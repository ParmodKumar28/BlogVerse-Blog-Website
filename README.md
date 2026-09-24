# BlogVerse — Modern MERN Stack Blogging Platform

BlogVerse is a complete, feature-rich, full-stack blogging platform built using the MERN stack (MongoDB, Express, React, Node.js). It provides a sleek, responsive interface for users to register, manage their profiles, and write, update, read, or delete blog posts.

---

## Key Features

*   **Secure Authentication**: User registration and login powered by `bcrypt` password hashing and a dual **JSON Web Token** scheme (short-lived access token + rotating refresh token) delivered exclusively via **HTTP-only, SameSite cookies** so tokens are never exposed to JavaScript.
*   **Real Session Revocation**: Logging out rotates a per-user `tokenVersion`, instantly invalidating every previously issued access/refresh token server-side.
*   **State Management**: Seamless global state synchronization on the frontend using Redux Toolkit.
*   **Rich User Profiles**: Customizable user profiles with optional profile picture upload support handled by `multer`.
*   **Complete Blog CRUD**: Authorized users can create, edit, and delete their blog posts, complete with category categorization and estimated read times.
*   **Responsive Styling**: Fully responsive user interface crafted with Tailwind CSS and Lucide Icons.
*   **Concurrent Dev Environment**: Single-command development startup for both frontend and backend using `concurrently`.

---

## Tech Stack

### Frontend
*   **Core**: React (v18)
*   **State Management**: Redux Toolkit & React Redux
*   **Routing**: React Router DOM (v6) with Protected Route guard wrappers
*   **Styling**: Tailwind CSS & PostCSS
*   **HTTP Client**: Axios (configured with credentials for secure cookie management)
*   **Feedback**: React Toastify (for notifications) & React Loader Spinner

### Backend
*   **Core**: Node.js & Express
*   **Database**: MongoDB & Mongoose (ODM)
*   **Authentication**: JSON Web Tokens (`jsonwebtoken`) with `cookie-parser` for HTTP-only session cookies
*   **Security**: `bcrypt` password hashing, `helmet` security headers, CORS allow-list, `express-rate-limit`, `express-mongo-sanitize` (NoSQL injection guard), and `sanitize-html` (XSS scrubbing)
*   **File Uploads**: `multer` middleware with image type/size validation (for user profile pictures)
*   **Logging**: `morgan` request logging
*   **Environment**: Dotenv for configuration management

---

## Security Overview

BlogVerse follows defense-in-depth practices for a multi-user blogging platform:

*   **Token handling**: Access token (default 15 min) + refresh token (default 7 days), both `HttpOnly`, `SameSite`, and `Secure`-in-production. Tokens never touch `localStorage`, so a successful XSS cannot exfiltrate them.
*   **Session revocation**: A `tokenVersion` field on each user is bumped on logout; every request validates the token's version against the database, so stolen/old tokens stop working immediately.
*   **JWT hardening**: Signing algorithm pinned to `HS256` (prevents algorithm-confusion attacks) with separate secrets for access and refresh tokens.
*   **Stored XSS prevention**: All user-generated blog text is sanitized server-side (`sanitize-html`) before persistence and again client-side (`DOMPurify`) before render.
*   **NoSQL injection prevention**: `express-mongo-sanitize` strips `$`/`.` operators from body, query, and params.
*   **Password security**: `bcrypt` at cost factor 12, plus minimum-length and email-format validation.
*   **Rate limiting**: A global API limiter plus a stricter dedicated limiter on the credential (`/login`, `/register`) endpoints to blunt brute-forcing.
*   **Upload safety**: Profile images are restricted by extension, MIME type, and a 5 MB size cap.
*   **Error hygiene**: Internal errors return generic messages; detailed stacks are logged server-side only.
*   **Config safety**: The app fails fast at boot if required secrets are missing, too short, or duplicated.

---

## Repository Structure

```text
Blog-Website/
├── Backend/                    # Express server and database logic
│   ├── src/
│   │   ├── Database/           # MongoDB configuration using Mongoose
│   │   ├── features/
│   │   │   ├── users/          # User routes, schemas, controllers, and repositories
│   │   │   └── blogs/          # Blog CRUD routes, schemas, controllers, and repositories
│   │   ├── middlewares/        # Authentication guards and global error handlers
│   │   ├── utils/              # Helper utilities
│   │   └── app.js              # Express app config (CORS, Parsers, routes)
│   ├── server.js               # Database connection and server entrypoint
│   └── package.json            # Backend scripts and dependencies
│
└── frontend/                   # React Single Page Application (SPA)
    ├── public/                 # Static assets
    ├── src/
    │   ├── api/                # Axios instance configuration
    │   ├── components/         # Shared and feature-specific React components
    │   ├── Redux/              # Redux slices and store configuration
    │   ├── utils/              # Client-side utility functions
    │   ├── App.js              # React Router structure
    │   └── index.js            # Frontend entrypoint
    └── package.json            # React scripts and dependencies
```

---

## API Endpoints Documentation

### User Routes (`/api/user`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/register` | Register a new user | ❌ |
| `POST` | `/login` | Authenticate user & set HTTP-only auth cookies | ❌ |
| `POST` | `/refresh` | Exchange the refresh cookie for a new access cookie | ❌ |
| `POST` | `/logout` | Revoke all tokens & clear auth cookies | ❌ |
| `GET` | `/me` | Restore the current user from the access cookie | ✅ |
| `PUT` | `/profile` | Update profile details (username, profile image) | ✅ |

### Blog Routes (`/api/blog`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/` | Create a new blog post | ✅ |
| `GET` | `/` | Fetch all blog posts | ❌ |
| `GET` | `/:id` | Fetch details of a single blog post | ❌ |
| `PUT` | `/:id` | Update an existing blog post (owner only) | ✅ |
| `DELETE` | `/:id` | Delete a blog post (owner only) | ✅ |

---

## Setup & Installation

### Prerequisites
*   Node.js (v16.x or higher)
*   npm (v7.x or higher)
*   MongoDB Instance (Atlas or Local)

### 1. Clone the repository
```bash
git clone <repository-url>
cd Blog-Website
```

### 2. Configure Environment Variables

#### Backend Configuration
Create a `.env` file in the `Backend/` directory:
```env
PORT=8000
DB_URL=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=at_least_32_random_chars_for_access_tokens
REFRESH_TOKEN_SECRET=at_least_32_random_chars_for_refresh_tokens
ACCESS_TOKEN_TTL_MIN=15
REFRESH_TOKEN_TTL_DAYS=7
FRONTEND_URL=https://your-blogverse-app.netlify.app
# Set to "production" when deploying so cookies use SameSite=None; Secure
# (required for cross-domain frontend ↔ API over HTTPS)
NODE_ENV=development
```

> Generate strong secrets with, e.g., `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
> The API **fails fast at startup** if `DB_URL`, `ACCESS_TOKEN_SECRET`, or `REFRESH_TOKEN_SECRET` are missing, shorter than 32 chars, or identical to each other.

#### Frontend Configuration
Create a `.env` file in the `frontend/` directory:
```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
```

### 3. Install Dependencies
Run npm install in both directories:
```bash
# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## Run the Application

You can launch both the **Backend API Server** and the **React Frontend Server** concurrently from the `Backend` directory:

```bash
cd Backend
npm run dev
```

*   **Backend Server** runs at: [http://localhost:8000](http://localhost:8000)
*   **Frontend Server** runs at: [http://localhost:3000](http://localhost:3000)
