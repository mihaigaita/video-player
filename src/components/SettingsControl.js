import { useContext } from 'react';
import { observer } from 'mobx-react';

import SettingsIcon from '@material-ui/icons/Settings';
import VideoControlButton from './VideoControlButton';
import { VideoPlayerContext } from './VideoPlayer';

const SettingsControl = observer(() => {
  const videoStore = useContext(VideoPlayerContext);

  return (
    <VideoControlButton edge="end" aria-label="settings">
      <SettingsIcon />
    </VideoControlButton>
  )
});

export default SettingsControl;