# MY PORTFOLIO (MANISH SAMANTA)

> Smart, full-stack developer portfolio built with MERN and optional Gemini-powered chat.

![Status](https://img.shields.io/badge/STATUS-ACTIVE-111827?style=for-the-badge)
![Frontend](https://img.shields.io/badge/FRONTEND-React%2018%20%2B%20Vite%205-0EA5E9?style=for-the-badge)
![Backend](https://img.shields.io/badge/BACKEND-Node.js%20%2B%20Express%204-22C55E?style=for-the-badge)
![Database](https://img.shields.io/badge/DATABASE-MongoDB%20%2B%20Mongoose%208-16A34A?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-Gemini%20Optional-F59E0B?style=for-the-badge)

## What This Project Is

This project is a full-stack portfolio platform with:

- React + Vite + Tailwind frontend
- Express + MongoDB backend
- Chat API with optional Gemini integration
- Automatic seed data and in-memory fallback support when DB is unavailable

This repository uses a nested workspace:

- root: command entry point
- `portfolio/client`: frontend app
- `portfolio/server`: backend API

## Key Features

- `GET /api/portfolio`: returns portfolio content
- `POST /api/contact`: stores contact messages
- `POST /api/chat`: AI/rule-based assistant responses
- `GET /api/health`: health check endpoint
- First-run seed for default portfolio data
- Graceful fallback mode without MongoDB

## Tech Stack

### Frontend

- React 18
- Vite 5
- Tailwind CSS 4

### Backend

- Node.js + Express 4
- MongoDB + Mongoose 8
- CORS + dotenv
- Google Generative AI SDK (`@google/generative-ai`)

## Project Structure

```text
.
|-- package.json
`-- portfolio/
      |-- package.json
      |-- client/
      |   |-- package.json
      |   `-- src/
      `-- server/
            |-- .env.example
            |-- package.json
            `-- src/
                  |-- index.js
                  |-- config/db.js
                  |-- models/
                  |-- routes/
                  `-- seed/defaultPortfolio.js
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB (local or remote URI, recommended)

MongoDB is optional for development because fallback mode is built in.

### 1) Install Dependencies

```bash
npm run install:all
```

### 2) Configure Environment

```bash
copy portfolio\server\.env.example portfolio\server\.env
```

### 3) Run Development Servers

```bash
npm run dev
```

### 4) Open Locally

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health: http://localhost:5000/api/health

## Environment Variables

File: `portfolio/server/.env`

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/portfolio_db
CLIENT_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
```

Notes:

- If `GEMINI_API_KEY` is missing, chat uses local rule-based replies.
- If MongoDB is unavailable, server still runs in fallback mode.

## Scripts

### Root (`package.json`)

- `npm run dev` -> runs `portfolio` dev script
- `npm run install:all` -> installs full workspace dependencies

### Portfolio (`portfolio/package.json`)

- `npm run dev` -> runs backend + frontend concurrently
- `npm run dev:server` -> backend only
- `npm run dev:client` -> frontend only
- `npm run install:all` -> installs portfolio, server, and client deps

### Client (`portfolio/client/package.json`)

- `npm run dev` -> starts Vite dev server
- `npm run build` -> creates production build
- `npm run preview` -> previews production build

### Server (`portfolio/server/package.json`)

- `npm run dev` -> starts backend with nodemon
- `npm start` -> starts backend with node

## API Reference

Base URL: `http://localhost:5000`

### `GET /api/health`

```json
{ "ok": true }
```

### `GET /api/portfolio`

Behavior:

- Returns MongoDB data when connected
- Falls back to seeded default data if DB is unavailable

### `POST /api/contact`

Request body:

```json
{
   "name": "Your Name",
   "email": "you@example.com",
   "message": "Hello"
}
```

Success response:

```json
{ "message": "Message saved successfully" }
```

Fallback response:

```json
{ "message": "Message saved in fallback mode" }
```

### `POST /api/chat`

Request body:

```json
{ "message": "Tell me about your skills" }
```

Response:

```json
{ "reply": "..." }
```

Behavior:

- With `GEMINI_API_KEY`: uses Gemini (`gemini-2.5-flash`)
- Without key or on API failure: uses local rule-based answers

## Runtime Notes

- Server starts even if MongoDB is down.
- On successful DB connection, default portfolio is seeded only when collection is empty.
- CORS origin defaults to `http://localhost:5173` and is configurable via `CLIENT_ORIGIN`.

## Troubleshooting

### Port Already In Use

The `portfolio` dev script runs `kill-port` for common local ports before startup.

### MongoDB Connection Errors

- Verify MongoDB is running
- Verify `MONGO_URI` in `portfolio/server/.env`
- Continue in fallback mode for local development if needed

### Chat Not Using Gemini

- Confirm `GEMINI_API_KEY` exists in `portfolio/server/.env`
- Restart backend after updating `.env`

## Production Notes

- Build frontend: `npm run build --prefix portfolio/client`
- Start backend: `npm start --prefix portfolio/server`
- Set secure production values for `MONGO_URI`, `CLIENT_ORIGIN`, and `GEMINI_API_KEY`

## License

This project is for personal portfolio and learning use.
