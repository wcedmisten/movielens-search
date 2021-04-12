CREATE TABLE movies (id int primary key, title varchar, genres varchar);
\copy movies FROM '/dataset/movies.csv' delimiter ',' CSV HEADER ;

CREATE TABLE ratings (user_id int, movie_id int, rating decimal, epoch_timestamp int,
    CONSTRAINT fk_movie_id FOREIGN KEY(movie_id) REFERENCES movies(id)
);

\copy ratings FROM '/dataset/ratings.csv' delimiter ',' CSV HEADER ;

-- creates a view for the average rating of each movie
CREATE VIEW avg_ratings (movie_id, avg_rating)
AS SELECT movie_id, AVG(rating)
FROM ratings
GROUP BY movie_id;

CREATE TABLE tags (user_id int, movie_id int, tag varchar, epoch_timestamp int,
    CONSTRAINT fk_movie_id FOREIGN KEY(movie_id) REFERENCES movies(id)
);
\copy tags FROM '/dataset/tags.csv' delimiter ',' CSV HEADER ;

CREATE TABLE links (movie_id int, imdb_id varchar, tmdb_id varchar,
    CONSTRAINT fk_movie_id FOREIGN KEY(movie_id) REFERENCES movies(id)
);
\copy links FROM '/dataset/links.csv' delimiter ',' CSV HEADER ;

/* update the trigram extension for search via similiarity() */
create extension pg_trgm;