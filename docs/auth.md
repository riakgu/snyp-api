# Authentication API Documentation

## Overview
The service uses JWT-based authentication with access and refresh tokens. Access tokens are short-lived for security, while refresh tokens allow obtaining new access tokens without re-login.

### Token Strategy
- **Access Token**: Short-lived
- **Refresh Token**: Long-lived
- **Token Blacklisting**: Supports immediate logout and security
- **User Token Revocation**: All user tokens can be revoked at once

---


### 1. Register
**POST** `/auth/register`

Creates a new user account.

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Validation Rules
- **name**: Required, string
- **email**: Required, valid email format, must be unique
- **password**: Required, minimum length (defined in validation)

#### Response (201)
```json
{
  "id": "nanoid",
  "email": "john@example.com",
  "name": "John Doe"
}
```

#### Error Responses
- `400` - Email already exists
- `400` - Validation failed (invalid format)


---

### 2. Login
**POST** `/auth/login`

Authenticates user and returns access + refresh tokens.

#### Request Body
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Response (200)
```json
{
  "user": {
    "id": "nanoid",
    "email": "john@example.com",
    "name": "John Doe"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response Fields
- **user**: User profile information
- **accessToken**: Short-lived JWT for API requests
- **refreshToken**: Long-lived JWT for obtaining new access tokens

#### Error Responses
- `401` - Invalid credentials (wrong email or password)
- `400` - Validation failed

---

### 3. Refresh Token
**POST** `/auth/refresh`

Obtains a new access token using a valid refresh token.

#### Request Body
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response (200)
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
}
```

#### Error Responses
- `401` - Invalid or expired refresh token
- `401` - Token revoked or blacklisted
- `400` - Validation failed

---

### 4. Logout
**POST** `/auth/logout`

Invalidates current session and revokes all user tokens.

#### Authentication
- **Required**: Yes (Bearer token)

#### Request Headers
```
Authorization: Bearer <access_token>
```

#### Request Body
None required (user info extracted from token)

#### Response (200)
```json
{
  "message": "Logged out successfully"
}
```

#### What Happens
1. Current access token added to blacklist
2. All refresh tokens for user revoked
3. User must login again to get new tokens

#### Error Responses
- `401` - Invalid or missing access token
- `401` - Token already blacklisted

---

### 5. Get Current User
**GET** `/auth/me`

Retrieves current authenticated user's profile.

#### Authentication
- **Required**: Yes (Bearer token)

#### Request Headers
```
Authorization: Bearer <access_token>
```

#### Response (200)
```json
{
  "id": "nanoid",
  "email": "john@example.com",
  "name": "John Doe"
}
```

#### Error Responses
- `401` - Invalid or missing access token
- `404` - User not found (deleted account)

---