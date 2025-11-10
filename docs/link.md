# Link API Spec

## Create Link API

### 1. Guest user

Endpoint: POST /api/links

Request Body:
```json
{
  "long_url" : "https://riakgu.com"
}
```
Response Body Success:
```json
{
  "data": {
    "id" : 1,
    "user_id" : null,
    "title" : "",
    "long_url" : "https://riakgu.com",
    "schort_code": "random",
    "expired_at": 0
  }
}
```

Response Body Error:
```json
{
  "errors": "Long URL length max 1000"
}
```

### 2. Authenticated user

Endpoint: POST /api/links

Request Body:
```json
{
  "long_url" : "https://riakgu.com"
  "title" : "riakgu" // optional
  "password": "secret" // optional
  "expired_at": 0 // optional
}
```
Response Body Success:
```json
{
  "data": {
    "id" : 1,
    "user_id" : "userid",
    "title" : "riakgu",
    "long_url" : "https://riakgu.com",
    "schort_code": "random",
    "expired_at": 0
  }
}
```

Response Body Error:
```json
{
  "errors": "Long URL length max 1000"
}
```

## Update Link API
Endpoint: PUT /api/links/:id

Request Body:
```json
{
  "title" : "riakgu update" // optional
  "short_code" : "rizky",
  "password": "secret" // optional
  "expired_at": 0 // optional
}
```
Response Body Success:
```json
{
  "data": {
    "id" : 1,
    "user_id" : "userid",
    "title" : "riakgu update",
    "long_url" : "https://riakgu.com",
    "short_code": "rizky",
    "expired_at": 0
  }
}
```

Response Body Error:
```json
{
  "errors": "Title length max 100"
}
```