import { createContext, useRef, useEffect, useCallback } from "react"
import { makeStyles } from '@material-ui/core/styles';

import VideoControls from './VideoControls';
import VideoStore from '../store/VideoStore';

const useStyles = makeStyles({
  videoContainer: {
    position: 'relative',
    border: '2px solid #555',
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
  const videoElementRef = useRef();
  const videoContainerRef = useRef();
  const videoStoreRef = useRef(null);

  // Lazy initialization of a single videoStore instance per mounted component
  const getStore = useCallback(() => {
    if (!videoStoreRef.current) {
      videoStoreRef.current = new VideoStore();
    }

    return videoStoreRef.current;
  }, [videoStoreRef]);
  
  // Assign component refs required by the video store after rendering & DOM insertion
  useEffect(() => {
    const videoStore = getStore();

    if (videoElementRef.current) {
      videoStore.setVideoElement(videoElementRef.current);
    }
    
    if (videoContainerRef.current) {
      videoStore.setVideoContainer(videoContainerRef.current);
    }
    
    return videoStore.cleanUp;
  }, [getStore]);
  
  // Reset store state if the video component props change
  useEffect(() => {
    const videoStore = getStore();
    videoStore.setInitialState();
  });

  return (
    <div
      className={classes.videoContainer}
      ref={videoContainerRef}
    >
      <VideoPlayerContext.Provider value={getStore()} >
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
