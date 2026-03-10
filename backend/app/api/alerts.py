from fastapi import APIRouter, Depends, HTTPException

from app.api.analysis import _resolve_region
from app.api.deps import get_region_repository, get_water_source_repository
from app.core.settings import Settings, get_settings
from app.models.alert import AlertRequest, AlertResponse, RadioScriptResponse, SmsResponse
from app.repositories.region_repo import RegionRepository
from app.repositories.water_repo import WaterSourceRepository
from app.services.alert_engine import build_alert_report, build_radio_script
from app.services.drought_engine import calculate_risk
from app.services.sms_engine import generate_sms
from app.services.water_engine import find_nearest_water

router = APIRouter(tags=["alerts"])


def _resolve_decision_context(
    payload: AlertRequest,
    region_repository: RegionRepository,
    water_repository: WaterSourceRepository,
):
    region = _resolve_region(payload, region_repository)
    if region is None:
        raise HTTPException(status_code=404, detail="Region not found")

    analysis = calculate_risk(region)
    navigation = find_nearest_water(region, water_repository.get_all_water_sources())
    if navigation is None:
        raise HTTPException(status_code=404, detail="No viable water source found")
    return region, analysis, navigation


@router.post("/generate-sms", response_model=SmsResponse)
def generate_sms_route(
    payload: AlertRequest,
    region_repository: RegionRepository = Depends(get_region_repository),
    water_repository: WaterSourceRepository = Depends(get_water_source_repository),
    settings: Settings = Depends(get_settings),
) -> SmsResponse:
    region, analysis, navigation = _resolve_decision_context(
        payload,
        region_repository,
        water_repository,
    )
    result = generate_sms(region, navigation, analysis, settings)
    return SmsResponse(
        message=result.text,
        provider=result.provider,
        usedFallback=result.used_fallback,
    )


@router.post("/generate-alert", response_model=AlertResponse)
def generate_alert_route(
    payload: AlertRequest,
    region_repository: RegionRepository = Depends(get_region_repository),
    water_repository: WaterSourceRepository = Depends(get_water_source_repository),
) -> AlertResponse:
    region, analysis, navigation = _resolve_decision_context(
        payload,
        region_repository,
        water_repository,
    )
    return AlertResponse(report=build_alert_report(region, analysis, navigation))


@router.post("/radio-script", response_model=RadioScriptResponse)
def generate_radio_script_route(
    payload: AlertRequest,
    region_repository: RegionRepository = Depends(get_region_repository),
    water_repository: WaterSourceRepository = Depends(get_water_source_repository),
) -> RadioScriptResponse:
    region, analysis, navigation = _resolve_decision_context(
        payload,
        region_repository,
        water_repository,
    )
    return RadioScriptResponse(script=build_radio_script(region, analysis, navigation))
