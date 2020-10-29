import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import VideoPlayer from './components/VideoPlayer';

const useStyles = makeStyles((theme) => ({
  topContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  videoContainer: {
    margin: theme.spacing(15, 'auto'),
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
  },
}));


const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.topContainer}>
      <div className={classes.videoContainer}>
        <VideoPlayer 
          posterUrl={process.env.PUBLIC_URL + "/preview/globe_preview_640x360.jpg"}
          manualDownloadUrl={process.env.PUBLIC_URL + "/video/globe_640x360.mp4"}
          sourceList={[{
              url: process.env.PUBLIC_URL + "/video/globe_640x360.webm",
              type: "video/webm",
            }, {
              url: process.env.PUBLIC_URL + "/video/globe_640x360.mp4",
              type: "video/mp4",
            }
          ]}
        />

        <div className={classes.title}>
          <Typography variant="h4" gutterBottom>
            Pale Blue Marble
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default App;
