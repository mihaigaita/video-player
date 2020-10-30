import { useContext } from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

import { formatSecondsToTimeDuration } from '../utils/functions';
import { VideoPlayerContext } from './VideoPlayer';

const usePreviewStyles = makeStyles({
  timePreview: {
    display: 'inline-block',
    position: 'relative',
    left: ({ seekTarget }) => `calc(${seekTarget}% - 18px)`,
    opacity: ({ previewEnabled }) => previewEnabled ? 1 : 0,
  },
});

const TimePreview = observer(() => {
  const videoStore = useContext(VideoPlayerContext);
  const classes = usePreviewStyles({ 
    seekTarget: videoStore.seekHoverPositionPercentClamped,
    previewEnabled: videoStore.previewPeekIsActive,
  });

  return (
    <div className={classes.timePreview}> 
      <Typography
        variant="body2" 
        color="secondary"
      >
        {formatSecondsToTimeDuration(videoStore.seekHoverPositionSeconds)}
      </Typography>
    </div>
  );
});

export default TimePreview;