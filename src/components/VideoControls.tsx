import * as React from 'react';
import { observer } from 'mobx-react';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import VideoProgress from './VideoProgress';
import VolumeControl from './VolumeControl';
import SettingsControl from './SettingsControl';
import FullscreenControl from './FullscreenControl';
import PlaybackControl from './PlaybackControl';
import VideoClickFeedback from './VideoClickFeedback';
import ElapsedTime from './ElapsedTime';
import { VideoPlayerContext } from './VideoPlayer';


const useVideoStyles = makeStyles({
  controlsAndProgress: {
    background: 'linear-gradient(0deg, #000a, transparent)',
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
});

const VideoControls: React.FC<{}> = () => {
  const classes = useVideoStyles();
  const videoStore = React.useContext(VideoPlayerContext);
  const [aboveControlsRef, setAboveControlsRef] = React.useState<HTMLDivElement | null>(null);

  return (
    <Box 
      onMouseLeave={videoStore.hideControlsHandler}
      onMouseEnter={videoStore.activateControlsHandler}
      onClick={videoStore.activateControlsHandler}
      onMouseMove={videoStore.activateControlsHandler}
      onTouchMove={videoStore.activateControlsHandler}
      onTouchStart={videoStore.activateControlsHandler}
      className={videoStore.userIsIdle ? classes.cursorOff : classes.cursorOn}
      height='100%'
      width='100%'
      position='absolute'
      zIndex={1}
      top={0}
      left={0}
    >
      <VideoClickFeedback />

      <Box 
        className={videoStore.userIsIdle 
          ? classes.controlsAndProgressIdle 
          : classes.controlsAndProgressActive}
        display='flex'
        flexDirection='column'
        width='100%'
        height='100%'
        position='relative'
        zIndex={2}
      >
        <Box 
          flexGrow={1}
          // @ts-expect-error
          ref={setAboveControlsRef}
          onClick={videoStore.handleVideoClick}
        />

        <Box className={classes.controlsAndProgress}>
          <VideoProgress />

          <Box 
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            marginBottom={2}
            paddingX={5}
          >
            <Box 
              display='flex'
              alignItems='center'
              onMouseLeave={videoStore.handleVolumeOnHoverExit}
            >
              <PlaybackControl />
              <VolumeControl />
              <ElapsedTime />
            </Box>

            <Box
              display='flex'
              alignItems='center'
            >
              <SettingsControl aboveControlsRef={aboveControlsRef} />
              <FullscreenControl />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default observer(VideoControls);