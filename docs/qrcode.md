# QR Code API Documentation

## Overview
The QR Code API provides endpoints to generate and download QR codes for existing shortened links.

---

### 1. Get QR Code
**GET** `/api/links/:shortCode/qr`

Generates and returns a QR code image for the shortened link. QR codes are cached for performance.

#### Authentication
- None

#### Response
- **Content-Type**: `image/png`
- **Cache-Control**: `public, max-age=604800` (7 days)
- Returns PNG image buffer

#### QR Code Properties
| Property | Value |
|----------|-------|
| Format | PNG |
| Size | 300x300 px |
| Error Correction | Medium (M) |
| Tracking | Includes `?qr=1` param |

#### Error Responses
- `404` - Link not found
- `500` - QR generation failed

---

### 2. Download QR Code
**GET** `/api/links/:shortCode/qr/download`

Downloads the QR code as a file attachment.

#### Authentication
- None

#### Response Headers
- **Content-Type**: `image/png`
- **Content-Disposition**: `attachment; filename="qr-{shortCode}.png"`

#### Error Responses
- `404` - Link not found
- `500` - QR generation failed