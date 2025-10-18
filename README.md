# Backend API

Node.js/Express service that provides JWT-secured authentication and CRUD endpoints for the product dashboard. It validates captcha tokens, hashes user passwords with bcrypt, and persists data in PostgreSQL.

## Prerequisites

- Node.js 18 or newer (`node -v`)
- npm 9+ (`npm -v`)
- PostgreSQL 14+ (`psql --version`)

## Project Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Create environment file** – copy the template below into `backend/.env` and adjust the values to your machine (database name, user, and secrets).
   ```
   PORT=4000
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/product_management
   DATABASE_SSL=false
   JWT_SECRET=pisang_goreng
   JWT_EXPIRATION=1h
   CAPTCHA_PROVIDER=recaptcha # or hcaptcha
   CAPTCHA_SECRET_KEY=pisang_rebus
   # CAPTCHA_VERIFY_URL=https://custom-provider.example.com/siteverify
   CORS_ORIGIN=http://localhost:5173
   ```
   - `DATABASE_URL` must contain valid PostgreSQL credentials. If you use peer auth, remove the password segment (e.g. `postgres://<your-user>@localhost:5432/product_management`).
   - Set `CAPTCHA_SECRET_KEY` to the server-side secret that matches the site key used in the frontend.

3. **Provision the database**
   ```bash
   createdb product_management
   psql product_management <<'SQL'
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
   SQL
   ```

4. **Seed an admin user**
   ```bash
   HASH=$(node -e "console.log(require('bcrypt').hashSync('semangkaBakar', 12))")
   psql product_management <<SQL
   INSERT INTO users (username, password_hash)
   VALUES ('admin', '$HASH')
   ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash;
   SQL
   ```

## Running the Server

```bash
npm run dev
```

The server boots on `http://localhost:4000`. Confirm it is healthy:
```bash
curl http://localhost:4000/health
```

Use the generated JWT to call protected endpoints, e.g.:
```bash
curl -H "Authorization: Bearer <token>" http://localhost:4000/api/products
```

## API Overview

- `POST /api/login` – body `{ username, password, captchaToken }`
- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

All routes except `/api/login` require the `Authorization: Bearer <JWT>` header.

## Useful Scripts

- `npm run dev` – start the Nodemon dev server
- `npm start` – run with Node
- `npm run lint` – run ESLint checks

## CAPTCHA Notes

The backend currently targets Google reCAPTCHA. To switch to hCaptcha, set `CAPTCHA_PROVIDER=hcaptcha` and replace the secret key. You can also override the verification endpoint via `CAPTCHA_VERIFY_URL` to support enterprise or self-hosted variants.
