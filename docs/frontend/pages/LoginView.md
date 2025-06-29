# LoginView.vue

**Location**: `frontend/src/views/LoginView.vue`  
**Type**: Authentication Page  
**Version**: 1.3.0  
**Last Updated**: 2025-06-27

## Purpose
User authentication interface for existing users to access their accounts.

## Features
- Email/password authentication form
- Form validation and error handling
- "Remember me" functionality
- Link to registration and password reset
- Redirect to intended page after login

## User Stories
- ✅ As a user, I want to login with email and password
- ✅ As a user, I want clear error messages for invalid credentials
- ✅ As a user, I want to reset my password if forgotten
- ✅ As a user, I want to navigate to registration easily

## Dependencies
- **Components**: None (uses Vuetify form components)
- **Services**: auth.service.ts
- **Stores**: auth.store.ts
- **Composables**: useAuth.ts
- **Routes**: /login

## Props
None

## Emits
None

## State Management
- **Local State**: Form data (email, password, remember)
- **Global State**: auth.store (authentication status)
- **Validation**: Email format, required fields

## API Integration
- `POST /api/v1/auth/login` - User authentication
- Returns JWT token on success

## Form Validation
- Email format validation
- Required field validation
- Real-time error feedback
- Submit button state management

## Navigation Logic
- Redirects to intended route after login
- Fallback to dashboard if no intended route
- Guards against accessing when already authenticated

## Security Features
- Password field masking
- JWT token secure storage
- CSRF protection
- Rate limiting protection

## Responsive Design
- ✅ Mobile form optimization
- ✅ Touch-friendly inputs
- ✅ Accessible form labels

## Testing
- **Unit Tests**: Form validation, auth service integration
- **E2E Tests**: `ui-tests/tests/auth/login.test.js`
- **Coverage**: Success/failure flows, navigation, validation

## Error Handling
- Invalid credentials messaging
- Network error handling
- Rate limit notifications
- Account verification status

## Known Issues
None currently identified

## Version History
- **v1.3.0**: Current stable version with email verification
- **v1.2.x**: Added remember me functionality
- **v1.1.x**: Enhanced validation and error handling
- **v1.0.x**: Initial implementation

## Rollback Guide
- **Safe Rollback**: Can revert to v1.2.x safely
- **Breaking Changes**: None in recent versions
- **Database**: Compatible with all auth table versions

## Future Enhancements
- [ ] Two-factor authentication
- [ ] Social login options (Google, GitHub)
- [ ] Biometric authentication
- [ ] Login attempt tracking

## Related Documentation
- [Auth Service](../../backend/services/auth.md)
- [Auth Store](../features/auth/auth-store.md)
- [RegisterView](./RegisterView.md)
- [ForgotPasswordView](./ForgotPasswordView.md)