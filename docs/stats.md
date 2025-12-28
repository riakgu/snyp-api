# Stats API Documentation

## Overview
The Stats API provides analytics for shortened links, including per-link and aggregate statistics.

---

### 1. Get Link Statistics
**GET** `/api/links/:shortCode/stats`

Retrieves usage statistics for a specific link.

#### Authentication
- None

#### Response (200)
```json
{
  "data": {
    "total_clicks": 1250,
    "unique_clicks": 843,
    "qr_clicks": 407
  }
}
```

#### Response Fields
| Field | Description |
|-------|-------------|
| `total_clicks` | Total number of clicks |
| `unique_clicks` | Unique visitors (based on IP + User Agent hash) |
| `qr_clicks` | Clicks from QR code scans |

#### Error Responses
- `404` - Link not found

---

### 2. Get Total Statistics (Dashboard)
**GET** `/api/links/stats`

Retrieves aggregate statistics for all user's links.

#### Authentication
- Required

#### Response (200)
```json
{
  "data": {
    "total_links": 25,
    "active_links": 20,
    "archived_links": 5,
    "total_clicks": 12500,
    "unique_clicks": 8430,
    "qr_clicks": 4070
  }
}
```

#### Response Fields
| Field | Description |
|-------|-------------|
| `total_links` | Total number of links (active + archived) |
| `active_links` | Number of active links |
| `archived_links` | Number of archived links |
| `total_clicks` | Sum of all clicks across all links |
| `unique_clicks` | Sum of unique clicks across all links |
| `qr_clicks` | Sum of QR clicks across all links |