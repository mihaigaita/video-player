import * as React from 'react';
import { observer } from 'mobx-react';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { formatSecondsToTimeDuration } from '../utils/functions';
import { VideoPlayerContext } from './VideoPlayer';


const useTextStyles = makeStyles({
  root: {
    lineHeight: '100%',
  },
});

const ElapsedTime: React.FC<{}> = () => {
  const videoStore = React.useContext(VideoPlayerContext);
  const textClasses = useTextStyles();

  return (
    <Box paddingTop={1} display="flex" alignItems="center">
      <Typography
        classes={textClasses}
        variant="body2" 
        color="secondary"
      >
        {`${formatSecondsToTimeDuration(videoStore.currentPositionSeconds)} 
          / ${formatSecondsToTimeDuration(videoStore.durationSeconds)}`}
      </Typography>
    </Box>
  );
};

export default observer(ElapsedTime);