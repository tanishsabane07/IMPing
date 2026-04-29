# IMP_Project

An internship management platform (frontend + backend) built with React (Vite) and Node/Express + MongoDB. This repository contains a Vite React client and an Express API server with Cloudinary uploads and JWT authentication.

**Tech stack**
- Frontend: React 19, Vite, Tailwind (utility CSS used), Radix UI components
- Backend: Node.js (18.x), Express 5, MongoDB (mongoose), JWT auth, Cloudinary for file storage

Repository layout
- `client/` — Vite React frontend
- `server/` — Express backend, routes, models, and middleware

Quick links
- Client entry: [client](client)
- Server entry: [server](server)

Prerequisites
- Node.js 18.x (the project and CI target Node 18)
- npm or yarn
- MongoDB (Atlas or local)
- Cloudinary account (if you want image / resume uploads)

Environment variables (server)
Create a `.env` file inside the `server/` folder. Example values:

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/imp_db?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here

# Optional: allowlist for CORS (comma-separated) and single FRONTEND_URL
FRONTEND_URLS=http://localhost:5173,http://localhost:3000
FRONTEND_URL=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Local development

1. Backend

```bash
cd server
npm install
# create server/.env from the example above
npm run dev
```

The backend will run on `http://localhost:5000` by default.

2. Frontend

```bash
cd client
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:5173` by default.

Build for production

1. Build the frontend

```bash
cd client
npm run build
```

2. Serve from the backend in production

The Express server is configured to serve `client/dist` when `NODE_ENV=production`. After building the client, set `NODE_ENV=production` and start the server (or deploy both to your preferred hosts):

```bash
cd server
npm start
```

Deployment notes
- CI/workflows target Node 18.x (see `.github/workflows/main_imp.yml`). Keep CI and runtime Node versions consistent with `server/package.json` engines.
- Recommended hosting:
	- Client: Vercel (automatic from `client/dist` / Vite build)
	- Server: Render / Railway / Heroku / your VPS

Troubleshooting
- CORS: Allowed frontend origins can be provided via `FRONTEND_URLS` or `FRONTEND_URL`. The server also accepts Vercel preview domains matching the configured pattern.
- Node version issues: the codebase targets Node 18; if you use `nvm`, switch to `18`.
- DB connection: confirm `MONGO_URI` is correct and accessible from your environment.

Contributing
- Fork the repo, make changes on a topic branch, and open a pull request. Use clear commit messages describing feature/bugfix scope.

License
- MIT

Contact
- For questions or help run the app locally and raise an issue with logs and steps to reproduce.
