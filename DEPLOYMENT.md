# Deployment

SAMATO AI is structured as two deployable services:

- `frontend/`: Next.js application
- `backend/`: FastAPI API

## Required Environment Variables

### Frontend

Create `frontend/.env` from `frontend/.env.example`.

- `NEXT_PUBLIC_API_BASE_URL`
  Use the public HTTPS URL of the backend API, for example `https://api.example.com`.

### Backend

Create `backend/.env` from `backend/.env.example`.

Set at minimum:

- `ALLOWED_ORIGINS`
  Comma-separated frontend origins, for example `https://app.example.com,https://www.example.com`
- `AI_PROVIDER`
  Use `deterministic` if you are not enabling an external model provider.

Optional:

- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `RAINFALL_FEED_URL`
- `RAINFALL_FEED_PATH`
- `RAINFALL_AUTO_REFRESH_ENABLED`
- `RAINFALL_REFRESH_INTERVAL_MINUTES`

## Direct Runtime Commands

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Frontend

```bash
cd frontend
npm install
npm run build
PORT=${PORT:-3000} npm run start -- --hostname 0.0.0.0 --port $PORT
```

## Docker Deployment

Each service has its own Dockerfile:

- `frontend/Dockerfile`
- `backend/Dockerfile`

Build examples:

```bash
docker build -t samato-backend ./backend
docker build -t samato-frontend \
  --build-arg NEXT_PUBLIC_API_BASE_URL=https://api.example.com \
  ./frontend
```

Run examples:

```bash
docker run --env-file backend/.env -p 8000:8000 samato-backend
docker run -p 3000:3000 samato-frontend
```

## Docker Compose

For a quick two-service deployment or pre-deploy validation:

```bash
docker compose up --build
```

The provided `compose.yaml` expects:

- `frontend/.env`
- `backend/.env`

By default the compose setup builds the frontend against `http://localhost:8000`.
