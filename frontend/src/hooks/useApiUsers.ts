'use client';

import { useState, useEffect, useCallback } from 'react';
import { usersApi, convertToFrontendUser, ROLE_MAP, BackendUser } from '@/services/api';
import type { RegisteredUser } from '@/context/UserManagementContext';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

interface UseApiUsersReturn {
  users: RegisteredUser[];
  pendingStudents: RegisteredUser[];
  verifiedStudents: RegisteredUser[];
  pendingAdmins: RegisteredUser[];
  verifiedAdmins: RegisteredUser[];
  pendingOrgAdmins: RegisteredUser[];
  verifiedOrgAdmins: RegisteredUser[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  activateUser: (userId: string) => Promise<boolean>;
  suspendUser: (userId: string) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
}

export function useApiUsers(): UseApiUsersReturn {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!USE_API) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await usersApi.getAll();
      
      // Handle paginated response - extract data array
      const usersData = response.data || [];
      
      // Convert backend users to frontend format
      const frontendUsers = usersData.map((user: BackendUser) => convertToFrontendUser(user));
      setUsers(frontendUsers);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to fetch users');
      console.error('Failed to fetch users:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Computed values
  const pendingStudents = users.filter(u => u.role === 'student' && !u.isVerified);
  const verifiedStudents = users.filter(u => u.role === 'student' && u.isVerified);
  const pendingAdmins = users.filter(u => u.role === 'admin' && !u.isVerified);
  const verifiedAdmins = users.filter(u => u.role === 'admin' && u.isVerified);
  const pendingOrgAdmins = users.filter(u => u.role === 'orgadmin' && !u.isVerified);
  const verifiedOrgAdmins = users.filter(u => u.role === 'orgadmin' && u.isVerified);

  const activateUser = async (userId: string): Promise<boolean> => {
    if (!USE_API) return false;
    
    try {
      await usersApi.activate(userId);
      await fetchUsers(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Failed to activate user:', err);
      return false;
    }
  };

  const suspendUser = async (userId: string): Promise<boolean> => {
    if (!USE_API) return false;
    
    try {
      await usersApi.suspend(userId);
      await fetchUsers(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Failed to suspend user:', err);
      return false;
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    if (!USE_API) return false;
    
    try {
      await usersApi.delete(userId);
      await fetchUsers(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Failed to delete user:', err);
      return false;
    }
  };

  return {
    users,
    pendingStudents,
    verifiedStudents,
    pendingAdmins,
    verifiedAdmins,
    pendingOrgAdmins,
    verifiedOrgAdmins,
    isLoading,
    error,
    refetch: fetchUsers,
    activateUser,
    suspendUser,
    deleteUser,
  };
}

// Hook to get users by role with API support
export function useApiUsersByRole(role: 'student' | 'admin' | 'orgadmin' | 'superadmin') {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!USE_API) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const backendRole = ROLE_MAP.toBackend[role as keyof typeof ROLE_MAP.toBackend];
      const response = await usersApi.getByRole(backendRole);
      
      // Handle array response
      const usersData = Array.isArray(response) ? response : [];
      
      // Convert backend users to frontend format
      const frontendUsers = usersData.map((user: BackendUser) => convertToFrontendUser(user));
      setUsers(frontendUsers);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to fetch users');
      console.error('Failed to fetch users:', err);
    } finally {
      setIsLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, isLoading, error, refetch: fetchUsers };
}

// Hook to get user stats
export function useApiUserStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalAdmins: 0,
    totalOrgAdmins: 0,
    pendingVerification: 0,
    activeUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!USE_API) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await usersApi.getStats();
      setStats({
        totalUsers: data.totalUsers || 0,
        totalStudents: data.usersByRole?.student || 0,
        totalAdmins: data.usersByRole?.admin || 0,
        totalOrgAdmins: data.usersByRole?.college_admin || 0,
        pendingVerification: data.pendingUsers || 0,
        activeUsers: data.activeUsers || 0,
      });
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to fetch stats');
      console.error('Failed to fetch stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
}
