import * as React from 'react';
import { observer } from 'mobx-react';
import { makeStyles, Theme } from '@material-ui/core/styles';

import Slider from '@material-ui/core/Slider';

import { formatSecondsToTimeDuration } from '../utils/functions';
import { VideoPlayerContext } from './VideoPlayer';
import TimePreview from './TimePreview';
import SeekPreview from './SeekPreview';


const useGeneralStyles = makeStyles(theme => ({
  top: {
    position: 'relative',
    margin: theme.spacing(0, 4),
  },
  progressContainer: {
    position: 'relative',
    height: 16,
  },
}));

type ProgressStyleInputs = {
  previewEnabled: boolean,
};

const useProgressStyles = makeStyles<Theme, ProgressStyleInputs>({
  root: {
    display: 'block',
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
  active: {},
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

const VideoProgress: React.FC<{}> = () => {
  const videoStore = React.useContext(VideoPlayerContext);

  const progressStyleInputs: ProgressStyleInputs = React.useMemo(() => ({
    previewEnabled: videoStore.previewPeekIsActive,
  }), [videoStore.previewPeekIsActive]);

  const progressClasses = useProgressStyles(progressStyleInputs);
  const generalClasses = useGeneralStyles();

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
          classes={progressClasses}
          min={0}
          step={0.1}
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
};

export default observer(VideoProgress);