import * as React from 'react';
import { observer } from 'mobx-react';
import {
  usePopupState,
  bindToggle,
  bindMenu,
} from 'material-ui-popup-state/hooks'
import { makeStyles, Theme } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import SettingsIcon from '@material-ui/icons/Settings';
import ListItemText from '@material-ui/core/ListItemText';
import CheckIcon from '@material-ui/icons/Check';

import VideoControlButton from './VideoControlButton';
import { VideoPlayerContext } from './VideoPlayer';

type MenuStylesInputsType = {
  maxHeight: number,
};

const useMenuStyles = makeStyles<Theme, MenuStylesInputsType>(theme => ({
  paper: {
    maxHeight: ({ maxHeight }) => maxHeight,
    backgroundColor: '#000d',
    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
      color: theme.palette.common.white,
    },
  },
}));

const useIconStyles = makeStyles(theme => ({
  root: {
    marginRight: theme.spacing(2),
  },
}));

const playbackSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const anchorOrigin = { vertical: 'bottom' as 'bottom', horizontal: 'right' as 'right' };
const transformOrigin = { vertical: 'bottom' as 'bottom', horizontal: 'right' as 'right' };
const listItemTypographyVariant = { variant: 'body2' as 'body2' };
const opacityOnStyle = { opacity: 1 };
const opacityOffStyle = { opacity: 0 };

type SettingsControlPropsType = {
  aboveControlsRef: HTMLDivElement | null,
};

const SettingsControl: React.FC<SettingsControlPropsType> = ({ aboveControlsRef = null }) => {
  const videoStore = React.useContext(VideoPlayerContext);
  const popupState = usePopupState({ variant: 'popover', popupId: 'settingsMenu' });
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(3);
  
  let clampedMinMaxAvailableContainerHeight = 500;
  if (aboveControlsRef) {
    const clampedMaxAvailableContainerHeight = Math.min(aboveControlsRef.clientHeight - 10, 500);
    clampedMinMaxAvailableContainerHeight = Math.max(50, clampedMaxAvailableContainerHeight);
  }

  const menuStylesInput = React.useMemo(() => ({
    maxHeight: clampedMinMaxAvailableContainerHeight
  }), [clampedMinMaxAvailableContainerHeight]);

  const menuClasses = useMenuStyles(menuStylesInput);
  const iconClasses = useIconStyles();

  React.useEffect(() => {
    if (!aboveControlsRef) return;

    popupState.setAnchorEl(aboveControlsRef);
  }, [popupState, aboveControlsRef]);

  const makeOnMenuItemClick = React.useCallback((speed, index) => (event: React.SyntheticEvent) => {
    setSelectedItemIndex(index);
    videoStore.handlePlaybackSpeedChange(speed);
    popupState.close();
  }, [popupState, videoStore, setSelectedItemIndex]);

  return (
    <Box>
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
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        classes={menuClasses}
        disablePortal={true}
        keepMounted={true}
      >
        <MenuItem 
          divider={true} 
        >
          <ListItemText 
            primaryTypographyProps={listItemTypographyVariant} 
            primary="Playback Speed"
          />
        </MenuItem>

        { /* This loop is static, generated by a constant list so we can use hooks inside 
          since the order and number of hooks is the same every time */
          playbackSpeeds.map((speed, index) => {
            const textContent = (speed === 1) ? 'Normal' : speed.toString().padStart(3, ' ');
            const isSelected = (selectedItemIndex === index);
            // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/rules-of-hooks
            const itemOnClick = React.useCallback(makeOnMenuItemClick(speed, index), [makeOnMenuItemClick]);

            return (
              <MenuItem
                key={textContent}
                onClick={itemOnClick}
              >
                <CheckIcon
                  color="secondary" 
                  classes={iconClasses} 
                  style={isSelected ? opacityOnStyle : opacityOffStyle }
                />
                <ListItemText
                  primaryTypographyProps={listItemTypographyVariant} 
                  primary={textContent} 
                />
              </MenuItem>
            );
          })
        }
      </Menu>
    </Box>
  );
};

export default observer(SettingsControl);