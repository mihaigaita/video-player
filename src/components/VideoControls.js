import { useContext, useCallback, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import clsx from 'clsx';

import Typography from '@material-ui/core/Typography';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';

import VideoControlButton from './VideoControlButton';
import VideoProgress from './VideoProgress';
import VolumeControl from './VolumeControl';
import SettingsControl from './SettingsControl';
import VideoClickFeedback from './VideoClickFeedback';
import { formatSecondsToTimeDuration } from '../utils/functions';
import { VideoPlayerContext } from './VideoPlayer';


const useVideoStyles = makeStyles((theme) => ({
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
  controlsAndProgressActive: {
    opacity: 1,
  },
  controlsAndProgressIdle: {
    transition: 'all 0.2s linear',
    opacity: 0,
  },
  cursorOn: {
    cursor: 'auto',
  },
  cursorOff: {
    transition: 'all 0.2s linear',
    cursor: 'none',
  },
  controlGroup: {
    display: 'flex',
    alignItems: 'center',
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

const VideoControls = observer(() => {
  const classes = useVideoStyles();
  const videoStore = useContext(VideoPlayerContext);
  const pendingControlHideHandler = useRef(null);

  const activateControlsHandler = useCallback(() => {
    // Cancel any existing scheduled hiding of video controls
    pendingControlHideHandler?.current?.cancel();

    const pendingHideHandle = videoStore.setUserAsActive.call(videoStore);
    pendingHideHandle.catch(() => null);
    pendingControlHideHandler.current = pendingHideHandle;
  }, [videoStore, pendingControlHideHandler]);

  const hideControlsHandler = useCallback(() => {
    // Cancel any existing scheduled hiding of video controls
    pendingControlHideHandler?.current?.cancel();

    videoStore.setUserAsIdle();
  }, [videoStore, pendingControlHideHandler]);

  return (
    <div 
      onMouseLeave={hideControlsHandler}
      onMouseEnter={activateControlsHandler}
      onClick={activateControlsHandler}
      onMouseMove={activateControlsHandler}
      onTouchMove={activateControlsHandler}
      onTouchStart={activateControlsHandler}
      className={clsx(
        classes.controlsRoot,
        videoStore.userIsIdle ? classes.cursorOff : classes.cursorOn
      )}
    >
      <VideoClickFeedback />

      <div className={clsx(
          classes.controlsAndProgress,
          videoStore.userIsIdle ? classes.controlsAndProgressIdle : classes.controlsAndProgressActive
        )}
      >
        <VideoProgress />

        <div className={classes.buttons}>
          <div className={classes.controlGroup}>
            <VideoControlButton 
              onClick={videoStore.handlePlayPause} 
              edge="end" 
              aria-label="play or pause"
            >
              {(videoStore.videoIsPlaying)
                ? <PauseIcon fontSize="large"/> 
                : <PlayArrowIcon fontSize="large"/>}
            </VideoControlButton>

            <VolumeControl />

            <div className={classes.textWrapper}>
              <Typography
                classes={{ root: classes.textRoot }}
                align="center" 
                edge="end" 
                variant="body2" 
                color="secondary"
              >
                {`${formatSecondsToTimeDuration(videoStore.currentPositionSeconds)} 
                  / ${formatSecondsToTimeDuration(videoStore.durationSeconds)}`}
              </Typography>
            </div>
          </div>

          <div className={classes.controlGroup}>
            <SettingsControl />
            
            <VideoControlButton aria-label="full-screen">
              {videoStore.fullscreenEnabled 
                ? <FullscreenExitIcon fontSize="large"/> 
                : <FullscreenIcon fontSize="large"/>
              }
            </VideoControlButton>
          </div>
        </div>
      </div>
    </div>
  );
});

export default VideoControls;