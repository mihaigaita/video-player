import { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';

import Typography from '@material-ui/core/Typography';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';

import VideoControlButton from './VideoControlButton';
import VideoProgress from './VideoProgress';
import VolumeControl from './VolumeControl';
import SettingsControl from './SettingsControl';
import { formatSecondsToTimeDuration } from '../utils/functions';
import { VideoPlayerContext } from './VideoPlayer';


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

  const FeedbackIconType = videoStore.playbackState === 'playing' ? PlayCircleFilledIcon : PauseCircleFilledIcon;

  return (
    <div className={classes.controlsRoot}>
      <div className={classes.actionFeedbackWrapper}>
        <FeedbackIconType 
          color="secondary"
          fontSize="inherit"
        />
      </div>

      <div className={classes.controlsAndProgress}>
        <VideoProgress />

        <div className={classes.buttons}>
          <div className={classes.controlGroup}>
            <VideoControlButton edge="end" aria-label="play or pause">
              {videoStore.playbackState === 'playing' 
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