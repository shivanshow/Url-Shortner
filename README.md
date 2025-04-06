# URL Shortener API with Authentication (JWT + Refresh Token)

A secure and scalable RESTful API built with Node.js and Express, designed for shortening URLs and handling user authentication using JWT and refresh tokens.

---

## Features

- User registration and login with hashed passwords
- JWT-based authentication
- Refresh token support via HTTP-only cookies
- URL shortening and redirection

---

## Tech Stack

- **Node.js** – Server-side JavaScript runtime
- **Express** – Web framework for building the API
- **MongoDB + Mongoose** – Database and ODM
- **JWT (JSON Web Tokens)** – Authentication
- **bcrypt** – Password hashing
- **HTTP-only Cookies** – Refresh token storage

---

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure MongoDB**

   Ensure MongoDB is running locally or set up a remote database (e.g. MongoDB Atlas).

4. **Start the server**

   ```bash
   node index.js
   ```

---

## Environment Secrets

Example development secrets:

```js
const ACCESS_SECRET = "access123";
const REFRESH_SECRET = "refresh";
```

Use strong, secure values for production.

---

## API Endpoints

### POST `/register`
Registers a new user.

**Request Body:**
```json
{
  "username": "testuser",
  "password": "123456"
}
```

---

### POST `/login`
Authenticates a user and issues an access token (in response) and a refresh token (in HTTP-only cookie).

**Request Body:**
```json
{
  "username": "testuser",
  "password": "123456"
}
```

---

### POST `/refresh-token`
Generates a new access token using a valid refresh token stored in cookies.

---

### POST `/url`
Creates a short URL. Requires authentication.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "originalUrl": "https://example.com"
}
```

---

### GET `/:shortId`
Redirects to the original URL using the short ID.

---


## Notes

- Routes like `/url` are protected and require a valid JWT access token.
- Refresh tokens are securely handled via HTTP-only cookies.
- Passwords are hashed with `bcrypt` before being stored.
- This API follows REST principles and is ready for frontend or mobile integration.

