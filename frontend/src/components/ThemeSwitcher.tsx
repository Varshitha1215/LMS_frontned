'use client';

import { useState } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Collapse,
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import CheckIcon from '@mui/icons-material/Check';
import PaletteIcon from '@mui/icons-material/Palette';
import { useThemeMode, ThemeName } from '@/context/ThemeContext';

export default function ThemeSwitcher() {
  const { mode, themeName, toggleMode, setTheme, allThemes } = useThemeMode();
  const [showThemes, setShowThemes] = useState(false);

  const handleThemeSelect = (theme: ThemeName) => {
    setTheme(theme);
  };

  const handleToggleThemes = () => {
    setShowThemes(!showThemes);
  };

  const isDark = mode === 'dark';

  // Theme preview colors for each theme
  const getPreviewColors = (theme: ThemeName) => {
    const config = allThemes[theme];
    return {
      primary: config.primary,
      accent: config.accent,
      name: config.name,
    };
  };

  // Ensure theme switcher is always visible with a dark container background
  // This ensures white icons are visible on any header background
  const containerBg = 'rgba(0,0,0,0.25)';
  const containerBorder = 'rgba(255,255,255,0.2)';
  const iconColor = 'rgba(255,255,255,0.95)';
  const iconColorMuted = 'rgba(255,255,255,0.75)';
  const bgColorHover = 'rgba(255,255,255,0.15)';
  const dividerColor = 'rgba(255,255,255,0.25)';

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 0.5,
        backgroundColor: containerBg,
        borderRadius: 3,
        px: 1,
        py: 0.5,
        border: `1px solid ${containerBorder}`,
      }}
    >
      {/* Palette Button to toggle themes */}
      <Tooltip title={showThemes ? 'Hide Themes' : 'Show Themes'} arrow placement="bottom">
        <IconButton
          onClick={handleToggleThemes}
          size="small"
          sx={{
            color: showThemes ? iconColor : iconColorMuted,
            p: 0.75,
            backgroundColor: showThemes ? bgColorHover : 'transparent',
            '&:hover': {
              backgroundColor: bgColorHover,
            },
            transition: 'all 0.2s ease',
          }}
        >
          <PaletteIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>

      {/* Theme Color Dots - Visible by default */}
      <Collapse in={showThemes} orientation="horizontal" timeout={300}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            pl: 0.5,
          }}
        >
          {(Object.keys(allThemes) as ThemeName[]).map((theme) => {
            const colors = getPreviewColors(theme);
            const isSelected = themeName === theme;

            return (
              <Tooltip 
                key={theme} 
                title={colors.name} 
                arrow 
                placement="bottom"
              >
                <Box
                  onClick={() => handleThemeSelect(theme)}
                  sx={{
                    width: isSelected ? 28 : 24,
                    height: isSelected ? 28 : 24,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${colors.primary} 50%, ${colors.accent} 50%)`,
                    border: isSelected 
                      ? '3px solid rgba(255,255,255,0.95)' 
                      : '2px solid rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isSelected 
                      ? '0 0 12px rgba(255,255,255,0.5), 0 2px 8px rgba(0,0,0,0.3)' 
                      : '0 2px 4px rgba(0,0,0,0.2)',
                    '&:hover': {
                      transform: 'scale(1.2)',
                      border: '3px solid rgba(255,255,255,0.9)',
                      boxShadow: '0 0 15px rgba(255,255,255,0.4), 0 4px 12px rgba(0,0,0,0.3)',
                    },
                  }}
                >
                  {isSelected && (
                    <CheckIcon sx={{ fontSize: 14, color: 'white', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />
                  )}
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      </Collapse>

      {/* Divider - only show when themes are visible */}
      <Collapse in={showThemes} orientation="horizontal" timeout={300}>
        <Box 
          sx={{ 
            width: 1, 
            height: 24, 
            backgroundColor: dividerColor,
            mx: 0.5,
          }} 
        />
      </Collapse>

      {/* Light/Dark Mode Toggle */}
      <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'} arrow placement="bottom">
        <IconButton
          onClick={toggleMode}
          size="small"
          sx={{
            color: iconColor,
            p: 0.75,
            '&:hover': {
              backgroundColor: bgColorHover,
            },
            transition: 'all 0.2s ease',
          }}
        >
          {isDark ? (
            <DarkModeIcon sx={{ fontSize: 20 }} />
          ) : (
            <LightModeIcon sx={{ fontSize: 20 }} />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
}
