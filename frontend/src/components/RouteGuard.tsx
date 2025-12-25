'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserManagement } from '@/context/UserManagementContext';
import { Box, CircularProgress } from '@mui/material';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const { currentUser, isLoaded } = useUserManagement();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (!currentUser) {
        router.push('/login');
      } else if (!allowedRoles.includes(currentUser.role)) {
        // Redirect to appropriate dashboard based on role
        switch (currentUser.role) {
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
            router.push('/student/dashboard');
            break;
          default:
            router.push('/login');
        }
      }
    }
  }, [currentUser, isLoaded, allowedRoles, router]);

  // Show loading spinner while checking authentication
  if (!isLoaded) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Don't render children if not authenticated or not authorized
  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return null;
  }

  return <>{children}</>;
}

// Convenience components for specific roles
export function SuperAdminGuard({ children }: { children: React.ReactNode }) {
  return <RouteGuard allowedRoles={['superadmin']}>{children}</RouteGuard>;
}

export function OrgAdminGuard({ children }: { children: React.ReactNode }) {
  return <RouteGuard allowedRoles={['orgadmin']}>{children}</RouteGuard>;
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  return <RouteGuard allowedRoles={['admin']}>{children}</RouteGuard>;
}

export function StudentGuard({ children }: { children: React.ReactNode }) {
  return <RouteGuard allowedRoles={['student']}>{children}</RouteGuard>;
}

export function InstructorGuard({ children }: { children: React.ReactNode }) {
  return <RouteGuard allowedRoles={['instructor']}>{children}</RouteGuard>;
}
