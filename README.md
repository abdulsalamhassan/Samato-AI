# SAMATO AI

Scaffold for the SAMATO AI drought crisis detection and nomad alert system described in the project blueprint.

## Workspace

- `frontend/`: Next.js dashboard for crisis map, rankings, AI analyzer, alerts, and SMS preview
- `backend/`: FastAPI API for rankings, risk analysis, nearest water lookup, SMS generation, and alert generation

## Planned build order

1. Day 1: Map shell, seed data, rankings endpoint
2. Day 2: Risk scoring and region detail flow
3. Day 3: AI analysis integration
4. Day 4: SMS, alert, and radio script generation
5. Day 5: polish, error states, deployment

## Local setup

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Environment

- Copy `frontend/.env.example` to `frontend/.env.local`
- Copy `backend/.env.example` to `backend/.env`

AI integration is scaffolded behind environment variables so the prototype can be built incrementally without blocking on provider access.
"# Samato" 
