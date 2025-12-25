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
  DialogActions,
  Breadcrumbs,
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
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AssessmentIcon from '@mui/icons-material/Assessment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BusinessIcon from '@mui/icons-material/Business';
import GroupsIcon from '@mui/icons-material/Groups';
import SecurityIcon from '@mui/icons-material/Security';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PendingIcon from '@mui/icons-material/Pending';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SchoolIcon from '@mui/icons-material/School';
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
  { icon: <HomeIcon />, label: 'Dashboard', path: '/superadmin/dashboard', active: false },
  { icon: <CorporateFareIcon />, label: 'Organizations', path: '/superadmin/organizations', active: true },
  { icon: <GroupsIcon />, label: 'Courses', path: '/superadmin/courses', active: false },
  { icon: <AssessmentIcon />, label: 'Reports', path: '/superadmin/reports', active: false },
  { icon: <SettingsIcon />, label: 'Settings', path: '/superadmin/settings', active: false },
];

interface OrganizationData {
  name: string;
  orgAdmins: RegisteredUser[];
  admins: RegisteredUser[];
  pendingOrgAdmins: RegisteredUser[];
  pendingAdmins: RegisteredUser[];
  totalUsers: number;
}

export default function OrganizationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
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
    getAllPendingAdmins,
    getAllVerifiedAdmins,
    getUniqueInstitutes,
    users,
    isLoaded 
  } = useUserManagement();
  const isDark = mode === 'dark';

  // Get all data
  const pendingOrgAdmins = getAllPendingOrgAdmins();
  const verifiedOrgAdmins = getAllVerifiedOrgAdmins();
  const pendingAdmins = getAllPendingAdmins();
  const verifiedAdmins = getAllVerifiedAdmins();
  const institutes = getUniqueInstitutes();

  // Build organization data
  const organizationsData = useMemo(() => {
    const orgMap = new Map<string, OrganizationData>();

    institutes.forEach(inst => {
      orgMap.set(inst, {
        name: inst,
        orgAdmins: verifiedOrgAdmins.filter(u => u.institute === inst),
        admins: verifiedAdmins.filter(u => u.institute === inst),
        pendingOrgAdmins: pendingOrgAdmins.filter(u => u.institute === inst),
        pendingAdmins: pendingAdmins.filter(u => u.institute === inst),
        totalUsers: users.filter(u => u.institute === inst && u.role !== 'superadmin').length,
      });
    });

    return Array.from(orgMap.values());
  }, [institutes, verifiedOrgAdmins, verifiedAdmins, pendingOrgAdmins, pendingAdmins, users]);

  // Filter organizations based on search
  const filteredOrganizations = useMemo(() => {
    if (!searchQuery) return organizationsData;
    return organizationsData.filter(org => 
      org.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [organizationsData, searchQuery]);

  // Get selected organization data
  const selectedOrgData = useMemo(() => {
    if (!selectedOrg) return null;
    return organizationsData.find(org => org.name === selectedOrg) || null;
  }, [selectedOrg, organizationsData]);

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
            '& .MuiChip-icon': { color: isDark ? '#000' : '#1E40AF' },
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
          '& .MuiChip-icon': { color: isDark ? '#000' : '#7C2D12' },
        }}
      />
    );
  };

  const getStatusChip = (isVerified: boolean) => {
    if (isVerified) {
      return (
        <Chip
          icon={<VerifiedUserIcon sx={{ fontSize: 16, color: isDark ? '#000' : '#166534' }} />}
          label="Verified"
          size="small"
          sx={{
            backgroundColor: isDark ? '#22C55E' : '#DCFCE7',
            color: isDark ? '#000000' : '#166534',
            fontWeight: 700,
            border: isDark ? 'none' : '1px solid #86EFAC',
            '& .MuiChip-icon': { color: isDark ? '#000' : '#166534' },
          }}
        />
      );
    }
    return (
      <Chip
        icon={<PendingIcon sx={{ fontSize: 16, color: isDark ? '#000' : '#92400E' }} />}
        label="Pending"
        size="small"
        sx={{
          backgroundColor: isDark ? '#F59E0B' : '#FEF3C7',
          color: isDark ? '#000000' : '#92400E',
          fontWeight: 700,
          border: isDark ? 'none' : '1px solid #FCD34D',
          '& .MuiChip-icon': { color: isDark ? '#000' : '#92400E' },
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
                sx={{ '& .MuiTypography-root': { color: item.active ? colors.headerText : colors.headerTextSecondary, fontWeight: item.active ? 600 : 400 } }}
              />
            </ListItem>
          ))}
        </List>

        {/* User section at bottom */}
        <Box sx={{ p: 2, borderTop: `1px solid ${colors.sidebarBorder}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
            <Avatar sx={{ width: 40, height: 40, bgcolor: colors.accent }}>
              {currentUser?.firstName?.[0] || 'S'}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ color: colors.headerText, fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
      <Box sx={{ flex: 1, ml: '280px', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            px: 4,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${colors.cardBorder}`,
            backgroundColor: colors.cardBg,
          }}
        >
          <Box>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" sx={{ color: colors.textMuted }} />}>
              <Link href="/superadmin/dashboard" style={{ textDecoration: 'none' }}>
                <Typography sx={{ color: colors.textSecondary, fontSize: '0.9rem', '&:hover': { color: colors.accent } }}>
                  Dashboard
                </Typography>
              </Link>
              <Typography sx={{ color: selectedOrg ? colors.textSecondary : colors.textPrimary, fontSize: '0.9rem', fontWeight: selectedOrg ? 400 : 600 }}>
                Organizations
              </Typography>
              {selectedOrg && (
                <Typography sx={{ color: colors.textPrimary, fontSize: '0.9rem', fontWeight: 600 }}>
                  {selectedOrg}
                </Typography>
              )}
            </Breadcrumbs>
            <Typography variant="h5" sx={{ color: colors.textPrimary, fontWeight: 700, mt: 0.5 }}>
              {selectedOrg ? selectedOrg : '🏢 Organizations'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ThemeSwitcher />
            <Badge badgeContent={pendingOrgAdmins.length + pendingAdmins.length} color="error">
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

        {/* Profile Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem onClick={handleClose}>
            <PersonIcon sx={{ mr: 1 }} /> Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} /> Logout
          </MenuItem>
        </Menu>

        {/* Main Content Area */}
        <Box sx={{ p: 4, flex: 1 }}>
          {!selectedOrg ? (
            // Organizations List View
            <>
              {/* Search Bar */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  placeholder="Search organizations..."
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    width: 400,
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
              </Box>

              {/* Stats Overview */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, mb: 4 }}>
                <Card
                  sx={{
                    p: 3,
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.cardBorder}`,
                    borderRadius: 3,
                    animation: `${fadeInUp} 0.5s ease`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography sx={{ color: colors.textMuted, fontSize: '0.85rem', mb: 0.5 }}>
                        Total Organizations
                      </Typography>
                      <Typography variant="h3" sx={{ color: colors.infoText, fontWeight: 700 }}>
                        {institutes.length}
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

                <Card
                  sx={{
                    p: 3,
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.cardBorder}`,
                    borderRadius: 3,
                    animation: `${fadeInUp} 0.5s ease 0.1s`,
                    animationFillMode: 'backwards',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography sx={{ color: colors.textMuted, fontSize: '0.85rem', mb: 0.5 }}>
                        Total Org Admins
                      </Typography>
                      <Typography variant="h3" sx={{ color: colors.successText, fontWeight: 700 }}>
                        {verifiedOrgAdmins.length + pendingOrgAdmins.length}
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
                      <CorporateFareIcon sx={{ color: colors.successText, fontSize: 28 }} />
                    </Box>
                  </Box>
                </Card>

                <Card
                  sx={{
                    p: 3,
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.cardBorder}`,
                    borderRadius: 3,
                    animation: `${fadeInUp} 0.5s ease 0.2s`,
                    animationFillMode: 'backwards',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography sx={{ color: colors.textMuted, fontSize: '0.85rem', mb: 0.5 }}>
                        Total Admins
                      </Typography>
                      <Typography variant="h3" sx={{ color: colors.warningText, fontWeight: 700 }}>
                        {verifiedAdmins.length + pendingAdmins.length}
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
                      <SupervisorAccountIcon sx={{ color: colors.warningText, fontSize: 28 }} />
                    </Box>
                  </Box>
                </Card>
              </Box>

              {/* Organizations Grid */}
              <Typography variant="h6" sx={{ color: colors.textPrimary, fontWeight: 600, mb: 2 }}>
                Registered Organizations ({filteredOrganizations.length})
              </Typography>

              {filteredOrganizations.length === 0 ? (
                <Card
                  sx={{
                    p: 6,
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.cardBorder}`,
                    borderRadius: 3,
                    textAlign: 'center',
                  }}
                >
                  <BusinessIcon sx={{ fontSize: 60, color: colors.textMuted, mb: 2 }} />
                  <Typography variant="h6" sx={{ color: colors.textSecondary, mb: 1 }}>
                    No Organizations Found
                  </Typography>
                  <Typography sx={{ color: colors.textMuted }}>
                    {searchQuery ? 'No organizations match your search.' : 'Organizations will appear here once users register.'}
                  </Typography>
                </Card>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 3 }}>
                  {filteredOrganizations.map((org, index) => (
                    <Card
                      key={org.name}
                      onClick={() => setSelectedOrg(org.name)}
                      sx={{
                        p: 3,
                        backgroundColor: colors.cardBg,
                        border: `1px solid ${colors.cardBorder}`,
                        borderRadius: 3,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        animation: `${fadeInUp} 0.5s ease ${index * 0.05}s`,
                        animationFillMode: 'backwards',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 8px 30px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.12)'}`,
                          borderColor: colors.accent,
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: '16px',
                            background: `linear-gradient(135deg, ${colors.accent}30 0%, ${themeColors.secondary}30 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <SchoolIcon sx={{ color: colors.accent, fontSize: 28 }} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              color: colors.textPrimary,
                              fontWeight: 700,
                              fontSize: '1.1rem',
                              mb: 0.5,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {org.name}
                          </Typography>
                          <Typography sx={{ color: colors.textMuted, fontSize: '0.85rem' }}>
                            {org.totalUsers} total user{org.totalUsers !== 1 ? 's' : ''}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ borderColor: colors.cardBorder, my: 2 }} />

                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        <Box sx={{ textAlign: 'center', p: 1.5, borderRadius: 2, backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)' }}>
                          <Typography sx={{ color: colors.infoText, fontWeight: 700, fontSize: '1.5rem' }}>
                            {org.orgAdmins.length}
                          </Typography>
                          <Typography sx={{ color: colors.textMuted, fontSize: '0.75rem' }}>
                            Org Admins
                          </Typography>
                          {org.pendingOrgAdmins.length > 0 && (
                            <Chip
                              label={`+${org.pendingOrgAdmins.length} pending`}
                              size="small"
                              sx={{
                                mt: 0.5,
                                height: 20,
                                fontSize: '0.65rem',
                                backgroundColor: colors.warningBg,
                                color: colors.warningText,
                              }}
                            />
                          )}
                        </Box>
                        <Box sx={{ textAlign: 'center', p: 1.5, borderRadius: 2, backgroundColor: isDark ? 'rgba(249, 115, 22, 0.1)' : 'rgba(249, 115, 22, 0.05)' }}>
                          <Typography sx={{ color: colors.warningText, fontWeight: 700, fontSize: '1.5rem' }}>
                            {org.admins.length}
                          </Typography>
                          <Typography sx={{ color: colors.textMuted, fontSize: '0.75rem' }}>
                            Admins
                          </Typography>
                          {org.pendingAdmins.length > 0 && (
                            <Chip
                              label={`+${org.pendingAdmins.length} pending`}
                              size="small"
                              sx={{
                                mt: 0.5,
                                height: 20,
                                fontSize: '0.65rem',
                                backgroundColor: colors.warningBg,
                                color: colors.warningText,
                              }}
                            />
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          size="small"
                          endIcon={<NavigateNextIcon />}
                          sx={{
                            color: colors.accent,
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': { backgroundColor: `${colors.accent}15` },
                          }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </Card>
                  ))}
                </Box>
              )}
            </>
          ) : (
            // Organization Detail View
            <>
              {/* Back Button */}
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => setSelectedOrg(null)}
                sx={{
                  mb: 3,
                  color: colors.textSecondary,
                  textTransform: 'none',
                  '&:hover': { backgroundColor: `${colors.accent}15`, color: colors.accent },
                }}
              >
                Back to Organizations
              </Button>

              {/* Organization Stats */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3, mb: 4 }}>
                <Card
                  sx={{
                    p: 3,
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.cardBorder}`,
                    borderRadius: 3,
                  }}
                >
                  <Typography sx={{ color: colors.textMuted, fontSize: '0.85rem', mb: 0.5 }}>
                    Verified Org Admins
                  </Typography>
                  <Typography variant="h3" sx={{ color: colors.infoText, fontWeight: 700 }}>
                    {selectedOrgData?.orgAdmins.length || 0}
                  </Typography>
                </Card>
                <Card
                  sx={{
                    p: 3,
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.cardBorder}`,
                    borderRadius: 3,
                  }}
                >
                  <Typography sx={{ color: colors.textMuted, fontSize: '0.85rem', mb: 0.5 }}>
                    Pending Org Admins
                  </Typography>
                  <Typography variant="h3" sx={{ color: colors.warningText, fontWeight: 700 }}>
                    {selectedOrgData?.pendingOrgAdmins.length || 0}
                  </Typography>
                </Card>
                <Card
                  sx={{
                    p: 3,
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.cardBorder}`,
                    borderRadius: 3,
                  }}
                >
                  <Typography sx={{ color: colors.textMuted, fontSize: '0.85rem', mb: 0.5 }}>
                    Verified Admins
                  </Typography>
                  <Typography variant="h3" sx={{ color: colors.successText, fontWeight: 700 }}>
                    {selectedOrgData?.admins.length || 0}
                  </Typography>
                </Card>
                <Card
                  sx={{
                    p: 3,
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.cardBorder}`,
                    borderRadius: 3,
                  }}
                >
                  <Typography sx={{ color: colors.textMuted, fontSize: '0.85rem', mb: 0.5 }}>
                    Pending Admins
                  </Typography>
                  <Typography variant="h3" sx={{ color: colors.errorText, fontWeight: 700 }}>
                    {selectedOrgData?.pendingAdmins.length || 0}
                  </Typography>
                </Card>
              </Box>

              {/* Org Admins Section */}
              <Card
                sx={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: 3,
                  mb: 3,
                  overflow: 'hidden',
                }}
              >
                <Box sx={{ p: 3, borderBottom: `1px solid ${colors.cardBorder}`, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CorporateFareIcon sx={{ color: colors.infoText }} />
                  <Typography variant="h6" sx={{ color: colors.textPrimary, fontWeight: 600 }}>
                    Organization Admins
                  </Typography>
                  <Chip
                    label={`${(selectedOrgData?.orgAdmins.length || 0) + (selectedOrgData?.pendingOrgAdmins.length || 0)} total`}
                    size="small"
                    sx={{ backgroundColor: colors.infoBg, color: colors.infoText, fontWeight: 600 }}
                  />
                </Box>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ backgroundColor: colors.cardBg, color: colors.textSecondary, fontWeight: 700, borderBottom: `1px solid ${colors.cardBorder}` }}>
                          User
                        </TableCell>
                        <TableCell sx={{ backgroundColor: colors.cardBg, color: colors.textSecondary, fontWeight: 700, borderBottom: `1px solid ${colors.cardBorder}` }}>
                          Department
                        </TableCell>
                        <TableCell sx={{ backgroundColor: colors.cardBg, color: colors.textSecondary, fontWeight: 700, borderBottom: `1px solid ${colors.cardBorder}` }}>
                          Status
                        </TableCell>
                        <TableCell sx={{ backgroundColor: colors.cardBg, color: colors.textSecondary, fontWeight: 700, borderBottom: `1px solid ${colors.cardBorder}` }}>
                          Registered
                        </TableCell>
                        <TableCell sx={{ backgroundColor: colors.cardBg, color: colors.textSecondary, fontWeight: 700, borderBottom: `1px solid ${colors.cardBorder}`, textAlign: 'center' }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[...(selectedOrgData?.orgAdmins || []), ...(selectedOrgData?.pendingOrgAdmins || [])].length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} sx={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                            <Box sx={{ py: 4, textAlign: 'center' }}>
                              <CorporateFareIcon sx={{ fontSize: 48, color: colors.textMuted, mb: 1 }} />
                              <Typography sx={{ color: colors.textSecondary }}>
                                No Organization Admins for this institution yet.
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : (
                        [...(selectedOrgData?.orgAdmins || []), ...(selectedOrgData?.pendingOrgAdmins || [])].map((user) => (
                          <TableRow
                            key={user.id}
                            sx={{
                              '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' },
                            }}
                          >
                            <TableCell sx={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ width: 40, height: 40, bgcolor: colors.infoText }}>
                                  {user.firstName[0]}{user.lastName[0]}
                                </Avatar>
                                <Box>
                                  <Typography sx={{ color: colors.textPrimary, fontWeight: 600 }}>
                                    {user.firstName} {user.lastName}
                                  </Typography>
                                  <Typography sx={{ color: colors.textMuted, fontSize: '0.8rem' }}>
                                    {user.email}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                              <Typography sx={{ color: colors.textSecondary }}>
                                {user.department}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                              {getStatusChip(user.isVerified)}
                            </TableCell>
                            <TableCell sx={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                              <Typography sx={{ color: colors.textSecondary, fontSize: '0.85rem' }}>
                                {formatDate(user.registeredAt)}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ borderBottom: `1px solid ${colors.cardBorder}`, textAlign: 'center' }}>
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
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>

              {/* Admins Section */}
              <Card
                sx={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <Box sx={{ p: 3, borderBottom: `1px solid ${colors.cardBorder}`, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SupervisorAccountIcon sx={{ color: colors.warningText }} />
                  <Typography variant="h6" sx={{ color: colors.textPrimary, fontWeight: 600 }}>
                    Admins
                  </Typography>
                  <Chip
                    label={`${(selectedOrgData?.admins.length || 0) + (selectedOrgData?.pendingAdmins.length || 0)} total`}
                    size="small"
                    sx={{ backgroundColor: colors.warningBg, color: colors.warningText, fontWeight: 600 }}
                  />
                </Box>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ backgroundColor: colors.cardBg, color: colors.textSecondary, fontWeight: 700, borderBottom: `1px solid ${colors.cardBorder}` }}>
                          User
                        </TableCell>
                        <TableCell sx={{ backgroundColor: colors.cardBg, color: colors.textSecondary, fontWeight: 700, borderBottom: `1px solid ${colors.cardBorder}` }}>
                          Department
                        </TableCell>
                        <TableCell sx={{ backgroundColor: colors.cardBg, color: colors.textSecondary, fontWeight: 700, borderBottom: `1px solid ${colors.cardBorder}` }}>
                          Status
                        </TableCell>
                        <TableCell sx={{ backgroundColor: colors.cardBg, color: colors.textSecondary, fontWeight: 700, borderBottom: `1px solid ${colors.cardBorder}` }}>
                          Registered
                        </TableCell>
                        <TableCell sx={{ backgroundColor: colors.cardBg, color: colors.textSecondary, fontWeight: 700, borderBottom: `1px solid ${colors.cardBorder}`, textAlign: 'center' }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[...(selectedOrgData?.admins || []), ...(selectedOrgData?.pendingAdmins || [])].length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} sx={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                            <Box sx={{ py: 4, textAlign: 'center' }}>
                              <SupervisorAccountIcon sx={{ fontSize: 48, color: colors.textMuted, mb: 1 }} />
                              <Typography sx={{ color: colors.textSecondary }}>
                                No Admins for this institution yet.
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : (
                        [...(selectedOrgData?.admins || []), ...(selectedOrgData?.pendingAdmins || [])].map((user) => (
                          <TableRow
                            key={user.id}
                            sx={{
                              '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' },
                            }}
                          >
                            <TableCell sx={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ width: 40, height: 40, bgcolor: colors.warningText }}>
                                  {user.firstName[0]}{user.lastName[0]}
                                </Avatar>
                                <Box>
                                  <Typography sx={{ color: colors.textPrimary, fontWeight: 600 }}>
                                    {user.firstName} {user.lastName}
                                  </Typography>
                                  <Typography sx={{ color: colors.textMuted, fontSize: '0.8rem' }}>
                                    {user.email}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                              <Typography sx={{ color: colors.textSecondary }}>
                                {user.department}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                              {getStatusChip(user.isVerified)}
                            </TableCell>
                            <TableCell sx={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                              <Typography sx={{ color: colors.textSecondary, fontSize: '0.85rem' }}>
                                {formatDate(user.registeredAt)}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ borderBottom: `1px solid ${colors.cardBorder}`, textAlign: 'center' }}>
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
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </>
          )}
        </Box>
      </Box>

      {/* View User Dialog */}
      <Dialog
        open={viewDialog.open}
        onClose={() => setViewDialog({ open: false, user: null })}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: colors.cardBg,
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ color: colors.textPrimary, fontWeight: 700, pb: 1 }}>
          User Details
        </DialogTitle>
        <DialogContent>
          {viewDialog.user && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar
                  sx={{
                    width: 70,
                    height: 70,
                    bgcolor: viewDialog.user.role === 'orgadmin' ? colors.infoText : colors.warningText,
                    fontSize: '1.5rem',
                    fontWeight: 700,
                  }}
                >
                  {viewDialog.user.firstName[0]}{viewDialog.user.lastName[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ color: colors.textPrimary, fontWeight: 700 }}>
                    {viewDialog.user.firstName} {viewDialog.user.lastName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    {getRoleChip(viewDialog.user.role)}
                    {getStatusChip(viewDialog.user.isVerified)}
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ borderColor: colors.cardBorder, my: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <EmailIcon sx={{ color: colors.textMuted }} />
                  <Box>
                    <Typography sx={{ color: colors.textMuted, fontSize: '0.75rem' }}>Email</Typography>
                    <Typography sx={{ color: colors.textPrimary }}>{viewDialog.user.email}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <BusinessIcon sx={{ color: colors.textMuted }} />
                  <Box>
                    <Typography sx={{ color: colors.textMuted, fontSize: '0.75rem' }}>Institution</Typography>
                    <Typography sx={{ color: colors.textPrimary }}>{viewDialog.user.institute}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SchoolIcon sx={{ color: colors.textMuted }} />
                  <Box>
                    <Typography sx={{ color: colors.textMuted, fontSize: '0.75rem' }}>Department</Typography>
                    <Typography sx={{ color: colors.textPrimary }}>{viewDialog.user.department}</Typography>
                  </Box>
                </Box>

                {viewDialog.user.adminId && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <BadgeIcon sx={{ color: colors.textMuted }} />
                    <Box>
                      <Typography sx={{ color: colors.textMuted, fontSize: '0.75rem' }}>Admin ID</Typography>
                      <Typography sx={{ color: colors.textPrimary }}>{viewDialog.user.adminId}</Typography>
                    </Box>
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CalendarTodayIcon sx={{ color: colors.textMuted }} />
                  <Box>
                    <Typography sx={{ color: colors.textMuted, fontSize: '0.75rem' }}>Registered On</Typography>
                    <Typography sx={{ color: colors.textPrimary }}>{formatDate(viewDialog.user.registeredAt)}</Typography>
                  </Box>
                </Box>

                {viewDialog.user.isVerified && viewDialog.user.verifiedAt && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <VerifiedUserIcon sx={{ color: colors.successText }} />
                    <Box>
                      <Typography sx={{ color: colors.textMuted, fontSize: '0.75rem' }}>Verified On</Typography>
                      <Typography sx={{ color: colors.textPrimary }}>{formatDate(viewDialog.user.verifiedAt)}</Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setViewDialog({ open: false, user: null })}
            sx={{
              color: colors.textSecondary,
              '&:hover': { backgroundColor: `${colors.accent}15` },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
