import decimal
import json

import click
import flask
import psycopg2
import psycopg2.extras

app = flask.Flask(__name__)
db = psycopg2.connect("user=postgres password=testpass host=db")

def decimal_default(obj):
    """Converter used for Decimal -> float conversion in dicts"""
    if isinstance(obj, decimal.Decimal):
        # round to 2 digits
        return round(float(obj), 2)
    raise TypeError

def search_results_to_dict(result, total_count):
    """
    Returns a structured dictionary of search result queries based on the ordering in the SELECT statement.
    Also returns the total number of results in the count field (for pagination purposes)
    """
    res = {}

    res['results'] = list(map(lambda item: {
        'id': item[0],
        'title': item[1],
        'genres': item[2],
        'avg_rating': item[3]
    }, result))
    res['count'] = total_count

    return res

@app.route("/api/search", methods = ['GET'])
def search():
    """
    Search the movies database given request parameters
    
    search_val (str): match results against movie titles using trigram similarity. (See https://www.postgresql.org/docs/9.1/pgtrgm.html)
    min_rating (float): minimum average rating for the movie, inclusive
    max_rating (float): maximum average rating for the movie, inclusive
    genres (str): JSON encoded array of genres to be matched with the movie's genre. NOTE: these are logical ORs with each other.
    page (int): page number (starting at 1) for paginated results. Uses fixed page size of 10 movies. 

    Returns a JSON response containing the results structured by field, and the count of total results.
    """
    search_string = str(flask.request.args['search_val'])
    
    min_rating = flask.request.args['min_rating']
    max_rating = flask.request.args['max_rating']

    page = int(flask.request.args['page'])
    page_offset = (page - 1) * 10

    genres = flask.request.args['genres']
    genres_list = json.loads(genres)

    # TODO: actually store genres in a separate table to avoid this terrible regex hack
    # for now, this is reasonably performant at this scale
    query_regex = ".*" + ".*|.*".join(genres_list) + ".*"


    count_query =   ("SELECT " 
                    "count(*)  "
                    "FROM "
                    "movies "
                    "INNER JOIN avg_ratings ON movies.id = avg_ratings.movie_id "
                    "WHERE "
                    "avg_ratings.avg_rating >= %s and avg_ratings.avg_rating <= %s "
                    "AND "
                    "movies.genres ~ %s ")

    with db.cursor(cursor_factory = psycopg2.extras.DictCursor) as cur:
        cur.execute(count_query,
            (float(min_rating), float(max_rating), query_regex, )
        )
        result = cur.fetchone()
        count = result[0]

    # This query retrieves data for the movie list view using a view previously calculated for average rating
    # It also uses

    base_query =    ("SELECT " 
                    "movies.id, movies.title, movies.genres, avg_ratings.avg_rating  "
                    "FROM "
                    "movies "
                    "INNER JOIN avg_ratings ON movies.id = avg_ratings.movie_id "
                    "WHERE "
                    "avg_ratings.avg_rating >= %s and avg_ratings.avg_rating <= %s "
                    "AND "
                    "movies.genres ~ %s ")

    # order by rating if the search query is empty
    if search_string == "":
        with db.cursor(cursor_factory = psycopg2.extras.DictCursor) as cur:
            cur.execute(
                            base_query +
                            "ORDER BY avg_ratings.avg_rating DESC, movies.id DESC LIMIT 10 OFFSET %s;",
                            (float(min_rating), float(max_rating), query_regex, page_offset,)
                        )
            result = cur.fetchmany(10)
            return flask.json.dumps(search_results_to_dict(result, count), default=decimal_default)
    # otherwise, order by search closeness
    else:
        with db.cursor(cursor_factory = psycopg2.extras.DictCursor) as cur:
            cur.execute(
                            base_query +
                            "ORDER BY SIMILARITY(title, %s) DESC, movies.id DESC LIMIT 10 OFFSET %s;",
                            (float(min_rating), float(max_rating), query_regex, search_string, page_offset,)
                        )
            result = cur.fetchmany(10)

            return flask.json.dumps(search_results_to_dict(result, count), default=decimal_default)


def movie_id_result_to_dict(item):
    """
    Returns a structured dictionary of movie data based on the ordering in the SELECT statement.
    Includes fields: id, title, genre, avg_rating, imdb_id, and tmdb_id
    """
    return {
        'id': item[0],
        'title': item[1],
        'genres': item[2],
        'avg_rating': item[3],
        'imdb_id': item[4],
        'tmdb_id': item[5]
    }

@app.route("/api/movie/<id>", methods = ['GET'])
def movie(id):
    """
    Returns a JSON encoded object of movie data for movie with id=id.
    Fields include: id, title, genres, avg_rating, imdb_id (ID for movie on imdb.com), and tmdb_id (ID for movie on themoviedb.org)
    """
    base_query =    ("SELECT " 
                    "movies.id, movies.title, movies.genres, avg_ratings.avg_rating, links.imdb_id, links.tmdb_id "
                    "FROM "
                    "movies "
                    "INNER JOIN avg_ratings ON movies.id = avg_ratings.movie_id "
                    "INNER JOIN links ON movies.id = links.movie_id "
                    "WHERE "
                    "movies.id = %s ")

    with db.cursor(cursor_factory = psycopg2.extras.DictCursor) as cur:
        cur.execute(
                        base_query,
                        (id,)
                    )
        result = cur.fetchone()

        return flask.json.dumps(movie_id_result_to_dict(result), default=decimal_default)
