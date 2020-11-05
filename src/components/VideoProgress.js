import { useContext, useMemo } from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';

import Slider from '@material-ui/core/Slider';

import { formatSecondsToTimeDuration } from '../utils/functions';
import { VideoPlayerContext } from './VideoPlayer';
import TimePreview from './TimePreview';
import SeekPreview from './SeekPreview';

const useGeneralStyles = makeStyles({
  top: {
    position: 'relative',
    marginLeft: ({ marginX }) => marginX,
    marginRight: ({ marginX }) => marginX,
  },
  progressContainer: {
    position: 'relative',
    height: 16,
  },
});

const useProgressStyles = makeStyles({
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
    opacity: ({ previewEnabled }) => previewEnabled ? 1 : 0,
  },
  active: { },
  track: {
    top: '50%',
    height: ({ previewEnabled }) => previewEnabled ? 5 : 3,
    marginTop: ({ previewEnabled }) => previewEnabled ? -2.5 : -1.5,
    pointerEvents: 'none',
  },
  rail: {
    top: '50%',
    height: ({ previewEnabled }) => previewEnabled ? 5 : 3,
    marginTop: ({ previewEnabled }) => previewEnabled ? -2.5 : -1.5,
    backgroundColor: 'gray',
    opacity: 0.4,
  },
});

const VideoProgress = observer(() => {
  const videoStore = useContext(VideoPlayerContext);
  const styleInputs = useMemo(() => ({
    previewEnabled: videoStore.previewPeekIsActive,
    marginX: videoStore.progressMarginPixels,
    smoothMove: !videoStore.seekIsPending && videoStore.videoIsPlaying,
  }), [videoStore.previewPeekIsActive, videoStore.progressMarginPixels, 
    videoStore.seekIsPending, videoStore.videoIsPlaying]);

  const progressClasses = useProgressStyles(styleInputs);
  const generalClasses = useGeneralStyles(styleInputs);

  return (
    <div className={generalClasses.top}>
      <TimePreview />
      
      <div className={generalClasses.progressContainer}>
        <Slider
          onMouseMove={videoStore.handlePreviewSeek}
          onMouseLeave={videoStore.cancelPreviewSeek}
          onMouseEnter={videoStore.startPreviewSeek}
          onChange={videoStore.handleSeek}
          onChangeCommitted={videoStore.handleSeek}
          component="div"
          classes={progressClasses}
          min={0}
          step={0.01}
          max={videoStore.durationSeconds}
          valueLabelDisplay="off"
          getAriaValueText={formatSecondsToTimeDuration}
          aria-label="progress-slider"
          value={videoStore.currentPositionSeconds}
        />

        <SeekPreview />
      </div>
    </div>
  );
});

export default VideoProgress;