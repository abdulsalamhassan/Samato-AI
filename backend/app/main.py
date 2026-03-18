import asyncio
from contextlib import asynccontextmanager, suppress

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import aid, alerts, analysis, dashboard, data_pipeline, geography, priority, rankings, regions, water
from app.core.logging import add_logging_middleware, configure_logging
from app.core.settings import get_settings
from app.repositories.rainfall_repo import RainfallRepository
from app.repositories.region_repo import RegionRepository
from app.services.rainfall_refresh_service import refresh_rainfall_feed

settings = get_settings()
configure_logging()


async def _rainfall_refresh_loop() -> None:
    while True:
        refresh_rainfall_feed(
            settings,
            RainfallRepository(),
            RegionRepository(),
        )
        await asyncio.sleep(max(60, settings.rainfall_refresh_interval_minutes * 60))


@asynccontextmanager
async def lifespan(_: FastAPI):
    task = None
    if settings.rainfall_auto_refresh_enabled:
        task = asyncio.create_task(_rainfall_refresh_loop())

    try:
        yield
    finally:
        if task is not None:
            task.cancel()
            with suppress(asyncio.CancelledError):
                await task


app = FastAPI(title=settings.app_name, version=settings.app_version, lifespan=lifespan)

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
app.include_router(aid.router)
app.include_router(water.router)
app.include_router(rankings.router)
app.include_router(alerts.router)
app.include_router(data_pipeline.router)
app.include_router(dashboard.router)
app.include_router(geography.router)
app.include_router(priority.router)
