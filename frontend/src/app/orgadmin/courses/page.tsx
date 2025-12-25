'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Avatar,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Badge,
  Menu,
  MenuItem,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  Alert,
} from '@mui/material';
import { keyframes } from '@mui/system';
import Link from 'next/link';
import { useThemeMode } from '@/context/ThemeContext';
import { useUserManagement } from '@/context/UserManagementContext';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
  { icon: <HomeIcon />, label: 'Dashboard', path: '/orgadmin/dashboard' },
  { icon: <PeopleIcon />, label: 'Students and Admins', path: '/orgadmin/students' },
  { icon: <MenuBookIcon />, label: 'Courses', path: '/orgadmin/courses', active: true },
  { icon: <SchoolIcon />, label: 'Admin Management', path: '/orgadmin/admins' },
  { icon: <AssessmentIcon />, label: 'Reports', path: '/orgadmin/reports' },
  { icon: <SettingsIcon />, label: 'Settings', path: '/orgadmin/settings' },
];

export default function OrgAdminCoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const { mode, themeColors } = useThemeMode();
  const { 
    currentUser, 
    setCurrentUser, 
    courses,
    selectCourseByOrgAdmin,
    deselectCourseByOrgAdmin,
    isLoaded,
  } = useUserManagement();
  const isDark = mode === 'dark';

  // Use courses directly from context for automatic reactivity
  const allCourses = courses;

  // Get enrolled course IDs for this OrgAdmin
  const enrolledCourseIds = currentUser?.selectedCourseIds || [];

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

  const handleEnrollCourse = (courseId: string, courseTitle: string) => {
    if (!currentUser?.id) return;
    
    selectCourseByOrgAdmin(courseId, currentUser.id);
    setSnackbar({
      open: true,
      message: `Successfully enrolled in "${courseTitle}"! This course is now available to your admins.`,
      severity: 'success',
    });
  };

  const handleUnenrollCourse = (courseId: string, courseTitle: string) => {
    if (!currentUser?.id) return;
    
    deselectCourseByOrgAdmin(courseId, currentUser.id);
    setSnackbar({
      open: true,
      message: `Unenrolled from "${courseTitle}". This course is no longer available to your admins.`,
      severity: 'info',
    });
  };

  // Filter courses based on search
  const filteredCourses = allCourses.filter(course =>
    `${course.title} ${course.description}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.pageBg, transition: 'background-color 0.3s ease' }}>
      {/* ==================== SIDEBAR ==================== */}
      <Box
        sx={{
          width: 260,
          position: 'fixed',
          height: '100vh',
          background: colors.sidebarBg,
          borderRight: `1px solid ${colors.sidebarBorder}`,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
          transition: 'all 0.3s ease',
        }}
      >
        {/* Logo */}
        <Box sx={{ p: 3, borderBottom: `1px solid ${colors.sidebarBorder}` }}>
          <Link href="/orgadmin/dashboard" style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: colors.logoGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 12px ${colors.accent}40`,
                }}
              >
                <SchoolIcon sx={{ color: '#fff', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography sx={{ color: colors.headerText, fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.2 }}>
                  LMS
                </Typography>
                <Typography sx={{ color: colors.headerTextMuted, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  OrgAdmin
                </Typography>
              </Box>
            </Box>
          </Link>
        </Box>

        {/* Menu Items */}
        <Box sx={{ flex: 1, py: 2, overflowY: 'auto' }}>
          {menuItems.map((item, index) => (
            <Link key={index} href={item.path} style={{ textDecoration: 'none' }}>
              <Box
                sx={{
                  mx: 2,
                  mb: 1,
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: item.active ? colors.menuItemActive : 'transparent',
                  '&:hover': { backgroundColor: colors.menuItemHover },
                }}
              >
                <Box sx={{ color: item.active ? colors.accent : colors.headerTextSecondary, display: 'flex' }}>
                  {item.icon}
                </Box>
                <Typography
                  sx={{
                    color: item.active ? colors.accent : colors.headerTextSecondary,
                    fontWeight: item.active ? 600 : 500,
                    fontSize: '0.9rem',
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            </Link>
          ))}
        </Box>

        {/* User Profile */}
        <Box sx={{ p: 2, borderTop: `1px solid ${colors.sidebarBorder}` }}>
          <Box
            onClick={handleProfileClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              '&:hover': { backgroundColor: colors.menuItemHover },
            }}
          >
            <Avatar sx={{ width: 36, height: 36, backgroundColor: colors.accent }}>
              {currentUser?.firstName?.[0] || 'O'}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ color: colors.headerText, fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser?.firstName || 'OrgAdmin'}
              </Typography>
              <Typography sx={{ color: colors.headerTextMuted, fontSize: '0.75rem' }}>
                Organization Admin
              </Typography>
            </Box>
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            sx: { backgroundColor: colors.cardBg, borderRadius: 2, minWidth: 200, border: `1px solid ${colors.cardBorder}` },
          }}
        >
          <MenuItem onClick={handleClose} sx={{ color: colors.textPrimary, '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' } }}>
            <PersonIcon sx={{ mr: 1.5, fontSize: 20 }} /> Profile
          </MenuItem>
          <MenuItem onClick={handleClose} sx={{ color: colors.textPrimary, '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' } }}>
            <SettingsIcon sx={{ mr: 1.5, fontSize: 20 }} /> Settings
          </MenuItem>
          <Divider sx={{ borderColor: colors.cardBorder }} />
          <MenuItem onClick={handleLogout} sx={{ color: colors.textSecondary, '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' } }}>
            <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} /> Logout
          </MenuItem>
        </Menu>
      </Box>

      {/* ==================== MAIN CONTENT ==================== */}
      <Box sx={{ flex: 1, ml: '260px', minHeight: '100vh' }}>
        {/* Top Header */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            backgroundColor: colors.headerBg,
            backdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${colors.sidebarBorder}`,
            px: 4,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 50,
            transition: 'all 0.3s ease',
          }}
        >
          <TextField
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{
              width: 400,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: 2,
                color: colors.headerText,
                '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                '&.Mui-focused fieldset': { borderColor: colors.accent },
              },
              '& .MuiOutlinedInput-input': { '&::placeholder': { color: colors.headerTextMuted, opacity: 1 } },
            }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: colors.headerTextMuted }} /></InputAdornment> }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ThemeSwitcher />
            <IconButton sx={{ color: colors.headerTextSecondary, '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' } }}>
              <Badge badgeContent={0} sx={{ '& .MuiBadge-badge': { backgroundColor: '#F59E0B', color: '#ffffff' } }}>
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ p: 4 }}>
          {/* Page Header */}
          <Box sx={{ mb: 4, animation: `${fadeInUp} 0.5s ease-out` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Link href="/orgadmin/dashboard" style={{ textDecoration: 'none' }}>
                <IconButton sx={{ color: colors.textSecondary, '&:hover': { backgroundColor: `${colors.accent}20`, color: colors.accent } }}>
                  <ArrowBackIcon />
                </IconButton>
              </Link>
              <Box>
                <Typography variant="h4" sx={{ color: colors.textPrimary, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <MenuBookIcon sx={{ fontSize: 36, color: colors.accent }} />
                  Course Enrollment
                </Typography>
                <Typography sx={{ color: colors.textSecondary, fontSize: '1rem', mt: 0.5 }}>
                  Enroll in courses to make them available to your admins at <strong>{currentUser?.institute || 'your institution'}</strong>
                </Typography>
              </Box>
            </Box>

            {/* Stats */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mt: 3 }}>
              <Card sx={{ p: 2.5, backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 2 }}>
                <Typography sx={{ color: colors.textMuted, fontSize: '0.8rem', mb: 0.5 }}>Total Available Courses</Typography>
                <Typography variant="h4" sx={{ color: colors.accent, fontWeight: 700 }}>{allCourses.length}</Typography>
              </Card>
              <Card sx={{ p: 2.5, backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 2 }}>
                <Typography sx={{ color: colors.textMuted, fontSize: '0.8rem', mb: 0.5 }}>Enrolled Courses</Typography>
                <Typography variant="h4" sx={{ color: '#22C55E', fontWeight: 700 }}>{enrolledCourseIds.length}</Typography>
              </Card>
              <Card sx={{ p: 2.5, backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 2 }}>
                <Typography sx={{ color: colors.textMuted, fontSize: '0.8rem', mb: 0.5 }}>Not Enrolled</Typography>
                <Typography variant="h4" sx={{ color: '#F59E0B', fontWeight: 700 }}>{allCourses.length - enrolledCourseIds.length}</Typography>
              </Card>
            </Box>
          </Box>

          {/* Courses Grid */}
          {filteredCourses.length === 0 ? (
            <Card sx={{ p: 8, textAlign: 'center', backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 3 }}>
              <MenuBookIcon sx={{ fontSize: 80, color: colors.textMuted, mb: 2, opacity: 0.5 }} />
              <Typography variant="h5" sx={{ color: colors.textSecondary, mb: 1, fontWeight: 600 }}>
                {allCourses.length === 0 ? 'No Courses Available' : 'No Courses Found'}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textMuted, maxWidth: 500, mx: 'auto' }}>
                {allCourses.length === 0
                  ? 'The Super Admin hasn\'t created any courses yet. Courses will appear here once they are created.'
                  : 'Try adjusting your search query to find the course you\'re looking for.'}
              </Typography>
            </Card>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 3 }}>
              {filteredCourses.map((course) => {
                const isEnrolled = enrolledCourseIds.includes(course.id);
                return (
                  <Card
                    key={course.id}
                    sx={{
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${isEnrolled ? colors.accent : colors.cardBorder}`,
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 24px ${colors.accent}20`,
                      },
                    }}
                  >
                    {isEnrolled && (
                      <Chip
                        label="Enrolled"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          backgroundColor: '#22C55E',
                          color: '#fff',
                          fontWeight: 600,
                          zIndex: 1,
                        }}
                      />
                    )}

                    {/* Course Header */}
                    <Box sx={{ p: 3, background: `linear-gradient(135deg, ${colors.accent}15 0%, ${colors.cardBg} 100%)` }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2, pr: isEnrolled ? 6 : 0 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ color: colors.textPrimary, fontWeight: 700, mb: 0.5 }}>
                            {course.title}
                          </Typography>
                          {course.description && (
                            <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '0.85rem' }}>
                              {course.description}
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Chip
                          label={`${course.modules.length} Modules`}
                          size="small"
                          sx={{
                            backgroundColor: `${colors.accent}30`,
                            color: colors.accent,
                            fontWeight: 600,
                          }}
                        />
                        <Chip
                          label={`${course.modules.reduce((sum, mod) => sum + mod.topics.length, 0)} Topics`}
                          size="small"
                          sx={{
                            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                            color: colors.textSecondary,
                          }}
                        />
                      </Box>

                      {/* Action Button */}
                      {isEnrolled ? (
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => handleUnenrollCourse(course.id, course.title)}
                          sx={{
                            borderColor: '#EF4444',
                            color: '#EF4444',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                              borderColor: '#DC2626',
                              backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            },
                          }}
                        >
                          Unenroll Course
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => handleEnrollCourse(course.id, course.title)}
                          sx={{
                            backgroundColor: colors.accent,
                            color: '#fff',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': { backgroundColor: `${colors.accent}dd` },
                          }}
                        >
                          Enroll Now
                        </Button>
                      )}
                    </Box>

                    {/* Modules Accordion */}
                    <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                      {course.modules.map((module, index) => (
                        <Accordion
                          key={module.id}
                          sx={{
                            backgroundColor: 'transparent',
                            boxShadow: 'none',
                            '&:before': { display: 'none' },
                            borderTop: `1px solid ${colors.cardBorder}`,
                          }}
                        >
                          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: colors.textSecondary }} />}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                              <Box
                                sx={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: '8px',
                                  backgroundColor: `${colors.accent}20`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Typography sx={{ color: colors.accent, fontWeight: 700, fontSize: '0.85rem' }}>
                                  {index + 1}
                                </Typography>
                              </Box>
                              <Typography sx={{ color: colors.textPrimary, fontWeight: 600, fontSize: '0.9rem' }}>
                                {module.name}
                              </Typography>
                              <Chip
                                label={`${module.topics.length} Topics`}
                                size="small"
                                sx={{
                                  ml: 'auto',
                                  backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                  color: colors.textSecondary,
                                  fontSize: '0.7rem',
                                  height: 22,
                                }}
                              />
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails sx={{ pt: 0 }}>
                            <List dense>
                              {module.topics.map((topic) => (
                                <ListItem
                                  key={topic.id}
                                  sx={{
                                    borderRadius: 1,
                                    mb: 0.5,
                                    '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' },
                                  }}
                                >
                                  <ListItemIcon sx={{ minWidth: 36 }}>
                                    <PictureAsPdfIcon sx={{ fontSize: 20, color: '#EF4444' }} />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={topic.name}
                                    secondary={topic.pdfUrl ? 'PDF attached' : 'No PDF'}
                                    primaryTypographyProps={{
                                      sx: { color: colors.textPrimary, fontSize: '0.85rem', fontWeight: 500 },
                                    }}
                                    secondaryTypographyProps={{
                                      sx: { color: colors.textMuted, fontSize: '0.7rem' },
                                    }}
                                  />
                                </ListItem>
                              ))}
                              {module.assessment && (
                                <ListItem
                                  sx={{
                                    borderRadius: 1,
                                    backgroundColor: `${colors.accent}10`,
                                    border: `1px dashed ${colors.accent}40`,
                                  }}
                                >
                                  <ListItemIcon sx={{ minWidth: 36 }}>
                                    <AssessmentIcon sx={{ fontSize: 20, color: colors.accent }} />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary="Module Assessment"
                                    secondary={`${module.assessment.questions.length} questions`}
                                    primaryTypographyProps={{
                                      sx: { color: colors.accent, fontSize: '0.85rem', fontWeight: 600 },
                                    }}
                                    secondaryTypographyProps={{
                                      sx: { color: colors.textMuted, fontSize: '0.7rem' },
                                    }}
                                  />
                                </ListItem>
                              )}
                            </List>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </Box>
                  </Card>
                );
              })}
            </Box>
          )}
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
