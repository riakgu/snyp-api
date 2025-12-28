# Link API Documentation

## Overview
This service provides URL shortening functionality with authentication, password protection, expiration dates, and link archiving capabilities.

---

### Authentication
- **Optional Auth**: Endpoints marked with `optionalAuth` work with or without authentication but provide additional features when authenticated.
- **Required Auth**: Endpoints marked with `requireAuth` need a valid authentication token.

---

### 1. Create Link
**POST** `/api/links`

Creates a new shortened link. Works for both authenticated and unauthenticated users, with different capabilities.

#### Authentication
- Optional (enhanced features when authenticated)

#### Request Body
```json
{
  "long_url": "https://example.com/very-long-url",
  "short_code": "custom",
  "title": "My Link",
  "password": "secret123",
  "expired_at": "2024-12-31T23:59:59Z"
}
```

> **Note:** `short_code`, `title`, `password`, and `expired_at` are only available for authenticated users.

#### Response (200)
```json
{
  "data": {
    "id": "nanoid",
    "user_id": "nanoid",
    "title": "My Link",
    "long_url": "https://example.com/very-long-url",
    "short_code": "abc123",
    "has_password": true,
    "is_archived": false,
    "expired_at": "2024-12-31T23:59:59Z",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Error Responses
- `400` - Short code already taken
- `500` - Failed to generate unique short code

---

### 2. Get Link by Short Code
**GET** `/api/links/:shortCode`

Retrieves link information by its short code.

#### Authentication
- None

#### Response (200)
```json
{
  "data": {
    "id": "nanoid",
    "user_id": "nanoid",
    "title": "My Link",
    "long_url": "https://example.com/very-long-url",
    "short_code": "abc123",
    "has_password": true,
    "is_archived": false,
    "expired_at": "2024-12-31T23:59:59Z",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Error Responses
- `404` - Link not found

---

### 3. Get User Links
**GET** `/api/links`

Retrieves links for the authenticated user with pagination and status filter.

#### Authentication
- Required

#### Query Parameters
| Parameter | Default | Description |
|-----------|---------|-------------|
| `page` | 1 | Page number |
| `limit` | 10 | Items per page |
| `status` | `active` | Filter: `active` or `archived` |

#### Response (200)
```json
{
  "data": [
    {
      "id": "nanoid",
      "user_id": "nanoid",
      "title": "My Link",
      "long_url": "https://example.com",
      "short_code": "abc123",
      "has_password": true,
      "is_archived": false,
      "expired_at": "2024-12-31T23:59:59Z"
    }
  ],
  "paging": {
    "page": 1,
    "limit": 10,
    "totalItem": 25,
    "totalPage": 3
  }
}
```

#### Empty State Response
```json
{
  "message": "You haven't created any links yet",
  "data": []
}
```

---

### 4. Update Link
**PATCH** `/api/links/:shortCode`

Updates an existing link. Only the owner can update their links.

#### Authentication
- Required

#### Request Body
All fields are optional. Set to `null` to remove a value.

```json
{
  "title": "Updated Title",
  "long_url": "https://new-url.com",
  "short_code": "newcode",
  "password": "newpassword",
  "expired_at": "2025-12-31T23:59:59Z"
}
```

#### Response (200)
```json
{
  "data": {
    "id": "nanoid",
    "user_id": "nanoid",
    "title": "Updated Title",
    "long_url": "https://new-url.com",
    "short_code": "newcode",
    "has_password": true,
    "is_archived": false,
    "expired_at": "2025-12-31T23:59:59Z"
  }
}
```

#### Error Responses
- `400` - Short code already taken
- `404` - Link not found or not owned by user

---

### 5. Delete Link
**DELETE** `/api/links/:shortCode`

Soft deletes a link (preserves data but makes short code unavailable).

#### Authentication
- Required

#### Response (200)
```json
{
  "message": "Link has been deleted successfully"
}
```

#### Error Responses
- `404` - Link not found or not owned by user

---

### 6. Verify Password
**POST** `/api/links/:shortCode/verify`

Verifies password for password-protected links and returns the destination URL.

#### Authentication
- None

#### Request Body
```json
{
  "password": "secret123"
}
```

#### Response (200)
```json
{
  "data": {
    "long_url": "https://example.com/very-long-url"
  }
}
```

#### Error Responses
- `400` - Link is not password protected
- `401` - Incorrect password
- `404` - Link not found
