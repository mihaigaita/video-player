import { useContext } from 'react';
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
    width: 60,
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

const VolumeControl = observer(() => {
  const classes = useVolumeStyles();
  const sliderClasses = useSliderStyles();
  const videoStore = useContext(VideoPlayerContext);

  return (
    <div className={classes.wrapper}>
      <VideoControlButton 
        edge="end" 
        aria-label="volume"
        onClick={videoStore.toggleVolume}
      >
        {(videoStore.volumeLevel <= 0) 
          ? <VolumeOffIcon />
          : (videoStore.volumeLevel >= 0.5) 
            ? <VolumeUpIcon />
            : <VolumeDownIcon />
        }
      </VideoControlButton>

      <Slider
        classes={sliderClasses}
        min={0}
        step={0.01}
        max={1}
        color="secondary"
        onChange={videoStore.handleVolumeChange}
        valueLabelDisplay="off"
        aria-label="volume-slider"
        value={videoStore.volumeLevel} 
      />
    </div>
  );
});

export default VolumeControl;