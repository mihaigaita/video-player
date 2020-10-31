import { useCallback, useContext, useRef, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import {
  usePopupState,
  bindToggle,
  bindMenu,
} from 'material-ui-popup-state/hooks'
import { makeStyles } from '@material-ui/core/styles';

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import SettingsIcon from '@material-ui/icons/Settings';
import ListItemText from '@material-ui/core/ListItemText';
import CheckIcon from '@material-ui/icons/Check';

import VideoControlButton from './VideoControlButton';
import { VideoPlayerContext } from './VideoPlayer';

const useStyles = makeStyles(theme => ({
  menuPaper: {
    maxHeight: ({ maxHeight }) => maxHeight,
    backgroundColor: '#0009',
    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
      color: theme.palette.common.white,
    },
  },
  iconRoot: {
    marginRight: theme.spacing(2),
  },
}));

const playbackSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const SettingsControl = observer(({ aboveControlsRef }) => {
  const videoStore = useContext(VideoPlayerContext);
  const popupState = usePopupState({ variant: 'popover', popupId: 'settingsMenu' });
  const [selectedItemIndex, setSelectedItemIndex] = useState(3);
  
  let clampedMinMaxAvailableContainerHeight = 500;
  if (aboveControlsRef) {
    const clampedMaxAvailableContainerHeight = Math.min(aboveControlsRef.clientHeight - 10, 500);
    clampedMinMaxAvailableContainerHeight = Math.max(50, clampedMaxAvailableContainerHeight);
  }

  const classes = useStyles({ maxHeight: clampedMinMaxAvailableContainerHeight });

  useEffect(() => {
    if (!aboveControlsRef) return void(0);

    popupState.setAnchorEl(aboveControlsRef);
  }, [popupState, aboveControlsRef]);

  const makeOnMenuItemClick = useCallback((speed, index) => (event) => {
    setSelectedItemIndex(index);
    videoStore.handlePlaybackSpeedChange(speed);
    popupState.close();
  }, [popupState, videoStore, setSelectedItemIndex]);

  return (
    <div>
      <VideoControlButton 
        edge="end"
        aria-label="settings" 
        {...bindToggle(popupState)}
      >
        <SettingsIcon />
      </VideoControlButton>
      <Menu 
        {...bindMenu(popupState)}
        variant="menu"
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        classes={{ paper: classes.menuPaper }}
        disablePortal={true}
        keepMounted={true}
      >
        <MenuItem 
          divider={true} 
          onClick={popupState.close}
        >
          <ListItemText 
            primaryTypographyProps={{ variant: "body2" }} 
            primary="Playback Speed" 
          />
        </MenuItem>

        {playbackSpeeds.map((speed, index) => {
          const textContent = (speed === 1) ? 'Normal' : speed.toString().padStart(3, ' ');
          const isSelected = (selectedItemIndex === index);

          return (
            <MenuItem
              key={textContent}
              onClick={makeOnMenuItemClick(speed, index)}
            >
              <CheckIcon 
                color="secondary" 
                classes={{ root: classes.iconRoot }} 
                style={{ opacity: isSelected ? 1 : 0 }}
              />
              <ListItemText 
                primaryTypographyProps={{ variant: "body2" }} 
                primary={textContent} 
              />
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
});

export default SettingsControl;