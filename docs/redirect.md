# Redirect API Documentation

## Overview
The Redirect API handles all public-facing functionality for accessing shortened links. Special cases (password-protected, expired, not found) redirect to frontend pages instead of returning errors.

---

### Redirect Link
**GET** `/:shortCode`

Redirects the user based on link status.

#### Authentication
- None

#### Query Parameters
| Parameter | Description |
|-----------|-------------|
| `qr` | Set to `1` if accessed via QR code scan |

---

#### Redirect Behavior

| Condition | Status | Redirects To |
|-----------|--------|--------------|
| Normal link | 301 | Original long URL |
| Password protected | 302 | `/p/:shortCode` (Frontend) |
| Expired link | 302 | `/expired` (Frontend) |
| Archived link | 302 | `/expired` (Frontend) |
| Not found | 302 | `/not-found` (Frontend) |

---

#### Examples

**Normal redirect:**
```
GET /abc123
→ 301 Redirect to https://example.com/original-url
```

**Password protected:**
```
GET /abc123
→ 302 Redirect to https://app.snyp.click/p/abc123
```

**Expired/Archived:**
```
GET /abc123
→ 302 Redirect to https://app.snyp.click/expired
```

---

### Notes
- Password verification is handled by `POST /api/links/:shortCode/verify` (see [Link API](link.md))
- Click tracking occurs only on successful redirects (not password/expired pages)
- QR scan tracking: append `?qr=1` to the short link