# Portfolio MERN Stack

This project is now structured as a MERN full-stack app:

- `client`: React (Vite) frontend
- `server`: Express + MongoDB backend

## Features

- Portfolio content API at `/api/portfolio`
- Contact form API at `/api/contact`
- Rule-based chatbot API at `/api/chat`
- Health check endpoint at `/api/health`
- Automatic MongoDB seed on first run when DB is available
- In-memory fallback mode if MongoDB is unavailable

## Quick Start

1. Install dependencies:

   npm run install:all

2. Create environment file for backend:

   Copy `server/.env.example` to `server/.env`

3. (Recommended) Start MongoDB locally (default URL used in `.env.example`):

   mongodb://127.0.0.1:27017/portfolio_db

   If MongoDB is not running, the server still starts in fallback mode.

4. Run frontend and backend together:

   npm run dev

## Environment Variables (`server/.env`)

- `PORT=5000`
- `MONGO_URI=mongodb://127.0.0.1:27017/portfolio_db`
- `CLIENT_ORIGIN=http://localhost:5173`

## API Endpoints

- `GET /api/health` -> `{ ok: true }`
- `GET /api/portfolio` -> portfolio JSON (DB-backed or fallback data)
- `POST /api/contact` -> saves `{ name, email, message }`
- `POST /api/chat` -> accepts `{ message }`, returns `{ reply }`

## Ports

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
