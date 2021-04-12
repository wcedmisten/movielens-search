import StarIcon from '@material-ui/icons/Star';

export function drawStars(rating) {
    return [...Array(Math.round(rating)).keys()].map(i =>
        <StarIcon key={i}></StarIcon>
    )
}