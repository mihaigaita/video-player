import * as React from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

import { formatSecondsToTimeDuration } from '../utils/functions';
import { VideoPlayerContext } from './VideoPlayer';

const usePreviewStyles = makeStyles(theme => ({
  root: {
    display: 'inline-block',
    position: 'absolute',
    top: '-1.3rem',
    background: 'radial-gradient(#0003, transparent)',
    padding: theme.spacing(0, 2),
    borderRadius: 100,
  },
}));

const TimePreview: React.FC<{}> = () => {
  const videoStore = React.useContext(VideoPlayerContext);
  const classes = usePreviewStyles();
  
  const rootStyles = {
    left: `calc(${videoStore.seekHoverPositionPercentClamped}% - 18px)`,
    opacity: videoStore.previewPeekIsActive ? 1 : 0,
  };

  return (
    <div 
      className={classes.root}
      style={rootStyles}
    > 
      <Typography
        variant="body2" 
        color="secondary"
      >
        {formatSecondsToTimeDuration(videoStore.seekHoverPositionSeconds)}
      </Typography>
    </div>
  );
};

export default observer(TimePreview);