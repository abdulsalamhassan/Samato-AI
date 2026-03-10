from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import alerts, analysis, rankings
from app.config import get_settings

settings = get_settings()

app = FastAPI(title=settings.app_name, version=settings.app_version)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(rankings.router, prefix="/api", tags=["rankings"])
app.include_router(analysis.router, prefix="/api", tags=["analysis"])
app.include_router(alerts.router, prefix="/api", tags=["alerts"])
