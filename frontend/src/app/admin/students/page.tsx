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
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Menu,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
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
  { icon: <PeopleIcon />, label: 'My Students', path: '/admin/students', active: true },
  { icon: <MenuBookIcon />, label: 'Courses', path: '/admin/courses' },
  { icon: <AssignmentIcon />, label: 'Assignments', path: '/admin/assignments' },
  { icon: <CloudUploadIcon />, label: 'Content Upload', path: '/admin/content' },
  { icon: <BarChartIcon />, label: 'Analytics', path: '/admin/analytics' },
  { icon: <SettingsIcon />, label: 'Settings', path: '/admin/settings' },
];

export default function AdminStudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { mode, themeColors } = useThemeMode();
  const { currentUser, setCurrentUser, isLoaded, getStudentsForAdmin } = useUserManagement();
  const isDark = mode === 'dark';

  // Get students assigned to this admin
  const assignedStudents = currentUser?.id ? getStudentsForAdmin(currentUser.id) : [];

  // Filter students based on search
  const filteredStudents = assignedStudents.filter(s =>
    `${s.firstName} ${s.lastName} ${s.email} ${s.studentId || ''} ${s.department}`.toLowerCase().includes(searchQuery.toLowerCase())
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
            backgroundColor: colors.headerBg,
            borderBottom: `1px solid ${colors.sidebarBorder}`,
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
          <TextField
            placeholder="Search students..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: colors.headerTextMuted }} />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ThemeSwitcher />
            <Badge badgeContent={2} color="error">
              <IconButton sx={{ color: colors.headerTextSecondary, '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' } }}>
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
                  <PeopleIcon sx={{ fontSize: 36, color: colors.accent }} />
                  My Assigned Students
                </Typography>
                <Typography sx={{ color: colors.textSecondary, fontSize: '1rem', mt: 0.5 }}>
                  View and track progress of students assigned to you by your organization admin
                </Typography>
              </Box>
            </Box>

            {/* Quick Summary */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mt: 3 }}>
              {[
                { label: 'Total Students', value: assignedStudents.length, color: '#8B5CF6' },
                { label: 'Active', value: assignedStudents.length, color: '#22C55E' },
                { label: 'Avg. Progress', value: '0%', color: '#3B82F6' },
                { label: 'Pending Tasks', value: '0', color: '#F59E0B' },
              ].map((item, index) => (
                <Card
                  key={index}
                  sx={{
                    p: 2,
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.cardBorder}`,
                    borderRadius: 2,
                  }}
                >
                  <Typography sx={{ color: colors.textMuted, fontSize: '0.75rem', mb: 0.5 }}>
                    {item.label}
                  </Typography>
                  <Typography variant="h5" sx={{ color: item.color, fontWeight: 700 }}>
                    {item.value}
                  </Typography>
                </Card>
              ))}
            </Box>
          </Box>

          {/* Students Table */}
          <Card sx={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 3, overflow: 'hidden' }}>
            {filteredStudents.length === 0 ? (
              <Box sx={{ p: 8, textAlign: 'center' }}>
                <SchoolIcon sx={{ fontSize: 80, color: colors.textMuted, mb: 2, opacity: 0.5 }} />
                <Typography variant="h5" sx={{ color: colors.textSecondary, mb: 1, fontWeight: 600 }}>
                  {assignedStudents.length === 0 ? 'No Students Assigned' : 'No Students Found'}
                </Typography>
                <Typography variant="body2" sx={{ color: colors.textMuted, maxWidth: 400, mx: 'auto' }}>
                  {assignedStudents.length === 0
                    ? "Your organization admin hasn't assigned any students to you yet. Students will appear here once they are assigned."
                    : 'Try adjusting your search query to find the student you\'re looking for.'}
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
                      <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Student</TableCell>
                      <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Student ID</TableCell>
                      <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Department</TableCell>
                      <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Year</TableCell>
                      <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Progress</TableCell>
                      <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }} align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredStudents.map((student) => {
                      const progress = 0; // Placeholder for actual progress
                      return (
                        <TableRow
                          key={student.id}
                          sx={{
                            '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' },
                            transition: 'background-color 0.2s ease',
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar
                                sx={{
                                  width: 44,
                                  height: 44,
                                  backgroundColor: '#22C55E30',
                                  color: '#22C55E',
                                  fontWeight: 600,
                                }}
                              >
                                {student.firstName[0]}{student.lastName[0]}
                              </Avatar>
                              <Box>
                                <Typography sx={{ color: colors.textPrimary, fontWeight: 600, fontSize: '0.95rem' }}>
                                  {student.firstName} {student.lastName}
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.textMuted, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <EmailIcon sx={{ fontSize: 14 }} />
                                  {student.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ color: colors.textSecondary, fontFamily: 'monospace', fontWeight: 500 }}>
                              {student.studentId || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={student.department}
                              size="small"
                              sx={{
                                backgroundColor: `${colors.accent}20`,
                                color: colors.accent,
                                fontWeight: 500,
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: colors.textSecondary }}>
                            {student.year || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ minWidth: 120 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '0.75rem' }}>
                                  Progress
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.accent, fontWeight: 600, fontSize: '0.75rem' }}>
                                  {progress}%
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{
                                  height: 6,
                                  borderRadius: 1,
                                  backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: progress > 70 ? '#22C55E' : progress > 40 ? '#F59E0B' : '#EF4444',
                                    borderRadius: 1,
                                  },
                                }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label="Active"
                              size="small"
                              sx={{
                                backgroundColor: '#22C55E20',
                                color: '#22C55E',
                                fontWeight: 500,
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              component={Link}
                              href={`/admin/students/${student.id}`}
                              variant="contained"
                              size="small"
                              startIcon={<VisibilityIcon />}
                              sx={{
                                backgroundColor: colors.accent,
                                color: '#fff',
                                textTransform: 'none',
                                fontSize: '0.75rem',
                                '&:hover': { backgroundColor: `${colors.accent}dd` },
                              }}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
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
