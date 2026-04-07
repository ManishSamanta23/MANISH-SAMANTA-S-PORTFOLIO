# Portfolio MERN Stack

This project is now structured as a MERN full-stack app:

- `client`: React (Vite) frontend
- `server`: Express + MongoDB backend

## Features

- Portfolio content served from MongoDB (`/api/portfolio`)
- Contact form stores messages in MongoDB (`/api/contact`)
- Chatbot endpoint from backend (`/api/chat`)
- Existing profile/project images migrated to React public assets

## Quick Start

1. Install dependencies:

   npm run install:all

2. Create environment file for backend:

   Copy `server/.env.example` to `server/.env`

3. Start MongoDB locally (default URL used in `.env.example`):

   mongodb://127.0.0.1:27017/portfolio_db

4. Run both frontend and backend:

   npm run dev

## Ports

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
