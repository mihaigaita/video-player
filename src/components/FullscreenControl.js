import fscreen from 'fscreen';
import { useContext } from 'react';
import { observer } from 'mobx-react';

import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';

import VideoControlButton from './VideoControlButton';
import { VideoPlayerContext } from './VideoPlayer';


const FullScreenControl = observer(() => {
  const videoStore = useContext(VideoPlayerContext);

  return (
    <VideoControlButton aria-label="full-screen">
      {videoStore.fullscreenEnabled 
        ? <FullscreenExitIcon fontSize="large"/> 
        : <FullscreenIcon fontSize="large"/>
      }
    </VideoControlButton>
  );
});

export default FullScreenControl;