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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import { keyframes } from '@mui/system';
import Link from 'next/link';
import { useThemeMode } from '@/context/ThemeContext';
import { useUserManagement, RegisteredUser } from '@/context/UserManagementContext';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import SchoolIcon from '@mui/icons-material/School';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AssessmentIcon from '@mui/icons-material/Assessment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
  { icon: <PeopleIcon />, label: 'Students and Admins', path: '/orgadmin/students', active: true },
  { icon: <SchoolIcon />, label: 'Admin Management', path: '/orgadmin/admins' },
  { icon: <AssessmentIcon />, label: 'Reports', path: '/orgadmin/reports' },
  { icon: <SettingsIcon />, label: 'Settings', path: '/orgadmin/settings' },
];

export default function OrgAdminStudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tabValue, setTabValue] = useState(0);
  const [assignDialog, setAssignDialog] = useState<{ open: boolean; student: RegisteredUser | null }>({
    open: false,
    student: null,
  });
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const { mode, themeColors } = useThemeMode();
  const { 
    currentUser, 
    setCurrentUser,
    getPendingStudentsByInstitute, 
    getVerifiedStudentsByInstitute,
    getPendingAdminsByInstitute,
    getVerifiedAdminsByInstitute,
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

  // Filter students based on search
  const filteredVerified = verifiedStudents.filter(s =>
    `${s.firstName} ${s.lastName} ${s.email} ${s.studentId || ''}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allStudents = [...pendingStudents, ...verifiedStudents];
  const filteredAll = allStudents.filter(s =>
    `${s.firstName} ${s.lastName} ${s.email} ${s.studentId || ''}`.toLowerCase().includes(searchQuery.toLowerCase())
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
              <Badge badgeContent={pendingStudents.length + pendingAdmins.length} sx={{ '& .MuiBadge-badge': { backgroundColor: '#F59E0B', color: '#ffffff' } }}>
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
                  <PeopleIcon sx={{ fontSize: 36, color: colors.accent }} />
                  Students and Admins
                </Typography>
                <Typography sx={{ color: colors.textSecondary, fontSize: '1rem', mt: 0.5 }}>
                  Manage admin access control for students at <strong>{orgAdminInstitute || 'your institution'}</strong>
                </Typography>
              </Box>
            </Box>
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
                    <Chip label={allStudents.length} size="small" sx={{ height: 20, fontSize: '0.7rem', backgroundColor: colors.accent, color: '#fff' }} />
                  </Box>
                }
              />
            </Tabs>
          </Box>

          {/* Verified Students Tab */}
          {tabValue === 0 && (
            <Card sx={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 3, overflow: 'hidden' }}>
              {filteredVerified.length === 0 ? (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <GroupAddIcon sx={{ fontSize: 60, color: colors.textMuted, mb: 2 }} />
                  <Typography variant="h6" sx={{ color: colors.textSecondary, mb: 1 }}>
                    No Verified Students Yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textMuted }}>
                    Verify pending students to manage their admin access
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
                            <TableCell>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 250 }}>
                                {assignedAdmins.length === 0 ? (
                                  <Chip label="No admins assigned" size="small" sx={{ backgroundColor: colors.textMuted, color: '#fff', opacity: 0.5 }} />
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
                                Manage Access
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
          )}

          {/* All Students Tab */}
          {tabValue === 1 && (
            <Card sx={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 3, overflow: 'hidden' }}>
              {filteredAll.length === 0 ? (
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
                      {filteredAll.map((student) => {
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
                                {student.isVerified ? (
                                  assignedAdmins.length === 0 ? (
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
                                  )
                                ) : (
                                  <Chip label="Verify first" size="small" sx={{ backgroundColor: colors.textMuted, color: '#fff', opacity: 0.5 }} />
                                )}
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              {student.isVerified ? (
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
                                  Manage Access
                                </Button>
                              ) : (
                                <Chip label="Pending Verification" size="small" sx={{ backgroundColor: '#F59E0B20', color: '#F59E0B' }} />
                              )}
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
