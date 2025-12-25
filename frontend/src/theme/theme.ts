'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0C2B4E',      // Deep navy blue
      light: '#1a4a7a',
      dark: '#081d35',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1a4a7a',
      light: '#2d6aa8',
      dark: '#0C2B4E',
    },
    background: {
      default: '#0a1f38',   // Dark navy background
      paper: '#f8fafc',     // Light paper
    },
    text: {
      primary: '#0C2B4E',
      secondary: '#1a4a7a',
    },
  },
  typography: {
    fontFamily: '"Inter", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(12, 43, 78, 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export default theme;