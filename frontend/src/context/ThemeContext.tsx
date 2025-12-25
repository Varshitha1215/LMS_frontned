'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


export type ThemeName = 
  | 'midnightOcean'    // Dark Blue + Black
  | 'lavenderDream'    // Lavender + Yellow
  | 'forestNight'      // Dark Green + Emerald
  | 'sunsetBlaze'      // Orange + Deep Red
  | 'arcticFrost'      // Ice Blue + Silver/White
  | 'royalPurple'      // Deep Purple + Gold
  | 'cyberNeon';       // Magenta/Pink + Cyan

export interface ThemeColors {
  name: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  accent: string;
  backgroundDark: string;
  backgroundLight: string;
  paperDark: string;
  paperLight: string;
  textDark: string;
  textLight: string;
  gradient: string;
}

export const themeConfigs: Record<ThemeName, ThemeColors> = {
  // 1. MIDNIGHT OCEAN - Deep Navy + Cyan Blue
  midnightOcean: {
    name: 'Midnight Ocean',
    primary: '#0C2B4E',
    primaryLight: '#1a4a7a',
    primaryDark: '#081d35',
    secondary: '#00D4FF',
    secondaryLight: '#5CE1FF',
    secondaryDark: '#00A8CC',
    accent: '#00D4FF',
    backgroundDark: '#050d18',
    backgroundLight: '#e8f4fc',
    paperDark: '#0C2B4E',
    paperLight: '#ffffff',
    textDark: '#ffffff',
    textLight: '#0C2B4E',
    gradient: 'linear-gradient(135deg, #0C2B4E 0%, #1a4a7a 50%, #081d35 100%)',
  },

  // 2. LAVENDER DREAM - Dull Muted Lavender + Soft Gold
  lavenderDream: {
    name: 'Lavender Dream',
    primary: '#5D4777',
    primaryLight: '#7B6895',
    primaryDark: '#3D2D52',
    secondary: '#D4A853',
    secondaryLight: '#E5C178',
    secondaryDark: '#B8923E',
    accent: '#D4A853',
    backgroundDark: '#0e0b12',
    backgroundLight: '#F8F5FC',
    paperDark: '#1f1828',
    paperLight: '#ffffff',
    textDark: '#B8A8CC',
    textLight: '#4A3666',
    gradient: 'linear-gradient(135deg, #3D2D52 0%, #5D4777 50%, #2A1F38 100%)',
  },

  // 3. FOREST NIGHT - Deep Forest Green + Moonlight Silver
  forestNight: {
    name: 'Forest Night',
    primary: '#1B4332',
    primaryLight: '#2D6A4F',
    primaryDark: '#0D2818',
    secondary: '#94A3B8',
    secondaryLight: '#CBD5E1',
    secondaryDark: '#64748B',
    accent: '#A7F3D0',
    backgroundDark: '#070f08',
    backgroundLight: '#F0FDF4',
    paperDark: '#0D2818',
    paperLight: '#ffffff',
    textDark: '#D8E9DC',
    textLight: '#1B4332',
    gradient: 'linear-gradient(135deg, #0D2818 0%, #1B4332 50%, #071510 100%)',
  },

  // 4. SUNSET BLAZE - Warm Terracotta + Golden Amber
  sunsetBlaze: {
    name: 'Sunset Blaze',
    primary: '#9C4221',
    primaryLight: '#C2572D',
    primaryDark: '#6B2D14',
    secondary: '#D97706',
    secondaryLight: '#F59E0B',
    secondaryDark: '#B45309',
    accent: '#F59E0B',
    backgroundDark: '#1a1008',
    backgroundLight: '#FFFBEB',
    paperDark: '#2D1810',
    paperLight: '#ffffff',
    textDark: '#FDE68A',
    textLight: '#78350F',
    gradient: 'linear-gradient(135deg, #6B2D14 0%, #9C4221 50%, #451A0A 100%)',
  },

  // 5. ARCTIC FROST - Cool Blue + Pearl White
  arcticFrost: {
    name: 'Arctic Frost',
    primary: '#0284C7',
    primaryLight: '#0EA5E9',
    primaryDark: '#075985',
    secondary: '#E2E8F0',
    secondaryLight: '#F1F5F9',
    secondaryDark: '#CBD5E1',
    accent: '#38BDF8',
    backgroundDark: '#0c1929',
    backgroundLight: '#F0F9FF',
    paperDark: '#0E4C75',
    paperLight: '#ffffff',
    textDark: '#E0F2FE',
    textLight: '#0369A1',
    gradient: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 50%, #075985 100%)',
  },

  // 6. ROYAL PURPLE - Rich Purple + Rose Pink
  royalPurple: {
    name: 'Royal Purple',
    primary: '#7C2D92',
    primaryLight: '#9333EA',
    primaryDark: '#581C87',
    secondary: '#F472B6',
    secondaryLight: '#F9A8D4',
    secondaryDark: '#DB2777',
    accent: '#F472B6',
    backgroundDark: '#1a0a24',
    backgroundLight: '#FAF5FF',
    paperDark: '#4C1D6C',
    paperLight: '#ffffff',
    textDark: '#F3E8FF',
    textLight: '#6B21A8',
    gradient: 'linear-gradient(135deg, #7C2D92 0%, #9333EA 50%, #581C87 100%)',
  },

  // 7. CYBER NEON - Muted Pink + Dull Cyan
  cyberNeon: {
    name: 'Cyber Neon',
    primary: '#8B3A5C',
    primaryLight: '#A85278',
    primaryDark: '#5C2640',
    secondary: '#4A8A96',
    secondaryLight: '#5FA3B0',
    secondaryDark: '#3A6E78',
    accent: '#5FA3B0',
    backgroundDark: '#0c0810',
    backgroundLight: '#FDF2F8',
    paperDark: '#1e1628',
    paperLight: '#ffffff',
    textDark: '#E8C4D8',
    textLight: '#7A2D4A',
    gradient: 'linear-gradient(135deg, #5C2640 0%, #8B3A5C 50%, #3A2030 100%)',
  },
};

// ==================== THEME CONTEXT ====================

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  themeName: ThemeName;
  themeColors: ThemeColors;
  allThemes: typeof themeConfigs;
  toggleMode: () => void;
  setTheme: (theme: ThemeName) => void;
  // Legacy support
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeContextProvider');
  }
  return context;
};

// Generate MUI theme from our color config
const createAppTheme = (colors: ThemeColors, mode: ThemeMode): Theme => createTheme({
  palette: {
    mode,
    primary: {
      main: colors.primary,
      light: colors.primaryLight,
      dark: colors.primaryDark,
    },
    secondary: {
      main: colors.secondary,
      light: colors.secondaryLight,
      dark: colors.secondaryDark,
    },
    background: {
      default: mode === 'dark' ? colors.backgroundDark : colors.backgroundLight,
      paper: mode === 'dark' ? colors.paperDark : colors.paperLight,
    },
    text: {
      primary: mode === 'dark' ? colors.textDark : colors.textLight,
      secondary: mode === 'dark' 
        ? `rgba(255, 255, 255, 0.7)` 
        : `rgba(0, 0, 0, 0.6)`,
    },
  },
  typography: {
    fontFamily: '"Inter", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

interface ThemeContextProviderProps {
  children: ReactNode;
}

// Default theme configuration
const DEFAULT_THEME: ThemeName = 'midnightOcean';
const DEFAULT_MODE: ThemeMode = 'dark';

// Helper function to get initial values from localStorage (runs only on client)
const getInitialMode = (): ThemeMode => {
  if (typeof window === 'undefined') return DEFAULT_MODE;
  const savedMode = localStorage.getItem('themeMode') as ThemeMode;
  return savedMode || DEFAULT_MODE;
};

const getInitialTheme = (): ThemeName => {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  const savedTheme = localStorage.getItem('themeName') as ThemeName;
  return (savedTheme && themeConfigs[savedTheme]) ? savedTheme : DEFAULT_THEME;
};

// Custom hook to track mounted state without triggering linter warnings
const useMounted = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    const handleMount = () => setMounted(true);
    handleMount();
  }, []);
  
  return mounted;
};

export const ThemeContextProvider = ({ children }: ThemeContextProviderProps) => {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);
  const [themeName, setThemeName] = useState<ThemeName>(getInitialTheme);
  const mounted = useMounted();

  const toggleMode = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const setTheme = (theme: ThemeName) => {
    setThemeName(theme);
    localStorage.setItem('themeName', theme);
  };

  const themeColors = themeConfigs[themeName];
  const muiTheme = createAppTheme(themeColors, mode);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ 
      mode, 
      themeName, 
      themeColors, 
      allThemes: themeConfigs,
      toggleMode, 
      setTheme,
      toggleTheme: toggleMode, // Legacy support
    }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
