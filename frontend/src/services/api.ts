/**
 * API Service - BACKEND DISABLED
 * Frontend now works standalone without backend
 */

// API Configuration - DISABLED
const API_BASE_URL = ''; // Backend disabled
const API_PREFIX = '';

// Role mapping between frontend and backend
export const ROLE_MAP = {
  // Frontend -> Backend
  toBackend: {
    superadmin: 'super_admin',
    orgadmin: 'college_admin',
    admin: 'admin',
    student: 'student',
    instructor: 'instructor',
  },
  // Backend -> Frontend
  toFrontend: {
    super_admin: 'superadmin',
    college_admin: 'orgadmin',
    admin: 'admin',
    student: 'student',
    instructor: 'instructor',
    teaching_assistant: 'admin',
  },
} as const;

// Authentication & User Management Types
export interface RegisterUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'admin' | 'superadmin' | 'orgadmin' | 'instructor';
  institute?: string;
  department?: string;
  studentId?: string;
  adminId?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    organizationId?: string;
  };
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId?: string;
  isVerified: boolean;
  createdAt: string;
}

// Status mapping
export const STATUS_MAP = {
  toBackend: {
    verified: 'active',
    pending: 'pending_verification',
  },
  toFrontend: {
    active: true,
    inactive: false,
    suspended: false,
    pending_verification: false,
  },
} as const;

// Types
export interface BackendUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  organizationId?: string;
  phone?: string;
  avatarUrl?: string;
  emailVerified?: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  organization?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    organizationId?: string;
  };
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

// Token management
const TOKEN_KEY = 'lms_access_token';
const REFRESH_TOKEN_KEY = 'lms_refresh_token';

export const tokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  setAccessToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setRefreshToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
  },
  clearTokens: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },
};

// API Request helper - DISABLED (Frontend only mode)
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  console.warn('Backend is disabled. API calls will not work.');
  throw new Error('Backend is disabled. Please enable backend to use API features.');
}

// Refresh token - DISABLED
async function refreshAccessToken(): Promise<boolean> {
  console.warn('Backend is disabled. Token refresh not available.');
  return false;
}

// ==================== AUTH API ====================

export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
    phone?: string;
    organizationSlug?: string;
    department?: string;
  }): Promise<AuthResponse> => {
    // Map frontend role to backend role
    const backendRole = data.role 
      ? ROLE_MAP.toBackend[data.role as keyof typeof ROLE_MAP.toBackend] 
      : 'student';

    const response = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        role: backendRole,
        phone: data.phone,
        department: data.department,
      }),
    });

    // Store tokens
    tokenStorage.setAccessToken(response.accessToken);
    tokenStorage.setRefreshToken(response.refreshToken);

    return response;
  },

  /**
   * Login user
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Store tokens
    tokenStorage.setAccessToken(response.accessToken);
    tokenStorage.setRefreshToken(response.refreshToken);

    return response;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (refreshToken) {
      try {
        await apiRequest('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        });
      } catch {
        // Ignore errors on logout
      }
    }
    tokenStorage.clearTokens();
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<BackendUser> => {
    return apiRequest<BackendUser>('/users/me');
  },

  /**
   * Forgot password
   */
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

// ==================== USERS API ====================

export const usersApi = {
  /**
   * Get all users with filters
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    organizationId?: string;
    role?: string;
    status?: string;
    search?: string;
  }): Promise<BackendUser[]> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.organizationId) queryParams.append('organizationId', params.organizationId);
    if (params?.role) {
      const backendRole = ROLE_MAP.toBackend[params.role as keyof typeof ROLE_MAP.toBackend] || params.role;
      queryParams.append('role', backendRole);
    }
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);

    const query = queryParams.toString();
    return apiRequest(`/users${query ? `?${query}` : ''}`);
  },

  /**
   * Get users by role
   */
  getByRole: async (role: string, organizationId?: string): Promise<BackendUser[]> => {
    const backendRole = ROLE_MAP.toBackend[role as keyof typeof ROLE_MAP.toBackend] || role;
    const query = organizationId ? `?organizationId=${organizationId}` : '';
    return apiRequest(`/users/by-role/${backendRole}${query}`);
  },

  /**
   * Get user by ID
   */
  getById: async (id: string): Promise<BackendUser> => {
    return apiRequest(`/users/${id}`);
  },

  /**
   * Get user statistics
   */
  getStats: async (organizationId?: string): Promise<{
    totalUsers: number;
    activeUsers: number;
    pendingUsers: number;
    usersByRole: Record<string, number>;
  }> => {
    const query = organizationId ? `?organizationId=${organizationId}` : '';
    return apiRequest(`/users/stats${query}`);
  },

  /**
   * Update user
   */
  update: async (id: string, data: Partial<BackendUser>): Promise<BackendUser> => {
    return apiRequest(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Activate user (approve)
   */
  activate: async (id: string): Promise<BackendUser> => {
    return apiRequest(`/users/${id}/activate`, {
      method: 'POST',
    });
  },

  /**
   * Suspend user (reject/disable)
   */
  suspend: async (id: string): Promise<BackendUser> => {
    return apiRequest(`/users/${id}/suspend`, {
      method: 'POST',
    });
  },

  /**
   * Verify user account
   */
  verify: async (id: string): Promise<BackendUser> => {
    return apiRequest(`/users/${id}/verify`, {
      method: 'PUT',
    });
  },

  /**
   * Delete user
   */
  delete: async (id: string): Promise<void> => {
    return apiRequest(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Restore deleted user
   */
  restore: async (id: string): Promise<BackendUser> => {
    return apiRequest(`/users/${id}/restore`, {
      method: 'POST',
    });
  },
};

// ==================== ORGANIZATIONS API ====================

export const organizationsApi = {
  /**
   * Get all organizations
   */
  getAll: async (): Promise<{ data: Array<{ id: string; name: string; slug: string; isActive: boolean; createdAt: string }> }> => {
    return apiRequest('/organizations');
  },

  /**
   * Get organization by ID
   */
  getById: async (id: string): Promise<{ id: string; name: string; slug: string; isActive: boolean }> => {
    return apiRequest(`/organizations/${id}`);
  },

  /**
   * Get organization stats
   */
  getStats: async (id: string): Promise<{
    totalUsers: number;
    totalCourses: number;
    totalStudents: number;
    totalInstructors: number;
  }> => {
    return apiRequest(`/organizations/${id}/stats`);
  },

  /**
   * Create organization
   */
  create: async (data: { name: string; slug: string }): Promise<{ id: string; name: string; slug: string }> => {
    return apiRequest('/organizations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Convert backend user to frontend format
 */
export function convertToFrontendUser(backendUser: BackendUser): {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'admin' | 'superadmin' | 'orgadmin';
  institute: string;
  department: string;
  studentId?: string;
  adminId?: string;
  password: string;
  registeredAt: string;
  isVerified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
} {
  const frontendRole = ROLE_MAP.toFrontend[backendUser.role as keyof typeof ROLE_MAP.toFrontend] || 'student';
  const isVerified = STATUS_MAP.toFrontend[backendUser.status as keyof typeof STATUS_MAP.toFrontend] ?? false;

  return {
    id: backendUser.id,
    firstName: backendUser.firstName,
    lastName: backendUser.lastName,
    email: backendUser.email,
    role: frontendRole as 'student' | 'admin' | 'superadmin' | 'orgadmin',
    institute: backendUser.organization?.name || 'Unknown Institute',
    department: 'Department', // Backend doesn't have department field
    password: '', // Never returned from backend
    registeredAt: backendUser.createdAt,
    isVerified,
    verifiedAt: isVerified ? backendUser.updatedAt : undefined,
  };
}

/**
 * Check if API is available
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Default export object
const api = {
  auth: authApi,
  users: usersApi,
  organizations: organizationsApi,
  tokenStorage,
  checkApiHealth,
  convertToFrontendUser,
  ROLE_MAP,
  STATUS_MAP,
  API_BASE_URL,
};

export default api;
