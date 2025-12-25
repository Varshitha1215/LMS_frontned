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
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import QuizIcon from '@mui/icons-material/Quiz';
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
  { icon: <HomeIcon />, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: <PeopleIcon />, label: 'My Students', path: '/admin/students' },
  { icon: <MenuBookIcon />, label: 'Courses', path: '/admin/courses', active: true },
  { icon: <AssignmentIcon />, label: 'Assignments', path: '/admin/assignments' },
  { icon: <CloudUploadIcon />, label: 'Content Upload', path: '/admin/content' },
  { icon: <BarChartIcon />, label: 'Analytics', path: '/admin/analytics' },
  { icon: <SettingsIcon />, label: 'Settings', path: '/admin/settings' },
];

export default function AdminCoursesPage() {
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
    users,
    courses,
    selectCourseByAdmin,
    deselectCourseByAdmin,
    isLoaded 
  } = useUserManagement();
  const isDark = mode === 'dark';

  // Find the OrgAdmin for this admin's institute
  const orgAdmin = users.find(u => 
    u.role === 'orgadmin' && 
    u.institute === currentUser?.institute &&
    u.isVerified
  );

  // Use courses directly from context for automatic reactivity
  const allCourses = courses;

  // Get courses enrolled by OrgAdmin
  const orgAdminEnrolledCourseIds = orgAdmin?.selectedCourseIds || [];
  const availableCourses = allCourses.filter(course => 
    orgAdminEnrolledCourseIds.includes(course.id)
  );

  // Get enrolled course IDs for this Admin
  const enrolledCourseIds = currentUser?.selectedCourseIds || [];

  // Filter courses based on search
  const filteredCourses = availableCourses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    
    selectCourseByAdmin(courseId, currentUser.id);
    setSnackbar({
      open: true,
      message: `Successfully enrolled in "${courseTitle}"! This course is now available to your students.`,
      severity: 'success',
    });
  };

  const handleUnenrollCourse = (courseId: string, courseTitle: string) => {
    if (!currentUser?.id) return;
    
    deselectCourseByAdmin(courseId, currentUser.id);
    setSnackbar({
      open: true,
      message: `Unenrolled from "${courseTitle}". This course is no longer available to your students.`,
      severity: 'info',
    });
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
          <Link href="/admin/dashboard" style={{ textDecoration: 'none' }}>
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
          </Link>
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
              📚 Course Library
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              Enroll in courses to assign them to your students
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              placeholder="Search courses..."
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
          {/* Page Header */}
          <Box sx={{ mb: 4, animation: `${fadeInUp} 0.5s ease-out` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Link href="/admin/dashboard" style={{ textDecoration: 'none' }}>
                <IconButton sx={{ color: colors.textSecondary, '&:hover': { backgroundColor: `${colors.accent}20`, color: colors.accent } }}>
                  <ArrowBackIcon />
                </IconButton>
              </Link>
              <Box>
                <Typography variant="h4" sx={{ color: colors.textPrimary, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <MenuBookIcon sx={{ fontSize: 36, color: colors.accent }} />
                  Available Courses
                </Typography>
                <Typography sx={{ color: colors.textSecondary, fontSize: '1rem', mt: 0.5 }}>
                  Courses made available by your organization admin at <strong>{currentUser?.institute}</strong>
                </Typography>
              </Box>
            </Box>

            {/* Stats */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mt: 3 }}>
              <Card sx={{ p: 2.5, backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 2 }}>
                <Typography sx={{ color: colors.textMuted, fontSize: '0.8rem', mb: 0.5 }}>Available Courses</Typography>
                <Typography variant="h4" sx={{ color: colors.accent, fontWeight: 700 }}>{availableCourses.length}</Typography>
              </Card>
              <Card sx={{ p: 2.5, backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 2 }}>
                <Typography sx={{ color: colors.textMuted, fontSize: '0.8rem', mb: 0.5 }}>My Enrolled Courses</Typography>
                <Typography variant="h4" sx={{ color: '#22C55E', fontWeight: 700 }}>{enrolledCourseIds.length}</Typography>
              </Card>
              <Card sx={{ p: 2.5, backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 2 }}>
                <Typography sx={{ color: colors.textMuted, fontSize: '0.8rem', mb: 0.5 }}>Not Enrolled</Typography>
                <Typography variant="h4" sx={{ color: '#F59E0B', fontWeight: 700 }}>{availableCourses.length - enrolledCourseIds.length}</Typography>
              </Card>
            </Box>
          </Box>

          {/* Courses Grid */}
          {filteredCourses.length === 0 ? (
            <Card sx={{ p: 8, textAlign: 'center', backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 3 }}>
              <MenuBookIcon sx={{ fontSize: 80, color: colors.textMuted, mb: 2, opacity: 0.5 }} />
              <Typography variant="h5" sx={{ color: colors.textSecondary, mb: 1, fontWeight: 600 }}>
                {availableCourses.length === 0 ? 'No Courses Available' : 'No Courses Found'}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textMuted }}>
                {availableCourses.length === 0
                  ? 'Your Organization Admin hasn\'t enrolled in any courses yet. Please contact them to make courses available.'
                  : 'Try adjusting your search query.'}
              </Typography>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {filteredCourses.map((course) => {
                const isEnrolled = enrolledCourseIds.includes(course.id);
                return (
                  <Grid item xs={12} md={6} key={course.id}>
                    <Card
                      sx={{
                        backgroundColor: colors.cardBg,
                        border: `1px solid ${isEnrolled ? colors.accent : colors.cardBorder}`,
                        borderRadius: 3,
                        overflow: 'hidden',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 8px 24px ${colors.accent}30`,
                        },
                      }}
                    >
                      {isEnrolled && (
                        <Chip
                          icon={<CheckCircleIcon />}
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
                        <Box sx={{ pr: isEnrolled ? 6 : 0, mb: 2 }}>
                          <Typography variant="h6" sx={{ color: colors.textPrimary, fontWeight: 700, mb: 0.5 }}>
                            {course.title}
                          </Typography>
                          {course.description && (
                            <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '0.85rem' }}>
                              {course.description}
                            </Typography>
                          )}
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
                            startIcon={<RemoveCircleIcon />}
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
                            startIcon={<AddIcon />}
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
                      <Box sx={{ maxHeight: 300, overflowY: 'auto', flex: 1 }}>
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
                                      <QuizIcon sx={{ fontSize: 20, color: colors.accent }} />
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
                  </Grid>
                );
              })}
            </Grid>
          )}
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
