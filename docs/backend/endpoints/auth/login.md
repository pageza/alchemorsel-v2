# POST /api/v1/auth/login

**Endpoint**: `POST /api/v1/auth/login`  
**Authentication**: None required  
**Version**: 1.3.0  
**Last Updated**: 2025-06-27

## Purpose
Authenticate existing users with email and password credentials.

## Request

### Headers
```
Content-Type: application/json
```

### Body
```json
{
  "email": "string",     // Required: User's email address
  "password": "string"   // Required: User's password
}
```

#### Validation Rules
- **email**: Valid email format, case-insensitive
- **password**: Minimum 8 characters

## Response

### Success (200 OK)
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "username": "string",
    "is_email_verified": true,
    "profile": {
      "id": "uuid",
      "username": "string",
      "bio": "string",
      "profile_picture_url": "string",
      "privacy_level": "private"
    },
    "dietary_preferences": [
      {
        "id": "uuid",
        "preference": "vegetarian"
      }
    ],
    "allergens": [
      {
        "id": "uuid",
        "allergen": "peanuts",
        "severity": "moderate"
      }
    ]
  }
}
```

### Error Responses

#### Invalid Credentials (401 Unauthorized)
```json
{
  "error": "Invalid email or password"
}
```

#### Validation Error (400 Bad Request)
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

#### Rate Limited (429 Too Many Requests)
```json
{
  "error": "Too many login attempts. Please try again later."
}
```

#### Server Error (500 Internal Server Error)
```json
{
  "error": "Internal server error"
}
```

## Authentication Flow
1. Client sends email and password
2. Backend validates credentials against database
3. If valid, JWT token generated with user claims
4. User profile data fetched and included in response
5. Token used for subsequent authenticated requests

## Security Features
- Password hashing with bcrypt
- Rate limiting (5 attempts per 15 minutes per IP)
- JWT token with expiration (24 hours)
- Account lockout after repeated failures

## Implementation Details

### Handler Location
`backend/internal/api/auth.go:LoginHandler`

### Service Integration
- `auth.service.ValidateCredentials()`
- `auth.service.GenerateToken()`
- `profile.service.GetUserProfile()`

### Database Operations
- Query users table for email match
- Validate password hash
- Update last_login timestamp

## Testing

### Unit Tests
```go
func TestLoginHandler_Success(t *testing.T)
func TestLoginHandler_InvalidCredentials(t *testing.T)
func TestLoginHandler_ValidationError(t *testing.T)
func TestLoginHandler_RateLimited(t *testing.T)
```

### E2E Tests
- Valid login flow
- Invalid credentials handling
- Rate limiting behavior
- Token usage validation

## Rate Limiting
- **Limit**: 5 attempts per IP per 15 minutes
- **Lockout**: Progressive delays (1s, 2s, 4s, 8s, 15m)
- **Reset**: Successful login resets attempt counter

## Token Management
- **Algorithm**: HS256 (HMAC SHA-256)
- **Expiration**: 24 hours
- **Claims**: user_id, email, is_verified
- **Storage**: Frontend stores in secure HTTP-only cookie or localStorage

## Related Endpoints
- [POST /api/v1/auth/register](./register.md) - User registration
- [POST /api/v1/auth/forgot-password](./forgot-password.md) - Password reset
- [POST /api/v1/auth/verify-email](./verify-email.md) - Email verification

## Version History
- **v1.3.0**: Current version with email verification status
- **v1.2.x**: Added rate limiting and security improvements
- **v1.1.x**: Enhanced error handling and validation
- **v1.0.x**: Initial login implementation

## Known Issues
None currently identified

## Monitoring
- Login success/failure rates
- Rate limiting triggers
- Response times
- Error frequency

## Example Usage

### cURL
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }'
```

### JavaScript (Frontend)
```javascript
const response = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword'
  })
});

const data = await response.json();
if (response.ok) {
  // Store token and user data
  localStorage.setItem('token', data.token);
  // Redirect to dashboard
}
```