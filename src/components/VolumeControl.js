import { makeStyles } from '@material-ui/core/styles';

import Slider from '@material-ui/core/Slider';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';

import VideoControlButton from './VideoControlButton';


const useVolumeStyles = makeStyles((theme) => ({
  root: {
    display: 'inline-block',
    margin: theme.spacing(0, 2),
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
  wrapper: {
    display: 'flex',
    alignItems: 'center',
  }
}));

const VolumeControl = ({
  volumeLevel,
}) => {
  const classes = useVolumeStyles();

  return (
    <div className={classes.wrapper}>
      <VideoControlButton edge="end" aria-label="volume">
        {(volumeLevel <= 0) 
          ? <VolumeOffIcon />
          : (volumeLevel >= 50) 
            ? <VolumeUpIcon />
            : <VolumeDownIcon />
        }
      </VideoControlButton>

      <Slider
        classes={classes}
        min={0}
        step={1}
        max={100}
        color="secondary"
        // onChange={handleChange}
        valueLabelDisplay="off"
        aria-label="volume-slider"
        value={volumeLevel} 
      />
    </div>
  );
};

export default VolumeControl;