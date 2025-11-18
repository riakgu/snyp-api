# User API Documentation

## Overview
The User API provides endpoints for retrieving and updating authenticated user information.

---

### 1. Get Current User
**GET** `/api/users/me`

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

### 2. Update Profile
**POST** `/api/users/me`

Updates the authenticated user's profile information.

#### Authentication
- **Required**: Yes (Bearer token)

#### Request Body
```json
{
  "name": "John Updated"
}
```

#### Response (200)
```json
{
  "id": "nanoid",
  "email": "john@example.com",
  "name": "John Updated"
}
```

#### Error Responses
- `400` - Invalid validation
- `401` - Invalid or missing access token
- `404` - User not found (deleted account)
---

### 3. Update Password
**POST** `/api/users/me/password`

Updates the authenticated user’s password securely.

#### Authentication
- **Required**: Yes (Bearer token)

#### Request Body
```json
{
  "old_password": "oldPass123",
  "new_password": "newPass456"
}

```

#### Response (200)
```json
{
  "message": "Password updated successfully"
}
```

#### Error Responses
- `400` - Invalid validation
- `401` - Invalid or missing access token
- `404` - User not found (deleted account)
---