# Backend

FastAPI service layer for SAMATO AI.

## Responsibilities

- Build district records from baseline, rainfall, population, and satellite inputs
- Compute drought risk and district rankings
- Resolve nearest viable water sources
- Generate aid-planning outputs plus SMS, alert, and radio content
- Expose dashboard and rainfall-refresh endpoints

## Run

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Test

```bash
pytest -q
```
