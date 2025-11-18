# Archive API Documentation

## Overview
The Archive API allows authenticated users to manage the archival state of their shortened links.

---

### 1. Archive Link
**POST** `/api/links/:shortCode/archive`

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

### 2. Get Archived Links
**GET** `/api/links/archived`

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

### 3. Unarchive Link
**PATCH** `/api/links/:shortCode/archive`

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