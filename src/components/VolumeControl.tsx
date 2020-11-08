import * as React from 'react';
import { observer } from 'mobx-react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Slider from '@material-ui/core/Slider';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';

import VideoControlButton from './VideoControlButton';
import { VideoPlayerContext } from './VideoPlayer';

type SliderStylesInputsType = {
  fullscreenIsActive: boolean,
};

const useSliderStyles = makeStyles<Theme, SliderStylesInputsType>((theme) => ({
  root: {
    display: 'inline-block',
    margin: theme.spacing(0, 4, 0, 4),
  },
  track: {
    height: 4,
  },
  rail: {
    height: 4,
    backgroundColor: 'gray',
  },
  thumb: {
    width: 16,
    height: 16,
    marginTop: -6,
    '&:focus, &:hover, &$active': {
      boxShadow: 'unset',
    },
    transform: ({ fullscreenIsActive }) => `scale(${fullscreenIsActive ? 1 : 0.75})`,
    transition: 'transform .2s linear',
  },
}));

const VolumeControl: React.FC<{}> = () => {
  const videoStore = React.useContext(VideoPlayerContext);

  const sliderStylesInputs = React.useMemo(() => ({
    fullscreenIsActive: videoStore.fullscreenIsActive,
  }), [videoStore.fullscreenIsActive]);
  const sliderClasses = useSliderStyles(sliderStylesInputs);

  const sliderMaxWidth = videoStore.fullscreenIsActive ? '100px' : '76px';
  const sliderDisplayWidth = videoStore.pointerIsHovering ? sliderMaxWidth : '0px';

  return (
    <Box 
      display='flex'
      alignItems='center'
      marginX={2}
      onMouseEnter={videoStore.handleVolumeOnHover}
    >
      <VideoControlButton 
        edge="end" 
        aria-label="volume"
        onClick={videoStore.toggleVolume}
      >
        {((videoStore.volumeLevel <= 0) || videoStore.volumeIsMuted) 
          ? <VolumeOffIcon />
          : (videoStore.volumeLevel >= 0.5) 
            ? <VolumeUpIcon />
            : <VolumeDownIcon />
        }
      </VideoControlButton>

      <Box 
        display='flex'
        alignItems='center'
        overflow='hidden'
        width={sliderDisplayWidth} 
        style={{ transition: 'width .2s linear' }}
      >
        <Slider
          classes={sliderClasses}
          min={0}
          step={0.01}
          max={1}
          color="secondary"
          onChange={videoStore.handleVolumeChange}
          valueLabelDisplay="off"
          aria-label="volume-slider"
          value={videoStore.volumeIsMuted ? 0 : videoStore.volumeLevel} 
        />
      </Box>
    </Box>
  );
};

export default observer(VolumeControl);