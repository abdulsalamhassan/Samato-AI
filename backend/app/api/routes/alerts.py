from fastapi import APIRouter

from app.schemas.alerts import (
    AlertRequest,
    AlertResponse,
    RadioScriptRequest,
    RadioScriptResponse,
    SmsRequest,
    SmsResponse,
)
from app.services.alert_engine import build_alert_report, build_radio_script
from app.services.sms_generator import generate_sms

router = APIRouter()


@router.post("/generate-sms", response_model=SmsResponse)
def generate_sms_route(payload: SmsRequest) -> SmsResponse:
    return SmsResponse(message=generate_sms(payload))


@router.post("/generate-alert", response_model=AlertResponse)
def generate_alert_route(payload: AlertRequest) -> AlertResponse:
    return AlertResponse(report=build_alert_report(payload))


@router.post("/radio-script", response_model=RadioScriptResponse)
def generate_radio_script_route(payload: RadioScriptRequest) -> RadioScriptResponse:
    return RadioScriptResponse(script=build_radio_script(payload))
