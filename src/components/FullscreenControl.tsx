import * as React from 'react';
import { observer } from 'mobx-react';

import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';

import VideoControlButton from './VideoControlButton';
import { VideoPlayerContext } from './VideoPlayer';


const FullScreenControl: React.FC<{}> = () => {
  const videoStore = React.useContext(VideoPlayerContext);

  return (
    <VideoControlButton 
      onClick={videoStore.handleFullscreen}
      aria-label="full-screen"
    >
      {videoStore.fullscreenIsActive 
        ? <FullscreenExitIcon fontSize="large"/> 
        : <FullscreenIcon fontSize="large"/>
      }
    </VideoControlButton>
  );
};

export default observer(FullScreenControl);