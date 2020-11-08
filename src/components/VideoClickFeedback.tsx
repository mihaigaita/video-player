import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';

import Box from '@material-ui/core/Box';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';

import { VideoPlayerContext } from './VideoPlayer';


const useFeedbackStyles = makeStyles({
  actionAnimationStart: {
    fontSize: "4rem",
    opacity: 0.5,
  },
  actionRestState: {
    transition: 'all 0.5s ease-out',
    fontSize: "8rem",
    opacity: 0,
  },
});

const VideoClickFeedback: React.FC<{}> = () => {
  const videoStore = React.useContext(VideoPlayerContext);
  const classes = useFeedbackStyles();

  const iconClasses = React.useMemo(() => ({ 
    root: videoStore.videoClickAnimationDisplaying 
      ? classes.actionAnimationStart 
      : classes.actionRestState 
  }), [videoStore.videoClickAnimationDisplaying, classes]);

  const FeedbackIconType = (videoStore.videoIsPlaying)
    ? PlayCircleFilledIcon 
    : PauseCircleFilledIcon;

  return (
    <Box 
      display='flex'
      alignItems='center'
      justifyContent='center'
      height='100%'
      width='100%'
      position='absolute'
      zIndex={1}
      top={0}
      left={0}
      bgcolor={videoStore.seekIsPending ? '#000a' : 'initial'}
    >
      <FeedbackIconType
        classes={iconClasses}
        color="secondary"
      />
    </Box>
  );
};

export default observer(VideoClickFeedback);