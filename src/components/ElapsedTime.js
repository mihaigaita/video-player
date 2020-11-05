import { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';

import Typography from '@material-ui/core/Typography';

import { formatSecondsToTimeDuration } from '../utils/functions';
import { VideoPlayerContext } from './VideoPlayer';


const useContainerStyles = makeStyles((theme) => ({
  top: {
    paddingTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
  },
}));

const useTextStyles = makeStyles({
  root: {
    lineHeight: '100%',
  },
});

const ElapsedTime = observer(() => {
  const videoStore = useContext(VideoPlayerContext);
  const wrapperClasses = useContainerStyles();
  const textClasses = useTextStyles();

  return (
    <div className={wrapperClasses.top}>
      <Typography
        classes={textClasses.textClasses}
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