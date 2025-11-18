# QR Code API Documentation

## Overview
The QR Code API provides endpoints to generate and download QR codes for existing shortened links.

---

### 1. Get QR Code
**GET** `/api/links/:shortCode/qr`

Generates and returns a QR code image for the shortened link.

#### Authentication
- None

#### Response
- Returns QR code image


#### Error Responses
- `404` - Link not found
- `500` - Internal server error (QR generation failed)

---

### 2. Download QR Code
**GET** `/api/links/:shortCode/qr/download`

Downloads the QR code as a file.

#### Authentication
- None

#### Response
- PNG file download

---