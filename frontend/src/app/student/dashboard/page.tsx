'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  Avatar,
  IconButton,
  Button,
  LinearProgress,
  Chip,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { keyframes } from '@mui/system';
import Link from 'next/link';
import { useThemeMode } from '@/context/ThemeContext';
import { useEnrollment } from '@/context/EnrollmentContext';
import { useUserManagement } from '@/context/UserManagementContext';
import { useAchievements, ContestAchievement, StreakAchievement, CourseCompletionAchievement } from '@/context/AchievementsContext';
import { StudentGuard } from '../../../components/RouteGuard';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import TerminalIcon from '@mui/icons-material/Terminal';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import PersonIcon from '@mui/icons-material/Person';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import WhatshotIcon from '@mui/icons-material/Whatshot';
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
  { icon: <HomeIcon />, label: 'Dashboard', path: '/student/dashboard', active: true },
  { icon: <CodeIcon />, label: 'Practice', path: '/student/practice' },
  { icon: <AssignmentIcon />, label: 'Assignments', path: '/student/assignments' },
  { icon: <TerminalIcon />, label: 'Compiler', path: '/student/compiler' },
  { icon: <LeaderboardIcon />, label: 'Leaderboard', path: '/student/leaderboard' },
  { icon: <MenuBookIcon />, label: 'Courses', path: '/student/courses' },
  { icon: <EmojiEventsIcon />, label: 'Achievements', path: '/student/achievements' },
];





export default function StudentDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { mode, themeColors } = useThemeMode();
  const { enrolledCourses, isLoaded } = useEnrollment();
  const { currentUser } = useUserManagement();
  const { achievements, certificates, isLoaded: achievementsLoaded } = useAchievements();
  const isDark = mode === 'dark';
  const router = useRouter();

  // Activity Heat Map State - fetch from backend/localStorage
  const [activityData] = useState<Array<{ date: string; count: number }>>([]);
  const [contests] = useState<Array<{ id: string; title: string; date: string; participants: number; status: 'upcoming' | 'live' | 'ended' }>>([]);
  
  // User Stats State - fetch from backend/localStorage
  const [currentStreak] = useState<number>(0);
  const [problemsSolved] = useState<number>(0);
  const [globalRank] = useState<number>(0);
  const [assignmentsDue] = useState<number>(0);

  // Theme-based colors from context
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
    accentHover: '#4298c4',
    menuItemHover: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255, 255, 255, 0.2)',
    menuItemActive: isDark ? `${themeColors.accent}35` : `${themeColors.accent}25`,
    logoGradient: `linear-gradient(135deg, ${themeColors.primaryLight} 0%, ${themeColors.primary} 100%)`,
    // Header/Sidebar text colors (use white for visibility on colored backgrounds)
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

  return (
    <StudentGuard>
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
              <Typography variant="caption" sx={{ color: colors.headerTextMuted, fontSize: '0.7rem' }}>
                Learn • Code • Excel
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Navigation Menu */}
        <Box sx={{ flex: 1, py: 2, overflowY: 'auto' }}>
          <List sx={{ px: 1.5 }}>
            {menuItems.map((item, index) => (
              <ListItem
                key={index}
                component={Link}
                href={item.path}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  py: 1.2,
                  px: 2,
                  backgroundColor: item.active ? colors.menuItemActive : 'transparent',
                  border: item.active ? `1px solid ${colors.accent}50` : '1px solid transparent',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  '&:hover': {
                    backgroundColor: item.active ? `${colors.accent}30` : colors.menuItemHover,
                    transform: 'translateX(5px)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: item.active ? colors.accent : colors.headerTextSecondary }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: item.active ? colors.accent : colors.headerTextSecondary,
                      fontWeight: item.active ? 600 : 400,
                      fontSize: '0.9rem',
                    },
                  }}
                />
                {item.active && (
                  <Box sx={{ width: 4, height: 20, backgroundColor: colors.accent, borderRadius: 2, ml: 1 }} />
                )}
              </ListItem>
            ))}
          </List>
        </Box>

        {/* User Profile Section */}
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
              transition: 'all 0.3s ease',
              '&:hover': { backgroundColor: colors.menuItemHover },
            }}
          >
            <Avatar sx={{ width: 42, height: 42, background: `linear-gradient(135deg, ${colors.accent} 0%, ${themeColors.primaryLight} 100%)`, fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}>
              {currentUser?.firstName?.[0]?.toUpperCase() || 'S'}{currentUser?.lastName?.[0]?.toUpperCase() || ''}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ color: colors.headerText, fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.3 }}>
                {currentUser?.firstName && currentUser?.lastName ? `${currentUser.firstName} ${currentUser.lastName}` : 'Student'}
              </Typography>
              <Typography sx={{ color: colors.headerTextMuted, fontSize: '0.75rem' }}>Student</Typography>
            </Box>
            <SettingsIcon sx={{ color: colors.headerTextMuted, fontSize: 20 }} />
          </Box>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          sx={{ '& .MuiPaper-root': { backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 2, minWidth: 180 } }}
        >
          <MenuItem onClick={handleClose} sx={{ color: colors.textPrimary, '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' } }}>
            <PersonIcon sx={{ mr: 1.5, fontSize: 20 }} /> Profile
          </MenuItem>
          <MenuItem onClick={handleClose} sx={{ color: colors.textPrimary, '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' } }}>
            <SettingsIcon sx={{ mr: 1.5, fontSize: 20 }} /> Settings
          </MenuItem>
          <Divider sx={{ borderColor: colors.cardBorder }} />
          <MenuItem component={Link} href="/login" onClick={handleClose} sx={{ color: colors.textSecondary, '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' } }}>
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
          {/* Search Bar */}
          <TextField
            placeholder="Search problems, topics, or courses..."
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
              '& .MuiOutlinedInput-input': { '&::placeholder': { color: colors.headerTextMuted } },
            }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: colors.headerTextMuted }} /></InputAdornment> }}
          />

          {/* Right Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Theme Switcher - includes theme selection and light/dark toggle */}
            <ThemeSwitcher />

            <IconButton sx={{ color: colors.headerTextSecondary, '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' } }}>
              <NotificationsIcon />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              sx={{
                background: `linear-gradient(135deg, ${themeColors.secondary} 0%, ${themeColors.primary} 100%)`,
                borderRadius: 2,
                px: 3,
                fontWeight: 600,
                color: '#ffffff',
                '&:hover': { background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`, transform: 'translateY(-2px)', boxShadow: `0 5px 20px ${colors.accent}60` },
              }}
            >
              Quick Compile
            </Button>
          </Box>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ p: 4 }}>
          {/* Welcome Section */}
          <Box sx={{ mb: 4, animation: `${fadeInUp} 0.5s ease-out` }}>
            <Typography variant="h4" sx={{ color: colors.textPrimary, fontWeight: 700, mb: 1 }}>
              Welcome back, <Typography component="span" sx={{ color: colors.accent, fontWeight: 700 }}>{currentUser?.firstName || 'Student'}</Typography>! 👋
            </Typography>
            <Typography sx={{ color: colors.textSecondary, fontSize: '1rem' }}>
              You have {enrolledCourses.length} enrolled course{enrolledCourses.length !== 1 ? 's' : ''}. Keep up the great work!
            </Typography>
          </Box>

          {/* Quick Stats */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
            {/* Current Streak */}
            <Card
              sx={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: 3,
                p: 2.5,
                transition: 'all 0.3s ease',
                animation: `${fadeInUp} 0.5s ease-out 0.1s both`,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 24px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}`,
                  borderColor: '#FF6B35',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LocalFireDepartmentIcon sx={{ color: '#fff', fontSize: 28 }} />
                </Box>
                <Typography sx={{ color: colors.textPrimary, fontWeight: 700, fontSize: '2rem', lineHeight: 1 }}>
                  {currentStreak}
                </Typography>
              </Box>
              <Typography sx={{ color: colors.textMuted, fontSize: '0.85rem', fontWeight: 500 }}>
                Current Streak
              </Typography>
              <Typography sx={{ color: colors.textMuted, fontSize: '0.7rem', mt: 0.5 }}>
                {currentStreak > 0 ? 'Keep it going!' : 'Start your streak today'}
              </Typography>
            </Card>

            {/* Problems Solved */}
            <Card
              sx={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: 3,
                p: 2.5,
                transition: 'all 0.3s ease',
                animation: `${fadeInUp} 0.5s ease-out 0.15s both`,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 24px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}`,
                  borderColor: '#22C55E',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CodeIcon sx={{ color: '#fff', fontSize: 28 }} />
                </Box>
                <Typography sx={{ color: colors.textPrimary, fontWeight: 700, fontSize: '2rem', lineHeight: 1 }}>
                  {problemsSolved}
                </Typography>
              </Box>
              <Typography sx={{ color: colors.textMuted, fontSize: '0.85rem', fontWeight: 500 }}>
                Problems Solved
              </Typography>
              <Typography sx={{ color: colors.textMuted, fontSize: '0.7rem', mt: 0.5 }}>
                {problemsSolved > 0 ? 'Great progress!' : 'Solve your first problem'}
              </Typography>
            </Card>

            {/* Global Rank */}
            <Card
              sx={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: 3,
                p: 2.5,
                transition: 'all 0.3s ease',
                animation: `${fadeInUp} 0.5s ease-out 0.2s both`,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 24px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}`,
                  borderColor: '#FFD700',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <EmojiEventsIcon sx={{ color: '#fff', fontSize: 28 }} />
                </Box>
                <Typography sx={{ color: colors.textPrimary, fontWeight: 700, fontSize: '2rem', lineHeight: 1 }}>
                  {globalRank > 0 ? `#${globalRank}` : '-'}
                </Typography>
              </Box>
              <Typography sx={{ color: colors.textMuted, fontSize: '0.85rem', fontWeight: 500 }}>
                Global Rank
              </Typography>
              <Typography sx={{ color: colors.textMuted, fontSize: '0.7rem', mt: 0.5 }}>
                {globalRank > 0 ? 'Keep climbing!' : 'Rank not available'}
              </Typography>
            </Card>

            {/* Assignments Due */}
            <Card
              sx={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: 3,
                p: 2.5,
                transition: 'all 0.3s ease',
                animation: `${fadeInUp} 0.5s ease-out 0.25s both`,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 24px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}`,
                  borderColor: assignmentsDue > 0 ? '#EF4444' : colors.accent,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: assignmentsDue > 0 
                      ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
                      : `linear-gradient(135deg, ${colors.accent} 0%, ${themeColors.primary} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AssignmentIcon sx={{ color: '#fff', fontSize: 28 }} />
                </Box>
                <Typography sx={{ color: colors.textPrimary, fontWeight: 700, fontSize: '2rem', lineHeight: 1 }}>
                  {assignmentsDue}
                </Typography>
              </Box>
              <Typography sx={{ color: colors.textMuted, fontSize: '0.85rem', fontWeight: 500 }}>
                Assignments Due
              </Typography>
              <Typography sx={{ color: assignmentsDue > 0 ? '#EF4444' : colors.textMuted, fontSize: '0.7rem', mt: 0.5, fontWeight: assignmentsDue > 0 ? 600 : 400 }}>
                {assignmentsDue > 0 ? `${assignmentsDue} pending` : 'All caught up!'}
              </Typography>
            </Card>
          </Box>

          {/* My Courses Section */}
          <Card
            sx={{
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: 3,
              p: 3,
              mb: 4,
              animation: `${fadeInUp} 0.5s ease-out 0.15s both`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box>
                <Typography sx={{ color: colors.textPrimary, fontWeight: 700, fontSize: '1.1rem' }}>
                  📚 My Courses
                </Typography>
                <Typography sx={{ color: colors.textMuted, fontSize: '0.85rem' }}>
                  Your enrolled courses and progress
                </Typography>
              </Box>
              <Button
                component={Link}
                href="/student/courses"
                endIcon={<KeyboardArrowRightIcon />}
                sx={{ color: colors.accent, fontWeight: 600, '&:hover': { backgroundColor: 'rgba(92, 179, 232, 0.1)' } }}
              >
                View All
              </Button>
            </Box>

            {!isLoaded ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress sx={{ color: colors.accent }} />
              </Box>
            ) : enrolledCourses.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography sx={{ color: colors.textMuted, mb: 2 }}>
                  No courses enrolled yet
                </Typography>
                <Button
                  component={Link}
                  href="/student/courses"
                  variant="contained"
                  sx={{ backgroundColor: colors.accent, '&:hover': { backgroundColor: colors.accentHover } }}
                >
                  Browse Courses
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {enrolledCourses.slice(0, 3).map((course) => (
                  <Box
                    key={course.id}
                    sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '280px' }}
                  >
                    <Card
                      onClick={() => router.push(`/student/courses/${course.id}`)}
                      sx={{
                        cursor: 'pointer',
                        border: `1px solid ${colors.cardBorder}`,
                        backgroundColor: 'transparent',
                        '&:hover': {
                          borderColor: colors.accent,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 4px 12px ${colors.accent}33`,
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Box sx={{ p: 2.5 }}>
                        <Typography sx={{ color: colors.textPrimary, fontWeight: 600, fontSize: '1rem', mb: 1.5 }}>
                          {course.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                          <Chip
                            label={course.level}
                            size="small"
                            sx={{
                              backgroundColor: course.level === 'Advanced' ? 'rgba(244, 67, 54, 0.1)' :
                                              course.level === 'Intermediate' ? 'rgba(255, 152, 0, 0.1)' : 'rgba(76, 175, 80, 0.1)',
                              color: course.level === 'Advanced' ? '#f44336' :
                                     course.level === 'Intermediate' ? '#ff9800' : '#4caf50',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                            }}
                          />
                          <Typography sx={{ color: colors.textMuted, fontSize: '0.8rem' }}>
                            {course.totalModules} modules
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 1.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography sx={{ color: colors.textMuted, fontSize: '0.8rem' }}>
                              Progress
                            </Typography>
                            <Typography sx={{ color: colors.accent, fontSize: '0.8rem', fontWeight: 600 }}>
                              {course.progress || 0}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={course.progress || 0}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: colors.cardBorder,
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: colors.accent,
                                borderRadius: 3,
                              },
                            }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <PersonIcon sx={{ color: colors.textMuted, fontSize: 16 }} />
                            <Typography sx={{ color: colors.textMuted, fontSize: '0.75rem' }}>
                              {course.instructor}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Card>
                  </Box>
                ))}
              </Box>
            )}
          </Card>

          {/* Activity Heat Map & Contests Section */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3, mb: 4 }}>
            {/* Activity Heat Map */}
            <Card
              sx={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: 3,
                p: 3,
                animation: `${fadeInUp} 0.5s ease-out 0.25s both`,
              }}
            >
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ color: colors.textPrimary, fontWeight: 700, fontSize: '1.1rem', mb: 0.5 }}>
                  🔥 Activity Heat Map
                </Typography>
                <Typography sx={{ color: colors.textMuted, fontSize: '0.85rem' }}>
                  Your coding activity over the last 12 weeks
                </Typography>
              </Box>
              <Box sx={{ overflowX: 'auto', pb: 1 }}>
                <Box sx={{ display: 'flex', gap: 0.5, minWidth: 'fit-content' }}>
                  {(() => {
                    const weeks = [];
                    const today = new Date();
                    for (let weekIdx = 11; weekIdx >= 0; weekIdx--) {
                      const weekDays = [];
                      for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
                        const date = new Date(today);
                        date.setDate(date.getDate() - (weekIdx * 7 + (6 - dayIdx)));
                        const dateStr = date.toISOString().split('T')[0];
                        const activity = activityData.find(a => a.date === dateStr);
                        const count = activity?.count || 0;
                        weekDays.push(
                          <Box
                            key={dateStr}
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: 0.5,
                              backgroundColor: count === 0 ? colors.cardBorder :
                                             count <= 2 ? isDark ? 'rgba(92, 179, 232, 0.3)' : 'rgba(92, 179, 232, 0.3)' :
                                             count <= 4 ? isDark ? 'rgba(92, 179, 232, 0.6)' : 'rgba(92, 179, 232, 0.6)' :
                                             colors.accent,
                              transition: 'all 0.2s ease',
                              cursor: 'pointer',
                              '&:hover': {
                                transform: 'scale(1.2)',
                                boxShadow: `0 0 8px ${colors.accent}`,
                              },
                            }}
                            title={`${dateStr}: ${count} activities`}
                          />
                        );
                      }
                      weeks.push(
                        <Box key={weekIdx} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {weekDays}
                        </Box>
                      );
                    }
                    return weeks;
                  })()}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                <Typography sx={{ color: colors.textMuted, fontSize: '0.75rem' }}>Less</Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: 0.5, backgroundColor: colors.cardBorder }} />
                  <Box sx={{ width: 12, height: 12, borderRadius: 0.5, backgroundColor: isDark ? 'rgba(92, 179, 232, 0.3)' : 'rgba(92, 179, 232, 0.3)' }} />
                  <Box sx={{ width: 12, height: 12, borderRadius: 0.5, backgroundColor: isDark ? 'rgba(92, 179, 232, 0.6)' : 'rgba(92, 179, 232, 0.6)' }} />
                  <Box sx={{ width: 12, height: 12, borderRadius: 0.5, backgroundColor: colors.accent }} />
                </Box>
                <Typography sx={{ color: colors.textMuted, fontSize: '0.75rem' }}>More</Typography>
              </Box>
            </Card>

            {/* Upcoming Contests */}
            <Card
              sx={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: 3,
                p: 3,
                animation: `${fadeInUp} 0.5s ease-out 0.3s both`,
              }}
            >
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ color: colors.textPrimary, fontWeight: 700, fontSize: '1.1rem', mb: 0.5 }}>
                  🏆 Upcoming Contests
                </Typography>
                <Typography sx={{ color: colors.textMuted, fontSize: '0.85rem' }}>
                  Participate and compete
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {contests.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <EmojiEventsIcon sx={{ fontSize: 40, color: colors.textMuted, mb: 1 }} />
                    <Typography sx={{ color: colors.textMuted, fontSize: '0.85rem' }}>
                      No upcoming contests
                    </Typography>
                  </Box>
                ) : (
                  contests.slice(0, 4).map((contest) => (
                    <Box
                      key={contest.id}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(12, 43, 78, 0.02)',
                        border: `1px solid ${colors.cardBorder}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: colors.accent,
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            background: contest.status === 'live' ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' :
                                       contest.status === 'upcoming' ? `linear-gradient(135deg, ${colors.accent} 0%, ${themeColors.primary} 100%)` :
                                       'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <EmojiEventsIcon sx={{ color: '#fff', fontSize: 20 }} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              color: colors.textPrimary,
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              mb: 0.5,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {contest.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography sx={{ color: colors.textMuted, fontSize: '0.7rem' }}>
                              {new Date(contest.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                            <Box sx={{ width: 2, height: 2, borderRadius: '50%', backgroundColor: colors.textMuted }} />
                            <Typography sx={{ color: colors.textMuted, fontSize: '0.7rem' }}>
                              {contest.participants} participants
                            </Typography>
                          </Box>
                          {contest.status === 'live' && (
                            <Chip
                              label="LIVE"
                              size="small"
                              sx={{
                                mt: 0.5,
                                height: 18,
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                backgroundColor: '#EF4444',
                                color: '#fff',
                                '& .MuiChip-label': { px: 1 },
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
              {contests.length > 4 && (
                <Button
                  fullWidth
                  size="small"
                  endIcon={<KeyboardArrowRightIcon />}
                  sx={{
                    mt: 1,
                    color: colors.accent,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    '&:hover': { backgroundColor: 'rgba(92, 179, 232, 0.1)' },
                  }}
                >
                  View All Contests
                </Button>
              )}
            </Card>
          </Box>

          <Card sx={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ p: 2.5, borderBottom: `1px solid ${colors.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmojiEventsIcon sx={{ color: '#FFD700', fontSize: 22 }} />
                <Typography sx={{ color: colors.textPrimary, fontWeight: 700, fontSize: '1rem' }}>Achievements</Typography>
              </Box>
              <Button
                component={Link}
                href="/student/achievements"
                endIcon={<KeyboardArrowRightIcon />}
                size="small"
                sx={{ color: colors.accent, fontWeight: 600, fontSize: '0.75rem', '&:hover': { backgroundColor: 'rgba(92, 179, 232, 0.1)' } }}
              >
                View All
              </Button>
            </Box>
            <Box sx={{ p: 2 }}>
              {!achievementsLoaded ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      border: `3px solid ${colors.cardBorder}`,
                      borderTopColor: colors.accent,
                      animation: 'spin 1s linear infinite',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }}
                  />
                </Box>
              ) : achievements.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <EmojiEventsIcon sx={{ fontSize: 40, color: colors.textMuted, mb: 1 }} />
                  <Typography sx={{ color: colors.textMuted, fontSize: '0.85rem' }}>
                    No achievements yet. Keep learning!
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
                  {achievements.slice(0, 6).map((achievement) => {
                    const getAchievementIcon = () => {
                      if (achievement.type === 'contest') {
                        const data = achievement.data as ContestAchievement;
                        switch (data.icon) {
                          case 'gold': return <MilitaryTechIcon sx={{ color: '#FFD700', fontSize: 24 }} />;
                          case 'silver': return <MilitaryTechIcon sx={{ color: '#C0C0C0', fontSize: 24 }} />;
                          case 'bronze': return <MilitaryTechIcon sx={{ color: '#CD7F32', fontSize: 24 }} />;
                          default: return <EmojiEventsIcon sx={{ color: colors.accent, fontSize: 24 }} />;
                        }
                      } else if (achievement.type === 'streak') {
                        const data = achievement.data as StreakAchievement;
                        switch (data.icon) {
                          case 'fire': return <WhatshotIcon sx={{ color: '#FF6B35', fontSize: 24 }} />;
                          case 'lightning': return <LocalFireDepartmentIcon sx={{ color: '#FFD700', fontSize: 24 }} />;
                          default: return <EmojiEventsIcon sx={{ color: colors.accent, fontSize: 24 }} />;
                        }
                      } else if (achievement.type === 'course') {
                        return <WorkspacePremiumIcon sx={{ color: '#22C55E', fontSize: 24 }} />;
                      }
                      return <EmojiEventsIcon sx={{ color: colors.accent, fontSize: 24 }} />;
                    };

                    const getAchievementDetails = () => {
                      if (achievement.type === 'contest') {
                        const data = achievement.data as ContestAchievement;
                        return { title: data.title, subtitle: data.contestName, date: data.earnedAt };
                      } else if (achievement.type === 'streak') {
                        const data = achievement.data as StreakAchievement;
                        return { title: data.title, subtitle: `${data.streakDays} day streak`, date: data.earnedAt };
                      } else if (achievement.type === 'course') {
                        const data = achievement.data as CourseCompletionAchievement;
                        return { title: 'Course Completed', subtitle: data.courseTitle, date: data.earnedAt };
                      }
                      return { title: 'Achievement', subtitle: '', date: '' };
                    };

                    const details = getAchievementDetails();
                    const formattedDate = details.date ? new Date(details.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';

                    return (
                      <Box
                        key={achievement.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(12, 43, 78, 0.02)',
                          border: `1px solid ${colors.cardBorder}`,
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(12, 43, 78, 0.04)',
                            transform: 'translateX(4px)',
                            borderColor: `${colors.accent}40`,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(12, 43, 78, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {getAchievementIcon()}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              color: colors.textPrimary,
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {details.title}
                          </Typography>
                          <Typography
                            sx={{
                              color: colors.textMuted,
                              fontSize: '0.7rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {details.subtitle}
                          </Typography>
                        </Box>
                        <Typography sx={{ color: colors.textMuted, fontSize: '0.7rem', flexShrink: 0 }}>
                          {formattedDate}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}

              {/* Certificates Summary */}
              {certificates.length > 0 && (
                <Box
                  sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: `1px solid ${colors.cardBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WorkspacePremiumIcon sx={{ color: '#22C55E', fontSize: 18 }} />
                    <Typography sx={{ color: colors.textSecondary, fontSize: '0.8rem' }}>
                      {certificates.length} Certificate{certificates.length !== 1 ? 's' : ''} Earned
                    </Typography>
                  </Box>
                  <Button
                    component={Link}
                    href="/student/achievements"
                    size="small"
                    sx={{ color: colors.accent, fontSize: '0.7rem', fontWeight: 600 }}
                  >
                    View Certificates
                  </Button>
                </Box>
              )}
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
    </StudentGuard>
  );
}