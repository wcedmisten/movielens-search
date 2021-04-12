import StarIcon from '@material-ui/icons/Star';

// draws the number of stars appropriate for a rating (rounded to one-star increments)
export function drawStars(rating) {
    return [...Array(Math.round(rating)).keys()].map(i =>
        <StarIcon key={i}></StarIcon>
    )
}