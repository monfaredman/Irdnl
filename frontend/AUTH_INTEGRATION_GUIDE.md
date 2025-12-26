# Frontend Authentication Integration Guide

This document describes the complete authentication flow connecting the React/Next.js frontend to the NestJS backend API.

## Overview

The authentication system implements:
- JWT-based authentication with access and refresh tokens
- Automatic token refresh on 401 errors
- Protected routes for authenticated users
- Role-based access control (RBAC)
- Multi-tab session synchronization
- Persistent login state

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  AuthProvider │  │  useAuth     │  │  ProtectedRoute      │   │
│  │  (Context)    │  │  (Hook)      │  │  (Component/HOC)     │   │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘   │
│         │                 │                      │               │
│         └────────────┬────┴──────────────────────┘               │
│                      ▼                                           │
│              ┌──────────────┐                                    │
│              │  Auth Store  │ (Zustand + LocalStorage)           │
│              │  (auth.ts)   │                                    │
│              └──────┬───────┘                                    │
│                     │                                            │
│                     ▼                                            │
│              ┌──────────────┐                                    │
│              │  Auth API    │                                    │
│              │  (auth.ts)   │                                    │
│              └──────┬───────┘                                    │
└─────────────────────┼───────────────────────────────────────────┘
                      │ HTTP
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Backend (NestJS)                           │
├─────────────────────────────────────────────────────────────────┤
│  POST /api/auth/register  - Register new user                    │
│  POST /api/auth/login     - Login with email/password            │
│  POST /api/auth/refresh   - Refresh access token                 │
│  POST /api/auth/logout    - Logout (requires auth)               │
│  GET  /api/user/me        - Get current user profile             │
│  PUT  /api/user/me        - Update current user profile          │
└─────────────────────────────────────────────────────────────────┘
```

## File Structure

```
frontend/src/
├── types/
│   └── auth.ts              # Auth-related TypeScript types
├── lib/api/
│   ├── auth.ts              # Auth API functions
│   ├── client.ts            # API client with token refresh
│   └── index.ts             # API exports
├── store/
│   └── auth.ts              # Zustand auth store
├── hooks/
│   ├── useAuth.ts           # Auth hook for components
│   └── index.ts             # Hook exports
├── providers/
│   └── auth-provider.tsx    # Auth context provider
├── components/
│   ├── auth/
│   │   ├── ProtectedRoute.tsx  # Protected route component
│   │   └── index.ts            # Auth component exports
│   ├── modals/
│   │   └── AuthModals.tsx      # Login/Register modal (updated)
│   └── sections/
│       └── AuthForm.tsx        # Auth form component (updated)
└── app/
    └── layout.tsx           # Root layout (includes AuthProvider)
```

## Usage

### 1. Using the Auth Hook

```tsx
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { user, isAuthenticated, login, logout, register, isLoading, error } = useAuth();

  const handleLogin = async () => {
    const success = await login({
      email: "user@example.com",
      password: "password123",
    });
    if (success) {
      // Redirect or show success
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.name}!</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### 2. Protecting Routes

#### Option A: Using the ProtectedRoute Component

```tsx
import { ProtectedRoute } from "@/components/auth";

function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

#### Option B: Using the withAuth HOC

```tsx
import { withAuth } from "@/components/auth";

function DashboardPage() {
  return <div>Dashboard content</div>;
}

export default withAuth(DashboardPage);
```

#### Option C: Using the useRequireAuth Hook

```tsx
import { useRequireAuth } from "@/components/auth";

function SettingsPage() {
  const { isAuthenticated, isLoading } = useRequireAuth();

  if (isLoading) return <div>Loading...</div>;

  return <div>Settings content</div>;
}
```

### 3. Role-Based Access Control

```tsx
import { ProtectedRoute } from "@/components/auth";
import { UserRole } from "@/types/auth";

function AdminPage() {
  return (
    <ProtectedRoute requiredRole={UserRole.ADMIN}>
      <div>Admin-only content</div>
    </ProtectedRoute>
  );
}
```

### 4. Using Auth Context

```tsx
import { useAuthContext } from "@/providers/auth-provider";

function AuthStatus() {
  const { isInitialized, user, isAuthenticated } = useAuthContext();

  if (!isInitialized) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? `Logged in as ${user?.name}` : "Not logged in"}
    </div>
  );
}
```

## API Client

The API client automatically handles authentication:

```tsx
import { apiClient } from "@/lib/api";

// Authenticated request (token added automatically)
const data = await apiClient.get("/user/me");

// Skip authentication for public endpoints
const publicData = await apiClient.get("/content", undefined, { skipAuth: true });
```

### Token Refresh

The API client automatically:
1. Adds the access token to all requests (unless `skipAuth: true`)
2. Intercepts 401 errors
3. Attempts to refresh the token using the refresh token
4. Retries the original request with the new token
5. Logs out the user if refresh fails

## Token Storage

Tokens are stored in localStorage:
- `access_token` - JWT access token (15 min expiry)
- `refresh_token` - JWT refresh token (7 day expiry)
- `user` - Serialized user object

## Multi-Tab Synchronization

The auth store listens for `storage` events to sync auth state across browser tabs.

## Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **Token Expiry**: Access tokens expire in 15 minutes, refresh tokens in 7 days
3. **HttpOnly Cookies**: Consider migrating to HttpOnly cookies for enhanced security
4. **CORS**: Backend is configured to accept requests from the frontend origin only
5. **Password Hashing**: Passwords are hashed with bcrypt (10 rounds) on the backend

## Environment Variables

```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Backend (.env)
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

## Testing the Flow

1. **Register**: POST to `/api/auth/register` with `{ email, password, name }`
2. **Login**: POST to `/api/auth/login` with `{ email, password }`
3. **Access Protected Route**: Include `Authorization: Bearer <access_token>` header
4. **Refresh Token**: POST to `/api/auth/refresh` with `{ refresh_token }`
5. **Logout**: POST to `/api/auth/logout` (requires auth header)

## Backend Endpoints Reference

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| POST | `/api/auth/refresh` | No | Refresh access token |
| POST | `/api/auth/logout` | Yes | Logout user |
| GET | `/api/user/me` | Yes | Get current user profile |
| PUT | `/api/user/me` | Yes | Update current user profile |
| POST | `/api/auth/admin/login` | No | Admin login |
| POST | `/api/auth/admin/refresh` | No | Admin token refresh |
