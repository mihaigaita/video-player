import * as React from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';

import Slider from '@material-ui/core/Slider';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';

import VideoControlButton from './VideoControlButton';
import { VideoPlayerContext } from './VideoPlayer';


const useVolumeStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(0, 2),
  }
}));

const useSliderStyles = makeStyles((theme) => ({
  root: {
    display: 'inline-block',
    margin: theme.spacing(0, 2, 0, 4),
  },
  track: {
    height: 4,
  },
  rail: {
    height: 4,
    backgroundColor: 'gray',
  },
  thumb: {
    marginTop: -4,
    '&:focus, &:hover, &$active': {
      boxShadow: 'unset',
    }
  },
}));

const useSliderContainerStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    transition: 'width .2s cubic-bezier(0.4, 0.0, 1, 1)',
    overflow: 'hidden',
  },
});

const VolumeControl: React.FC<{}> = () => {
  const volumeClasses = useVolumeStyles();
  const videoStore = React.useContext(VideoPlayerContext);

  const sliderClasses = useSliderStyles();
  const sliderContainerClasses = useSliderContainerStyles({ 
    pointerIsHovering: videoStore.pointerIsHovering 
  });

  const sliderContainerStyle = React.useMemo(() => ({ 
    width: videoStore.pointerIsHovering ? 76 : 0 
  }), [videoStore.pointerIsHovering]);

  return (
    <div 
      className={volumeClasses.wrapper}
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

      <div 
        className={sliderContainerClasses.container} 
        style={sliderContainerStyle}
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
      </div>
    </div>
  );
};

export default observer(VolumeControl);