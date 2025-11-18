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
  "short_code": "custom", // Optional: Custom short code (authenticated users only)
  "title": "My Link", // Optional: Link title (authenticated users only)
  "password": "secret123", // Optional: Password protection (authenticated users only)
  "expired_at": "2024-12-31T23:59:59Z" // Optional: Expiration date (authenticated users only)
}
```

#### Authenticated Users Features
- Custom short codes
- Link titles
- Password protection
- Expiration dates
- Link ownership

#### Unauthenticated Users
- Auto-generated 5-character short codes
- Basic URL shortening only

#### Response (201)
```json
{
  "id": "nanoid",
  "user_id": "nanoid", // null for unauthenticated
  "title": "My Link",
  "long_url": "https://example.com/very-long-url",
  "short_code": "abc123",
  "has_password": true,
  "is_archived": false,
  "expired_at": "2024-12-31T23:59:59Z"
}
```

#### Error Responses
- `400` - Short code already taken
- `500` - Failed to generate unique short code after 100 attempts

---

### 2. Get Link by Short Code
**GET** `/api/links/:shortCode`

Retrieves link information by its short code.

#### Authentication
- None

#### Response (200)
```json
{
  "id": "nanoid",
  "user_id": "nanoid",
  "title": "My Link",
  "long_url": "https://example.com/very-long-url",
  "short_code": "abc123",
  "password": "hashed_password",
  "has_password": true,
  "is_archived": false,
  "expired_at": "2024-12-31T23:59:59Z"
}
```

#### Error Responses
- `404` - Link not found

---

### 3. Get User Links (200)
**GET** `/api/links`

Retrieves all active (non-archived) links for the authenticated user with pagination.

#### Authentication
- Required

#### Query Parameters
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 10): Items per page

#### Response
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
All fields are optional. Only include fields you want to update.

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
  "id": "nanoid",
  "user_id": "nanoid",
  "title": "Updated Title",
  "long_url": "https://new-url.com",
  "short_code": "newcode",
  "has_password": true,
  "is_archived": false,
  "expired_at": "2025-12-31T23:59:59Z"
}
```

#### Error Responses
- `400` - Short code already taken
- `404` - Link not found or not owned by user
- `500` - Internal server error

---

### 5. Delete Link
**DELETE** `/api/links/:shortCode`

Permanently deletes a link. Only the owner can delete their links.

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
- `500` - Internal server error

---



