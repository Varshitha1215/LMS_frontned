'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Avatar,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Menu,
  MenuItem,
} from '@mui/material';
import { keyframes } from '@mui/system';
import Link from 'next/link';
import { useThemeMode } from '@/context/ThemeContext';
import { useUserManagement } from '@/context/UserManagementContext';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ThemeSwitcher from '@/components/ThemeSwitcher';

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Sidebar menu items
const menuItems = [
  { icon: <HomeIcon />, label: 'Dashboard', path: '/admin/dashboard', active: true },
  { icon: <PeopleIcon />, label: 'My Students', path: '/admin/students' },
  { icon: <MenuBookIcon />, label: 'Courses', path: '/admin/courses' },
  { icon: <AssignmentIcon />, label: 'Assignments', path: '/admin/assignments' },
  { icon: <CloudUploadIcon />, label: 'Content Upload', path: '/admin/content' },
  { icon: <BarChartIcon />, label: 'Analytics', path: '/admin/analytics' },
  { icon: <SettingsIcon />, label: 'Settings', path: '/admin/settings' },
];

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { mode, themeColors } = useThemeMode();
  const { currentUser, setCurrentUser, isLoaded, getStudentsForAdmin } = useUserManagement();
  const isDark = mode === 'dark';

  // Get students assigned to this admin
  const assignedStudents = currentUser?.id ? getStudentsForAdmin(currentUser.id) : [];

  // Theme-based colors
  const colors = {
    pageBg: isDark ? themeColors.backgroundDark : themeColors.backgroundLight,
    sidebarBg: isDark ? themeColors.primaryDark : themeColors.primary,
    sidebarBorder: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255, 255, 255, 0.2)',
    headerBg: isDark ? themeColors.primaryDark : themeColors.primary,
    cardBg: isDark ? themeColors.paperDark : themeColors.paperLight,
    cardBorder: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0, 0, 0, 0.08)',
    textPrimary: isDark ? themeColors.textDark : themeColors.textLight,
    textSecondary: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0, 0, 0, 0.6)',
    textMuted: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0, 0, 0, 0.4)',
    inputBg: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
    inputBorder: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
    accent: themeColors.accent,
    menuItemHover: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255, 255, 255, 0.2)',
    menuItemActive: isDark ? `${themeColors.accent}35` : `${themeColors.accent}25`,
    logoGradient: `linear-gradient(135deg, ${themeColors.primaryLight} 0%, ${themeColors.primary} 100%)`,
    headerText: '#ffffff',
    headerTextSecondary: 'rgba(255,255,255,0.8)',
    headerTextMuted: 'rgba(255,255,255,0.6)',
    successBg: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
    successText: isDark ? '#34D399' : '#059669',
    warningBg: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)',
    warningText: isDark ? '#FBBF24' : '#D97706',
    infoBg: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)',
    infoText: isDark ? '#60A5FA' : '#2563EB',
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    window.location.href = '/login';
  };

  if (!isLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: colors.pageBg }}>
        <Typography sx={{ color: colors.textPrimary }}>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.pageBg, transition: 'background-color 0.3s ease' }}>
      {/* ==================== SIDEBAR ==================== */}
      <Box
        sx={{
          width: 260,
          backgroundColor: colors.sidebarBg,
          borderRight: `1px solid ${colors.sidebarBorder}`,
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          height: '100vh',
          zIndex: 100,
          transition: 'all 0.3s ease',
        }}
      >
        {/* Logo */}
        <Box sx={{ p: 3, borderBottom: `1px solid ${colors.sidebarBorder}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 45,
                height: 45,
                borderRadius: '12px',
                background: colors.logoGradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <CodeIcon sx={{ color: colors.accent, fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: colors.headerText, fontWeight: 700, fontSize: '1.2rem', lineHeight: 1.2, display: 'inline' }}>
                Code
              </Typography>
              <Typography variant="h6" sx={{ color: colors.accent, fontWeight: 700, fontSize: '1.2rem', lineHeight: 1.2, display: 'inline' }}>
                Path
              </Typography>
              <Typography variant="caption" sx={{ color: colors.headerTextMuted, fontSize: '0.7rem', display: 'block' }}>
                Admin Panel
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Navigation */}
        <List sx={{ px: 2, py: 2, flex: 1 }}>
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              component={Link}
              href={item.path}
              sx={{
                borderRadius: '12px',
                mb: 0.5,
                backgroundColor: item.active ? colors.menuItemActive : 'transparent',
                '&:hover': { backgroundColor: colors.menuItemHover },
                transition: 'all 0.2s ease',
              }}
            >
              <ListItemIcon sx={{ color: item.active ? colors.accent : colors.headerTextSecondary, minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{ '& .MuiTypography-root': { color: colors.headerText, fontWeight: item.active ? 600 : 400, fontSize: '0.95rem' } }}
              />
            </ListItem>
          ))}
        </List>

        {/* User Profile Section */}
        <Box sx={{ p: 2, borderTop: `1px solid ${colors.sidebarBorder}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
            <Avatar sx={{ width: 42, height: 42, bgcolor: colors.accent, fontWeight: 700 }}>
              {currentUser?.firstName?.[0] || 'A'}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ color: colors.headerText, fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser?.firstName && currentUser?.lastName ? `${currentUser.firstName} ${currentUser.lastName}` : 'Admin'}
              </Typography>
              <Typography sx={{ color: colors.headerTextMuted, fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser?.email || 'No email'}
              </Typography>
              <Typography sx={{ color: colors.headerTextMuted, fontSize: '0.7rem', textTransform: 'capitalize' }}>
                {currentUser?.role || 'Admin'} • {currentUser?.institute || 'N/A'}
              </Typography>
            </Box>
            <IconButton size="small" onClick={handleLogout} sx={{ color: colors.headerTextSecondary }}>
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* ==================== MAIN CONTENT ==================== */}
      <Box sx={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            backgroundColor: colors.cardBg,
            borderBottom: `1px solid ${colors.cardBorder}`,
            px: 4,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ color: colors.textPrimary, fontWeight: 700 }}>
              📊 Admin Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              Manage courses, content, and assignments
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              placeholder="Search..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: 250,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: colors.inputBg,
                  borderRadius: 2,
                  '& fieldset': { borderColor: colors.inputBorder },
                  '&:hover fieldset': { borderColor: colors.accent },
                  '&.Mui-focused fieldset': { borderColor: colors.accent },
                },
                '& .MuiInputBase-input': { color: colors.textPrimary },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: colors.textMuted }} />
                  </InputAdornment>
                ),
              }}
            />
            <ThemeSwitcher />
            <Badge badgeContent={2} color="error">
              <IconButton sx={{ color: colors.textSecondary }}>
                <NotificationsIcon />
              </IconButton>
            </Badge>
            <IconButton onClick={handleProfileClick}>
              <Avatar sx={{ width: 38, height: 38, bgcolor: colors.accent }}>
                {currentUser?.firstName?.[0] || 'A'}
              </Avatar>
            </IconButton>
          </Box>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ p: 4, flex: 1 }}>
          {/* Welcome Section */}
          <Card
            sx={{
              p: 4,
              mb: 4,
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${colors.accent}15 0%, ${colors.cardBg} 100%)`,
              animation: `${fadeInUp} 0.5s ease`,
            }}
          >
            <Typography variant="h4" sx={{ color: colors.textPrimary, fontWeight: 700, mb: 1 }}>
              Welcome back, {currentUser?.firstName}! 👋
            </Typography>
            <Typography sx={{ color: colors.textSecondary, fontSize: '1.1rem' }}>
              You&apos;re logged in as an Admin for <strong>{currentUser?.institute}</strong>
            </Typography>
          </Card>

          {/* Quick Stats */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3, mb: 4 }}>
            {[
              { label: 'Total Courses', value: '0', icon: <MenuBookIcon />, color: colors.infoText, bg: colors.infoBg },
              { label: 'My Students', value: assignedStudents.length.toString(), icon: <SchoolIcon />, color: colors.successText, bg: colors.successBg },
              { label: 'Pending Assignments', value: '0', icon: <AssignmentIcon />, color: colors.warningText, bg: colors.warningBg },
              { label: 'Content Uploads', value: '0', icon: <CloudUploadIcon />, color: colors.accent, bg: `${colors.accent}20` },
            ].map((stat, index) => (
              <Card
                key={index}
                sx={{
                  p: 3,
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: 3,
                  animation: `${fadeInUp} 0.5s ease ${0.1 * index}s`,
                  animationFillMode: 'backwards',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography sx={{ color: colors.textMuted, fontSize: '0.85rem', mb: 0.5 }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h3" sx={{ color: stat.color, fontWeight: 700 }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '16px',
                      backgroundColor: stat.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {React.cloneElement(stat.icon, { sx: { color: stat.color, fontSize: 28 } })}
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>

          {/* Assigned Students Overview */}
          <Card
            sx={{
              p: 3,
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box>
                <Typography variant="h5" sx={{ color: colors.textPrimary, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PeopleIcon sx={{ color: colors.accent }} />
                  My Assigned Students
                </Typography>
                <Typography sx={{ color: colors.textSecondary, fontSize: '0.9rem', mt: 0.5 }}>
                  Students assigned to you by your organization admin
                </Typography>
              </Box>
              {assignedStudents.length > 0 && (
                <Button
                  component={Link}
                  href="/admin/students"
                  variant="contained"
                  sx={{
                    backgroundColor: colors.accent,
                    color: '#fff',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: `${colors.accent}dd` },
                  }}
                >
                  View All Students
                </Button>
              )}
            </Box>

            {assignedStudents.length === 0 ? (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <SchoolIcon sx={{ fontSize: 60, color: colors.textMuted, mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" sx={{ color: colors.textSecondary, mb: 1 }}>
                  No Students Assigned Yet
                </Typography>
                <Typography variant="body2" sx={{ color: colors.textMuted }}>
                  Your organization admin hasn&apos;t assigned any students to you yet.
                  <br />
                  Students will appear here once they are assigned.
                </Typography>
              </Box>
            ) : (
              <Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
                  {assignedStudents.slice(0, 6).map((student) => (
                    <Card
                      key={student.id}
                      sx={{
                        p: 2.5,
                        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                        border: `1px solid ${colors.cardBorder}`,
                        borderRadius: 2,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                          transform: 'translateY(-2px)',
                          boxShadow: `0 4px 12px ${colors.accent}20`,
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            backgroundColor: '#22C55E30',
                            color: '#22C55E',
                            fontWeight: 600,
                          }}
                        >
                          {student.firstName[0]}{student.lastName[0]}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              color: colors.textPrimary,
                              fontWeight: 600,
                              fontSize: '0.95rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {student.firstName} {student.lastName}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: colors.textMuted,
                              fontSize: '0.75rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {student.email}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ borderColor: colors.cardBorder, mb: 2 }} />

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '0.8rem' }}>
                            Student ID:
                          </Typography>
                          <Typography variant="body2" sx={{ color: colors.textPrimary, fontWeight: 500, fontSize: '0.8rem' }}>
                            {student.studentId || 'N/A'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '0.8rem' }}>
                            Department:
                          </Typography>
                          <Typography variant="body2" sx={{ color: colors.textPrimary, fontWeight: 500, fontSize: '0.8rem' }}>
                            {student.department}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '0.8rem' }}>
                            Year:
                          </Typography>
                          <Typography variant="body2" sx={{ color: colors.textPrimary, fontWeight: 500, fontSize: '0.8rem' }}>
                            {student.year || 'N/A'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '0.8rem' }}>
                            Progress:
                          </Typography>
                          <Typography variant="body2" sx={{ color: colors.successText, fontWeight: 600, fontSize: '0.8rem' }}>
                            0%
                          </Typography>
                        </Box>
                      </Box>

                      <Button
                        fullWidth
                        component={Link}
                        href={`/admin/students/${student.id}`}
                        variant="outlined"
                        size="small"
                        sx={{
                          mt: 2,
                          borderColor: colors.accent,
                          color: colors.accent,
                          textTransform: 'none',
                          '&:hover': {
                            borderColor: colors.accent,
                            backgroundColor: `${colors.accent}15`,
                          },
                        }}
                      >
                        View Details
                      </Button>
                    </Card>
                  ))}
                </Box>
                {assignedStudents.length > 6 && (
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Button
                      component={Link}
                      href="/admin/students"
                      variant="text"
                      sx={{
                        color: colors.accent,
                        textTransform: 'none',
                        '&:hover': { backgroundColor: `${colors.accent}15` },
                      }}
                    >
                      View All {assignedStudents.length} Students →
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Card>
        </Box>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: 2,
            minWidth: 200,
          },
        }}
      >
        <MenuItem onClick={handleClose} sx={{ color: colors.textPrimary }}>
          <ListItemIcon><PersonIcon sx={{ color: colors.textSecondary }} /></ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleClose} sx={{ color: colors.textPrimary }}>
          <ListItemIcon><SettingsIcon sx={{ color: colors.textSecondary }} /></ListItemIcon>
          Settings
        </MenuItem>
        <Divider sx={{ borderColor: colors.cardBorder }} />
        <MenuItem onClick={handleLogout} sx={{ color: '#EF4444' }}>
          <ListItemIcon><LogoutIcon sx={{ color: '#EF4444' }} /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}
