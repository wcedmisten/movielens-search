import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
//   formControl: {
//     margin: theme.spacing(3),
//   },
}));

export default function GenreSelect(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked={true}  onChange={props.handleGenreChange} name="Action" />}
            label="Action"
          />
          <FormControlLabel
            control={<Checkbox defaultChecked={true}  onChange={props.handleGenreChange} name="Adventure" />}
            label="Adventure"
          />
          <FormControlLabel
            control={<Checkbox defaultChecked={true}  onChange={props.handleGenreChange} name="Animation" />}
            label="Animation"
          />
          <FormControlLabel
            control={<Checkbox defaultChecked={true}  onChange={props.handleGenreChange} name="Children" />}
            label="Children's"
          />
          <FormControlLabel
            control={<Checkbox defaultChecked={true}  onChange={props.handleGenreChange} name="Comedy" />}
            label="Comedy"
          />
        </FormGroup>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked={true}  onChange={props.handleGenreChange} name="Crime" />}
            label="Crime"
          />
          <FormControlLabel
            control={<Checkbox defaultChecked={true}  onChange={props.handleGenreChange} name="Documentary" />}
            label="Documentary"
          />
          <FormControlLabel
            control={<Checkbox defaultChecked={true}  onChange={props.handleGenreChange} name="Drama" />}
            label="Drama"
          />
          <FormControlLabel
            control={<Checkbox defaultChecked={true}  onChange={props.handleGenreChange} name="Fantasy" />}
            label="Fantasy"
          />
          <FormControlLabel
            control={<Checkbox defaultChecked={true}  onChange={props.handleGenreChange} name="Film-Noir" />}
            label="Film-Noir"
          />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
                control={<Checkbox defaultChecked={true}  onChange={props.handleGenreChange} name="Horror" />}
                label="Horror"
            />
            <FormControlLabel
                control={<Checkbox defaultChecked={true}  onChange={props.handleGenreChange} name="Musical" />}
                label="Musical"
            />
            <FormControlLabel
                control={<Checkbox defaultChecked={true}  onChange={props.handleGenreChange} name="Mystery" />}
                label="Mystery"
            />
            <FormControlLabel
                control={<Checkbox defaultChecked={true}  onChange={props.handleGenreChange} name="Romance" />}
                label="Romance"
            />
            <FormControlLabel
                control={<Checkbox defaultChecked={true}  onChange={props.handleGenreChange} name="Sci-Fi" />}
                label="Sci-Fi"
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
                control={<Checkbox defaultChecked={true}  onChange={props.handleGenreChange} name="Thriller" />}
                label="Thriller"
            />
            <FormControlLabel
                control={<Checkbox defaultChecked={true}  onChange={props.handleGenreChange} name="War" />}
                label="War"
            />
            <FormControlLabel
                control={<Checkbox defaultChecked={true}  onChange={props.handleGenreChange} name="Western" />}
                label="Western"
            />
          </FormGroup>
    </div>
  );
}