# Stats API Documentation

## Overview
The Stats API provides detailed analytics for shortened links.

---

### 1. Get Link Statistics
**GET** `/api/links/:shortCode/stats`

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