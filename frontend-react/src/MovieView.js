import { drawStars } from './Utils.js'

// module that shows details for a specific movie, when clicked from search results
export default function MovieView(props) {
    return <div>
            <h1>{props.movie.title}</h1>
            <p>{drawStars(props.movie.avg_rating)} ({Number(props.movie.avg_rating).toFixed(2)})</p>
            <p>Genre(s): {props.movie.genres}</p>
            <a target="_blank" rel="noopener noreferrer" href={`http://www.imdb.com/title/tt${props.movie.imdb_id}`}>IMDB</a>
            <br></br>
            <a target="_blank" rel="noopener noreferrer" href={`https://www.themoviedb.org/movie/${props.movie.tmdb_id}`}>The Movie DB</a>
        </div>
}