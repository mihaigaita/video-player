import { useContext, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import clsx from 'clsx';

import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';

import { VideoPlayerContext } from './VideoPlayer';


const useFeedbackStyles = makeStyles({
  actionFeedbackWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
  },
  backgroundMask: {
    background: '#000a',
  },
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

const VideoClickFeedback = observer(() => {
  const videoStore = useContext(VideoPlayerContext);
  const classes = useFeedbackStyles();

  const iconClasses = useMemo(() => ({ 
    root: videoStore.videoClickAnimationDisplaying 
      ? classes.actionAnimationStart 
      : classes.actionRestState 
  }), [videoStore.videoClickAnimationDisplaying, classes]);

  const FeedbackIconType = (videoStore.videoIsPlaying)
    ? PlayCircleFilledIcon 
    : PauseCircleFilledIcon;

  return (
    <div 
      className={clsx(
        classes.actionFeedbackWrapper, 
        videoStore.seekIsPending && classes.backgroundMask
      )}
    >
      <FeedbackIconType
        classes={iconClasses}
        color="secondary"
      />
    </div>
  );
});

export default VideoClickFeedback;