'use client';

import { useState, useMemo } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material';
import { keyframes } from '@mui/system';
import Link from 'next/link';
import { useThemeMode } from '@/context/ThemeContext';
import { useUserManagement, RegisteredUser } from '@/context/UserManagementContext';

// Icons
import HomeIcon from '@mui/icons-material/Home';

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

import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AssessmentIcon from '@mui/icons-material/Assessment';
import VisibilityIcon from '@mui/icons-material/Visibility';

import BusinessIcon from '@mui/icons-material/Business';
import GroupsIcon from '@mui/icons-material/Groups';
import SecurityIcon from '@mui/icons-material/Security';
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
  { icon: <HomeIcon />, label: 'Dashboard', path: '/superadmin/dashboard', active: true },
  { icon: <CorporateFareIcon />, label: 'Organizations', path: '/superadmin/organizations' },
  { icon: <GroupsIcon />, label: 'Courses', path: '/superadmin/courses' },
  { icon: <AssessmentIcon />, label: 'Reports', path: '/superadmin/reports' },
  { icon: <SettingsIcon />, label: 'Settings', path: '/superadmin/settings' },
];

export default function SuperAdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedInstitute, setSelectedInstitute] = useState<string>('all');
  const [selectedCardFilter, setSelectedCardFilter] = useState<'all' | 'pending-orgadmin' | 'verified-orgadmin' | 'institutions'>('all');
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; type: 'approve' | 'reject'; user: RegisteredUser | null }>({
    open: false,
    type: 'approve',
    user: null,
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [viewDialog, setViewDialog] = useState<{ open: boolean; user: RegisteredUser | null }>({
    open: false,
    user: null,
  });

  const { mode, themeColors } = useThemeMode();
  const { 
    currentUser, 
    setCurrentUser,
    getAllPendingOrgAdmins,
    getAllVerifiedOrgAdmins,
    getUniqueInstitutes,
    verifyAdmin,
    rejectAdmin,
    users,
    isLoaded 
  } = useUserManagement();
  const isDark = mode === 'dark';

  // Get data - SuperAdmin only manages OrgAdmins
  const pendingOrgAdmins = getAllPendingOrgAdmins();
  const verifiedOrgAdmins = getAllVerifiedOrgAdmins();
  const institutes = getUniqueInstitutes();

  // Pending OrgAdmins - SuperAdmin only manages OrgAdmins
  const allPending = useMemo(() => {
    let combined: RegisteredUser[] = [...pendingOrgAdmins];
    
    if (selectedInstitute !== 'all') {
      combined = combined.filter(u => u.institute === selectedInstitute);
    }
    if (searchQuery) {
      combined = combined.filter(u => 
        u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.institute.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return combined.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
  }, [pendingOrgAdmins, selectedInstitute, searchQuery]);

  // Verified OrgAdmins - SuperAdmin only manages OrgAdmins
  const allVerified = useMemo(() => {
    let combined: RegisteredUser[] = [...verifiedOrgAdmins];
    
    if (selectedInstitute !== 'all') {
      combined = combined.filter(u => u.institute === selectedInstitute);
    }
    if (searchQuery) {
      combined = combined.filter(u => 
        u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.institute.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return combined.sort((a, b) => new Date(b.verifiedAt || b.registeredAt).getTime() - new Date(a.verifiedAt || a.registeredAt).getTime());
  }, [verifiedOrgAdmins, selectedInstitute, searchQuery]);

  // Statistics - SuperAdmin only manages OrgAdmins
  const stats = useMemo(() => ({
    totalPendingOrgAdmins: pendingOrgAdmins.length,
    totalVerifiedOrgAdmins: verifiedOrgAdmins.length,
    totalInstitutes: institutes.length,
    totalUsers: users.filter(u => u.role !== 'superadmin').length,
  }), [pendingOrgAdmins, verifiedOrgAdmins, institutes, users]);

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
    // Enhanced color contrasts for better visibility
    successBg: isDark ? 'rgba(34, 197, 94, 0.25)' : 'rgba(34, 197, 94, 0.15)',
    successText: isDark ? '#4ADE80' : '#16A34A',
    warningBg: isDark ? 'rgba(251, 191, 36, 0.25)' : 'rgba(251, 191, 36, 0.18)',
    warningText: isDark ? '#FCD34D' : '#CA8A04',
    errorBg: isDark ? 'rgba(248, 113, 113, 0.25)' : 'rgba(239, 68, 68, 0.15)',
    errorText: isDark ? '#FCA5A5' : '#DC2626',
    infoBg: isDark ? 'rgba(96, 165, 250, 0.25)' : 'rgba(59, 130, 246, 0.15)',
    infoText: isDark ? '#93C5FD' : '#2563EB',
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
    // Reset card filter when switching tabs
    setSelectedCardFilter('all');
  };

  const handleInstituteChange = (event: SelectChangeEvent) => {
    setSelectedInstitute(event.target.value);
  };

  // Handle stat card clicks
  const handleCardClick = (filter: 'all' | 'pending-orgadmin' | 'verified-orgadmin' | 'institutions') => {
    if (filter === 'pending-orgadmin') {
      setTabValue(0); // Switch to Pending tab
      setSelectedCardFilter(selectedCardFilter === 'pending-orgadmin' ? 'all' : 'pending-orgadmin');
    } else if (filter === 'pending-admin') {
      setTabValue(0); // Switch to Pending tab
      setSelectedCardFilter(selectedCardFilter === 'pending-admin' ? 'all' : 'pending-admin');
    } else if (filter === 'verified-orgadmin') {
      setTabValue(1); // Switch to Approved tab
      setSelectedCardFilter(selectedCardFilter === 'verified-orgadmin' ? 'all' : 'verified-orgadmin');
    } else if (filter === 'institutions') {
      // Toggle to show all institutions - reset filter
      setSelectedCardFilter(selectedCardFilter === 'institutions' ? 'all' : 'institutions');
    }
  };

  const handleApproveClick = (user: RegisteredUser) => {
    setConfirmDialog({ open: true, type: 'approve', user });
  };

  const handleRejectClick = (user: RegisteredUser) => {
    setConfirmDialog({ open: true, type: 'reject', user });
  };

  const handleConfirmAction = () => {
    if (confirmDialog.user) {
      if (confirmDialog.type === 'approve') {
        verifyAdmin(confirmDialog.user.id, currentUser?.email || 'superadmin@gmail.com');
        setSnackbar({
          open: true,
          message: `${confirmDialog.user.firstName} ${confirmDialog.user.lastName} (${confirmDialog.user.role === 'orgadmin' ? 'Organization Admin' : 'Admin'}) has been approved successfully!`,
          severity: 'success',
        });
      } else {
        rejectAdmin(confirmDialog.user.id);
        setSnackbar({
          open: true,
          message: `${confirmDialog.user.firstName} ${confirmDialog.user.lastName}'s registration has been rejected.`,
          severity: 'warning',
        });
      }
    }
    setConfirmDialog({ open: false, type: 'approve', user: null });
  };

  const handleViewUser = (user: RegisteredUser) => {
    setViewDialog({ open: true, user });
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

  const getRoleChip = (role: string) => {
    if (role === 'orgadmin') {
      return (
        <Chip
          icon={<CorporateFareIcon sx={{ fontSize: 16, color: isDark ? '#000' : '#1E40AF' }} />}
          label="Org Admin"
          size="small"
          sx={{
            backgroundColor: isDark ? '#3B82F6' : '#DBEAFE',
            color: isDark ? '#000000' : '#1E40AF',
            fontWeight: 700,
            fontSize: '0.75rem',
            border: isDark ? 'none' : '1px solid #93C5FD',
            '& .MuiChip-icon': {
              color: isDark ? '#000' : '#1E40AF',
            },
          }}
        />
      );
    }
    return (
      <Chip
        icon={<SupervisorAccountIcon sx={{ fontSize: 16, color: isDark ? '#000' : '#7C2D12' }} />}
        label="Admin"
        size="small"
        sx={{
          backgroundColor: isDark ? '#F97316' : '#FFEDD5',
          color: isDark ? '#000000' : '#7C2D12',
          fontWeight: 700,
          fontSize: '0.75rem',
          border: isDark ? 'none' : '1px solid #FDBA74',
          '& .MuiChip-icon': {
            color: isDark ? '#000' : '#7C2D12',
          },
        }}
      />
    );
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
          width: 280,
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
                width: 50,
                height: 50,
                borderRadius: '14px',
                background: `linear-gradient(135deg, ${colors.accent} 0%, ${themeColors.secondary} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              }}
            >
              <SecurityIcon sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: colors.headerText, fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.2 }}>
                Super Admin
              </Typography>
              <Typography variant="caption" sx={{ color: colors.headerTextMuted, fontSize: '0.7rem' }}>
                System Control Panel
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
              {currentUser?.firstName?.[0] || 'S'}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ color: colors.headerText, fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser?.firstName} {currentUser?.lastName}
              </Typography>
              <Typography sx={{ color: colors.headerTextMuted, fontSize: '0.75rem' }}>
                Super Admin
              </Typography>
            </Box>
            <IconButton size="small" onClick={handleLogout} sx={{ color: colors.headerTextSecondary }}>
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* ==================== MAIN CONTENT ==================== */}
      <Box sx={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column' }}>
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
              🛡️ Super Admin Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              Manage Organization Admins & Admins across all institutions
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ThemeSwitcher />
            <Badge badgeContent={stats.totalPendingOrgAdmins + stats.totalPendingAdmins} color="error">
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
          {/* Statistics Cards - Only OrgAdmin Management */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, mb: 4 }}>
            {/* Pending Org Admins */}
            <Card
              onClick={() => handleCardClick('pending-orgadmin')}
              sx={{
                p: 3,
                backgroundColor: colors.cardBg,
                border: selectedCardFilter === 'pending-orgadmin' 
                  ? `2px solid ${colors.warningText}` 
                  : `1px solid ${colors.cardBorder}`,
                borderRadius: 3,
                animation: `${fadeInUp} 0.5s ease`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: selectedCardFilter === 'pending-orgadmin' ? 'scale(1.02)' : 'scale(1)',
                boxShadow: selectedCardFilter === 'pending-orgadmin' 
                  ? `0 4px 20px ${isDark ? 'rgba(251, 191, 36, 0.3)' : 'rgba(251, 191, 36, 0.25)'}` 
                  : 'none',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: `0 4px 20px ${isDark ? 'rgba(251, 191, 36, 0.2)' : 'rgba(251, 191, 36, 0.15)'}`,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ color: colors.textMuted, fontSize: '0.85rem', mb: 0.5 }}>
                    Pending Org Admins
                  </Typography>
                  <Typography variant="h3" sx={{ color: colors.warningText, fontWeight: 700 }}>
                    {stats.totalPendingOrgAdmins}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '16px',
                    backgroundColor: colors.warningBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CorporateFareIcon sx={{ color: colors.warningText, fontSize: 28 }} />
                </Box>
              </Box>
            </Card>

            {/* Verified Org Admins */}
            <Card
              onClick={() => handleCardClick('verified-orgadmin')}
              sx={{
                p: 3,
                backgroundColor: colors.cardBg,
                border: selectedCardFilter === 'verified-orgadmin' 
                  ? `2px solid ${colors.successText}` 
                  : `1px solid ${colors.cardBorder}`,
                borderRadius: 3,
                animation: `${fadeInUp} 0.5s ease 0.1s`,
                animationFillMode: 'backwards',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: selectedCardFilter === 'verified-orgadmin' ? 'scale(1.02)' : 'scale(1)',
                boxShadow: selectedCardFilter === 'verified-orgadmin' 
                  ? `0 4px 20px ${isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.25)'}` 
                  : 'none',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: `0 4px 20px ${isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.15)'}`,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ color: colors.textMuted, fontSize: '0.85rem', mb: 0.5 }}>
                    Verified Org Admins
                  </Typography>
                  <Typography variant="h3" sx={{ color: colors.successText, fontWeight: 700 }}>
                    {stats.totalVerifiedOrgAdmins}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '16px',
                    backgroundColor: colors.successBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <VerifiedUserIcon sx={{ color: colors.successText, fontSize: 28 }} />
                </Box>
              </Box>
            </Card>

            {/* Total Institutions */}
            <Card
              onClick={() => handleCardClick('institutions')}
              sx={{
                p: 3,
                backgroundColor: colors.cardBg,
                border: selectedCardFilter === 'institutions' 
                  ? `2px solid ${colors.infoText}` 
                  : `1px solid ${colors.cardBorder}`,
                borderRadius: 3,
                animation: `${fadeInUp} 0.5s ease 0.2s`,
                animationFillMode: 'backwards',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: selectedCardFilter === 'institutions' ? 'scale(1.02)' : 'scale(1)',
                boxShadow: selectedCardFilter === 'institutions' 
                  ? `0 4px 20px ${isDark ? 'rgba(96, 165, 250, 0.3)' : 'rgba(59, 130, 246, 0.25)'}` 
                  : 'none',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: `0 4px 20px ${isDark ? 'rgba(96, 165, 250, 0.2)' : 'rgba(59, 130, 246, 0.15)'}`,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ color: colors.textMuted, fontSize: '0.85rem', mb: 0.5 }}>
                    Total Institutions
                  </Typography>
                  <Typography variant="h3" sx={{ color: colors.infoText, fontWeight: 700 }}>
                    {stats.totalInstitutes}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '16px',
                    backgroundColor: colors.infoBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BusinessIcon sx={{ color: colors.infoText, fontSize: 28 }} />
                </Box>
              </Box>
            </Card>
          </Box>

          {/* Management Section */}
          <Card
            sx={{
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: 3,
              overflow: 'hidden',
              animation: `${fadeInUp} 0.5s ease 0.4s`,
              animationFillMode: 'backwards',
            }}
          >
            {/* Tabs & Filters */}
            <Box sx={{ borderBottom: `1px solid ${colors.cardBorder}`, px: 3, pt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  sx={{
                    '& .MuiTab-root': {
                      color: colors.textSecondary,
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      minHeight: 56,
                    },
                    '& .Mui-selected': {
                      color: `${colors.accent} !important`,
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: colors.accent,
                      height: 3,
                      borderRadius: '3px 3px 0 0',
                    },
                  }}
                >
                  <Tab 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <PendingIcon sx={{ fontSize: 22, color: colors.warningText }} />
                        <Typography component="span" sx={{ fontWeight: 600, color: 'inherit' }}>
                          Pending Approvals
                        </Typography>
                        <Chip 
                          label={allPending.length} 
                          size="small" 
                          sx={{ 
                            backgroundColor: isDark ? '#F59E0B' : '#FEF3C7',
                            color: isDark ? '#000000' : '#92400E',
                            fontWeight: 700,
                            height: 24,
                            minWidth: 32,
                            fontSize: '0.85rem',
                            border: isDark ? 'none' : '1px solid #FCD34D',
                          }} 
                        />
                      </Box>
                    } 
                  />
                  <Tab 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <VerifiedUserIcon sx={{ fontSize: 22, color: colors.successText }} />
                        <Typography component="span" sx={{ fontWeight: 600, color: 'inherit' }}>
                          Approved Users
                        </Typography>
                        <Chip 
                          label={allVerified.length} 
                          size="small" 
                          sx={{ 
                            backgroundColor: isDark ? '#22C55E' : '#DCFCE7',
                            color: isDark ? '#000000' : '#166534',
                            fontWeight: 700,
                            height: 24,
                            minWidth: 32,
                            fontSize: '0.85rem',
                            border: isDark ? 'none' : '1px solid #86EFAC',
                          }} 
                        />
                      </Box>
                    } 
                  />
                </Tabs>
              </Box>

              {/* Search and Filter */}
              <Box sx={{ display: 'flex', gap: 2, pb: 2 }}>
                <TextField
                  placeholder="Search by name, email, or institution..."
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    flex: 1,
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
                <FormControl size="small" sx={{ minWidth: 250 }}>
                  <InputLabel sx={{ color: colors.textSecondary }}>Filter by Institution</InputLabel>
                  <Select
                    value={selectedInstitute}
                    onChange={handleInstituteChange}
                    label="Filter by Institution"
                    sx={{
                      backgroundColor: colors.inputBg,
                      borderRadius: 2,
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.inputBorder },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.accent },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.accent },
                      '& .MuiSelect-select': { color: colors.textPrimary },
                    }}
                  >
                    <MenuItem value="all">All Institutions</MenuItem>
                    {institutes.map((inst) => (
                      <MenuItem key={inst} value={inst}>{inst}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Active Filter Indicator */}
              {selectedCardFilter !== 'all' && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 2 }}>
                  <Typography sx={{ color: colors.textMuted, fontSize: '0.85rem' }}>
                    Active Filter:
                  </Typography>
                  <Chip
                    label={
                      selectedCardFilter === 'pending-orgadmin' ? 'Pending Org Admins' :
                      selectedCardFilter === 'verified-orgadmin' ? 'Verified Org Admins' :
                      'Institutions'
                    }
                    size="small"
                    onDelete={() => setSelectedCardFilter('all')}
                    sx={{
                      backgroundColor: 
                        selectedCardFilter === 'pending-orgadmin' ? (isDark ? '#F59E0B' : '#FEF3C7') :
                        selectedCardFilter === 'verified-orgadmin' ? (isDark ? '#22C55E' : '#DCFCE7') :
                        (isDark ? '#3B82F6' : '#DBEAFE'),
                      color: 
                        selectedCardFilter === 'pending-orgadmin' ? (isDark ? '#000' : '#92400E') :
                        selectedCardFilter === 'verified-orgadmin' ? (isDark ? '#000' : '#166534') :
                        (isDark ? '#000' : '#1E40AF'),
                      fontWeight: 600,
                      '& .MuiChip-deleteIcon': {
                        color: 'inherit',
                        '&:hover': { color: 'inherit', opacity: 0.7 },
                      },
                    }}
                  />
                  <Button
                    size="small"
                    onClick={() => setSelectedCardFilter('all')}
                    sx={{ 
                      color: colors.textSecondary, 
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      '&:hover': { color: colors.accent },
                    }}
                  >
                    Clear Filter
                  </Button>
                </Box>
              )}
            </Box>

            {/* Table Content */}
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: colors.cardBg, color: colors.textSecondary, fontWeight: 700, borderBottom: `1px solid ${colors.cardBorder}` }}>
                      User
                    </TableCell>
                    <TableCell sx={{ backgroundColor: colors.cardBg, color: colors.textSecondary, fontWeight: 700, borderBottom: `1px solid ${colors.cardBorder}` }}>
                      Role
                    </TableCell>
                    <TableCell sx={{ backgroundColor: colors.cardBg, color: colors.textSecondary, fontWeight: 700, borderBottom: `1px solid ${colors.cardBorder}` }}>
                      Institution
                    </TableCell>
                    <TableCell sx={{ backgroundColor: colors.cardBg, color: colors.textSecondary, fontWeight: 700, borderBottom: `1px solid ${colors.cardBorder}` }}>
                      Department
                    </TableCell>
                    <TableCell sx={{ backgroundColor: colors.cardBg, color: colors.textSecondary, fontWeight: 700, borderBottom: `1px solid ${colors.cardBorder}` }}>
                      {tabValue === 0 ? 'Registered On' : 'Approved On'}
                    </TableCell>
                    <TableCell sx={{ backgroundColor: colors.cardBg, color: colors.textSecondary, fontWeight: 700, borderBottom: `1px solid ${colors.cardBorder}` }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ backgroundColor: colors.cardBg, color: colors.textSecondary, fontWeight: 700, borderBottom: `1px solid ${colors.cardBorder}`, textAlign: 'center' }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(tabValue === 0 ? allPending : allVerified).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: 'center', py: 8, color: colors.textMuted }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          {tabValue === 0 ? (
                            <>
                              <CheckCircleIcon sx={{ fontSize: 60, color: colors.successText, opacity: 0.5 }} />
                              <Typography variant="h6" sx={{ color: colors.textSecondary }}>
                                No Pending Approvals
                              </Typography>
                              <Typography sx={{ color: colors.textMuted }}>
                                All organization admins and admins have been reviewed.
                              </Typography>
                            </>
                          ) : (
                            <>
                              <GroupsIcon sx={{ fontSize: 60, color: colors.infoText, opacity: 0.5 }} />
                              <Typography variant="h6" sx={{ color: colors.textSecondary }}>
                                No Approved Users Yet
                              </Typography>
                              <Typography sx={{ color: colors.textMuted }}>
                                Approved organization admins and admins will appear here.
                              </Typography>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    (tabValue === 0 ? allPending : allVerified).map((user) => (
                      <TableRow
                        key={user.id}
                        sx={{
                          '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' },
                          transition: 'background-color 0.2s ease',
                        }}
                      >
                        <TableCell sx={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              sx={{
                                width: 42,
                                height: 42,
                                bgcolor: user.role === 'orgadmin' ? colors.infoText : colors.warningText,
                                fontWeight: 700,
                              }}
                            >
                              {user.firstName[0]}{user.lastName[0]}
                            </Avatar>
                            <Box>
                              <Typography sx={{ color: colors.textPrimary, fontWeight: 600, fontSize: '0.95rem' }}>
                                {user.firstName} {user.lastName}
                              </Typography>
                              <Typography sx={{ color: colors.textMuted, fontSize: '0.8rem' }}>
                                {user.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                          {getRoleChip(user.role)}
                        </TableCell>
                        <TableCell sx={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                          <Typography sx={{ color: colors.textPrimary, fontSize: '0.9rem' }}>
                            {user.institute}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                          <Typography sx={{ color: colors.textSecondary, fontSize: '0.9rem' }}>
                            {user.department}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                          <Typography sx={{ color: colors.textSecondary, fontSize: '0.85rem' }}>
                            {formatDate(tabValue === 0 ? user.registeredAt : (user.verifiedAt || user.registeredAt))}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                          {tabValue === 0 ? (
                            <Chip
                              icon={<PendingIcon sx={{ fontSize: 16, color: isDark ? '#000' : '#92400E' }} />}
                              label="Pending"
                              size="small"
                              sx={{
                                backgroundColor: isDark ? '#F59E0B' : '#FEF3C7',
                                color: isDark ? '#000000' : '#92400E',
                                fontWeight: 700,
                                border: isDark ? 'none' : '1px solid #FCD34D',
                                '& .MuiChip-icon': {
                                  color: isDark ? '#000' : '#92400E',
                                },
                              }}
                            />
                          ) : (
                            <Chip
                              icon={<CheckCircleIcon sx={{ fontSize: 16, color: isDark ? '#000' : '#166534' }} />}
                              label="Approved"
                              size="small"
                              sx={{
                                backgroundColor: isDark ? '#22C55E' : '#DCFCE7',
                                color: isDark ? '#000000' : '#166534',
                                fontWeight: 700,
                                border: isDark ? 'none' : '1px solid #86EFAC',
                                '& .MuiChip-icon': {
                                  color: isDark ? '#000' : '#166534',
                                },
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell sx={{ borderBottom: `1px solid ${colors.cardBorder}`, textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => handleViewUser(user)}
                                sx={{
                                  color: colors.infoText,
                                  backgroundColor: colors.infoBg,
                                  '&:hover': { backgroundColor: colors.infoText, color: '#fff' },
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {tabValue === 0 && (
                              <>
                                <Tooltip title="Approve">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleApproveClick(user)}
                                    sx={{
                                      color: colors.successText,
                                      backgroundColor: colors.successBg,
                                      '&:hover': { backgroundColor: colors.successText, color: '#fff' },
                                    }}
                                  >
                                    <CheckCircleIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Reject">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleRejectClick(user)}
                                    sx={{
                                      color: colors.errorText,
                                      backgroundColor: colors.errorBg,
                                      '&:hover': { backgroundColor: colors.errorText, color: '#fff' },
                                    }}
                                  >
                                    <CancelIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                            {tabValue === 1 && (
                              <Tooltip title="Delete User">
                                <IconButton
                                  size="small"
                                  onClick={() => handleRejectClick(user)}
                                  sx={{
                                    color: colors.errorText,
                                    backgroundColor: colors.errorBg,
                                    '&:hover': { backgroundColor: colors.errorText, color: '#fff' },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      </Box>

      {/* ==================== DIALOGS ==================== */}
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        PaperProps={{
          sx: {
            backgroundColor: colors.cardBg,
            borderRadius: 3,
            border: `1px solid ${colors.cardBorder}`,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ color: colors.textPrimary, fontWeight: 700 }}>
          {confirmDialog.type === 'approve' ? '✅ Approve Registration' : '❌ Reject Registration'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: colors.textSecondary }}>
            {confirmDialog.type === 'approve'
              ? `Are you sure you want to approve ${confirmDialog.user?.firstName} ${confirmDialog.user?.lastName} as ${confirmDialog.user?.role === 'orgadmin' ? 'an Organization Admin' : 'an Admin'}? They will gain full access to their dashboard and management features.`
              : `Are you sure you want to reject ${confirmDialog.user?.firstName} ${confirmDialog.user?.lastName}'s registration? This action cannot be undone and they will need to register again.`
            }
          </DialogContentText>
          {confirmDialog.user && (
            <Box sx={{ mt: 2, p: 2, borderRadius: 2, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}>
              <Typography sx={{ color: colors.textMuted, fontSize: '0.85rem', mb: 1 }}>User Details:</Typography>
              <Typography sx={{ color: colors.textPrimary, fontSize: '0.9rem' }}>
                <strong>Email:</strong> {confirmDialog.user.email}
              </Typography>
              <Typography sx={{ color: colors.textPrimary, fontSize: '0.9rem' }}>
                <strong>Institution:</strong> {confirmDialog.user.institute}
              </Typography>
              <Typography sx={{ color: colors.textPrimary, fontSize: '0.9rem' }}>
                <strong>Role:</strong> {confirmDialog.user.role === 'orgadmin' ? 'Organization Admin' : 'Admin'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
            sx={{ color: colors.textSecondary }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            sx={{
              backgroundColor: confirmDialog.type === 'approve' ? colors.successText : colors.errorText,
              '&:hover': {
                backgroundColor: confirmDialog.type === 'approve' ? '#059669' : '#DC2626',
              },
            }}
          >
            {confirmDialog.type === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View User Dialog */}
      <Dialog
        open={viewDialog.open}
        onClose={() => setViewDialog({ open: false, user: null })}
        PaperProps={{
          sx: {
            backgroundColor: colors.cardBg,
            borderRadius: 3,
            border: `1px solid ${colors.cardBorder}`,
            minWidth: 500,
          },
        }}
      >
        <DialogTitle sx={{ color: colors.textPrimary, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 50,
              height: 50,
              bgcolor: viewDialog.user?.role === 'orgadmin' ? colors.infoText : colors.warningText,
              fontWeight: 700,
            }}
          >
            {viewDialog.user?.firstName?.[0]}{viewDialog.user?.lastName?.[0]}
          </Avatar>
          {viewDialog.user?.firstName} {viewDialog.user?.lastName}
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: colors.cardBorder }}>
          {viewDialog.user && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography sx={{ color: colors.textMuted, fontSize: '0.8rem', mb: 0.5 }}>Email</Typography>
                  <Typography sx={{ color: colors.textPrimary, fontWeight: 500 }}>{viewDialog.user.email}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: colors.textMuted, fontSize: '0.8rem', mb: 0.5 }}>Role</Typography>
                  {getRoleChip(viewDialog.user.role)}
                </Box>
                <Box>
                  <Typography sx={{ color: colors.textMuted, fontSize: '0.8rem', mb: 0.5 }}>Institution</Typography>
                  <Typography sx={{ color: colors.textPrimary, fontWeight: 500 }}>{viewDialog.user.institute}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: colors.textMuted, fontSize: '0.8rem', mb: 0.5 }}>Department</Typography>
                  <Typography sx={{ color: colors.textPrimary, fontWeight: 500 }}>{viewDialog.user.department}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: colors.textMuted, fontSize: '0.8rem', mb: 0.5 }}>Admin ID</Typography>
                  <Typography sx={{ color: colors.textPrimary, fontWeight: 500 }}>{viewDialog.user.adminId || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: colors.textMuted, fontSize: '0.8rem', mb: 0.5 }}>Registered On</Typography>
                  <Typography sx={{ color: colors.textPrimary, fontWeight: 500 }}>{formatDate(viewDialog.user.registeredAt)}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: colors.textMuted, fontSize: '0.8rem', mb: 0.5 }}>Status</Typography>
                  {viewDialog.user.isVerified ? (
                    <Chip icon={<CheckCircleIcon sx={{ fontSize: 16 }} />} label="Approved" size="small" sx={{ backgroundColor: colors.successBg, color: colors.successText, fontWeight: 600 }} />
                  ) : (
                    <Chip icon={<PendingIcon sx={{ fontSize: 16 }} />} label="Pending" size="small" sx={{ backgroundColor: colors.warningBg, color: colors.warningText, fontWeight: 600 }} />
                  )}
                </Box>
                {viewDialog.user.isVerified && viewDialog.user.verifiedAt && (
                  <Box>
                    <Typography sx={{ color: colors.textMuted, fontSize: '0.8rem', mb: 0.5 }}>Approved On</Typography>
                    <Typography sx={{ color: colors.textPrimary, fontWeight: 500 }}>{formatDate(viewDialog.user.verifiedAt)}</Typography>
                  </Box>
                )}
              </Box>
              {viewDialog.user.isVerified && viewDialog.user.verifiedBy && (
                <Box sx={{ mt: 1, p: 2, borderRadius: 2, backgroundColor: colors.successBg }}>
                  <Typography sx={{ color: colors.successText, fontSize: '0.9rem' }}>
                    ✅ Approved by: <strong>{viewDialog.user.verifiedBy}</strong>
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setViewDialog({ open: false, user: null })} sx={{ color: colors.textSecondary }}>
            Close
          </Button>
          {viewDialog.user && !viewDialog.user.isVerified && (
            <>
              <Button
                onClick={() => {
                  setViewDialog({ open: false, user: null });
                  handleApproveClick(viewDialog.user!);
                }}
                variant="contained"
                sx={{ backgroundColor: colors.successText }}
              >
                Approve
              </Button>
              <Button
                onClick={() => {
                  setViewDialog({ open: false, user: null });
                  handleRejectClick(viewDialog.user!);
                }}
                variant="contained"
                sx={{ backgroundColor: colors.errorText }}
              >
                Reject
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

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
        <MenuItem onClick={handleLogout} sx={{ color: colors.errorText }}>
          <ListItemIcon><LogoutIcon sx={{ color: colors.errorText }} /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
