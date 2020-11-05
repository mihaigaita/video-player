import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

const useControlStyles = makeStyles({
  root: {
    padding: 0,
    '&:hover': {
      backgroundColor: 'unset',
    }
  }
});

const VideoControlButton = ({ children, onClick, ...otherProps }) => {
  const classes = useControlStyles();

  return (
    <IconButton 
      classes={classes}
      disableFocusRipple 
      disableRipple
      onClick={onClick}
      color="secondary"
    >
      {React.cloneElement(React.Children.only(children), otherProps)}
    </IconButton>
  );
};

export default VideoControlButton;