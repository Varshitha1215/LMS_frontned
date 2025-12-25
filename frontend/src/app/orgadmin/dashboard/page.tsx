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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Menu,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import { keyframes } from '@mui/system';
import Link from 'next/link';
import { useThemeMode } from '@/context/ThemeContext';
import { useUserManagement, RegisteredUser } from '@/context/UserManagementContext';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import PendingIcon from '@mui/icons-material/Pending';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import SchoolIcon from '@mui/icons-material/School';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AssessmentIcon from '@mui/icons-material/Assessment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MenuBookIcon from '@mui/icons-material/MenuBook';
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
  { icon: <HomeIcon />, label: 'Dashboard', path: '/orgadmin/dashboard', active: true },
  { icon: <PeopleIcon />, label: 'Students and Admins', path: '/orgadmin/students' },
  { icon: <MenuBookIcon />, label: 'Courses', path: '/orgadmin/courses' },
  { icon: <SchoolIcon />, label: 'Admin Management', path: '/orgadmin/admins' },
  { icon: <AssessmentIcon />, label: 'Reports', path: '/orgadmin/reports' },
  { icon: <SettingsIcon />, label: 'Settings', path: '/orgadmin/settings' },
];

export default function OrgAdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tabValue, setTabValue] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; type: 'verify' | 'reject'; student: RegisteredUser | null }>({
    open: false,
    type: 'verify',
    student: null,
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [viewDialog, setViewDialog] = useState<{ open: boolean; student: RegisteredUser | null }>({
    open: false,
    student: null,
  });
  const [assignDialog, setAssignDialog] = useState<{ open: boolean; student: RegisteredUser | null }>({
    open: false,
    student: null,
  });
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);

  const { mode, themeColors } = useThemeMode();
  const { 
    currentUser, 
    setCurrentUser,
    getPendingStudentsByInstitute, 
    getVerifiedStudentsByInstitute,
    getPendingAdminsByInstitute,
    getVerifiedAdminsByInstitute,
    verifyStudent, 
    rejectStudent,
    verifyAdmin,
    rejectAdmin,
    assignAdminToStudent,
    removeAdminFromStudent,
    getAdminsForStudent,
    isLoaded 
  } = useUserManagement();
  const isDark = mode === 'dark';

  // Get the OrgAdmin's institution
  const orgAdminInstitute = currentUser?.institute || '';

  // Filter students by the OrgAdmin's institution
  const pendingStudents = orgAdminInstitute 
    ? getPendingStudentsByInstitute(orgAdminInstitute) 
    : [];
  const verifiedStudents = orgAdminInstitute 
    ? getVerifiedStudentsByInstitute(orgAdminInstitute) 
    : [];
  
  // Filter admins by the OrgAdmin's institution
  const pendingAdmins = orgAdminInstitute 
    ? getPendingAdminsByInstitute(orgAdminInstitute) 
    : [];
  const verifiedAdmins = orgAdminInstitute 
    ? getVerifiedAdminsByInstitute(orgAdminInstitute) 
    : [];

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
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleVerifyClick = (student: RegisteredUser) => {
    setConfirmDialog({ open: true, type: 'verify', student });
  };

  const handleRejectClick = (student: RegisteredUser) => {
    setConfirmDialog({ open: true, type: 'reject', student });
  };

  const handleConfirmAction = () => {
    if (confirmDialog.student) {
      if (confirmDialog.type === 'verify') {
        verifyStudent(confirmDialog.student.id, currentUser?.email || 'orgadmin@gmail.com');
        setSnackbar({
          open: true,
          message: `${confirmDialog.student.firstName} ${confirmDialog.student.lastName} has been verified successfully!`,
          severity: 'success',
        });
      } else {
        rejectStudent(confirmDialog.student.id);
        setSnackbar({
          open: true,
          message: `${confirmDialog.student.firstName} ${confirmDialog.student.lastName}'s registration has been rejected.`,
          severity: 'info',
        });
      }
    }
    setConfirmDialog({ open: false, type: 'verify', student: null });
  };

  const handleViewStudent = (student: RegisteredUser) => {
    setViewDialog({ open: true, student });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filter students based on search
  const filteredPending = pendingStudents.filter(s =>
    `${s.firstName} ${s.lastName} ${s.email} ${s.studentId || ''}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVerified = verifiedStudents.filter(s =>
    `${s.firstName} ${s.lastName} ${s.email} ${s.studentId || ''}`.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredPendingAdmins = pendingAdmins.filter(a =>
    `${a.firstName} ${a.lastName} ${a.email}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVerifiedAdmins = verifiedAdmins.filter(a =>
    `${a.firstName} ${a.lastName} ${a.email}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const stats = [
    { label: 'Pending Students', value: pendingStudents.length, icon: <PendingIcon />, color: '#F59E0B' },
    { label: 'Verified Students', value: verifiedStudents.length, icon: <VerifiedUserIcon />, color: '#22C55E' },
    { label: 'Total Students', value: pendingStudents.length + verifiedStudents.length, icon: <SchoolIcon />, color: themeColors.accent },
    { label: 'Total Admins', value: pendingAdmins.length + verifiedAdmins.length, icon: <GroupAddIcon />, color: '#8B5CF6' },
  ];

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
              <CorporateFareIcon sx={{ color: colors.accent, fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: colors.headerText, fontWeight: 700, fontSize: '1.2rem', lineHeight: 1.2, display: 'inline' }}>
                Org
              </Typography>
              <Typography variant="h6" sx={{ color: colors.accent, fontWeight: 700, fontSize: '1.2rem', lineHeight: 1.2, display: 'inline' }}>
                Admin
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: colors.headerTextMuted, fontSize: '0.7rem' }}>
                Student Management
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
              {currentUser ? `${currentUser.firstName[0]}${currentUser.lastName[0]}` : 'OA'}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ color: colors.headerText, fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.3 }}>
                {currentUser?.firstName && currentUser?.lastName ? `${currentUser.firstName} ${currentUser.lastName}` : 'Org Admin'}
              </Typography>
              <Typography sx={{ color: colors.headerTextMuted, fontSize: '0.75rem' }}>
                {currentUser?.institute || 'Organization'}
              </Typography>
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
          {/* Search Bar */}
          <TextField
            placeholder="Search students and admins..."
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

          {/* Right Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ThemeSwitcher />
            <IconButton sx={{ color: colors.headerTextSecondary, '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' } }}>
              <Badge badgeContent={pendingStudents.length} sx={{ '& .MuiBadge-badge': { backgroundColor: '#F59E0B', color: '#ffffff' } }}>
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ p: 4 }}>
          {/* Page Header */}
          <Box sx={{ mb: 4, animation: `${fadeInUp} 0.5s ease-out` }}>
            <Typography variant="h4" sx={{ color: colors.textPrimary, fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CorporateFareIcon sx={{ fontSize: 36, color: colors.accent }} />
              Organization Admin Dashboard
            </Typography>
            <Typography sx={{ color: colors.textSecondary, fontSize: '1rem' }}>
              Manage students and admins, verify registrations, and control admin access to student data for <strong>{orgAdminInstitute || 'your institution'}</strong>
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3, mb: 4 }}>
            {stats.map((stat, index) => (
              <Card
                key={index}
                onClick={() => {
                  // Click handling: Navigate to respective tabs
                  if (index === 0) setTabValue(0); // Pending Students -> Pending Verification tab
                  else if (index === 1) setTabValue(1); // Verified Students -> Verified Students tab
                  else if (index === 2) setTabValue(2); // Total Students -> All Students tab
                  else if (index === 3) setTabValue(4); // Total Admins -> Verified Admins tab
                }}
                sx={{
                  p: 3,
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: 3,
                  animation: `${fadeInUp} 0.5s ease-out ${index * 0.1}s both`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 25px ${stat.color}25`,
                    borderColor: stat.color,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" sx={{ color: stat.color, fontWeight: 700, mb: 0.5 }}>
                      {isLoaded ? stat.value : <CircularProgress size={24} />}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                      {stat.label}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '16px',
                      backgroundColor: `${stat.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>

          {/* Tabs */}
          <Box sx={{ mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: colors.accent,
                  height: 3,
                  borderRadius: 2,
                },
                '& .MuiTab-root': {
                  color: colors.textMuted,
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  minWidth: 180,
                  '&.Mui-selected': {
                    color: colors.accent,
                    fontWeight: 600,
                  },
                },
              }}
            >
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PendingIcon sx={{ fontSize: 20 }} />
                    Pending Verification
                    {pendingStudents.length > 0 && (
                      <Chip label={pendingStudents.length} size="small" sx={{ height: 20, fontSize: '0.7rem', backgroundColor: '#F59E0B', color: '#fff' }} />
                    )}
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VerifiedUserIcon sx={{ fontSize: 20 }} />
                    Verified Students
                    <Chip label={verifiedStudents.length} size="small" sx={{ height: 20, fontSize: '0.7rem', backgroundColor: '#22C55E', color: '#fff' }} />
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SchoolIcon sx={{ fontSize: 20 }} />
                    All Students
                    <Chip label={pendingStudents.length + verifiedStudents.length} size="small" sx={{ height: 20, fontSize: '0.7rem', backgroundColor: colors.accent, color: '#fff' }} />
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupAddIcon sx={{ fontSize: 20 }} />
                    Pending Admins
                    {pendingAdmins.length > 0 && (
                      <Chip label={pendingAdmins.length} size="small" sx={{ height: 20, fontSize: '0.7rem', backgroundColor: '#F59E0B', color: '#fff' }} />
                    )}
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VerifiedUserIcon sx={{ fontSize: 20 }} />
                    Verified Admins
                    <Chip label={verifiedAdmins.length} size="small" sx={{ height: 20, fontSize: '0.7rem', backgroundColor: '#22C55E', color: '#fff' }} />
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ fontSize: 20 }} />
                    All Admins
                    <Chip label={pendingAdmins.length + verifiedAdmins.length} size="small" sx={{ height: 20, fontSize: '0.7rem', backgroundColor: '#8B5CF6', color: '#fff' }} />
                  </Box>
                }
              />
            </Tabs>
          </Box>

          {/* Student Tables */}
          {tabValue === 0 && (
            <Card sx={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 3, overflow: 'hidden' }}>
              {filteredPending.length === 0 ? (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <CheckCircleIcon sx={{ fontSize: 60, color: '#22C55E', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: colors.textSecondary, mb: 1 }}>
                    No Pending Verifications
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textMuted }}>
                    All student registrations have been verified
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Student Name</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Email</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Student ID</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Department</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Registered At</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }} align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredPending.map((student) => (
                        <TableRow
                          key={student.id}
                          sx={{
                            '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' },
                            transition: 'background-color 0.2s ease',
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ width: 36, height: 36, backgroundColor: `${colors.accent}30`, color: colors.accent }}>
                                {student.firstName[0]}{student.lastName[0]}
                              </Avatar>
                              <Typography sx={{ color: colors.textPrimary, fontWeight: 500 }}>
                                {student.firstName} {student.lastName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: colors.textSecondary }}>{student.email}</TableCell>
                          <TableCell sx={{ color: colors.textSecondary }}>{student.studentId || 'N/A'}</TableCell>
                          <TableCell sx={{ color: colors.textSecondary }}>{student.department}</TableCell>
                          <TableCell sx={{ color: colors.textMuted, fontSize: '0.85rem' }}>{formatDate(student.registeredAt)}</TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <IconButton
                                onClick={() => handleViewStudent(student)}
                                sx={{ color: colors.textSecondary, '&:hover': { backgroundColor: `${colors.accent}20`, color: colors.accent } }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                              <Button
                                size="small"
                                variant="contained"
                                startIcon={<CheckCircleIcon />}
                                onClick={() => handleVerifyClick(student)}
                                sx={{
                                  backgroundColor: '#22C55E',
                                  color: '#fff',
                                  textTransform: 'none',
                                  '&:hover': { backgroundColor: '#16A34A' },
                                }}
                              >
                                Verify
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<CancelIcon />}
                                onClick={() => handleRejectClick(student)}
                                sx={{
                                  borderColor: '#EF4444',
                                  color: '#EF4444',
                                  textTransform: 'none',
                                  '&:hover': { backgroundColor: '#EF444420', borderColor: '#EF4444' },
                                }}
                              >
                                Reject
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Card>
          )}

          {tabValue === 1 && (
            <Card sx={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 3, overflow: 'hidden' }}>
              {filteredVerified.length === 0 ? (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <GroupAddIcon sx={{ fontSize: 60, color: colors.textMuted, mb: 2 }} />
                  <Typography variant="h6" sx={{ color: colors.textSecondary, mb: 1 }}>
                    No Verified Students Yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textMuted }}>
                    Verify pending students to see them here
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Student Name</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Email</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Student ID</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Department</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Verified At</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Assigned Admins</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredVerified.map((student) => {
                        const assignedAdmins = getAdminsForStudent(student.id);
                        return (
                        <TableRow
                          key={student.id}
                          sx={{
                            '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' },
                            transition: 'background-color 0.2s ease',
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ width: 36, height: 36, backgroundColor: '#22C55E30', color: '#22C55E' }}>
                                {student.firstName[0]}{student.lastName[0]}
                              </Avatar>
                              <Typography sx={{ color: colors.textPrimary, fontWeight: 500 }}>
                                {student.firstName} {student.lastName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: colors.textSecondary }}>{student.email}</TableCell>
                          <TableCell sx={{ color: colors.textSecondary }}>{student.studentId || 'N/A'}</TableCell>
                          <TableCell sx={{ color: colors.textSecondary }}>{student.department}</TableCell>
                          <TableCell sx={{ color: colors.textMuted, fontSize: '0.85rem' }}>{student.verifiedAt ? formatDate(student.verifiedAt) : 'N/A'}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {assignedAdmins.length === 0 ? (
                                <Chip label="None" size="small" sx={{ backgroundColor: colors.textMuted, color: '#fff', opacity: 0.5 }} />
                              ) : (
                                assignedAdmins.map((admin) => (
                                  <Chip
                                    key={admin.id}
                                    label={`${admin.firstName} ${admin.lastName}`}
                                    size="small"
                                    onDelete={() => {
                                      removeAdminFromStudent(student.id, admin.id);
                                      setSnackbar({ open: true, message: `Removed ${admin.firstName} from ${student.firstName}`, severity: 'info' });
                                    }}
                                    sx={{
                                      backgroundColor: '#8B5CF620',
                                      color: '#8B5CF6',
                                      '& .MuiChip-deleteIcon': { color: '#8B5CF6', '&:hover': { color: '#7C3AED' } },
                                    }}
                                  />
                                ))
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton
                                onClick={() => handleViewStudent(student)}
                                sx={{ color: colors.textSecondary, '&:hover': { backgroundColor: `${colors.accent}20`, color: colors.accent } }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                              <Button
                                size="small"
                                variant="contained"
                                startIcon={<GroupAddIcon />}
                                onClick={() => {
                                  setAssignDialog({ open: true, student });
                                  setSelectedAdmins(assignedAdmins.map(a => a.id));
                                }}
                                sx={{
                                  backgroundColor: colors.accent,
                                  color: '#fff',
                                  textTransform: 'none',
                                  fontSize: '0.75rem',
                                  px: 1.5,
                                  '&:hover': { backgroundColor: `${colors.accent}dd` },
                                }}
                              >
                                Manage
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Card>
          )}

          {/* All Students Tab */}
          {tabValue === 2 && (
            <Card sx={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 3, overflow: 'hidden' }}>
              {[...filteredPending, ...filteredVerified].length === 0 ? (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <SchoolIcon sx={{ fontSize: 60, color: colors.textMuted, mb: 2 }} />
                  <Typography variant="h6" sx={{ color: colors.textSecondary, mb: 1 }}>
                    No Students Found
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textMuted }}>
                    No students have registered for your institution yet
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Student Name</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Email</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Student ID</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Department</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Assigned Admins</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }} align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[...filteredPending, ...filteredVerified].map((student) => {
                        const assignedAdmins = getAdminsForStudent(student.id);
                        return (
                        <TableRow
                          key={student.id}
                          sx={{
                            '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' },
                            transition: 'background-color 0.2s ease',
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ width: 36, height: 36, backgroundColor: student.isVerified ? '#22C55E30' : `${colors.accent}30`, color: student.isVerified ? '#22C55E' : colors.accent }}>
                                {student.firstName[0]}{student.lastName[0]}
                              </Avatar>
                              <Typography sx={{ color: colors.textPrimary, fontWeight: 500 }}>
                                {student.firstName} {student.lastName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: colors.textSecondary }}>{student.email}</TableCell>
                          <TableCell sx={{ color: colors.textSecondary }}>{student.studentId || 'N/A'}</TableCell>
                          <TableCell sx={{ color: colors.textSecondary }}>{student.department}</TableCell>
                          <TableCell>
                            <Chip
                              icon={student.isVerified ? <VerifiedUserIcon sx={{ fontSize: 16 }} /> : <PendingIcon sx={{ fontSize: 16 }} />}
                              label={student.isVerified ? 'Verified' : 'Pending'}
                              size="small"
                              sx={{
                                backgroundColor: student.isVerified ? '#22C55E20' : '#F59E0B20',
                                color: student.isVerified ? '#22C55E' : '#F59E0B',
                                fontWeight: 500,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 200 }}>
                              {assignedAdmins.length === 0 ? (
                                <Chip label="None" size="small" sx={{ backgroundColor: colors.textMuted, color: '#fff', opacity: 0.5 }} />
                              ) : (
                                assignedAdmins.map((admin) => (
                                  <Chip
                                    key={admin.id}
                                    label={`${admin.firstName} ${admin.lastName}`}
                                    size="small"
                                    onDelete={student.isVerified ? () => {
                                      removeAdminFromStudent(student.id, admin.id);
                                      setSnackbar({ open: true, message: `Removed ${admin.firstName} from ${student.firstName}`, severity: 'info' });
                                    } : undefined}
                                    sx={{
                                      backgroundColor: '#8B5CF620',
                                      color: '#8B5CF6',
                                      '& .MuiChip-deleteIcon': { color: '#8B5CF6', '&:hover': { color: '#7C3AED' } },
                                    }}
                                  />
                                ))
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <IconButton
                                onClick={() => handleViewStudent(student)}
                                sx={{ color: colors.textSecondary, '&:hover': { backgroundColor: `${colors.accent}20`, color: colors.accent } }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                              {!student.isVerified ? (
                                <>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    startIcon={<CheckCircleIcon />}
                                    onClick={() => handleVerifyClick(student)}
                                    sx={{
                                      backgroundColor: '#22C55E',
                                      color: '#fff',
                                      textTransform: 'none',
                                      fontSize: '0.75rem',
                                      px: 1,
                                      '&:hover': { backgroundColor: '#16A34A' },
                                    }}
                                  >
                                    Verify
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<CancelIcon />}
                                    onClick={() => handleRejectClick(student)}
                                    sx={{
                                      borderColor: '#EF4444',
                                      color: '#EF4444',
                                      textTransform: 'none',
                                      fontSize: '0.75rem',
                                      px: 1,
                                      '&:hover': { backgroundColor: '#EF444420', borderColor: '#EF4444' },
                                    }}
                                  >
                                    Reject
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  size="small"
                                  variant="contained"
                                  startIcon={<GroupAddIcon />}
                                  onClick={() => {
                                    setAssignDialog({ open: true, student });
                                    setSelectedAdmins(assignedAdmins.map(a => a.id));
                                  }}
                                  sx={{
                                    backgroundColor: colors.accent,
                                    color: '#fff',
                                    textTransform: 'none',
                                    fontSize: '0.75rem',
                                    px: 1.5,
                                    '&:hover': { backgroundColor: `${colors.accent}dd` },
                                  }}
                                >
                                  Manage
                                </Button>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Card>
          )}

          {/* Pending Admins Tab */}
          {tabValue === 3 && (
            <Card sx={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 3, overflow: 'hidden' }}>
              {filteredPendingAdmins.length === 0 ? (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <CheckCircleIcon sx={{ fontSize: 60, color: '#22C55E', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: colors.textSecondary, mb: 1 }}>
                    No Pending Admin Verifications
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textMuted }}>
                    All admin registrations have been verified
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Admin Name</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Email</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Institute</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Registered At</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }} align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredPendingAdmins.map((admin) => (
                        <TableRow
                          key={admin.id}
                          sx={{
                            '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' },
                            transition: 'background-color 0.2s ease',
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ width: 36, height: 36, backgroundColor: '#8B5CF630', color: '#8B5CF6' }}>
                                {admin.firstName[0]}{admin.lastName[0]}
                              </Avatar>
                              <Typography sx={{ color: colors.textPrimary, fontWeight: 500 }}>
                                {admin.firstName} {admin.lastName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: colors.textSecondary }}>{admin.email}</TableCell>
                          <TableCell sx={{ color: colors.textSecondary }}>{admin.institute}</TableCell>
                          <TableCell sx={{ color: colors.textMuted, fontSize: '0.85rem' }}>{formatDate(admin.registeredAt)}</TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <IconButton
                                onClick={() => handleViewStudent(admin)}
                                sx={{ color: colors.textSecondary, '&:hover': { backgroundColor: `${colors.accent}20`, color: colors.accent } }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                              <Button
                                size="small"
                                variant="contained"
                                startIcon={<CheckCircleIcon />}
                                onClick={() => handleVerifyClick(admin)}
                                sx={{
                                  backgroundColor: '#22C55E',
                                  color: '#fff',
                                  textTransform: 'none',
                                  fontSize: '0.75rem',
                                  px: 1.5,
                                  '&:hover': { backgroundColor: '#16A34A' },
                                }}
                              >
                                Verify
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<CancelIcon />}
                                onClick={() => handleRejectClick(admin)}
                                sx={{
                                  borderColor: '#EF4444',
                                  color: '#EF4444',
                                  textTransform: 'none',
                                  fontSize: '0.75rem',
                                  px: 1.5,
                                  '&:hover': { backgroundColor: '#EF444420', borderColor: '#EF4444' },
                                }}
                              >
                                Reject
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Card>
          )}

          {/* Verified Admins Tab */}
          {tabValue === 4 && (
            <Card sx={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 3, overflow: 'hidden' }}>
              {filteredVerifiedAdmins.length === 0 ? (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <GroupAddIcon sx={{ fontSize: 60, color: colors.textMuted, mb: 2 }} />
                  <Typography variant="h6" sx={{ color: colors.textSecondary, mb: 1 }}>
                    No Verified Admins
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textMuted }}>
                    No admins have been verified yet
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Admin Name</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Email</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Institute</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Registered At</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }} align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredVerifiedAdmins.map((admin) => (
                        <TableRow
                          key={admin.id}
                          sx={{
                            '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' },
                            transition: 'background-color 0.2s ease',
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ width: 36, height: 36, backgroundColor: '#22C55E30', color: '#22C55E' }}>
                                {admin.firstName[0]}{admin.lastName[0]}
                              </Avatar>
                              <Typography sx={{ color: colors.textPrimary, fontWeight: 500 }}>
                                {admin.firstName} {admin.lastName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: colors.textSecondary }}>{admin.email}</TableCell>
                          <TableCell sx={{ color: colors.textSecondary }}>{admin.institute}</TableCell>
                          <TableCell sx={{ color: colors.textMuted, fontSize: '0.85rem' }}>{formatDate(admin.registeredAt)}</TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <IconButton
                                onClick={() => handleViewStudent(admin)}
                                sx={{ color: colors.textSecondary, '&:hover': { backgroundColor: `${colors.accent}20`, color: colors.accent } }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                onClick={() => handleRejectClick(admin)}
                                sx={{
                                  color: '#EF4444',
                                  '&:hover': { backgroundColor: '#EF444420' },
                                }}
                                size="small"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Card>
          )}

          {/* All Admins Tab */}
          {tabValue === 5 && (
            <Card sx={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 3, overflow: 'hidden' }}>
              {[...filteredPendingAdmins, ...filteredVerifiedAdmins].length === 0 ? (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <GroupAddIcon sx={{ fontSize: 60, color: colors.textMuted, mb: 2 }} />
                  <Typography variant="h6" sx={{ color: colors.textSecondary, mb: 1 }}>
                    No Admins Found
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textMuted }}>
                    No admins have registered for your institution yet
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Admin Name</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Email</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Institute</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Registered At</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ color: colors.textPrimary, fontWeight: 600 }} align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[...filteredPendingAdmins, ...filteredVerifiedAdmins].map((admin) => (
                        <TableRow
                          key={admin.id}
                          sx={{
                            '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' },
                            transition: 'background-color 0.2s ease',
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ width: 36, height: 36, backgroundColor: admin.isVerified ? '#22C55E30' : '#8B5CF630', color: admin.isVerified ? '#22C55E' : '#8B5CF6' }}>
                                {admin.firstName[0]}{admin.lastName[0]}
                              </Avatar>
                              <Typography sx={{ color: colors.textPrimary, fontWeight: 500 }}>
                                {admin.firstName} {admin.lastName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: colors.textSecondary }}>{admin.email}</TableCell>
                          <TableCell sx={{ color: colors.textSecondary }}>{admin.institute}</TableCell>
                          <TableCell sx={{ color: colors.textMuted, fontSize: '0.85rem' }}>{formatDate(admin.registeredAt)}</TableCell>
                          <TableCell>
                            <Chip
                              icon={admin.isVerified ? <VerifiedUserIcon sx={{ fontSize: 16 }} /> : <PendingIcon sx={{ fontSize: 16 }} />}
                              label={admin.isVerified ? 'Verified' : 'Pending'}
                              size="small"
                              sx={{
                                backgroundColor: admin.isVerified ? '#22C55E20' : '#F59E0B20',
                                color: admin.isVerified ? '#22C55E' : '#F59E0B',
                                fontWeight: 500,
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <IconButton
                                onClick={() => handleViewStudent(admin)}
                                sx={{ color: colors.textSecondary, '&:hover': { backgroundColor: `${colors.accent}20`, color: colors.accent } }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                              {!admin.isVerified && (
                                <>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    startIcon={<CheckCircleIcon />}
                                    onClick={() => handleVerifyClick(admin)}
                                    sx={{
                                      backgroundColor: '#22C55E',
                                      color: '#fff',
                                      textTransform: 'none',
                                      fontSize: '0.75rem',
                                      px: 1,
                                      '&:hover': { backgroundColor: '#16A34A' },
                                    }}
                                  >
                                    Verify
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<CancelIcon />}
                                    onClick={() => handleRejectClick(admin)}
                                    sx={{
                                      borderColor: '#EF4444',
                                      color: '#EF4444',
                                      textTransform: 'none',
                                      fontSize: '0.75rem',
                                      px: 1,
                                      '&:hover': { backgroundColor: '#EF444420', borderColor: '#EF4444' },
                                    }}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Card>
          )}
        </Box>
      </Box>

      {/* Assign Admin Dialog */}
      <Dialog
        open={assignDialog.open}
        onClose={() => {
          setAssignDialog({ open: false, student: null });
          setSelectedAdmins([]);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { backgroundColor: colors.cardBg, borderRadius: 3 },
        }}
      >
        <DialogTitle sx={{ color: colors.textPrimary, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          <GroupAddIcon sx={{ color: colors.accent }} />
          Manage Admin Access for {assignDialog.student?.firstName} {assignDialog.student?.lastName}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>
            Select which admins can view and manage this student's progress and information.
          </Typography>
          
          {verifiedAdmins.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <GroupAddIcon sx={{ fontSize: 48, color: colors.textMuted, mb: 1 }} />
              <Typography sx={{ color: colors.textSecondary }}>
                No verified admins available
              </Typography>
            </Box>
          ) : (
            <Box>
              {verifiedAdmins.map((admin) => (
                <Box
                  key={admin.id}
                  sx={{
                    p: 2,
                    mb: 1,
                    borderRadius: 2,
                    border: `1px solid ${colors.cardBorder}`,
                    cursor: 'pointer',
                    backgroundColor: selectedAdmins.includes(admin.id) ? `${colors.accent}15` : 'transparent',
                    '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' },
                  }}
                  onClick={() => {
                    setSelectedAdmins(prev =>
                      prev.includes(admin.id)
                        ? prev.filter(id => id !== admin.id)
                        : [...prev, admin.id]
                    );
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 40, height: 40, backgroundColor: '#8B5CF630', color: '#8B5CF6' }}>
                      {admin.firstName[0]}{admin.lastName[0]}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ color: colors.textPrimary, fontWeight: 500 }}>
                        {admin.firstName} {admin.lastName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.textMuted }}>
                        {admin.email}
                      </Typography>
                    </Box>
                    {selectedAdmins.includes(admin.id) && (
                      <CheckCircleIcon sx={{ color: colors.accent }} />
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button
            onClick={() => {
              setAssignDialog({ open: false, student: null });
              setSelectedAdmins([]);
            }}
            sx={{ color: colors.textSecondary }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (assignDialog.student) {
                // Get current admins
                const currentAdmins = getAdminsForStudent(assignDialog.student.id).map(a => a.id);
                
                // Add new admins
                selectedAdmins.forEach(adminId => {
                  if (!currentAdmins.includes(adminId)) {
                    assignAdminToStudent(assignDialog.student!.id, adminId);
                  }
                });
                
                // Remove unselected admins
                currentAdmins.forEach(adminId => {
                  if (!selectedAdmins.includes(adminId)) {
                    removeAdminFromStudent(assignDialog.student!.id, adminId);
                  }
                });
                
                setSnackbar({
                  open: true,
                  message: `Admin access updated for ${assignDialog.student.firstName} ${assignDialog.student.lastName}`,
                  severity: 'success',
                });
              }
              setAssignDialog({ open: false, student: null });
              setSelectedAdmins([]);
            }}
            variant="contained"
            sx={{
              backgroundColor: colors.accent,
              '&:hover': { backgroundColor: `${colors.accent}dd` },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, type: 'verify', student: null })}
        PaperProps={{
          sx: { backgroundColor: colors.cardBg, borderRadius: 3, minWidth: 400 },
        }}
      >
        <DialogTitle sx={{ color: colors.textPrimary, fontWeight: 600 }}>
          {confirmDialog.type === 'verify' ? 'Verify Student' : 'Reject Student'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: colors.textSecondary }}>
            {confirmDialog.type === 'verify'
              ? `Are you sure you want to verify ${confirmDialog.student?.firstName} ${confirmDialog.student?.lastName}? They will be able to login and access the platform.`
              : `Are you sure you want to reject ${confirmDialog.student?.firstName} ${confirmDialog.student?.lastName}'s registration? This action cannot be undone.`
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button
            onClick={() => setConfirmDialog({ open: false, type: 'verify', student: null })}
            sx={{ color: colors.textSecondary }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            sx={{
              backgroundColor: confirmDialog.type === 'verify' ? '#22C55E' : '#EF4444',
              '&:hover': { backgroundColor: confirmDialog.type === 'verify' ? '#16A34A' : '#DC2626' },
            }}
          >
            {confirmDialog.type === 'verify' ? 'Verify' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Student Dialog */}
      <Dialog
        open={viewDialog.open}
        onClose={() => setViewDialog({ open: false, student: null })}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { backgroundColor: colors.cardBg, borderRadius: 3 },
        }}
      >
        <DialogTitle sx={{ color: colors.textPrimary, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon sx={{ color: colors.accent }} />
          Details
        </DialogTitle>
        <DialogContent>
          {viewDialog.student && (
            <Box sx={{ pt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ width: 60, height: 60, backgroundColor: `${colors.accent}30`, color: colors.accent, fontSize: '1.5rem' }}>
                  {viewDialog.student.firstName[0]}{viewDialog.student.lastName[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ color: colors.textPrimary, fontWeight: 600 }}>
                    {viewDialog.student.firstName} {viewDialog.student.lastName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textMuted }}>
                    {viewDialog.student.email}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 2, borderColor: colors.cardBorder }} />
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: colors.textMuted }}>Student ID</Typography>
                  <Typography sx={{ color: colors.textPrimary }}>{viewDialog.student.studentId || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: colors.textMuted }}>Institute</Typography>
                  <Typography sx={{ color: colors.textPrimary }}>{viewDialog.student.institute}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: colors.textMuted }}>Department</Typography>
                  <Typography sx={{ color: colors.textPrimary }}>{viewDialog.student.department}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: colors.textMuted }}>Registered At</Typography>
                  <Typography sx={{ color: colors.textPrimary }}>{formatDate(viewDialog.student.registeredAt)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: colors.textMuted }}>Status</Typography>
                  <Chip
                    label={viewDialog.student.isVerified ? 'Verified' : 'Pending'}
                    size="small"
                    sx={{
                      mt: 0.5,
                      backgroundColor: viewDialog.student.isVerified ? '#22C55E20' : '#F59E0B20',
                      color: viewDialog.student.isVerified ? '#22C55E' : '#F59E0B',
                    }}
                  />
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button onClick={() => setViewDialog({ open: false, student: null })} sx={{ color: colors.textSecondary }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

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
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
