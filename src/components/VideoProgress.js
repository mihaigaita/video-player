import { useContext } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';

import Slider from '@material-ui/core/Slider';

import { formatSecondsToTimeDuration } from '../utils/functions';
import { VideoPlayerContext } from './VideoPlayer';
import TimePreview from './TimePreview';

const useProgressStyles = makeStyles({
  top: {
    marginLeft: ({ marginX }) => marginX,
    marginRight: ({ marginX }) => marginX,
  },
  progressContainer: {
    position: 'relative',
    height: 16,
  },
  seekPreview: {
    top: '50%',
    position: 'absolute',
    height: ({ previewEnabled }) => previewEnabled ? 5 : 3,
    marginTop: ({ previewEnabled }) => previewEnabled ? -2.5 : -1.5,
    left: 0,
    width: ({ seekTarget }) => `${seekTarget}%`,
    zIndex: -1,
    background: '#666',
  },
  root: {
    position: 'absolute',
    top: 0,
    padding: 0,
    height: 16,
  },
  thumb: {
    top: '50%',
    marginTop: -6,
    '&:focus, &:hover, &$active': {
      boxShadow: 'unset',
    },
  },
  hide: {
    opacity: 0,
  },
  active: { },
  smoothMove: {
    transition: 'width 0.25s linear',
  },
  track: ({ previewEnabled }) => ({
    top: '50%',
    height: previewEnabled ? 5 : 3,
    marginTop: previewEnabled ? -2.5 : -1.5,
    pointerEvents: 'none',
  }),
  rail: ({ previewEnabled }) => ({
    top: '50%',
    height: previewEnabled ? 5 : 3,
    marginTop: previewEnabled ? -2.5 : -1.5,
    backgroundColor: 'gray',
    opacity: 0.4,
  }),
});

const VideoProgress = observer(() => {
  const videoStore = useContext(VideoPlayerContext);
  const classes = useProgressStyles({ 
    seekTarget: videoStore.seekHoverPositionPercent,
    marginX: videoStore.progressMarginPixels,
    previewEnabled: videoStore.previewPeekIsActive,
  });

  return (
    <div className={classes.top}>
      <TimePreview />
      <div className={classes.progressContainer}>
        <Slider
          onMouseMove={videoStore.handlePreviewSeek}
          onMouseLeave={videoStore.cancelPreviewSeek}
          onMouseEnter={videoStore.startPreviewSeek}
          onChange={videoStore.handleSeek}
          onChangeCommitted={videoStore.handleSeek}
          component="div"
          classes={{
            root: classes.root,
            active: classes.active,
            rail: classes.rail,
            track: clsx(classes.track, !videoStore.seekIsPending && classes.smoothMove),
            thumb: clsx(classes.thumb, classes.smoothMove, !videoStore.previewPeekIsActive && classes.hide),
          }}
          min={0}
          step={0.01}
          max={videoStore.durationSeconds}
          valueLabelDisplay="off"
          getAriaValueText={formatSecondsToTimeDuration}
          aria-label="progress-slider"
          value={videoStore.currentPositionSeconds}
        />

        <div className={classes.seekPreview} />
      </div>
    </div>
  );
});

export default VideoProgress;