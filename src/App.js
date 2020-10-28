import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  topContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  videoContainer: {
    margin: theme.spacing(15, 'auto'),
  },
  video: {
    display: 'block',
    objectFit: 'contain',
  }
}));

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.topContainer}>
      <div className={classes.videoContainer}>
        <video
          id="video"
          className={classes.video}
          controls 
          preload="metadata" 
          poster={process.env.PUBLIC_URL + "/globe_preview_640x360.jpg"}
          height="360"
        >
          <source src={process.env.PUBLIC_URL + "/globe_640x360.mp4"} type="video/mp4" />
          <source src={process.env.PUBLIC_URL + "/globe_640x360.webm"} type="video/webm" />

          <a href={process.env.PUBLIC_URL + "/globe_640x360.mp4"}>Download MP4 (3MB)</a>
        </video>
        <Typography variant="h4" gutterBottom>
          Pale Blue Marble
        </Typography>
      </div>
    </div>
  );
};

export default App;
