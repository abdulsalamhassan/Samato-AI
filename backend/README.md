# Backend

FastAPI scaffold for SAMATO AI.

## Run

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Next steps

- Improve drought scoring with richer heuristics
- Add live AI integration behind a service abstraction
- Expand routing for alerts, SMS, and radio scripts
