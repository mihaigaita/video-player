import { useContext } from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';

import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';

import { formatSecondsToTimeDuration } from '../utils/functions';
import { VideoPlayerContext } from './VideoPlayer';

const useProgressStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2, 0),
  },
  thumb: {
    opacity: 0,
    '&:hover, &$active': {
      marginTop: -4,
      opacity: 1,
    },
    '&:focus, &:hover, &$active': {
      boxShadow: 'unset',
    }
  },
  active: {},
  track: {
    height: 4,
  },
  rail: {
    height: 4,
    backgroundColor: 'gray',
    opacity: 0.2,
  },
}));

const ValueLabelComponent = ({
  children,
  open,
  value
}) => {
  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
};

const VideoProgress = observer(() => {
  const classes = useProgressStyles();
  const videoStore = useContext(VideoPlayerContext);

  return (
    <Slider
      component="div"
      classes={classes}
      min={0}
      step={0.01}
      max={videoStore.durationSeconds}
      onChange={videoStore.handleSeek}
      valueLabelDisplay="auto"
      getAriaValueText={formatSecondsToTimeDuration}
      ValueLabelComponent={ValueLabelComponent}
      valueLabelFormat={formatSecondsToTimeDuration}
      aria-label="progress-slider"
      value={videoStore.currentPositionSeconds}
    />
  );
});

export default VideoProgress;