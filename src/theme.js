import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ff5722',
    },
    secondary: {
      main: '#ff9100',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#ddd',
    },
  },
});

export default theme;