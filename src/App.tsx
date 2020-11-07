import * as React from 'react';

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
    height: 360,
    width: 640,
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
  },
}));


const App: React.FC<{}> = () => {
  const classes = useStyles();

  return (
    <div className={classes.topContainer}>
      <div className={classes.videoContainer}>
        <VideoPlayer 
          posterUrl={process.env.PUBLIC_URL + "/preview/video.jpg"}
          manualDownloadUrl={process.env.PUBLIC_URL + "/video/video.mp4"}
          sourceList={[{
              url: process.env.PUBLIC_URL + "/video/video.mp4",
              type: "video/mp4",
            }
          ]}
        />

        <div className={classes.title}>
          <Typography variant="h4" gutterBottom>
            Big Buck Bunny
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default App;
