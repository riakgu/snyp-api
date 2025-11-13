# Link API Documentation

## Overview
This service provides URL shortening functionality with authentication, password protection, expiration dates, and link archiving capabilities.

---

### Authentication
- **Optional Auth**: Endpoints marked with `optionalAuth` work with or without authentication but provide additional features when authenticated.
- **Required Auth**: Endpoints marked with `requireAuth` need a valid authentication token.

---


### 1. Create Link
**POST** `/links`

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
**GET** `/links/:shortCode`

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
**GET** `/links`

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
**PATCH** `/links/:shortCode`

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
**DELETE** `/links/:shortCode`

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

### 6. Archive Link
**POST** `/links/:shortCode/archive`

Archives a link, making it inaccessible but preserving its data.

#### Authentication
- Required

#### Response (200)
```json
{
  "message": "Link has been archived successfully"
}
```

#### Error Responses
- `404` - Link not found or not owned by user
- `500` - Internal server error

---

### 7. Get Archived Links
**GET** `/links/archived`

Retrieves all archived links for the authenticated user with pagination.

#### Authentication
- Required

#### Query Parameters
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 10): Items per page

#### Response (200)
```json
{
  "data": [
    {
      "id": "nanoid",
      "user_id": "nanoid",
      "title": "Archived Link",
      "long_url": "https://example.com",
      "short_code": "abc123",
      "has_password": false,
      "is_archived": true,
      "expired_at": null
    }
  ],
  "paging": {
    "page": 1,
    "limit": 10,
    "totalItem": 5,
    "totalPage": 1
  }
}
```

#### Empty State Response
```json
{
  "message": "You don't have any archived links",
  "data": []
}
```

---

### 8. Unarchive Link
**PATCH** `/links/:shortCode/archive`

Restores an archived link to active status.

#### Authentication
- Required

#### Response (200)
```json
{
  "message": "Link has been unarchived successfully"
}
```

#### Error Responses
- `404` - Link not found or not owned by user
- `500` - Internal server error

---

### 9. Get QR Code
**GET** `/links/:shortCode/qr`

Generates and returns a QR code image for the shortened link.

#### Authentication
- None

#### Response
- Returns QR code image


#### Error Responses
- `404` - Link not found
- `500` - Internal server error (QR generation failed)

---

### 10. Download QR Code
**GET** `/links/:shortCode/qr/download`

Downloads the QR code as a file.

#### Authentication
- None

#### Response
- PNG file download

---

### 11. Get Link Statistics
**GET** `/links/:shortCode/stats`

Retrieves comprehensive usage statistics for a link.

#### Authentication
- None

#### Response
```json
{
  "total_visits": 1250,
  "unique_visits": 843,
  "qr_visits": 407
}
```

#### Response Fields
- `total_visits`: Total number of clicks/visits (all sources)
- `unique_visits`: Number of unique visitors (based on IP + User Agent hash)
- `qr_visits`: Number of visits from QR code scans


#### Error Responses
- `404` - Link not found

---