import { createContext, useCallback } from "react"
import { makeStyles } from '@material-ui/core/styles';

import VideoControls from './VideoControls';
import VideoStore from '../store/VideoStore';

const useStyles = makeStyles({
  videoContainer: {
    position: 'relative',
  },
  video: {
    display: 'block',
    objectFit: 'contain',
  }
});

export const VideoPlayerContext = createContext();

const Video = ({
  posterUrl = '',
  manualDownloadUrl = '',
  sourceList = [],
  height = 360,
  width = 640,
}) => {
  const classes = useStyles();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const videoStore = new VideoStore();

  const getVideoComponentRef = useCallback(node => {
    if (node) {
      videoStore.setVideoElement(node);
    }
  }, [videoStore]);

  return (
    <div className={classes.videoContainer}>
      <video
        id="video"
        ref={getVideoComponentRef}
        className={classes.video}
        preload="metadata" 
        poster={posterUrl}
        height={height.toString()}
        width={width.toString()}
      >
        {sourceList.map(source => {
          const { url, type } = source;
          return (
            <source key={url} src={url} type={type} />
          );
        })}

        <a href={manualDownloadUrl}>Download Video</a>
      </video>

      <VideoPlayerContext.Provider value={videoStore} >
        <VideoControls />
      </VideoPlayerContext.Provider>
    </div>
  );
};

export default Video;
