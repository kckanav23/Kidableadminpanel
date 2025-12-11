# KidAble Authentication System

## Overview

The KidAble Admin Panel uses a secure access code authentication system. Staff members receive a unique access code that grants them entry to the application with appropriate permissions.

## Authentication Flow

### 1. Login Process

1. User navigates to the application
2. If not authenticated, they see the Login page
3. User enters their staff access code
4. System calls `POST /staff/auth/login` with the code
5. On success, the access code is stored in localStorage
6. User details (name, email, admin status) are stored in app state
7. User is redirected to the Dashboard

### 2. Authenticated Requests

All API requests to the backend automatically include the authentication header:

```
X-Staff-Access-Code: <user's access code>
```

This is handled automatically by the `getHeaders()` function in `/lib/api.ts`.

### 3. Logout Process

1. User clicks "Log Out" in the header dropdown
2. Access code is removed from localStorage
3. User state is cleared
4. User is redirected to Login page

### 4. Session Persistence

- Access codes are stored in localStorage
- On app reload, the system checks for an existing access code
- If found, user remains logged in
- If not found, user sees the Login page

### 5. Error Handling

- **Invalid Code**: Shows error toast, user can try again
- **401/403 Errors**: Automatically clears access code and shows Login page
- **Network Errors**: Shows error message without logging out

## File Structure

```
/context/AuthContext.tsx       # Authentication state management
/pages/Login.tsx               # Login page component
/lib/api.ts                    # API service with auth headers
/components/layout/Header.tsx  # User menu with logout
/App.tsx                       # Auth provider wrapper
```

## API Integration

### Login Endpoint

```typescript
POST /staff/auth/login

Request:
{
  "code": "string"
}

Response:
{
  "userId": "uuid",
  "userName": "string",
  "userEmail": "string",
  "admin": boolean,
  "code": "string"
}
```

### Authenticated Requests

All requests to `/admin/*` endpoints include:

```
Headers:
{
  "X-Staff-Access-Code": "user's access code",
  "Content-Type": "application/json"
}
```

## Usage Examples

### Making Authenticated API Calls

```typescript
// Import the API service
import { homeworkApi } from '../lib/api';

// Call automatically includes auth header
const homework = await homeworkApi.listHomework(clientId, true);
```

### Using Auth Context

```typescript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <div>
      <p>Welcome, {user?.userName}</p>
      {user?.admin && <p>Admin Access</p>}
      <button onClick={logout}>Log Out</button>
    </div>
  );
}
```

## Security Notes

1. **Access Code Storage**: Stored in localStorage (browser storage)
2. **HTTPS Only**: Always use HTTPS in production
3. **Code Confidentiality**: Users should keep codes private
4. **Session Management**: Codes don't expire client-side but may expire server-side
5. **Admin vs Regular**: Admin flag determines access to certain features

## Testing

### Test Access Code Flow

1. Navigate to the app
2. Enter an access code (get from admin)
3. Verify login success
4. Test authenticated features
5. Test logout
6. Verify can't access app without login

### Invalid Code Handling

1. Enter invalid code
2. Verify error message appears
3. Verify can retry login
4. Verify no access to app

## Future Enhancements

- [ ] Access code expiration handling
- [ ] Remember me functionality
- [ ] Multi-factor authentication
- [ ] Role-based access control (RBAC)
- [ ] Audit logging for login attempts
- [ ] Password reset flow (if adding passwords)
