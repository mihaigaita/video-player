import * as React from 'react';
import { observer } from 'mobx-react';

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';

import VideoControlButton from './VideoControlButton';
import { VideoPlayerContext } from './VideoPlayer';


const PlaybackControl: React.FC<{}> = () => {
  const videoStore = React.useContext(VideoPlayerContext);

  return (
    <VideoControlButton 
      onClick={videoStore.handlePlayPause} 
      edge="end" 
      aria-label="play or pause"
    >
      {(videoStore.videoIsPlaying)
        ? <PauseIcon fontSize="large"/> 
        : <PlayArrowIcon fontSize="large"/>}
    </VideoControlButton>
  );
};

export default observer(PlaybackControl);