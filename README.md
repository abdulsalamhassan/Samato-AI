# SAMATO AI

SAMATO AI is a drought monitoring and humanitarian decision-support prototype focused on Somalia. The platform combines district-level risk scoring, rainfall context, water-source routing, aid-planning guidance, and community alert generation.

## Workspace

- `frontend/`: Next.js 15 dashboard for the crisis map, rankings, decision support, and alert previews
- `backend/`: FastAPI service for drought analysis, ranking, water navigation, aid planning, rainfall refresh, and alert generation

## Architecture

- The backend assembles region records from local baseline JSON, rainfall observations, population CSV data, and satellite-derived priority inputs.
- Risk scores, recommended actions, and logistics estimates are computed server-side.
- The frontend consumes the backend API and renders the operator dashboard.
- Optional AI providers can enhance some text outputs, but the system has deterministic fallbacks for core workflows.

## Local Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Validation

```bash
cd backend
pytest -q
```

## Environment Notes

- Frontend uses `NEXT_PUBLIC_API_BASE_URL` when provided and otherwise defaults to `http://127.0.0.1:8000`.
- Backend supports `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `AI_PROVIDER`, and rainfall refresh settings through `.env`.
- No `.env.example` files are currently checked in, so create local env files manually if needed.
