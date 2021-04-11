import click
import flask
import psycopg2

app = flask.Flask(__name__)
db = psycopg2.connect("user=postgres password=testpass host=db")


@app.route("/api/movies")
def test():
    with db.cursor() as cur:
        cur.execute("SELECT id, title FROM movies;")
        result = cur.fetchmany(10)
        return flask.jsonify(dict(result=result, backend="python"))

@app.route("/api/search", methods = ['GET'])
def search():
    with db.cursor() as cur:
        search_string = str(flask.request.args['search_val'])
        cur.execute("""SELECT title FROM movies ORDER BY SIMILARITY(title, %s) DESC LIMIT 10;""", (search_string,))
        result = cur.fetchmany(10)
        return flask.jsonify(dict(result=result))


@app.cli.command("load-movielens")
def load_movielens():
    with db.cursor() as cur:
        cur.execute("SELECT col FROM test;")
        (result,) = cur.fetchone()
        click.echo(f"result {result}")
