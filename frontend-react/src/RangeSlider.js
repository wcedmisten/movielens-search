import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
    root: {
        width: 500,
    },
});
  
function valuetext(value) {
return `${value} / 5`;
}

export default function RangeSlider(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
        <Typography id="range-slider" gutterBottom>
            Average Rating (Stars)
        </Typography>
        <Slider
            defaultValue={[.5, 5]}
            min={.5}
            step={.5}
            marks
            max={5}
            onChange={props.handleSliderChange}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            getAriaValueText={valuetext}
        />
        </div>
    );
}