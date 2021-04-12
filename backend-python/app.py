import click
import decimal
import flask
import psycopg2
import psycopg2.extras

import json

app = flask.Flask(__name__)
db = psycopg2.connect("user=postgres password=testpass host=db")

def decimal_default(obj):
    if isinstance(obj, decimal.Decimal):
        # round to 2 digits
        return round(float(obj), 2)
    raise TypeError

@app.route("/api/movies")
def test():
    with db.cursor() as cur:
        cur.execute("SELECT id, title FROM movies;")
        result = cur.fetchmany(10)
        return flask.jsonify(dict(result=result, backend="python"))


def search_results_to_dict(result, count):
    res = {}

    res['results'] = list(map(lambda item: {
        'id': item[0],
        'title': item[1],
        'genres': item[2],
        'avg_rating': item[3]
    }, result))
    res['count'] = count

    return res

@app.route("/api/search", methods = ['GET'])
def search():
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

    


@app.cli.command("load-movielens")
def load_movielens():
    with db.cursor() as cur:
        cur.execute("SELECT col FROM test;")
        (result,) = cur.fetchone()
        click.echo(f"result {result}")
