import { useContext } from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';

import { VideoPlayerContext } from './VideoPlayer';


const usePreviewStyles = makeStyles({
  seekPreview: {
    top: '50%',
    position: 'absolute',
    height: 5,
    marginTop: -2.5,
    left: 0,
    zIndex: -1,
    background: '#666',
  },
});

const SeekPreview = observer(() => {
  const videoStore = useContext(VideoPlayerContext);
  const classes = usePreviewStyles();

  return (
    <div 
      className={classes.seekPreview}
      style={{ width: `${videoStore.seekHoverPositionPercent}%` }}
    />
  );
});

export default SeekPreview;