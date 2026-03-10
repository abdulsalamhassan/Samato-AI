from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import alerts, analysis, rankings, regions, water
from app.core.logging import add_logging_middleware, configure_logging
from app.core.settings import get_settings

settings = get_settings()
configure_logging()

app = FastAPI(title=settings.app_name, version=settings.app_version)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
add_logging_middleware(app)


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(regions.router)
app.include_router(analysis.router)
app.include_router(water.router)
app.include_router(rankings.router)
app.include_router(alerts.router)
