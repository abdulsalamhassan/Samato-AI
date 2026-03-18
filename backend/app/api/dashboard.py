from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, Query

from app.api.deps import (
    get_rainfall_repository,
    get_region_repository,
    get_water_source_repository,
)
from app.core.rate_limit import rate_limit
from app.core.settings import Settings, get_settings
from app.models.alert import AlertResponse, RadioScriptResponse, SmsResponse
from app.models.dashboard import (
    AnalysisCenterItem,
    AnalysisCenterResponse,
    DashboardBootstrapResponse,
    RegionDecisionContext,
    RainfallRefreshStatus,
)
from app.repositories.rainfall_repo import RainfallRepository
from app.repositories.region_repo import RegionRepository
from app.repositories.water_repo import WaterSourceRepository
from app.services.aid_planner import build_aid_plan
from app.services.ai_text_engine import build_alert_report, build_radio_script, generate_ai_analysis
from app.services.drought_engine import calculate_risk
from app.services.rainfall_refresh_service import load_refresh_status, refresh_rainfall_feed
from app.services.ranking_engine import rank_regions
from app.services.sms_engine import generate_sms
from app.services.water_engine import find_nearest_water

router = APIRouter(tags=["dashboard"])


def _build_region_details(
    region_id: str,
    region_repository: RegionRepository,
    water_repository: WaterSourceRepository,
    settings: Settings,
) -> RegionDecisionContext:
    region = region_repository.get_region_by_id(region_id)
    if region is None:
        raise HTTPException(status_code=404, detail="Region not found")

    analysis = calculate_risk(region)
    navigation = find_nearest_water(region, water_repository.get_all_water_sources())
    if navigation is None:
        raise HTTPException(status_code=404, detail="No viable water source found")

    sms_result = generate_sms(region, navigation, analysis, settings)
    aid_plan = build_aid_plan(region, analysis, navigation)
    return RegionDecisionContext(
        region=region,
        analysis=analysis,
        aidPlan=aid_plan,
        waterNavigation=navigation,
        sms=SmsResponse(
            message=sms_result.text,
            provider=sms_result.provider,
            usedFallback=sms_result.used_fallback,
        ),
        alert=AlertResponse(report=build_alert_report(region, analysis, navigation, settings)),
        radio=RadioScriptResponse(script=build_radio_script(region, analysis, navigation, settings)),
        aiAnalysis=generate_ai_analysis(region, analysis, settings),
        confidence=analysis.confidence,
    )


@router.get("/dashboard/bootstrap", response_model=DashboardBootstrapResponse)
def get_dashboard_bootstrap(
    ranking_limit: int | None = Query(default=20, ge=1, le=200),
    _: None = Depends(rate_limit("dashboard-bootstrap")),
    region_repository: RegionRepository = Depends(get_region_repository),
    settings: Settings = Depends(get_settings),
) -> DashboardBootstrapResponse:
    regions = region_repository.get_all_regions()
    return DashboardBootstrapResponse(
        regions=regions,
        rankings=rank_regions(regions, limit=ranking_limit),
        rainfallStatus=load_refresh_status(settings),
    )


@router.get("/dashboard/regions/{region_id}", response_model=RegionDecisionContext)
def get_region_details(
    region_id: str,
    _: None = Depends(rate_limit("dashboard-region-details")),
    region_repository: RegionRepository = Depends(get_region_repository),
    water_repository: WaterSourceRepository = Depends(get_water_source_repository),
    settings: Settings = Depends(get_settings),
) -> RegionDecisionContext:
    return _build_region_details(region_id, region_repository, water_repository, settings)


@router.get("/analysis-center", response_model=AnalysisCenterResponse)
def get_analysis_center(
    limit: int = Query(default=12, ge=1, le=100),
    _: None = Depends(rate_limit("analysis-center")),
    region_repository: RegionRepository = Depends(get_region_repository),
    water_repository: WaterSourceRepository = Depends(get_water_source_repository),
    settings: Settings = Depends(get_settings),
) -> AnalysisCenterResponse:
    regions = region_repository.get_all_regions()
    ranked_regions = rank_regions(regions, limit=limit)
    region_lookup = {region.id: region for region in regions}
    items: list[AnalysisCenterItem] = []

    for ranked_region in ranked_regions:
        region = region_lookup.get(ranked_region.region_id)
        if region is None:
            continue
        details = _build_region_details(region.id, region_repository, water_repository, settings)
        items.append(
            AnalysisCenterItem(
                region=details.region,
                ranking=ranked_region,
                analysis=details.analysis,
                aidPlan=details.aid_plan,
                waterNavigation=details.water_navigation,
            )
        )

    return AnalysisCenterResponse(
        total=len(items),
        generatedAt=datetime.now(UTC),
        items=items,
    )


@router.get("/rainfall-status", response_model=RainfallRefreshStatus)
def get_rainfall_status(
    settings: Settings = Depends(get_settings),
) -> RainfallRefreshStatus:
    return load_refresh_status(settings)


@router.post("/refresh-rainfall", response_model=RainfallRefreshStatus)
def refresh_rainfall(
    _: None = Depends(rate_limit("refresh-rainfall")),
    rainfall_repository: RainfallRepository = Depends(get_rainfall_repository),
    region_repository: RegionRepository = Depends(get_region_repository),
    settings: Settings = Depends(get_settings),
) -> RainfallRefreshStatus:
    return refresh_rainfall_feed(settings, rainfall_repository, region_repository)
