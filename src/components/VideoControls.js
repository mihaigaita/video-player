import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

import IconButton from '@material-ui/core/IconButton';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import SettingsIcon from '@material-ui/icons/Settings';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';

const useVideoStyles = makeStyles((theme) => ({
  actionFeedbackWrapper: {
    fontSize: '4rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
    background: '#00000050',
  },
  controlsRoot: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },
  controlsAndProgress: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    position: 'absolute',
    zIndex: 2,
    bottom: 0,
    left: 0,
    padding: theme.spacing(0, 2),
  },
  controlGroup: {
    display: 'flex',
    alignItems: 'center',
  },
  progressSliderRoot: {
    padding: theme.spacing(2, 0),
  },
  progressSliderThumb: {
    opacity: 0,
    '&:hover, &$active': {
      marginTop: -4,
      opacity: 1,
    },
    '&:focus, &:hover, &$active': {
      boxShadow: 'unset',
    }
  },
  progressSliderActive: {

  },
  progressSliderTrack: {
    height: 4,
  },
  progressSliderRail: {
    height: 4,
    backgroundColor: 'gray',
    opacity: 0.2,
  },
  volumeSliderRoot: {
    display: 'inline-block',
    margin: theme.spacing(0, 2),
    width: 60,
  },
  volumeSliderTrack: {
    height: 4,
  },
  volumeSliderRail: {
    height: 4,
    backgroundColor: 'gray',
  },
  volumeSliderThumb: {
    marginTop: -4,
    '&:focus, &:hover, &$active': {
      boxShadow: 'unset',
    }
  },
  textWrapper: {
    paddingTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
  },
  textRoot: {
    lineHeight: '100%',
  },
}));

const useIconStyles = makeStyles((theme) => ({
  iconRoot: {
    padding: 0,
    '&:hover': {
      backgroundColor: 'unset',
    }
  }
}));

const CustomIconButton = ({ children, ...otherProps }) => {
  const classes = useIconStyles();

  return (
    <IconButton 
      classes={{ root: classes.iconRoot}} 
      disableFocusRipple 
      disableRipple
      color="secondary"
    >
      {React.cloneElement(React.Children.only(children), otherProps)}
    </IconButton>
  );
};

const ValueLabelComponent = ({
  children,
  open,
  value,
}) => (
  <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
    {children}
  </Tooltip>
);

const formatSecondsToTimeDuration = (value) => {
  const hours = Math.floor(value / 60 / 24);
  const minutes = Math.floor(value / 60 % 24);
  const seconds = value % 60;

  const hoursText = hours ? `${hours}:` : '';
  const minutesSecondsText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return `${hoursText}${minutesSecondsText}`;
};

const VideoControls = ({
  playbackState = 'paused',
  volumeLevel = 50,
  currentPositionSeconds = 0,
  durationSeconds = 0,
  fullscreenEnabled = false,
}) => {
  const classes = useVideoStyles();
  const FeedbackIconType = playbackState === 'playing' ? PlayCircleFilledIcon : PauseCircleFilledIcon;

  return (
    <div className={classes.controlsRoot}>
      <div className={classes.actionFeedbackWrapper}>
        <FeedbackIconType 
          color="secondary"
          fontSize="inherit"
        />
      </div>

      <div className={classes.controlsAndProgress}>
        <Slider
          component="div"
          classes={{
            root: classes.progressSliderRoot,
            rail: classes.progressSliderRail,
            track: classes.progressSliderTrack,
            thumb: classes.progressSliderThumb,
            active: classes.progressSliderActive,
          }}
          min={0}
          step={1}
          max={durationSeconds}
          // onChange={handleChange}
          valueLabelDisplay="auto"
          getAriaValueText={formatSecondsToTimeDuration}
          ValueLabelComponent={ValueLabelComponent}
          valueLabelFormat={formatSecondsToTimeDuration}
          aria-label="progress-slider"
          value={currentPositionSeconds}
        />

        <div className={classes.buttons}>
          <div className={classes.controlGroup}>
            <CustomIconButton edge="end" aria-label="play or pause">
              {playbackState === 'playing' 
                ? <PauseIcon fontSize="large"/> 
                : <PlayArrowIcon fontSize="large"/>}
            </CustomIconButton>

            <CustomIconButton edge="end" aria-label="volume">
              {(volumeLevel <= 0) 
                ? <VolumeOffIcon />
                : (volumeLevel >= 50) 
                  ? <VolumeUpIcon />
                  : <VolumeDownIcon />
              }
            </CustomIconButton>

            <Slider
              classes={{ 
                root: classes.volumeSliderRoot,
                track: classes.volumeSliderTrack,
                rail: classes.volumeSliderRail,
                thumb: classes.volumeSliderThumb,
              }}
              min={0}
              step={1}
              max={100}
              color="secondary"
              // onChange={handleChange}
              valueLabelDisplay="off"
              aria-label="volume-slider"
              value={volumeLevel} 
            />

            <div className={classes.textWrapper}>
              <Typography
                classes={{ root: classes.textRoot }}
                align="center" 
                edge="end" 
                variant="body2" 
                color="secondary"
              >
                {`${formatSecondsToTimeDuration(currentPositionSeconds)} / ${formatSecondsToTimeDuration(durationSeconds)}`}
              </Typography>
            </div>
          </div>

          <div className={classes.controlGroup}>
            <CustomIconButton edge="end" aria-label="settings">
              <SettingsIcon />
            </CustomIconButton>
            
            <CustomIconButton aria-label="full-screen">
              {fullscreenEnabled 
                ? <FullscreenExitIcon fontSize="large"/> 
                : <FullscreenIcon fontSize="large"/>
              }
            </CustomIconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoControls;