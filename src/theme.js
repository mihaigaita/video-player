import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        /* The emerging W3C standard that is currently Firefox-only */
        '*': {
          scrollbarColor: '#424242 #8e8e8e',
        },
        /* Works on Chrome/Edge/Safari */
        '*::-webkit-scrollbar': {
          width: 10,
        },
        '*::-webkit-scrollbar-track': {
          background: '#424242',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: '#8e8e8e',
          borderRadius: 4,
        }
      }
    }
  },
  spacing: 4,
  palette: {
    primary: {
      main: '#ff5722',
    },
    secondary: {
      main: '#ffffff',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#ccbfa0',
    },
  },
});

export default theme;