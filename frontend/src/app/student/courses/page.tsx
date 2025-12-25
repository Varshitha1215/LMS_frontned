'use client';

import { useState, useEffect } from 'react';
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
  LinearProgress,
} from '@mui/material';
import { keyframes } from '@mui/system';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useThemeMode } from '@/context/ThemeContext';
import { useUserManagement } from '@/context/UserManagementContext';
import ThemeSwitcher from '@/components/ThemeSwitcher';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import TerminalIcon from '@mui/icons-material/Terminal';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import QuizIcon from '@mui/icons-material/Quiz';
import SchoolIcon from '@mui/icons-material/School';

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
  { icon: <HomeIcon />, label: 'Dashboard', path: '/student/dashboard' },
  { icon: <CodeIcon />, label: 'Practice', path: '/student/practice' },
  { icon: <AssignmentIcon />, label: 'Assignments', path: '/student/assignments' },
  { icon: <TerminalIcon />, label: 'Compiler', path: '/student/compiler' },
  { icon: <LeaderboardIcon />, label: 'Leaderboard', path: '/student/leaderboard' },
  { icon: <MenuBookIcon />, label: 'Courses', path: '/student/courses', active: true },
  { icon: <EmojiEventsIcon />, label: 'Achievements', path: '/student/achievements' },
];

export default function StudentCoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { mode, themeColors } = useThemeMode();
  const { 
    currentUser, 
    setCurrentUser,
    users,
    courses,
    getCoursesForStudent,
    isLoaded 
  } = useUserManagement();
  const isDark = mode === 'dark';
  const router = useRouter();

  // Get courses available to this student (will re-compute when courses or users change)
  const availableCourses = currentUser?.id ? getCoursesForStudent(currentUser.id) : [];

  // Get the admins assigned to this student
  const assignedAdminIds = currentUser?.assignedAdminIds || [];
  const assignedAdmins = users.filter((u: any) => assignedAdminIds.includes(u.id));

  // Debug: Log when courses or users change
  useEffect(() => {
    console.log('📚 Student Courses Page - Data Update:', {
      studentId: currentUser?.id,
      studentName: currentUser?.firstName,
      assignedAdminIds,
      assignedAdmins: assignedAdmins.map((a: any) => ({ 
        id: a.id, 
        name: `${a.firstName} ${a.lastName}`,
        selectedCourses: a.selectedCourseIds?.length || 0 
      })),
      availableCoursesCount: availableCourses.length,
      coursesList: availableCourses.map((c: any) => ({ id: c.id, title: c.title }))
    });
  }, [courses, users, currentUser?.id]);

  // Filter courses based on search
  const filteredCourses = availableCourses.filter((course: any) =>
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

  const handleProfileClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    window.location.href = '/login';
  };

  const handleStartCourse = (courseId: string) => {
    router.push(`/student/courses/${courseId}`);
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
          <Link href="/student/dashboard" style={{ textDecoration: 'none' }}>
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
                  Student Portal
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
              {currentUser?.firstName?.[0] || 'S'}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ color: colors.headerText, fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser?.firstName && currentUser?.lastName ? `${currentUser.firstName} ${currentUser.lastName}` : 'Student'}
              </Typography>
              <Typography sx={{ color: colors.headerTextMuted, fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser?.email || 'No email'}
              </Typography>
              <Typography sx={{ color: colors.headerTextMuted, fontSize: '0.7rem', textTransform: 'capitalize' }}>
                {currentUser?.role || 'Student'} • {currentUser?.institute || 'N/A'}
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
              📚 My Learning Path
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              Access courses assigned by your instructors
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              placeholder="Search courses..."
              size="small"
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
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
            <Badge badgeContent={3} color="error">
              <IconButton sx={{ color: colors.textSecondary }}>
                <NotificationsIcon />
              </IconButton>
            </Badge>
            <IconButton onClick={handleProfileClick}>
              <Avatar sx={{ width: 38, height: 38, bgcolor: colors.accent }}>
                {currentUser?.firstName?.[0] || 'S'}
              </Avatar>
            </IconButton>
          </Box>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ p: 4, flex: 1 }}>
          {/* Page Header */}
          <Box sx={{ mb: 4, animation: `${fadeInUp} 0.5s ease-out` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Link href="/student/dashboard" style={{ textDecoration: 'none' }}>
                <IconButton sx={{ color: colors.textSecondary, '&:hover': { backgroundColor: `${colors.accent}20`, color: colors.accent } }}>
                  <ArrowBackIcon />
                </IconButton>
              </Link>
              <Box>
                <Typography variant="h4" sx={{ color: colors.textPrimary, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <SchoolIcon sx={{ fontSize: 36, color: colors.accent }} />
                  Available Courses
                </Typography>
                <Typography sx={{ color: colors.textSecondary, fontSize: '1rem', mt: 0.5 }}>
                  Courses assigned to you by {assignedAdmins.length > 0 ? `${assignedAdmins.length} instructor${assignedAdmins.length > 1 ? 's' : ''}` : 'your instructors'}
                </Typography>
              </Box>
            </Box>

            {/* Stats */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mt: 3 }}>
              <Card sx={{ p: 2.5, backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 2 }}>
                <Typography sx={{ color: colors.textMuted, fontSize: '0.8rem', mb: 0.5 }}>Total Courses</Typography>
                <Typography variant="h4" sx={{ color: colors.accent, fontWeight: 700 }}>{availableCourses.length}</Typography>
              </Card>
              <Card sx={{ p: 2.5, backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 2 }}>
                <Typography sx={{ color: colors.textMuted, fontSize: '0.8rem', mb: 0.5 }}>Instructors</Typography>
                <Typography variant="h4" sx={{ color: '#3B82F6', fontWeight: 700 }}>{assignedAdmins.length}</Typography>
              </Card>
              <Card sx={{ p: 2.5, backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 2 }}>
                <Typography sx={{ color: colors.textMuted, fontSize: '0.8rem', mb: 0.5 }}>Total Modules</Typography>
                <Typography variant="h4" sx={{ color: '#22C55E', fontWeight: 700 }}>
                  {availableCourses.reduce((sum: any, course: any) => sum + course.modules.length, 0)}
                </Typography>
              </Card>
              <Card sx={{ p: 2.5, backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 2 }}>
                <Typography sx={{ color: colors.textMuted, fontSize: '0.8rem', mb: 0.5 }}>Total Topics</Typography>
                <Typography variant="h4" sx={{ color: '#F59E0B', fontWeight: 700 }}>
                  {availableCourses.reduce((sum: any, course: any) => sum + course.modules.reduce((mSum: any, mod: any) => mSum + mod.topics.length, 0), 0)}
                </Typography>
              </Card>
            </Box>
          </Box>

          {/* Courses Grid */}
          {filteredCourses.length === 0 ? (
            <Card sx={{ p: 8, textAlign: 'center', backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 3 }}>
              <SchoolIcon sx={{ fontSize: 80, color: colors.textMuted, mb: 2, opacity: 0.5 }} />
              <Typography variant="h5" sx={{ color: colors.textSecondary, mb: 1, fontWeight: 600 }}>
                {availableCourses.length === 0 ? 'No Courses Available' : 'No Courses Found'}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textMuted, mb: 3 }}>
                {availableCourses.length === 0
                  ? 'Your instructors haven\'t assigned any courses yet. Please contact them for course access.'
                  : 'Try adjusting your search query.'}
              </Typography>
              {availableCourses.length === 0 && assignedAdmins.length > 0 && (
                <Box sx={{ mt: 3, p: 3, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: colors.textSecondary, mb: 2 }}>
                    Your assigned instructors:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                    {assignedAdmins.map((admin: any) => (
                      <Chip
                        key={admin.id}
                        label={`${admin.firstName} ${admin.lastName}`}
                        avatar={<Avatar>{admin.firstName?.[0]}</Avatar>}
                        sx={{
                          backgroundColor: colors.cardBg,
                          border: `1px solid ${colors.cardBorder}`,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Card>
          ) : (
            <Grid container spacing={3}>
              {filteredCourses.map((course: any) => {
                const totalTopics = course.modules.reduce((sum: any, mod: any) => sum + mod.topics.length, 0);
                const totalAssessments = course.modules.filter((mod: any) => mod.assessment).length;
                
                return (
                  <Grid item xs={12} lg={6} key={course.id}>
                    <Card
                      sx={{
                        backgroundColor: colors.cardBg,
                        border: `1px solid ${colors.cardBorder}`,
                        borderRadius: 3,
                        overflow: 'hidden',
                        transition: 'all 0.2s ease',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 8px 24px ${colors.accent}30`,
                          borderColor: colors.accent,
                        },
                      }}
                    >
                      {/* Course Header */}
                      <Box sx={{ p: 3, background: `linear-gradient(135deg, ${colors.accent}15 0%, ${colors.cardBg} 100%)` }}>
                        <Typography variant="h6" sx={{ color: colors.textPrimary, fontWeight: 700, mb: 1 }}>
                          {course.title}
                        </Typography>
                        {course.description && (
                          <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '0.85rem', mb: 2 }}>
                            {course.description}
                          </Typography>
                        )}

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          <Chip
                            icon={<FolderIcon />}
                            label={`${course.modules.length} Modules`}
                            size="small"
                            sx={{
                              backgroundColor: `${colors.accent}30`,
                              color: colors.accent,
                              fontWeight: 600,
                            }}
                          />
                          <Chip
                            icon={<DescriptionIcon />}
                            label={`${totalTopics} Topics`}
                            size="small"
                            sx={{
                              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                              color: colors.textSecondary,
                            }}
                          />
                          {totalAssessments > 0 && (
                            <Chip
                              icon={<QuizIcon />}
                              label={`${totalAssessments} Assessments`}
                              size="small"
                              sx={{
                                backgroundColor: '#F59E0B20',
                                color: '#F59E0B',
                                fontWeight: 600,
                              }}
                            />
                          )}
                        </Box>

                        {/* Progress Bar (Placeholder) */}
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" sx={{ color: colors.textMuted }}>
                              Progress
                            </Typography>
                            <Typography variant="caption" sx={{ color: colors.accent, fontWeight: 600 }}>
                              0%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={0}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: colors.accent,
                                borderRadius: 3,
                              },
                            }}
                          />
                        </Box>

                        {/* Action Button */}
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<PlayCircleFilledIcon />}
                          onClick={() => handleStartCourse(course.id)}
                          sx={{
                            backgroundColor: colors.accent,
                            color: '#fff',
                            textTransform: 'none',
                            fontWeight: 600,
                            py: 1.2,
                            '&:hover': { backgroundColor: `${colors.accent}dd` },
                          }}
                        >
                          Start Learning
                        </Button>
                      </Box>

                      {/* Modules Accordion */}
                      <Box sx={{ maxHeight: 350, overflowY: 'auto', flex: 1 }}>
                        {course.modules.map((module: any, index: any) => (
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
                                <Typography sx={{ color: colors.textPrimary, fontWeight: 600, fontSize: '0.9rem', flex: 1 }}>
                                  {module.name}
                                </Typography>
                                <Chip
                                  label={`${module.topics.length} topics`}
                                  size="small"
                                  sx={{
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
                                {module.topics.map((topic: any) => (
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
                                      secondary={topic.pdfUrl ? `PDF: ${topic.pdfName || 'Document'}` : 'No PDF attached'}
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
                                      mt: 1,
                                      backgroundColor: `${colors.accent}10`,
                                      border: `1px dashed ${colors.accent}40`,
                                    }}
                                  >
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                      <QuizIcon sx={{ fontSize: 20, color: colors.accent }} />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={module.assessment.title || 'Module Assessment'}
                                      secondary={`${module.assessment.questions.length} questions • ${module.assessment.passingScore || 70}% to pass`}
                                      primaryTypographyProps={{
                                        sx: { color: colors.accent, fontSize: '0.85rem', fontWeight: 600 },
                                      }}
                                      secondaryTypographyProps={{
                                        sx: { color: colors.textMuted, fontSize: '0.7rem' },
                                      }}
                                    />
                                    <Chip
                                      label="Quiz"
                                      size="small"
                                      sx={{
                                        backgroundColor: colors.accent,
                                        color: '#fff',
                                        fontSize: '0.65rem',
                                        height: 20,
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
          sx={{
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
