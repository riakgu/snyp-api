# Auth API Spec

## Register API

Endpoint: POST /api/auth/register

Request Body:
```json
{
  "email" : "info@riakgu.com",
  "password": "supersecret",
  "name": "riakgu"
}
```
Response Body Success:
```json
{
  "data": {
    "email" : "info@riakgu.com",
    "name": "riakgu"
  }
}
```

Response Body Error:
```json
{
  "errors": "email already registered"
}
```

## Login API

Endpoint: POST /api/auth/login

Request Body:
```json
{
  "email" : "info@riakgu.com",
  "password": "supersecret"
}
```
Response Body Success:
```json
{
  "data": {
    "access_token" : "token",
    "refresh_token" : "token"
  }
}
```

Response Body Error:
```json
{
  "errors": "Email or password wrong"
}
```

## Refresh Token API

Endpoint: POST /api/auth/refresh

Header:
- Authorization: token

Response Body Success:
```json
{
  "data": {
    "access_token": "token",
    "refresh_token": "token"
  }
}
```

Response Body Error:
```json
{
  "errors": "Unauthorized"
}
```

## Get Auth API

Endpoint: GET /api/auth/me

Header:
- Authorization: token

Response Body Success:
```json
{
  "user_id": "uuid"
}
```

Response Body Error:
```json
{
  "errors": "Unauthorized"
}
```

## Logout API
Endpoint: DELETE /api/auth/logout

Header:
- Authorization: token

Response Body Success:
```json
{
  "message": "success"
}
```
Response Body Error:
```json
{
  "errors": "Unauthorized"
}
```
