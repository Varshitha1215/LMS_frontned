# Backend Integration Guide

## Overview

This document explains how the frontend connects to the NestJS backend API.

## Environment Configuration

Create a `.env.local` file in the `frontend` folder:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# Enable API mode (set to 'false' to use localStorage fallback)
NEXT_PUBLIC_USE_API=true
```

## API Service (`src/services/api.ts`)

The API service provides:

### Role Mapping
Frontend roles map to different backend roles:
- `superadmin` ↔ `super_admin`
- `orgadmin` ↔ `college_admin`
- `admin` ↔ `admin`
- `student` ↔ `student`

### Authentication API (`authApi`)
- `register(data)` - Register new user
- `login(email, password)` - Login and get tokens
- `logout()` - Logout and clear tokens
- `getProfile()` - Get current user profile
- `refreshToken()` - Refresh access token
- `forgotPassword(email)` - Request password reset

### Users API (`usersApi`)
- `getAll(params)` - Get paginated list of users
- `getByRole(role)` - Get users by role
- `getById(id)` - Get single user
- `getStats(organizationId)` - Get user statistics
- `update(id, data)` - Update user
- `activate(id)` - Activate/verify user
- `suspend(id)` - Suspend user
- `delete(id)` - Soft delete user
- `restore(id)` - Restore deleted user

### Organizations API (`organizationsApi`)
- `getAll(params)` - Get organizations
- `getById(id)` - Get single organization
- `getStats()` - Get organization statistics
- `create(data)` - Create new organization

## Custom Hooks (`src/hooks/useApiUsers.ts`)

### `useApiUsers()`
Returns all users with filtering capabilities:
```tsx
const { 
  users,
  pendingStudents,
  verifiedStudents,
  pendingAdmins,
  verifiedAdmins,
  pendingOrgAdmins,
  verifiedOrgAdmins,
  isLoading,
  error,
  refetch,
  activateUser,
  suspendUser,
  deleteUser
} = useApiUsers();
```

### `useApiUsersByRole(role)`
Returns users filtered by role:
```tsx
const { users, isLoading, error, refetch } = useApiUsersByRole('student');
```

### `useApiUserStats()`
Returns user statistics:
```tsx
const { stats, isLoading, error, refetch } = useApiUserStats();
```

## Backend Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Refresh token |
| POST | `/auth/logout` | Logout |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users (paginated) |
| GET | `/users/me` | Get current user |
| GET | `/users/stats` | Get user statistics |
| GET | `/users/by-role/:role` | Get users by role |
| GET | `/users/:id` | Get user by ID |
| PATCH | `/users/:id` | Update user |
| DELETE | `/users/:id` | Soft delete user |
| POST | `/users/:id/activate` | Activate user |
| POST | `/users/:id/suspend` | Suspend user |
| POST | `/users/:id/restore` | Restore user |

### User Statuses
- `ACTIVE` - User is verified and can login
- `INACTIVE` - User is inactive
- `SUSPENDED` - User is suspended by admin
- `PENDING_VERIFICATION` - User awaiting approval

## Usage Examples

### Login Page
```tsx
import { authApi, ROLE_MAP, tokenStorage } from '@/services/api';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

const handleLogin = async (email: string, password: string) => {
  if (USE_API) {
    const response = await authApi.login(email, password);
    const frontendRole = ROLE_MAP.toFrontend[response.user.role];
    // Navigate based on role
  }
};
```

### Register Page
```tsx
import { authApi, ROLE_MAP } from '@/services/api';

const handleRegister = async (formData) => {
  if (USE_API) {
    const backendRole = ROLE_MAP.toBackend[formData.role];
    await authApi.register({
      ...formData,
      role: backendRole,
    });
  }
};
```

### Dashboard with Users
```tsx
import { useApiUsers } from '@/hooks/useApiUsers';

function Dashboard() {
  const { 
    pendingOrgAdmins, 
    activateUser, 
    isLoading 
  } = useApiUsers();

  const handleApprove = async (userId: string) => {
    await activateUser(userId);
  };

  if (isLoading) return <Loading />;
  
  return (
    <UserList users={pendingOrgAdmins} onApprove={handleApprove} />
  );
}
```

## Token Management

Tokens are stored in localStorage:
- Access Token: `lms_access_token`
- Refresh Token: `lms_refresh_token`

The API service automatically:
1. Includes access token in request headers
2. Attempts token refresh on 401 errors
3. Clears tokens on logout

## Running the Application

1. **Start Backend** (port 3001):
   ```bash
   cd lms-backend-nestjs
   npm run start:dev
   ```

2. **Start Frontend** (port 3000):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Connection**:
   - Navigate to `http://localhost:3000/login`
   - Register a new account or login
   - Check browser console for API calls

## Fallback Mode

If `NEXT_PUBLIC_USE_API=false`, the app uses localStorage for user management, allowing development without the backend running.
