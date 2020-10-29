import { makeStyles } from '@material-ui/core/styles';
import VideoControls from './VideoControls';

const useStyles = makeStyles((theme) => ({
  videoContainer: {
    position: 'relative',
  },
  video: {
    display: 'block',
    objectFit: 'contain',
  }
}));

const Video = ({
  posterUrl = '',
  manualDownloadUrl = '',
  sourceList = [],
  height = 360,
  width = 640,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.videoContainer}>
      <video
        id="video"
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

      <VideoControls
        playbackState={'paused'}
        volumeLevel={50}
        currentPositionSeconds={843}
        durationSeconds={1232}
        fullscreenEnabled={false}
      />
    </div>
  );
};

export default Video;
