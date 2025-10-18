## Backend API

### Requirements

- Node.js 18+
- PostgreSQL 14+

### Environment Variables

Create a `.env` file in this directory with the following keys:

```
PORT=4000
DATABASE_URL=postgres://user:password@localhost:5432/product_management
DATABASE_SSL=false
JWT_SECRET=pisang_goreng
JWT_EXPIRATION=1h
CAPTCHA_PROVIDER=recaptcha # or hcaptcha
CAPTCHA_SECRET_KEY=your-captcha-secret
# CAPTCHA_VERIFY_URL=https://custom-provider.example.com/siteverify (optional override)
# CORS_ORIGIN=http://localhost:5173 (optional)
```

### Database Setup

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  price DECIMAL,
  image_url VARCHAR(255),
  latitude DECIMAL,
  longitude DECIMAL
);
```

Seed at least one user by hashing the password with bcrypt:

```bash
node -e "console.log(require('bcrypt').hashSync('password', 12))"
```

### Install & Run

```bash
npm install
npm run dev
```

The server starts on `http://localhost:4000`.

### API Overview

- `POST /api/login`
  - Body: `{ "username": "...", "password": "...", "captchaToken": "..." }`
  - Response: `{ "token": "...", "user": { "id": 1, "username": "..." } }`

All product endpoints require an `Authorization: Bearer <JWT>` header.

- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### CAPTCHA

The backend verifies Google reCAPTCHA v2/v3 or hCaptcha tokens. Provide the appropriate secret via `CAPTCHA_SECRET_KEY` and configure the frontend to send the token as `captchaToken`.

