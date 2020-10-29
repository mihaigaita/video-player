import SettingsIcon from '@material-ui/icons/Settings';
import VideoControlButton from './VideoControlButton';

const SettingsControl = () => {
  return (
    <VideoControlButton edge="end" aria-label="settings">
      <SettingsIcon />
    </VideoControlButton>
  )
};

export default SettingsControl;