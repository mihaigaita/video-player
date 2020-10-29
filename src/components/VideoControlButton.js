import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

const useControlStyles = makeStyles({
  iconRoot: {
    padding: 0,
    '&:hover': {
      backgroundColor: 'unset',
    }
  }
});

const VideoControlButton = ({ children, ...otherProps }) => {
  const classes = useControlStyles();

  return (
    <IconButton 
      classes={{ root: classes.iconRoot}} 
      disableFocusRipple 
      disableRipple
      color="secondary"
    >
      {React.cloneElement(React.Children.only(children), otherProps)}
    </IconButton>
  );
};

export default VideoControlButton;