import { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';

import Typography from '@material-ui/core/Typography';

import { formatSecondsToTimeDuration } from '../utils/functions';
import { VideoPlayerContext } from './VideoPlayer';


const useStyles = makeStyles((theme) => ({
  textWrapper: {
    paddingTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
  },
  textRoot: {
    lineHeight: '100%',
  },
}));

const ElapsedTime = observer(() => {
  const videoStore = useContext(VideoPlayerContext);
  const classes = useStyles();

  return (
    <div className={classes.textWrapper}>
      <Typography
        classes={{ root: classes.textRoot }}
        align="center" 
        edge="end" 
        variant="body2" 
        color="secondary"
      >
        {`${formatSecondsToTimeDuration(videoStore.currentPositionSeconds)} 
          / ${formatSecondsToTimeDuration(videoStore.durationSeconds)}`}
      </Typography>
    </div>
  );
});

export default ElapsedTime;