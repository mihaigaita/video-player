import * as React from 'react';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import VideoPlayer from './components/VideoPlayer';


const App: React.FC<{}> = () => (
  <Box display="flex" justifyContent="center">
    <Box height={480} marginY={16} marginX="auto">
      <VideoPlayer
        posterUrl={process.env.PUBLIC_URL + "/preview/video.jpg"}
        manualDownloadUrl={process.env.PUBLIC_URL + "/video/video.mp4"}
        sourceList={[{
            url: process.env.PUBLIC_URL + "/video/video.mp4",
            type: "video/mp4",
          }
        ]}
      />

      <Box display="flex" justifyContent="center" marginTop={2}>
        <Typography variant="h4" gutterBottom>
          Big Buck Bunny
        </Typography>
      </Box>
    </Box>
  </Box>
);

export default App;
