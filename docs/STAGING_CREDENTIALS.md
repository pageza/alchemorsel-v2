# Staging Test Credentials

This document contains the recommended test credentials for staging environment testing.

## Test User Credentials

### Primary Test User
- **Email**: `test@alchemorsel.local`
- **Password**: `TestPassword123!`
- **Role**: Standard User
- **Purpose**: Primary E2E testing account

### Admin Test User  
- **Email**: `admin@alchemorsel.local`
- **Password**: `AdminPassword123!`
- **Role**: Administrator
- **Purpose**: Admin functionality testing

## GitHub Secrets Configuration

To use these credentials in GitHub Actions, add the following secrets to your repository:

### Required Secrets
```
STAGING_TEST_USER_EMAIL=test@alchemorsel.local
STAGING_TEST_USER_PASSWORD=TestPassword123!
STAGING_ADMIN_EMAIL=admin@alchemorsel.local
STAGING_ADMIN_PASSWORD=AdminPassword123!
```

### Optional Staging Deployment Secrets
```
STAGING_HOST=your-staging-server.com
STAGING_SSH_USER=deploy
STAGING_SSH_KEY=your-ssh-private-key
```

## Environment Variables for Local Testing

For local development and testing, you can use these credentials:

```bash
# .env.staging
TEST_USER_EMAIL=test@alchemorsel.local
TEST_USER_PASSWORD=TestPassword123!
ADMIN_EMAIL=admin@alchemorsel.local
ADMIN_PASSWORD=AdminPassword123!
```

## Database Seeding

Ensure these test users exist in your staging database:

```sql
-- Test user
INSERT INTO users (email, password_hash, role, verified, created_at) 
VALUES (
  'test@alchemorsel.local', 
  '$2b$10$hash_for_TestPassword123!', 
  'user', 
  true, 
  NOW()
);

-- Admin user
INSERT INTO users (email, password_hash, role, verified, created_at) 
VALUES (
  'admin@alchemorsel.local', 
  '$2b$10$hash_for_AdminPassword123!', 
  'admin', 
  true, 
  NOW()
);
```

## Security Notes

- These credentials are for **staging/testing only** - never use in production
- The `.local` domain prevents accidental production use
- Passwords follow strong security patterns but are predictable for testing
- Consider rotating these credentials periodically even in staging

## Usage in E2E Tests

The E2E tests will automatically use these credentials when running in staging mode:

```javascript
const testCredentials = {
  email: process.env.TEST_USER_EMAIL || 'test@alchemorsel.local',
  password: process.env.TEST_USER_PASSWORD || 'TestPassword123!'
};
```