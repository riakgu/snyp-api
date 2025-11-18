# Redirect API Documentation

## Overview
The Redirect API handles all public-facing functionality for accessing shortened links.

---

### 1. Redirect Link
**GET** `/:shortCode`

Redirects the user to the original long URL associated with the given shortCode.

#### Authentication
- None

#### Response 301
- Redirect to original link


#### Error Responses
- `404` - Link not found

---

### 2. Verify Password Link
**GET** `/:shortCode/verify`

Verifies the password for a password-protected link.

#### Authentication
- None

#### Request Body
```json
{
  "password": "secret"
}
```

#### Response (200)
```json
{
  "long_url": "https://example.com"
}
```

#### Error Responses
- `400` – Password missing 
- `401` – Invalid password 
- `404` – Link not found

---