import * as React from 'react';
import { observer } from 'mobx-react';

import Box from '@material-ui/core/Box';

import { VideoPlayerContext } from './VideoPlayer';


const SeekPreview: React.FC<{}> = () => {
  const videoStore = React.useContext(VideoPlayerContext);

  return (
    <Box 
      top="50%"
      position="absolute"
      height="5px"
      marginTop="-2.5px"
      left={0}
      zIndex={-1}
      bgcolor="text.secondary"
      width={`${videoStore.seekHoverPositionPercent}%`}
    />
  );
};

export default observer(SeekPreview);