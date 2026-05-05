# MY PORTFOLIO (MANISH SAMANTA)

> Full-stack portfolio built with React, Vite, Express, MongoDB, and a Gemini-backed chat fallback.
![Status](https://img.shields.io/badge/STATUS-ACTIVE-111827?style=for-the-badge)
![Frontend](https://img.shields.io/badge/FRONTEND-React%2018%20%2B%20Vite%205-0EA5E9?style=for-the-badge)
![Backend](https://img.shields.io/badge/BACKEND-Node.js%20%2B%20Express%204-22C55E?style=for-the-badge)
![Database](https://img.shields.io/badge/DATABASE-MongoDB%20%2B%20Mongoose%208-16A34A?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-Gemini%20Optional-F59E0B?style=for-the-badge)

## What This Project Is

This project is a full-stack portfolio platform with:
- React + Vite frontend using a custom Tailwind-based UI layer
- Express + MongoDB backend
- Portfolio, contact, and chat APIs
- Automatic seed data and in-memory fallback support when MongoDB is unavailable

This repository uses a nested workspace:
- root: command entry point
- `portfolio/client`: frontend app
- `portfolio/server`: backend API

The default mounted UI is `AppTailwind.jsx`; `App.jsx` is also present in the client source tree.

## Key Features

- `GET /api/health`: health check endpoint
- `GET /api/portfolio`: returns portfolio content from MongoDB or in-memory fallback
- `POST /api/contact`: validates and stores contact messages
- `POST /api/chat`: uses Gemini when configured, otherwise returns rule-based replies
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
      |       |-- App.jsx
      |       |-- AppTailwind.jsx
      |       |-- index.css
      |       `-- main.jsx
      `-- server/
            |-- .env.example
            |-- package.json
            `-- src/
                  |-- index.js
                  |-- config/
                  |   `-- db.js
                  |-- models/
                  |   |-- ContactMessage.js
                  |   `-- Portfolio.js
                  |-- routes/
                  |   |-- chatRoutes.js
                  |   |-- contactRoutes.js
                  |   `-- portfolioRoutes.js
                  `-- seed/
                      `-- defaultPortfolio.js
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

MongoDB is optional for development because fallback mode is built in.

### 1) Install Dependencies

```bash
npm run install:all
```

### 2) Configure Environment

```bash
copy portfolio\server\.env.example portfolio\server\.env
```

If you are on macOS or Linux, use `cp portfolio/server/.env.example portfolio/server/.env` instead.

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

- `MONGO_URI` is required for normal database mode. If it is missing or MongoDB is unavailable, the server runs in in-memory fallback mode.
- If `GEMINI_API_KEY` is missing, chat uses local rule-based replies.
- `CLIENT_ORIGIN` controls the allowed browser origin for CORS.

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
- Excludes the hidden `Age Calculator` project from the response

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

Validation:

- `name`, `email`, and `message` are required

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

The local fallback responds to questions about skills, projects, study details, and contact links.

## Runtime Notes

- Server starts even if MongoDB is down.
- On successful DB connection, default portfolio is seeded only when collection is empty.
- CORS origin defaults to `http://localhost:5173` and is configurable via `CLIENT_ORIGIN`.
- The frontend loads portfolio data from `/api/portfolio` and opens the chat UI from that data.
- Contact submissions are stored in MongoDB when available, otherwise in memory for the current run.

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
