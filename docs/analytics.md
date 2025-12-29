# Analytics API Documentation

## Overview
The Analytics API provides detailed analytics and insights for all user's links, including click data over time, traffic sources, and geographic distribution.

---

## Common Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `period` | string | `7d` | Time period: `24h`, `7d`, `30d`, `90d`, `alltime` |

---

### 1. Get Overview
**GET** `/api/analytics/overview`

Get overall analytics summary with comparison to previous period.

#### Authentication
- Required

#### Response (200)
```json
{
  "data": {
    "total_clicks": 12458,
    "unique_clicks": 5672,
    "qr_clicks": 892,
    "previous": {
      "total_clicks": 11120,
      "unique_clicks": 5250,
      "qr_clicks": 920
    }
  }
}
```

---

### 2. Get Clicks
**GET** `/api/analytics/clicks`

Get click data over time for charts.

#### Authentication
- Required

#### Response (200)
```json
{
  "data": [
    { "date": "2025-12-21", "count": 145 },
    { "date": "2025-12-22", "count": 189 },
    { "date": "2025-12-23", "count": 234 }
  ]
}
```

---

### 3. Get Top Links
**GET** `/api/analytics/top-links`

Get top performing links.

#### Authentication
- Required

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | `5` | Max results |

#### Response (200)
```json
{
  "data": [
    { "short_code": "promo2024", "long_url": "https://example.com", "count": 2456 }
  ]
}
```

---

### 4. Get Referrers
**GET** `/api/analytics/referrers`

Get traffic source breakdown.

#### Authentication
- Required

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | `10` | Max results |

#### Response (200)
```json
{
  "data": [
    { "name": "Direct", "count": 4567 },
    { "name": "Google", "count": 2234 },
    { "name": "Twitter", "count": 1189 }
  ]
}
```

---

### 5. Get Devices
**GET** `/api/analytics/devices`

Get device breakdown.

#### Authentication
- Required

#### Response (200)
```json
{
  "data": [
    { "name": "desktop", "count": 5678 },
    { "name": "mobile", "count": 4567 },
    { "name": "tablet", "count": 1213 }
  ]
}
```

---

### 6. Get Browsers
**GET** `/api/analytics/browsers`

Get browser breakdown.

#### Authentication
- Required

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | `5` | Top N browsers (+ "Other") |

#### Response (200)
```json
{
  "data": [
    { "name": "Chrome", "count": 5234 },
    { "name": "Safari", "count": 2345 },
    { "name": "Firefox", "count": 1234 },
    { "name": "Edge", "count": 876 },
    { "name": "Other", "count": 543 }
  ]
}
```

---

### 7. Get Countries
**GET** `/api/analytics/countries`

Get country breakdown.

#### Authentication
- Required

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | `10` | Max results |

#### Response (200)
```json
{
  "data": [
    { "name": "Indonesia", "count": 4562 },
    { "name": "United States", "count": 2341 },
    { "name": "Singapore", "count": 1456 }
  ]
}
```

---

### 8. Get Cities
**GET** `/api/analytics/cities`

Get city breakdown.

#### Authentication
- Required

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | `10` | Max results |

#### Response (200)
```json
{
  "data": [
    { "name": "Jakarta", "count": 2341 },
    { "name": "Surabaya", "count": 1234 },
    { "name": "Singapore", "count": 987 }
  ]
}
```

---

## Export Endpoints

All export endpoints return CSV file downloads.

### Export Clicks
**GET** `/api/analytics/clicks/export`

Export all click data as CSV.

#### Response
CSV file with columns: `date, short_code, referrer, browser, os, device, country, city, is_qr, is_unique`

---

### Export Top Links
**GET** `/api/analytics/top-links/export`

Export top links as CSV.

#### Response
CSV file with columns: `short_code, long_url, clicks`

---

### Export Referrers
**GET** `/api/analytics/referrers/export`

Export referrer data as CSV.

#### Response
CSV file with columns: `referrer, clicks`

---

### Export Devices
**GET** `/api/analytics/devices/export`

Export device data as CSV.

#### Response
CSV file with columns: `device, clicks`

---

### Export Browsers
**GET** `/api/analytics/browsers/export`

Export browser data as CSV.

#### Response
CSV file with columns: `browser, clicks`

---

### Export Countries
**GET** `/api/analytics/countries/export`

Export country data as CSV.

#### Response
CSV file with columns: `country, clicks`

---

### Export Cities
**GET** `/api/analytics/cities/export`

Export city data as CSV.

#### Response
CSV file with columns: `city, clicks`
