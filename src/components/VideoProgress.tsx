import * as React from 'react';
import { observer } from 'mobx-react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Slider from '@material-ui/core/Slider';

import { formatSecondsToTimeDuration } from '../utils/functions';
import { VideoPlayerContext } from './VideoPlayer';
import TimePreview from './TimePreview';
import SeekPreview from './SeekPreview';


type ProgressStyleInputsType = {
  previewEnabled: boolean,
  fullscreenIsActive: boolean,
};

const getProgressScale = (inputs: ProgressStyleInputsType): number => {
  const { fullscreenIsActive, previewEnabled } = inputs;

  const fullscreenScaleModifier = fullscreenIsActive ? 1.4 : 1;
  const hoveredScaleModifier = previewEnabled ? 1 : 0.6;

  return fullscreenScaleModifier * hoveredScaleModifier;
};

const useProgressStyles = makeStyles<Theme, ProgressStyleInputsType>({
  root: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    padding: 0,
    height: '100%',
    transform: (inputs) => `scaleY(${getProgressScale(inputs)})`,
    transformOrigin: 'center',
  },
  thumb: {
    '&:focus, &:hover, &$active': {
      boxShadow: 'unset',
    },
    marginTop: 'unset',
    transform: (inputs) => `scaleX(${getProgressScale(inputs)})`,
    opacity: ({ previewEnabled }) => previewEnabled ? 1 : 0,
  },
  active: {},
  track: {
    height: 'calc(5 / 16 * 100%)',
    pointerEvents: 'none',
  },
  rail: {
    height: 'calc(5 / 16 * 100%)',
    backgroundColor: 'gray',
    opacity: 0.4,
  },
});

const VideoProgress: React.FC<{}> = () => {
  const videoStore = React.useContext(VideoPlayerContext);

  const progressStyleInputs: ProgressStyleInputsType = React.useMemo(() => ({
    previewEnabled: videoStore.previewPeekIsActive,
    fullscreenIsActive: videoStore.fullscreenIsActive,
  }), [videoStore.previewPeekIsActive, videoStore.fullscreenIsActive]);

  const progressClasses = useProgressStyles(progressStyleInputs);

  return (
    <Box 
      position='relative'
      marginX={4}
    >
      <TimePreview />
      
      <Box
        position='relative'
        height='16px'
        display='flex'
        alignItems='center'
      >
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
      </Box>
    </Box>
  );
};

export default observer(VideoProgress);