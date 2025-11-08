# User API Spec

## Create User API

Endpoint: POST /api/users

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

## Update User API

Endpoint: PATCH /api/users/me

Header:
- Authorization: token

Request Body:
```json
{
  "name": "riakgu new", // optional
  "password": "newpassword" // optional
}
```
Response Body Success:
```json
{
  "data": {
    "name": "riakgu new"
  }
}
```

Response Body Error:
```json
{
  "errors": "name length max 100"
}
```