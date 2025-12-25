'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Alert,
  Divider,
  Grow,
  Tooltip,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { keyframes } from '@mui/system';
import { useThemeMode } from '@/context/ThemeContext';
import { useUserManagement } from '@/context/UserManagementContext';
// Backend API disabled - using localStorage only
import SchoolIcon from '@mui/icons-material/School';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GoogleIcon from '@mui/icons-material/Google';
import WindowIcon from '@mui/icons-material/Window';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LoginIcon from '@mui/icons-material/Login';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonIcon from '@mui/icons-material/Person';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import ThemeSwitcher from '@/components/ThemeSwitcher';

// Check if API should be used
const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

// Custom Keyframe Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.9);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const bounceIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(125, 211, 252, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(125, 211, 252, 0.6);
  }
`;

const arrowBounce = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px);
  }
`;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewParam = searchParams.get('view');
  const { mode, themeColors } = useThemeMode();
  const { validateLogin, setCurrentUser, isLoaded: usersLoaded } = useUserManagement();
  const isDark = mode === 'dark';
  
  const [showLogin, setShowLogin] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(viewParam === 'roleselection');
  const [isExiting, setIsExiting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Theme-based colors from context
  const colors = {
    background: isDark 
      ? `linear-gradient(145deg, ${themeColors.primaryDark} 0%, #0a0a0a 40%, #000000 70%, ${themeColors.primaryDark} 100%)`
      : `linear-gradient(145deg, ${themeColors.backgroundLight} 0%, ${themeColors.backgroundLight} 50%, ${themeColors.backgroundLight} 100%)`,
    cardBg: isDark ? themeColors.paperDark : themeColors.paperLight,
    cardBorder: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0, 0, 0, 0.1)',
    textPrimary: isDark ? themeColors.textDark : themeColors.textLight,
    textSecondary: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0, 0, 0, 0.6)',
    textMuted: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0, 0, 0, 0.4)',
    inputBg: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
    inputBorder: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
    headerBg: isDark 
      ? `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`
      : `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryLight} 100%)`,
    footerBg: isDark ? themeColors.primaryDark : themeColors.primary,
    accent: themeColors.accent,
  };

  useEffect(() => {
    setMounted(true);
    // Check URL parameter on mount
    if (viewParam === 'roleselection') {
      setShowRoleSelection(true);
    }
  }, [viewParam]);

  // Handle transition from welcome to login
  const handleEnterPortal = () => {
    setIsExiting(true);
    setTimeout(() => {
      setShowLogin(true);
      setIsExiting(false);
    }, 400);
  };

  // Handle back to welcome
  const handleBackToWelcome = () => {
    setIsExiting(true);
    setTimeout(() => {
      setShowLogin(false);
      setIsExiting(false);
    }, 400);
  };

  // Password validation
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasSpecialChar;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!isPasswordValid) {
      setError('Password does not meet the requirements');
      setLoading(false);
      return;
    }

    try {
      if (USE_API) {
        // Use Backend API
        try {
          const response = await authApi.login(email, password);
          
          // Map backend role to frontend role
          const frontendRole = ROLE_MAP.toFrontend[response.user.role as keyof typeof ROLE_MAP.toFrontend] || 'student';
          
          // Create user object for context
          const user = {
            id: response.user.id,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            email: response.user.email,
            role: frontendRole as 'student' | 'admin' | 'superadmin' | 'orgadmin',
            institute: 'Organization', // Will be fetched separately if needed
            department: 'Department',
            password: '', // Never store password
            registeredAt: new Date().toISOString(),
            isVerified: true, // If they can login, they're verified
          };
          
          setCurrentUser(user);

          // Redirect based on user role
          switch (frontendRole) {
            case 'superadmin':
              router.push('/superadmin/dashboard');
              break;
            case 'orgadmin':
              router.push('/orgadmin/dashboard');
              break;
            case 'admin':
              router.push('/admin/dashboard');
              break;
            case 'student':
            default:
              router.push('/student/dashboard');
              break;
          }
        } catch (apiError: unknown) {
          const error = apiError as { message?: string | string[]; statusCode?: number };
          if (error.statusCode === 401) {
            setError('Invalid email or password');
          } else if (error.message) {
            setError(Array.isArray(error.message) ? error.message[0] : error.message);
          } else {
            setError('Login failed. Please try again.');
          }
          setLoading(false);
          return;
        }
      } else {
        // Use localStorage (fallback)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Validate login using UserManagementContext (now async)
        const result = await validateLogin(email, password);
        
        if (!result.success) {
          setError(result.error || 'Invalid email or password');
          setLoading(false);
          return;
        }

        // Set the current user in context
        const user = result.user!;
        setCurrentUser(user);

        // Redirect based on user role
        switch (user.role) {
          case 'superadmin':
            router.push('/superadmin/dashboard');
            break;
          case 'orgadmin':
            router.push('/orgadmin/dashboard');
            break;
          case 'admin':
            router.push('/admin/dashboard');
            break;
          case 'student':
          default:
            router.push('/student/dashboard');
            break;
        }
      }
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => console.log('Google login clicked');
  const handleMicrosoftLogin = () => console.log('Microsoft login clicked');

  // Handle Register Now click - navigate directly to register page
  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExiting(true);
    setTimeout(() => {
      router.push('/register');
    }, 400);
  };

  // Handle role selection
  const handleRoleSelect = (role: string) => {
    setIsExiting(true);
    setTimeout(() => {
      router.push(`/register?role=${role}`);
    }, 400);
  };

  // Handle back from role selection
  const handleBackFromRoleSelection = () => {
    setIsExiting(true);
    setTimeout(() => {
      setShowRoleSelection(false);
      setShowLogin(true);
      setIsExiting(false);
    }, 400);
  };

  // Password requirement component
  const PasswordRequirement = ({ met, text, delay }: { met: boolean; text: string; delay: number }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, animation: `${slideInLeft} 0.3s ease-out ${delay}s both` }}>
      <Box sx={{ animation: met ? `${bounceIn} 0.4s ease-out` : 'none' }}>
        {met ? (
          <CheckCircleIcon sx={{ fontSize: 14, color: '#22c55e' }} />
        ) : (
          <CancelIcon sx={{ fontSize: 14, color: '#ef4444' }} />
        )}
      </Box>
      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: met ? '#22c55e' : '#64748b', fontWeight: met ? 500 : 400 }}>
        {text}
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: colors.background,
        position: 'fixed',
        top: 0,
        left: 0,
        p: 2,
        overflowY: 'auto',
        transition: 'background 0.3s ease',
      }}
    >
      {/* ==================== THEME CONTROLS ==================== */}
      <Box
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1000,
          display: 'flex',
          gap: 1,
          alignItems: 'center',
        }}
      >
        {/* Theme Switcher - includes theme selection and light/dark toggle */}
        <ThemeSwitcher />
      </Box>

      {/* ==================== WELCOME BOX ==================== */}
      {!showLogin && !showRoleSelection && (
        <Card
          onClick={handleEnterPortal}
          sx={{
            width: '100%',
            maxWidth: 400,
            borderRadius: 4,
            boxShadow: isDark 
              ? `0 20px 60px ${themeColors.primaryDark}80` 
              : `0 20px 60px ${themeColors.primary}30`,
            overflow: 'hidden',
            border: `1px solid ${colors.cardBorder}`,
            cursor: 'pointer',
            animation: isExiting 
              ? `${fadeOut} 0.4s ease-out forwards` 
              : `${fadeInUp} 0.6s ease-out`,
            transition: 'all 0.4s ease',
            '&:hover': {
              transform: 'translateY(-8px) scale(1.02)',
              boxShadow: isDark 
                ? `0 30px 80px ${themeColors.primaryDark}99` 
                : `0 30px 80px ${themeColors.primary}50`,
              '& .enter-icon': {
                animation: `${arrowBounce} 0.6s ease-in-out infinite`,
              },
              '& .logo-box': {
                animation: `${glow} 1.5s ease-in-out infinite`,
              },
            },
          }}
        >
          {/* Header Background Effect */}
          <Box
            sx={{
              background: colors.headerBg,
              py: 6,
              px: 4,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
                backgroundSize: '200% 100%',
                animation: `${shimmer} 3s infinite`,
              },
            }}
          >
            {/* Floating Logo */}
            <Box
              className="logo-box"
              sx={{
                width: 90,
                height: 90,
                borderRadius: '24px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                animation: `${float} 3s ease-in-out infinite`,
                border: '2px solid rgba(255,255,255,0.1)',
              }}
            >
              <SchoolIcon sx={{ fontSize: 50, color: 'white' }} />
            </Box>

            {/* Title */}
            <Box sx={{ mb: 1, position: 'relative', zIndex: 1 }}>
              <Typography variant="h4" fontWeight={700} color="white" fontSize="2rem" sx={{ display: 'inline' }}>
                LMS
              </Typography>
              <Typography variant="h4" fontWeight={700} fontSize="2rem" sx={{ display: 'inline', color: themeColors.accent }}>
                Portal
              </Typography>
            </Box>

            {/* Subtitle */}
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '1rem',
                mb: 4,
                position: 'relative',
                zIndex: 1,
              }}
            >
              Your Learning Management System
            </Typography>

            {/* Enter Button Visual */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                py: 1.5,
                px: 4,
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: 3,
                mx: 'auto',
                width: 'fit-content',
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.25)',
                },
              }}
            >
              <LoginIcon sx={{ color: 'white', fontSize: 22 }} />
              <Typography
                variant="body1"
                sx={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}
              >
                Click to Enter Portal
              </Typography>
              <KeyboardArrowRightIcon
                className="enter-icon"
                sx={{ color: themeColors.accent, fontSize: 24 }}
              />
            </Box>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              backgroundColor: colors.footerBg,
              py: 2,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
              © 2025 Education Systems
            </Typography>
          </Box>
        </Card>
      )}

      {/* ==================== LOGIN FORM ==================== */}
      {showLogin && (
        <Card
          sx={{
            width: '100%',
            maxWidth: 480,
            borderRadius: 3,
            boxShadow: isDark 
              ? `0 20px 60px ${themeColors.primaryDark}80`
              : `0 20px 60px ${themeColors.primary}30`,
            overflow: 'visible',
            border: `1px solid ${colors.cardBorder}`,
            backgroundColor: colors.cardBg,
            my: 2,
            animation: isExiting 
              ? `${fadeOut} 0.4s ease-out forwards`
              : `${fadeInUp} 0.5s ease-out`,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: isDark 
                ? `0 30px 80px ${themeColors.primaryDark}99`
                : `0 30px 80px ${themeColors.primary}50`,
            },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
              py: 3,
              px: 4,
              textAlign: 'center',
              borderRadius: '12px 12px 0 0',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                backgroundSize: '200% 100%',
                animation: `${shimmer} 3s infinite`,
              },
            }}
          >
            {/* Back Button */}
            <Box
              onClick={handleBackToWelcome}
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.6)',
                transition: 'all 0.3s ease',
                zIndex: 2,
                '&:hover': {
                  color: 'white',
                  transform: 'translateX(-3px)',
                },
              }}
            >
              <KeyboardArrowRightIcon sx={{ fontSize: 20, transform: 'rotate(180deg)' }} />
              <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Back</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 1, position: 'relative', zIndex: 1 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: `${pulse} 2s ease-in-out infinite`,
                }}
              >
                <SchoolIcon sx={{ fontSize: 28, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700} color="white" fontSize="1.6rem" sx={{ display: 'inline' }}>
                  LMS
                </Typography>
                <Typography variant="h5" fontWeight={700} fontSize="1.6rem" sx={{ display: 'inline', color: themeColors.accent }}>
                  Portal
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', position: 'relative', zIndex: 1 }}>
              Welcome back! Please sign in to continue.
            </Typography>
          </Box>

          {/* Form Section */}
          <Box sx={{ p: 3.5, backgroundColor: isDark ? themeColors.paperDark : themeColors.paperLight }}>
            {error && (
              <Grow in={!!error}>
                <Alert severity="error" sx={{ mb: 2, fontSize: '0.85rem', py: 0.5 }}>{error}</Alert>
              </Grow>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              {/* Email */}
              <Box sx={{ animation: `${fadeInUp} 0.5s ease-out 0.1s both` }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 0.8, fontSize: '0.9rem', color: colors.textPrimary }}>
                  Student ID or Email
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="small"
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.95rem',
                      backgroundColor: colors.inputBg,
                      borderRadius: 1.5,
                      transition: 'all 0.3s ease',
                      color: colors.textPrimary,
                      '& fieldset': { borderColor: colors.inputBorder },
                      '&:hover fieldset': { borderColor: themeColors.primary },
                      '&.Mui-focused': {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#ffffff',
                        transform: 'scale(1.01)',
                        '& fieldset': { borderColor: themeColors.accent, borderWidth: 2 },
                      },
                    },
                    '& .MuiOutlinedInput-input': { 
                      padding: '12px 14px',
                      '&::placeholder': { color: colors.textMuted, opacity: 1 },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon sx={{ color: colors.accent, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Password */}
              <Box sx={{ animation: `${fadeInUp} 0.5s ease-out 0.2s both` }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 0.8, fontSize: '0.9rem', color: colors.textPrimary }}>
                  Password
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter your password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="small"
                  sx={{
                    mb: 1,
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.95rem',
                      backgroundColor: colors.inputBg,
                      borderRadius: 1.5,
                      transition: 'all 0.3s ease',
                      color: colors.textPrimary,
                      '& fieldset': { borderColor: colors.inputBorder },
                      '&:hover fieldset': { borderColor: themeColors.primary },
                      '&.Mui-focused': {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#ffffff',
                        transform: 'scale(1.01)',
                        '& fieldset': { borderColor: themeColors.accent, borderWidth: 2 },
                      },
                    },
                    '& .MuiOutlinedInput-input': { 
                      padding: '12px 14px',
                      '&::placeholder': { color: colors.textMuted, opacity: 1 },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: colors.accent, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                          {showPassword ? (
                            <VisibilityOffOutlinedIcon sx={{ color: colors.accent, fontSize: 20 }} />
                          ) : (
                            <VisibilityOutlinedIcon sx={{ color: colors.accent, fontSize: 20 }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Password Requirements */}
              <Grow in={password.length > 0} timeout={300}>
                <Box sx={{ mb: 2, p: 1.5, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', borderRadius: 1.5, border: `1px solid ${colors.inputBorder}`, display: password.length > 0 ? 'block' : 'none' }}>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.textPrimary, mb: 0.8 }}>
                    Password must contain:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                    <PasswordRequirement met={hasMinLength} text="At least 8 characters" delay={0} />
                    <PasswordRequirement met={hasUppercase} text="At least 1 uppercase letter (A-Z)" delay={0.1} />
                    <PasswordRequirement met={hasSpecialChar} text="At least 1 special character (!@#$%^&*)" delay={0.2} />
                  </Box>
                </Box>
              </Grow>

              {/* Remember & Forgot */}
             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, animation: `${fadeInUp} 0.5s ease-out 0.3s both` }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      size="small"
                      sx={{ color: colors.textMuted, '&.Mui-checked': { color: colors.accent } }}
                    />
                  }
                  label={<Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '0.85rem' }}>Remember me</Typography>}
                />
                <Link href="/forgot-password" style={{ color: colors.accent, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </Box>

              {/* Submit */}
              <Box sx={{ animation: `${fadeInUp} 0.5s ease-out 0.4s both` }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading || (password.length > 0 && !isPasswordValid)}
                  endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    py: 1.4,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                    borderRadius: 1.5,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: `linear-gradient(135deg, ${themeColors.primaryDark} 0%, ${themeColors.primaryDark} 100%)`,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 25px ${themeColors.primary}60`,
                    },
                    '&.Mui-disabled': { background: '#cbd5e1', color: '#94a3b8' },
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign in to Portal'}
                </Button>
              </Box>
            </Box>

            {/* Divider */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2.5 }}>
              <Divider sx={{ flex: 1, borderColor: colors.inputBorder }} />
              <Typography variant="body2" sx={{ color: colors.textMuted, fontSize: '0.75rem', fontWeight: 600 }}>OR CONTINUE WITH</Typography>
              <Divider sx={{ flex: 1, borderColor: colors.inputBorder }} />
            </Box>

            {/* Social */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" fullWidth startIcon={<GoogleIcon sx={{ fontSize: 18 }} />} onClick={handleGoogleLogin}
                sx={{ py: 1.2, fontSize: '0.9rem', color: colors.textPrimary, borderColor: colors.inputBorder, borderRadius: 1.5, '&:hover': { borderColor: colors.accent, backgroundColor: colors.inputBg } }}>
                Google
              </Button>
              <Button variant="outlined" fullWidth startIcon={<WindowIcon sx={{ fontSize: 18 }} />} onClick={handleMicrosoftLogin}
                sx={{ py: 1.2, fontSize: '0.9rem', color: colors.textPrimary, borderColor: colors.inputBorder, borderRadius: 1.5, '&:hover': { borderColor: colors.accent, backgroundColor: colors.inputBg } }}>
                Microsoft
              </Button>
            </Box>

           {/* Help */}
            <Box sx={{ mt: 2.5, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '0.85rem', mb: 1 }}>
                Need help?{' '}
                <Link href="/support" style={{ color: colors.accent, fontWeight: 600, textDecoration: 'none' }}>
                  Contact IT Support
                </Link>
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '0.9rem' }}>
                New user?{' '}
                <Box 
                  component="span"
                  onClick={handleRegisterClick}
                  sx={{ 
                    color: colors.accent, 
                    fontWeight: 700,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Register Now!
                </Box>
              </Typography>
            </Box>
          </Box>

         {/* Footer */}
          <Box sx={{ backgroundColor: isDark ? themeColors.primaryDark : '#f8fafc', py: 2, textAlign: 'center', borderTop: `1px solid ${colors.inputBorder}`, borderRadius: '0 0 12px 12px' }}>
            <Typography variant="body2" sx={{ color: colors.textMuted, fontSize: '0.8rem' }}>© 2025 Education Systems. All rights reserved.</Typography>
          </Box>
        </Card>
      )}

      {/* ==================== ROLE SELECTION BOX ==================== */}
      {showRoleSelection && (
        <Card
          sx={{
            width: '100%',
            maxWidth: 400,
            borderRadius: 4,
            boxShadow: isDark 
              ? `0 20px 60px ${themeColors.primaryDark}80`
              : `0 20px 60px ${themeColors.primary}30`,
            overflow: 'hidden',
            border: `1px solid ${colors.cardBorder}`,
            animation: isExiting 
              ? `${fadeOut} 0.4s ease-out forwards` 
              : `${fadeInUp} 0.6s ease-out`,
            transition: 'all 0.4s ease',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: colors.headerBg,
              py: 5,
              px: 4,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
                backgroundSize: '200% 100%',
                animation: `${shimmer} 3s infinite`,
              },
            }}
          >
            {/* Back Button */}
            <Box
              onClick={handleBackFromRoleSelection}
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.6)',
                transition: 'all 0.3s ease',
                zIndex: 2,
                '&:hover': {
                  color: 'white',
                  transform: 'translateX(-3px)',
                },
              }}
            >
              <KeyboardArrowRightIcon sx={{ fontSize: 20, transform: 'rotate(180deg)' }} />
              <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Back</Typography>
            </Box>

            {/* Logo */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '20px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2.5,
                animation: `${float} 3s ease-in-out infinite`,
                border: '2px solid rgba(255,255,255,0.1)',
              }}
            >
              <SchoolIcon sx={{ fontSize: 45, color: 'white' }} />
            </Box>

            <Box sx={{ mb: 1 }}>
              <Typography variant="h5" fontWeight={700} color="white" fontSize="1.5rem" sx={{ display: 'inline' }}>
                LMS
              </Typography>
              <Typography variant="h5" fontWeight={700} fontSize="1.5rem" sx={{ display: 'inline', color: themeColors.accent }}>
                Portal
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
              Select your role to register
            </Typography>
          </Box>

          {/* Role Buttons */}
          <Box sx={{ p: 3, backgroundColor: isDark ? themeColors.paperDark : themeColors.paperLight }}>
            {/* Super Admin Button */}
            <Button
              fullWidth
              onClick={() => handleRoleSelect('superadmin')}
              sx={{
                py: 2,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 2,
                px: 3,
                background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryLight} 100%)`,
                borderRadius: 2,
                color: 'white',
                animation: `${fadeInUp} 0.5s ease-out 0.1s both`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-3px) scale(1.02)',
                  boxShadow: `0 10px 30px ${themeColors.primary}60`,
                  background: `linear-gradient(135deg, ${themeColors.primaryLight} 0%, ${themeColors.primary} 100%)`,
                },
              }}
            >
              <Box
                sx={{
                  width: 45,
                  height: 45,
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AdminPanelSettingsIcon sx={{ fontSize: 26, color: themeColors.accent }} />
              </Box>
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="body1" fontWeight={600} fontSize="1rem">
                  Enter as Super Admin
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>
                  Full system access & control
                </Typography>
              </Box>
              <KeyboardArrowRightIcon sx={{ ml: 'auto', fontSize: 24, color: themeColors.accent }} />
            </Button>

            {/* Admin Button */}
            <Button
              fullWidth
              onClick={() => handleRoleSelect('admin')}
              sx={{
                py: 2,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 2,
                px: 3,
                background: `linear-gradient(135deg, ${themeColors.primaryLight} 0%, ${themeColors.secondary} 100%)`,
                borderRadius: 2,
                color: 'white',
                animation: `${fadeInUp} 0.5s ease-out 0.2s both`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-3px) scale(1.02)',
                  boxShadow: `0 10px 30px ${themeColors.primaryLight}60`,
                  background: `linear-gradient(135deg, ${themeColors.secondary} 0%, ${themeColors.primaryLight} 100%)`,
                },
              }}
            >
              <Box
                sx={{
                  width: 45,
                  height: 45,
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SupervisorAccountIcon sx={{ fontSize: 26, color: themeColors.secondaryLight }} />
              </Box>
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="body1" fontWeight={600} fontSize="1rem">
                  Enter as Admin
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>
                  Institute management access
                </Typography>
              </Box>
              <KeyboardArrowRightIcon sx={{ ml: 'auto', fontSize: 24, color: themeColors.secondaryLight }} />
            </Button>

            {/* Organization Admin Button */}
            <Button
              fullWidth
              onClick={() => handleRoleSelect('orgadmin')}
              sx={{
                py: 2,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 2,
                px: 3,
                background: `linear-gradient(135deg, #0d3a5c 0%, #1a5a8a 100%)`,
                borderRadius: 2,
                color: 'white',
                animation: `${fadeInUp} 0.5s ease-out 0.25s both`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-3px) scale(1.02)',
                  boxShadow: '0 10px 30px rgba(13, 58, 92, 0.6)',
                  background: `linear-gradient(135deg, #1a5a8a 0%, #0d3a5c 100%)`,
                },
              }}
            >
              <Box
                sx={{
                  width: 45,
                  height: 45,
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CorporateFareIcon sx={{ fontSize: 26, color: themeColors.accent }} />
              </Box>
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="body1" fontWeight={600} fontSize="1rem">
                  Enter as Org Admin
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>
                  Student verification & management
                </Typography>
              </Box>
              <KeyboardArrowRightIcon sx={{ ml: 'auto', fontSize: 24, color: themeColors.accent }} />
            </Button>

            {/* Student Button */}
            <Button
              fullWidth
              onClick={() => handleRoleSelect('student')}
              sx={{
                py: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 2,
                px: 3,
                background: `linear-gradient(135deg, ${themeColors.secondary} 0%, ${themeColors.secondaryLight} 100%)`,
                borderRadius: 2,
                color: 'white',
                animation: `${fadeInUp} 0.5s ease-out 0.3s both`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-3px) scale(1.02)',
                  boxShadow: `0 10px 30px ${themeColors.secondary}60`,
                  background: `linear-gradient(135deg, ${themeColors.secondaryLight} 0%, ${themeColors.secondary} 100%)`,
                },
              }}
            >
              <Box
                sx={{
                  width: 45,
                  height: 45,
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PersonIcon sx={{ fontSize: 26, color: 'white' }} />
              </Box>
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="body1" fontWeight={600} fontSize="1rem">
                  Enter as Student
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>
                  Learning & course access
                </Typography>
              </Box>
              <KeyboardArrowRightIcon sx={{ ml: 'auto', fontSize: 24, color: 'white' }} />
            </Button>
          </Box>

          {/* Footer */}
          <Box sx={{ backgroundColor: colors.footerBg, py: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
              © 2025 Education Systems
            </Typography>
          </Box>
        </Card>
      )}
    </Box>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#0a0a0a',
      }}>
        <Typography sx={{ color: 'white' }}>Loading...</Typography>
      </Box>
    }>
      <LoginContent />
    </Suspense>
  );
}