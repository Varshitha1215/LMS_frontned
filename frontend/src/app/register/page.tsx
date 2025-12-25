'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Divider,
  Grow,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material';
import Link from 'next/link';
import { keyframes } from '@mui/system';
import { useUserManagement } from '@/context/UserManagementContext';
// Backend API disabled - using localStorage only
import SchoolIcon from '@mui/icons-material/School';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import GoogleIcon from '@mui/icons-material/Google';
import WindowIcon from '@mui/icons-material/Window';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonIcon from '@mui/icons-material/Person';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import InputLabel from '@mui/material/InputLabel';

// Role options for dropdown (Super Admin excluded - use default credentials)
const roleOptions = [
  { value: 'student', label: 'Student', icon: <PersonIcon />, description: 'Learning & course access' },
  { value: 'orgadmin', label: 'Organization Admin', icon: <CorporateFareIcon />, description: 'Student verification & management' },
  { value: 'admin', label: 'Admin', icon: <SupervisorAccountIcon />, description: 'Institute management access' },
];

// Animations
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const bounceIn = keyframes`
  0% { opacity: 0; transform: scale(0.3); }
  50% { transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
`;

// Institute and Department data
const institutes = [
  'Indian Institute of Technology (IIT) Delhi',
  'Indian Institute of Technology (IIT) Bombay',
  'Indian Institute of Technology (IIT) Madras',
  'National Institute of Technology (NIT) Trichy',
  'Birla Institute of Technology and Science (BITS)',
  'Delhi Technological University (DTU)',
  'Vellore Institute of Technology (VIT)',
  'Manipal Institute of Technology',
  'SRM Institute of Science and Technology',
  'Amity University',
];

const departments = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Biotechnology',
  'Data Science & AI',
  'Cybersecurity',
];

// Check if API mode is enabled
const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

function RegisterForm() {
  const searchParams = useSearchParams();
  const roleFromUrl = searchParams.get('role') || '';
  const { registerUser, getUserByEmail, isLoaded } = useUserManagement();

  // Super admin default credentials
  const isSuperAdmin = roleFromUrl === 'superadmin';
  const isAdmin = roleFromUrl === 'admin';
  const isOrgAdmin = roleFromUrl === 'orgadmin';
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: isSuperAdmin ? 'superadmin@gmail.com' : '',
    adminId: '',
    studentId: '',
    role: roleFromUrl,
    institute: '',
    department: '',
    password: isSuperAdmin ? 'Superadmin@123' : '',
    confirmPassword: isSuperAdmin ? 'Superadmin@123' : '',
  });

  // Update form when role changes from URL or dropdown
  useEffect(() => {
    if (roleFromUrl) {
      if (roleFromUrl === 'superadmin') {
        setFormData(prev => ({
          ...prev,
          email: 'superadmin@gmail.com',
          password: 'Superadmin@123',
          confirmPassword: 'Superadmin@123',
          role: 'superadmin',
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          role: roleFromUrl,
        }));
      }
    }
  }, [roleFromUrl]);

  // Handle role change from dropdown
  const handleRoleChange = (newRole: string) => {
    if (newRole === 'superadmin') {
      setFormData(prev => ({
        ...prev,
        role: 'superadmin',
        email: 'superadmin@gmail.com',
        password: 'Superadmin@123',
        confirmPassword: 'Superadmin@123',
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        role: newRole,
        email: prev.role === 'superadmin' ? '' : prev.email,
        password: prev.role === 'superadmin' ? '' : prev.password,
        confirmPassword: prev.role === 'superadmin' ? '' : prev.confirmPassword,
      }));
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Password validation
  const hasMinLength = formData.password.length >= 8;
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;
  const isPasswordValid = hasMinLength && hasUppercase && hasSpecialChar && passwordsMatch;

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
    setFormData({ ...formData, [field]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!formData.role) {
      setError('Please select a role');
      setLoading(false);
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Institute and department validation (not for super admin)
    if (formData.role !== 'superadmin' && (!formData.institute || !formData.department)) {
      setError('Please select an institute and department');
      setLoading(false);
      return;
    }

    // Admin ID validation for admin and orgadmin roles
    if ((formData.role === 'admin' || formData.role === 'orgadmin') && !formData.adminId) {
      setError('Please enter your Admin ID');
      setLoading(false);
      return;
    }

    if (!isPasswordValid) {
      setError('Password does not meet the requirements');
      setLoading(false);
      return;
    }

    // Check if email already exists (only for localStorage mode)
    if (!USE_API) {
      const existingUser = getUserByEmail(formData.email);
      if (existingUser) {
        setError('An account with this email already exists. Please login instead.');
        setLoading(false);
        return;
      }
    }

    try {
      if (USE_API) {
        // Use Backend API
        try {
          // Map frontend role to backend role
          const backendRole = ROLE_MAP.toBackend[formData.role as keyof typeof ROLE_MAP.toBackend] || 'student';
          
          await authApi.register({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            role: backendRole,
          });

          // Show appropriate message based on role
          if (formData.role === 'student') {
            setSuccess('Registration successful! Your account is pending verification by the Organization Admin. You will be able to login after verification.');
          } else if (formData.role === 'orgadmin') {
            setSuccess('Registration successful! Your Organization Admin account is pending approval by the Super Admin. You will receive access once approved.');
          } else if (formData.role === 'admin') {
            setSuccess('Registration successful! Your Admin account is pending approval by the Super Admin. You will receive access once approved.');
          } else {
            setSuccess('Registration successful! Redirecting to login...');
          }
          
          setTimeout(() => {
            window.location.href = '/login';
          }, (formData.role === 'student' || formData.role === 'orgadmin' || formData.role === 'admin') ? 5000 : 2000);
        } catch (apiError: unknown) {
          const error = apiError as { message?: string | string[]; statusCode?: number };
          if (error.statusCode === 409) {
            setError('An account with this email already exists. Please login instead.');
          } else if (error.message) {
            setError(Array.isArray(error.message) ? error.message[0] : error.message);
          } else {
            setError('Registration failed. Please try again.');
          }
          setLoading(false);
          return;
        }
      } else {
        // Use localStorage (fallback)
        // Check if email already exists
        const existingUser = getUserByEmail(formData.email);
        if (existingUser) {
          setError('An account with this email already exists. Please login instead.');
          setLoading(false);
          return;
        }

        // Register user using context
        registerUser({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          role: formData.role as 'student' | 'admin' | 'superadmin' | 'orgadmin',
          institute: formData.institute,
          department: formData.department,
          studentId: formData.studentId || undefined,
          adminId: formData.adminId || undefined,
          password: formData.password,
        });

        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show appropriate message based on role
        if (formData.role === 'student') {
          setSuccess('Registration successful! Your account is pending verification by the Organization Admin. You will be able to login after verification.');
        } else if (formData.role === 'orgadmin') {
          setSuccess('Registration successful! Your Organization Admin account is pending approval by the Super Admin. You will receive access once approved.');
        } else if (formData.role === 'admin') {
          setSuccess('Registration successful! Your Admin account is pending approval by the Super Admin. You will receive access once approved.');
        } else {
          setSuccess('Registration successful! Redirecting to login...');
        }
        
        setTimeout(() => {
          window.location.href = '/login';
        }, (formData.role === 'student' || formData.role === 'orgadmin' || formData.role === 'admin') ? 5000 : 2000);
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => console.log('Google register clicked');
  const handleMicrosoftRegister = () => console.log('Microsoft register clicked');

  // Get role display info
  const getRoleInfo = () => {
    switch (formData.role) {
      case 'superadmin':
        return { icon: <AdminPanelSettingsIcon />, label: 'Super Admin', color: '#0C2B4E' };
      case 'orgadmin':
        return { icon: <CorporateFareIcon />, label: 'Organization Admin', color: '#0d3a5c' };
      case 'admin':
        return { icon: <SupervisorAccountIcon />, label: 'Admin', color: '#1a4a7a' };
      default:
        return { icon: <PersonIcon />, label: 'Student', color: '#2d6aa8' };
    }
  };

  const roleInfo = getRoleInfo();

  // Password requirement component
  const PasswordRequirement = ({ met, text, delay }: { met: boolean; text: string; delay: number }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, animation: `${slideInLeft} 0.3s ease-out ${delay}s both` }}>
      <Box sx={{ animation: met ? `${bounceIn} 0.4s ease-out` : 'none' }}>
        {met ? <CheckCircleIcon sx={{ fontSize: 14, color: '#22c55e' }} /> : <CancelIcon sx={{ fontSize: 14, color: '#ef4444' }} />}
      </Box>
      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: met ? '#22c55e' : '#64748b', fontWeight: met ? 500 : 400 }}>
        {text}
      </Typography>
    </Box>
  );

  // Input field style
  const inputStyle = {
    mb: 2,
    '& .MuiOutlinedInput-root': {
      fontSize: '0.95rem',
      backgroundColor: '#f8fafc',
      borderRadius: 1.5,
      transition: 'all 0.3s ease',
      color: '#1e293b',
      '& fieldset': { borderColor: '#e2e8f0' },
      '&:hover fieldset': { borderColor: '#0C2B4E' },
      '&.Mui-focused': {
        backgroundColor: '#ffffff',
        transform: 'scale(1.01)',
        '& fieldset': { borderColor: '#0C2B4E', borderWidth: 2 },
      },
    },
    '& .MuiOutlinedInput-input': { 
      padding: '12px 14px',
      color: '#1e293b',
      '&::placeholder': {
        color: '#94a3b8',
        opacity: 1,
      },
    },
    '& .MuiInputBase-input': {
      color: '#1e293b',
      WebkitTextFillColor: '#1e293b',
    },
    '& .MuiInputBase-input.Mui-disabled': {
      color: '#64748b',
      WebkitTextFillColor: '#64748b',
    },
  };

  const selectStyle = {
    backgroundColor: '#f8fafc',
    borderRadius: 1.5,
    color: '#1e293b',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#0C2B4E' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0C2B4E', borderWidth: 2 },
    '& .MuiSelect-select': {
      color: '#1e293b',
    },
    '& .MuiInputBase-input': {
      color: '#1e293b',
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #1a4a7a 0%, #0C2B4E 50%, #081d35 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        p: 2,
        overflowY: 'auto',
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 560,
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(12, 43, 78, 0.5)',
          overflow: 'visible',
          border: '1px solid rgba(255,255,255,0.1)',
          my: 2,
          animation: `${fadeInUp} 0.5s ease-out`,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #0C2B4E 0%, #081d35 100%)',
            py: 3,
            px: 4,
            textAlign: 'center',
            borderRadius: '12px 12px 0 0',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
              backgroundSize: '200% 100%',
              animation: `${shimmer} 3s infinite`,
            },
          }}
        >
          {/* Back to Login */}
          <Link
            href="/login"
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              color: 'rgba(255,255,255,0.6)',
              textDecoration: 'none',
              zIndex: 2,
            }}
          >
            <KeyboardArrowRightIcon sx={{ fontSize: 20, transform: 'rotate(180deg)' }} />
            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Back</Typography>
          </Link>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 1, position: 'relative', zIndex: 1 }}>
            <Box
              sx={{
                width: 48, height: 48, borderRadius: '12px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: `${pulse} 2s ease-in-out infinite`,
              }}
            >
              <SchoolIcon sx={{ fontSize: 28, color: 'white' }} />
            </Box>
            <Typography variant="h5" fontWeight={700} color="white" fontSize="1.6rem">
              <span>LMS</span><span style={{ color: '#5cb3e8' }}>Portal</span>
            </Typography>
          </Box>
          
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', mt: 1, position: 'relative', zIndex: 1 }}>
            Create your account
          </Typography>
        </Box>

        {/* Form Section */}
        <Box sx={{ p: 3.5, backgroundColor: '#ffffff', maxHeight: '60vh', overflowY: 'auto' }}>
          {/* Alerts */}
          {error && <Grow in={!!error}><Alert severity="error" sx={{ mb: 2, fontSize: '0.85rem' }}>{error}</Alert></Grow>}
          {success && <Grow in={!!success}><Alert severity="success" sx={{ mb: 2, fontSize: '0.85rem' }}>{success}</Alert></Grow>}

          <Box component="form" onSubmit={handleSubmit}>
            {/* Role Selection Dropdown */}
            <Box sx={{ animation: `${fadeInUp} 0.5s ease-out 0.05s both`, mb: 2 }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.8, fontSize: '0.9rem', color: '#0C2B4E' }}>
                I am registering as *
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={formData.role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  displayEmpty
                  sx={{
                    ...selectStyle,
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      py: 1.2,
                    },
                  }}
                  renderValue={(selected) => {
                    if (!selected) {
                      return <Typography sx={{ color: '#94a3b8' }}>Select your role</Typography>;
                    }
                    const selectedRole = roleOptions.find(r => r.value === selected);
                    return (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ color: '#0C2B4E', display: 'flex', alignItems: 'center' }}>
                          {selectedRole?.icon}
                        </Box>
                        <Typography sx={{ color: '#1e293b', fontWeight: 500 }}>{selectedRole?.label}</Typography>
                      </Box>
                    );
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: '#ffffff',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                        borderRadius: 2,
                        '& .MuiMenuItem-root': {
                          color: '#1e293b',
                          py: 1.5,
                          '&:hover': { backgroundColor: '#f1f5f9' },
                          '&.Mui-selected': { backgroundColor: '#e2e8f0' },
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    <Typography sx={{ color: '#94a3b8' }}>Select your role</Typography>
                  </MenuItem>
                  {roleOptions.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '8px',
                            backgroundColor: '#0C2B4E10',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0C2B4E',
                          }}
                        >
                          {role.icon}
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>{role.label}</Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>{role.description}</Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Name Row */}
            <Box sx={{ display: 'flex', gap: 2, animation: `${fadeInUp} 0.5s ease-out 0.1s both` }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 0.8, fontSize: '0.9rem', color: '#0C2B4E' }}>
                  First Name *
                </Typography>
                <TextField
                  fullWidth
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange('firstName')}
                  size="small"
                  sx={inputStyle}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><PersonOutlinedIcon sx={{ color: '#0C2B4E', fontSize: 20 }} /></InputAdornment>,
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 0.8, fontSize: '0.9rem', color: '#0C2B4E' }}>
                  Last Name *
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange('lastName')}
                  size="small"
                  sx={inputStyle}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><PersonOutlinedIcon sx={{ color: '#0C2B4E', fontSize: 20 }} /></InputAdornment>,
                  }}
                />
              </Box>
            </Box>

            {/* Email */}
            <Box sx={{ animation: `${fadeInUp} 0.5s ease-out 0.15s both` }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.8, fontSize: '0.9rem', color: '#0C2B4E' }}>
                Email Address *
              </Typography>
              <TextField
                fullWidth
                placeholder="john.doe@email.com"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                size="small"
                sx={inputStyle}
                disabled={formData.role === 'superadmin'}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ color: '#0C2B4E', fontSize: 20 }} /></InputAdornment>,
                }}
              />
            </Box>

            {/* Admin ID (for admin and orgadmin) */}
            {(formData.role === 'admin' || formData.role === 'orgadmin') && (
              <Box sx={{ animation: `${fadeInUp} 0.5s ease-out 0.18s both` }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 0.8, fontSize: '0.9rem', color: '#0C2B4E' }}>
                  {formData.role === 'orgadmin' ? 'Organization Admin ID *' : 'Admin ID *'}
                </Typography>
                <TextField
                  fullWidth
                  placeholder="ADM12345"
                  value={formData.adminId}
                  onChange={handleChange('adminId')}
                  size="small"
                  sx={inputStyle}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><BadgeOutlinedIcon sx={{ color: '#0C2B4E', fontSize: 20 }} /></InputAdornment>,
                  }}
                />
              </Box>
            )}

            {/* Institute (not for super admin) */}
            {formData.role !== 'superadmin' && (
              <Box sx={{ animation: `${fadeInUp} 0.5s ease-out 0.2s both` }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 0.8, fontSize: '0.9rem', color: '#0C2B4E' }}>
                  Institute Name *
                </Typography>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <Select
                    value={formData.institute}
                    onChange={(e) => setFormData({ ...formData, institute: e.target.value })}
                    displayEmpty
                    sx={selectStyle}
                    renderValue={(selected) => {
                      if (!selected) {
                        return <Typography sx={{ color: '#94a3b8' }}>Select Institute</Typography>;
                      }
                      return <Typography sx={{ color: '#1e293b' }}>{selected}</Typography>;
                    }}
                    startAdornment={
                      <InputAdornment position="start">
                        <AccountBalanceIcon sx={{ color: '#0C2B4E', fontSize: 20 }} />
                      </InputAdornment>
                    }
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: '#ffffff',
                          '& .MuiMenuItem-root': {
                            color: '#1e293b',
                            '&:hover': { backgroundColor: '#f1f5f9' },
                            '&.Mui-selected': { backgroundColor: '#e2e8f0' },
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      <Typography sx={{ color: '#94a3b8' }}>Select Institute</Typography>
                    </MenuItem>
                    {institutes.map((inst) => (
                      <MenuItem key={inst} value={inst}>{inst}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            {/* Department (not for super admin) */}
            {formData.role !== 'superadmin' && (
              <Box sx={{ animation: `${fadeInUp} 0.5s ease-out 0.25s both` }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 0.8, fontSize: '0.9rem', color: '#0C2B4E' }}>
                  Department *
                </Typography>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <Select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    displayEmpty
                    sx={selectStyle}
                    renderValue={(selected) => {
                      if (!selected) {
                        return <Typography sx={{ color: '#94a3b8' }}>Select Department</Typography>;
                      }
                      return <Typography sx={{ color: '#1e293b' }}>{selected}</Typography>;
                    }}
                    startAdornment={
                      <InputAdornment position="start">
                        <BusinessIcon sx={{ color: '#0C2B4E', fontSize: 20 }} />
                      </InputAdornment>
                    }
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: '#ffffff',
                          '& .MuiMenuItem-root': {
                            color: '#1e293b',
                            '&:hover': { backgroundColor: '#f1f5f9' },
                            '&.Mui-selected': { backgroundColor: '#e2e8f0' },
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      <Typography sx={{ color: '#94a3b8' }}>Select Department</Typography>
                    </MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            {/* Student ID (only for students) */}
            {formData.role === 'student' && (
              <Box sx={{ animation: `${fadeInUp} 0.5s ease-out 0.3s both` }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 0.8, fontSize: '0.9rem', color: '#0C2B4E' }}>
                  Student ID (Optional)
                </Typography>
                <TextField
                  fullWidth
                  placeholder="STU12345"
                  value={formData.studentId}
                  onChange={handleChange('studentId')}
                  size="small"
                  sx={inputStyle}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><BadgeOutlinedIcon sx={{ color: '#0C2B4E', fontSize: 20 }} /></InputAdornment>,
                  }}
                />
              </Box>
            )}

            {/* Password */}
            <Box sx={{ animation: `${fadeInUp} 0.5s ease-out 0.35s both` }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.8, fontSize: '0.9rem', color: '#0C2B4E' }}>
                Password *
              </Typography>
              <TextField
                fullWidth
                placeholder="Create a strong password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange('password')}
                size="small"
                disabled={formData.role === 'superadmin'}
                sx={{ ...inputStyle, mb: 1 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ color: '#0C2B4E', fontSize: 20 }} /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                        {showPassword ? <VisibilityOffOutlinedIcon sx={{ color: '#0C2B4E', fontSize: 20 }} /> : <VisibilityOutlinedIcon sx={{ color: '#0C2B4E', fontSize: 20 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Password Requirements */}
            <Grow in={formData.password.length > 0} timeout={300}>
              <Box sx={{ mb: 2, p: 1.5, backgroundColor: '#f1f5f9', borderRadius: 1.5, border: '1px solid #e2e8f0', display: formData.password.length > 0 ? 'block' : 'none' }}>
                <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#0C2B4E', mb: 0.8 }}>
                  Password must contain:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                  <PasswordRequirement met={hasMinLength} text="At least 8 characters" delay={0} />
                  <PasswordRequirement met={hasUppercase} text="At least 1 uppercase letter (A-Z)" delay={0.1} />
                  <PasswordRequirement met={hasSpecialChar} text="At least 1 special character (!@#$%^&*)" delay={0.2} />
                </Box>
              </Box>
            </Grow>

            {/* Confirm Password */}
            <Box sx={{ animation: `${fadeInUp} 0.5s ease-out 0.4s both` }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.8, fontSize: '0.9rem', color: '#0C2B4E' }}>
                Confirm Password *
              </Typography>
              <TextField
                fullWidth
                placeholder="Confirm your password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                size="small"
                disabled={formData.role === 'superadmin'}
                sx={inputStyle}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ color: '#0C2B4E', fontSize: 20 }} /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                        {showConfirmPassword ? <VisibilityOffOutlinedIcon sx={{ color: '#0C2B4E', fontSize: 20 }} /> : <VisibilityOutlinedIcon sx={{ color: '#0C2B4E', fontSize: 20 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {formData.confirmPassword.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: -1.5, mb: 1 }}>
                  {passwordsMatch ? (
                    <>
                      <CheckCircleIcon sx={{ fontSize: 14, color: '#22c55e' }} />
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#22c55e' }}>Passwords match</Typography>
                    </>
                  ) : (
                    <>
                      <CancelIcon sx={{ fontSize: 14, color: '#ef4444' }} />
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#ef4444' }}>Passwords do not match</Typography>
                    </>
                  )}
                </Box>
              )}
            </Box>

            {/* Submit */}
            <Box sx={{ animation: `${fadeInUp} 0.5s ease-out 0.45s both` }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading || !isPasswordValid}
                endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
                sx={{
                  py: 1.4,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #0C2B4E 0%, #081d35 100%)',
                  borderRadius: 1.5,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #081d35 0%, #051525 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(12, 43, 78, 0.4)',
                  },
                  '&.Mui-disabled': { background: '#cbd5e1', color: '#94a3b8' },
                }}
              >
                {loading ? 'Creating Account...' : `Create ${roleInfo.label} Account`}
              </Button>
            </Box>
          </Box>

          {/* Divider */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2.5 }}>
            <Divider sx={{ flex: 1, borderColor: '#e2e8f0' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>OR REGISTER WITH</Typography>
            <Divider sx={{ flex: 1, borderColor: '#e2e8f0' }} />
          </Box>

          {/* Social */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" fullWidth startIcon={<GoogleIcon sx={{ fontSize: 18 }} />} onClick={handleGoogleRegister}
              sx={{ py: 1.2, fontSize: '0.9rem', color: '#0C2B4E', borderColor: '#e2e8f0', borderRadius: 1.5, '&:hover': { borderColor: '#0C2B4E', backgroundColor: '#f8fafc' } }}>
              Google
            </Button>
            <Button variant="outlined" fullWidth startIcon={<WindowIcon sx={{ fontSize: 18 }} />} onClick={handleMicrosoftRegister}
              sx={{ py: 1.2, fontSize: '0.9rem', color: '#0C2B4E', borderColor: '#e2e8f0', borderRadius: 1.5, '&:hover': { borderColor: '#0C2B4E', backgroundColor: '#f8fafc' } }}>
              Microsoft
            </Button>
          </Box>

          {/* Login Link */}
          <Typography variant="body2" align="center" sx={{ mt: 2.5, color: '#64748b', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#0C2B4E', fontWeight: 700, textDecoration: 'none' }}>
              Sign In
            </Link>
          </Typography>
        </Box>

        {/* Footer */}
        <Box sx={{ backgroundColor: '#f8fafc', py: 2, textAlign: 'center', borderTop: '1px solid #e2e8f0', borderRadius: '0 0 12px 12px' }}>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem' }}>© 2025 Education Systems. All rights reserved.</Typography>
        </Box>
      </Card>
    </Box>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #1a4a7a 0%, #0C2B4E 50%, #081d35 100%)',
      }}>
        <Typography color="white">Loading...</Typography>
      </Box>
    }>
      <RegisterForm />
    </Suspense>
  );
}
