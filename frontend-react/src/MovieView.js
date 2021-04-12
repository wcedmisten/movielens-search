import { drawStars } from './Utils.js'

export default function MovieView(props) {
    return <div>
            <h1>{props.movie.title}</h1>
            <p>{drawStars(props.movie.avg_rating)} ({Number(props.movie.avg_rating).toFixed(2)})</p>
            <p>Genre(s): {props.movie.genres}</p>
            <a href={`http://www.imdb.com/title/tt${props.movie.imdb_id}`}>IMDB</a>
            <br></br>
            <a href={`https://www.themoviedb.org/movie/${props.movie.tmdb_id}`}>The Movie DB</a>
        </div>

}