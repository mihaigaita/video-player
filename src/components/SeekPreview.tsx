import * as React from 'react';
import { observer } from 'mobx-react';

import Box from '@material-ui/core/Box';

import { VideoPlayerContext } from './VideoPlayer';


const SeekPreview: React.FC<{}> = () => {
  const videoStore = React.useContext(VideoPlayerContext);

  return (
    <Box 
      position="absolute"
      height={`calc(5 / 16 * 100%)`}
      left={0}
      zIndex={-1}
      bgcolor="grey.800"
      width={`${videoStore.seekHoverPositionPercent}%`}
      style={{ 
        transform: `scaleY(${videoStore.fullscreenIsActive ? 1.4 : 1})`,
        transformOrigin: 'top',
      }}
    />
  );
};

export default observer(SeekPreview);