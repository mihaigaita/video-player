import * as React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import VideoControls from './VideoControls';
import VideoStore from '../store/VideoStore';

const useStyles = makeStyles({
  video: {
    display: 'block',
    objectFit: 'contain',
    height: '100%',
    width: '100%',
  },
});

export const VideoPlayerContext = React.createContext<VideoStore>(null!);

type VideoSourceType = {
  url: string,
  type: string,
};

type VideoPlayerPropsType = {
  posterUrl: string,
  manualDownloadUrl: string,
  sourceList: VideoSourceType[],
}

const VideoPlayer: React.FC<VideoPlayerPropsType> = ({
  posterUrl = '',
  manualDownloadUrl = '',
  sourceList = [],
}) => {
  const classes = useStyles();
  const videoElementRef = React.useRef<HTMLVideoElement>(null!);
  const videoContainerRef = React.useRef<HTMLDivElement>(null!);
  const videoStoreRef = React.useRef<VideoStore | null>(null);

  // Lazy initialization of a single videoStore instance per mounted component
  const getStore = React.useCallback(() => {
    if (!videoStoreRef.current) {
      videoStoreRef.current = new VideoStore();
    }

    return videoStoreRef.current;
  }, [videoStoreRef]);
  
  // Assign component refs required by the video store after rendering & DOM insertion
  React.useEffect(() => {
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
  React.useEffect(() => {
    const videoStore = getStore();
    videoStore.setInitialState();
  });

  return (
    <Box
      position='relative'
      border={2}
      borderColor='grey.700'
      // @ts-expect-error
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
    </Box>
  );
};

export default VideoPlayer;