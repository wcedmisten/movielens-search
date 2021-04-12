import { drawStars } from './Utils.js'

import { List } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MovieIcon from '@material-ui/icons/Movie';
import { Pagination } from '@material-ui/lab';

export default function MovieList(props) {
    function getMoviesList() {
        return props.movies.map(movie =>
            <ListItem button={true} key={movie.id} onClick={() => props.clickHandler(movie.id)}>
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
        <Pagination page={props.page} onChange={props.onPageChange} count={props.count} variant="outlined" color="primary" />
    </div>
}