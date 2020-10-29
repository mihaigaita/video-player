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
    height: '100%',
    width: '100%',
  },
});

export const VideoPlayerContext = createContext();

const Video = ({
  posterUrl = '',
  manualDownloadUrl = '',
  sourceList = [],
}) => {
  const classes = useStyles();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const videoStore = new VideoStore(); // We want a new store instance for every different video source
  const videoElementRef = useRef();
  const videoContainerRef = useRef();

  useEffect(() => {
    if (videoElementRef.current) {
      videoStore.setVideoElement(videoElementRef.current);
      videoStore.setVideoContainer(videoContainerRef.current);
    }

    return videoStore.cleanUp;
  }, [videoStore]);

  return (
    <div 
      className={classes.videoContainer}
      ref={videoContainerRef}
    >
      <VideoPlayerContext.Provider value={videoStore} >
        <video
          id="video"
          ref={videoElementRef}
          className={classes.video}
          preload="metadata"
          poster={posterUrl}
        >
          {sourceList.map(source => {
            const { url, type } = source;
            return (
              <source key={url} src={url} type={type} />
            );
          })}

          <a href={manualDownloadUrl}>Download Video</a>
        </video>

        <VideoControls />
      </VideoPlayerContext.Provider>
    </div>
  );
};

export default Video;
