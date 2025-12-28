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

### 2. Restore Link
**POST** `/api/links/:shortCode/restore`

Restores an archived link to active status.

#### Authentication
- Required

#### Response (200)
```json
{
  "message": "Link has been restored successfully"
}
```

#### Error Responses
- `404` - Link not found or not owned by user
- `500` - Internal server error

---

### 3. Get Archived Links

Use the main links endpoint with status filter:

**GET** `/api/links?status=archived`

See [Link API Documentation](link.md) for details.