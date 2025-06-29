# Authentication Feature

**Version**: 1.3.0  
**Last Updated**: 2025-06-27  
**Status**: Production Ready ✅

## Overview
Comprehensive authentication system providing secure user registration, login, email verification, and session management.

## Features Included
- ✅ User Registration with dietary preferences
- ✅ Email/Password Login
- ✅ Email Verification System
- ✅ Password Reset Flow
- ✅ JWT Session Management
- ✅ Router Guards for Protected Routes
- ✅ Remember Me Functionality
- ✅ Rate Limiting Protection

## Architecture

### Frontend Components
- **Pages**:
  - [LoginView](../../pages/LoginView.md)
  - [RegisterView](../../pages/RegisterView.md)
  - [VerifyEmailView](../../pages/VerifyEmailView.md)
  - [ForgotPasswordView](../../pages/ForgotPasswordView.md)
  - [ResetPasswordView](../../pages/ResetPasswordView.md)

- **Components**:
  - [EmailVerificationBanner](../../components/EmailVerificationBanner.md)

- **Services**:
  - auth.service.ts
  - user.service.ts

- **Stores**:
  - auth.store.ts

- **Composables**:
  - useAuth.ts

### Backend Components
- **Endpoints**:
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/verify-email`
  - `POST /api/v1/auth/forgot-password`
  - `POST /api/v1/auth/reset-password`

- **Services**:
  - auth.go
  - email.go

- **Middleware**:
  - auth.go (JWT validation)
  - email_verification.go (email verification requirement)

## User Flow

### Registration Flow
1. User fills registration form with:
   - Name, email, password, username
   - Dietary preferences
   - Allergies and sensitivities
2. Backend creates account with unverified status
3. Verification email sent automatically
4. User redirected to email verification page
5. User clicks verification link in email
6. Account activated and user logged in

### Login Flow
1. User enters email and password
2. Backend validates credentials
3. JWT token generated and returned
4. Token stored securely in frontend
5. User redirected to intended page or dashboard
6. Authentication status maintained across sessions

### Email Verification
- Required for recipe generation and content creation
- Banner notification for unverified users
- Resend verification option available
- Automatic verification on link click

### Password Reset
1. User enters email on forgot password page
2. Reset email sent if account exists
3. User clicks reset link in email
4. New password form displayed
5. Password updated and user logged in

## Security Features

### JWT Implementation
- Secure token generation with user claims
- Token expiration and refresh handling
- HTTP-only cookie storage option
- Automatic token validation on requests

### Email Security
- Verification token expiration (24 hours)
- Reset token single-use validation
- Professional email templates
- Rate limiting on email sends

### Password Security
- Minimum complexity requirements
- Secure hashing (bcrypt)
- Password reset token validation
- Account lockout protection

## Router Guards

### Authentication Guard
```typescript
// Protects routes requiring authentication
const requireAuth = (to, from, next) => {
  if (!authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
};
```

### Email Verification Guard
```typescript
// Protects routes requiring verified email
const requireVerifiedEmail = (to, from, next) => {
  if (!authStore.user?.is_email_verified) {
    next({ name: 'VerifyEmail' });
  } else {
    next();
  }
};
```

### Guest Guard
```typescript
// Redirects authenticated users away from auth pages
const requireGuest = (to, from, next) => {
  if (authStore.isAuthenticated) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
};
```

## State Management

### Auth Store
- User authentication status
- User profile information
- Token management
- Login/logout actions
- Email verification status

### Persistence
- Authentication state persisted across browser sessions
- Automatic token refresh on app restart
- Secure token storage

## API Integration

### Request Interceptors
- Automatic JWT token attachment
- Token refresh on expiration
- Logout on authentication errors

### Response Handling
- Authentication error detection
- Automatic redirect on 401 errors
- User-friendly error messages

## Testing Coverage

### Unit Tests
- Auth service functionality
- Store state management
- Form validation logic
- Router guard behavior

### E2E Tests
- Complete registration flow
- Login/logout functionality
- Email verification process
- Password reset flow
- Protected route access

## Error Handling

### Frontend Errors
- Network connectivity issues
- Invalid credentials messaging
- Rate limit notifications
- Email verification failures

### Backend Errors
- Duplicate email registration
- Invalid verification tokens
- Expired reset tokens
- Account lockout conditions

## Rate Limiting
- Login attempt limiting
- Registration rate limiting
- Email send rate limiting
- Progressive delays on failures

## Mobile Optimization
- Touch-friendly form inputs
- Responsive form layouts
- Mobile-optimized error messages
- Keyboard handling for mobile

## Version History
- **v1.3.0**: Current version with email verification
- **v1.2.x**: Added remember me and password reset
- **v1.1.x**: Enhanced security and validation
- **v1.0.x**: Initial authentication implementation

## Known Issues
None currently identified

## Future Enhancements
- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, GitHub)
- [ ] Biometric authentication
- [ ] Session management dashboard
- [ ] Login attempt analytics
- [ ] Advanced password policies

## Configuration
```typescript
// Auth configuration
const authConfig = {
  tokenExpiry: '24h',
  emailVerificationExpiry: '24h',
  passwordResetExpiry: '1h',
  maxLoginAttempts: 5,
  lockoutDuration: '15m'
};
```

## Related Documentation
- [Backend Auth Service](../../../backend/services/auth.md)
- [Email Service](../../../backend/services/email.md)
- [User Model](../../../backend/models/user.md)
- [Security Guidelines](../../../security/guidelines.md)