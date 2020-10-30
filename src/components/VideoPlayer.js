import { createContext, useRef, useEffect, useState } from "react"
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
  const videoElementRef = useRef();
  const videoContainerRef = useRef();

  // Lazy initialization of a single videoStore instance per mounted component
  const [videoStore] = useState(() => new VideoStore());

  useEffect(() => {
    if (videoElementRef.current) {
      videoStore.setVideoElement(videoElementRef.current);
    }

    if (videoContainerRef.current) {
      videoStore.setVideoContainer(videoContainerRef.current);
    }

    return videoStore.cleanUp;
  }, [videoStore]);

  // Reset store state if the video content changes
  useEffect(() => {
    videoStore.setInitialState();
  }, [sourceList, videoStore]);

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
