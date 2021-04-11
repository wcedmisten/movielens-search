import { List } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import StarIcon from '@material-ui/icons/Star';
import MovieIcon from '@material-ui/icons/Movie';
import { Pagination } from '@material-ui/lab';

export default function MovieList(props) {
    function drawStars(rating) {
        return [...Array(Math.round(rating)).keys()].map(i =>
            <StarIcon key={i}></StarIcon>
        )
    }

    function getMoviesList() {
        return props.movies.map(movie =>
            <ListItem key={movie.id}>
                <ListItemIcon>
                    <MovieIcon/>
                </ListItemIcon>
                <ListItemText
                    primary={movie.title}
                />
                <div>
                    <p>{movie.rating}</p>
                    {drawStars(movie.avg_rating)}
                </div>
            
          </ListItem>
        )
    }

    return <div>
        <List>
            {getMoviesList()}
        </List>
        <Pagination count={10} variant="outlined" color="primary" />
    </div>
}