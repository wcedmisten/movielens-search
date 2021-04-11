import click
import flask
import psycopg2

app = flask.Flask(__name__)
db = psycopg2.connect("user=postgres password=testpass host=db")


@app.route("/test")
def test():
    with db.cursor() as cur:
        cur.execute("SELECT title FROM movies;")
        (result,) = cur.fetchone()
        return flask.jsonify(dict(result=result, backend="python"))


@app.cli.command("load-movielens")
def load_movielens():
    with db.cursor() as cur:
        cur.execute("SELECT col FROM test;")
        (result,) = cur.fetchone()
        click.echo(f"result {result}")
