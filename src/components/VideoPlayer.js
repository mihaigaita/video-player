import { createContext, useRef, useEffect } from "react"
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
  const videoElementRef = useRef();

  useEffect(() => {
    if (videoElementRef.current) {
      videoStore.setVideoElement(videoElementRef.current);
    }

    return videoStore.cleanUp;
  }, [videoStore]);

  return (
    <div className={classes.videoContainer}>
      <video
        id="video"
        ref={videoElementRef}
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
