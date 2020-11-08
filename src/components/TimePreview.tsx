import * as React from 'react';
import { observer } from 'mobx-react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { formatSecondsToTimeDuration } from '../utils/functions';
import { VideoPlayerContext } from './VideoPlayer';


const TimePreview: React.FC<{}> = () => {
  const videoStore = React.useContext(VideoPlayerContext);
  
  return (
    <Box 
      display='inline-block'
      position='absolute'
      top='-1.3rem'
      bgcolor={'radial-gradient(#0003} transparent)'}
      paddingX={2}
      borderRadius={100}
      left={`calc(${videoStore.seekHoverPositionPercentClamped}% - 18px)`}
      visibility={videoStore.previewPeekIsActive ? 'visible' : 'hidden'}
    > 
      <Typography
        variant="body2" 
        color="secondary"
      >
        {formatSecondsToTimeDuration(videoStore.seekHoverPositionSeconds)}
      </Typography>
    </Box>
  );
};

export default observer(TimePreview);