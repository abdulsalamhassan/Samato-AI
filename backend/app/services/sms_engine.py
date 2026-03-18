from typing import TYPE_CHECKING

from app.models.drought import DroughtAnalysis
from app.models.navigation import NearestWaterResult
from app.models.region import Region
from app.services.ai_text_engine import TextGenerationResult, generate_somali_sms

if TYPE_CHECKING:
    from app.core.settings import Settings


def build_sms_template(
    region: Region,
    navigation: NearestWaterResult,
    analysis: DroughtAnalysis,
) -> str:
    urgency_word = "Degdeg" if analysis.risk_level == "CRITICAL" else "Fiiro gaar ah"
    # User requested to avoid direct travel paths and focus on risk awareness
    return (
        f"SAMATO_ALERT: Walaal, {region.name} biyuhu way sii dhamaanayaan. "
        f"Halista abaarta ayaa dhow. Fadlan digtoonaaw. {urgency_word}!"
    )[:160]


def generate_sms(
    region: Region,
    navigation: NearestWaterResult,
    analysis: DroughtAnalysis,
    settings: "Settings",
) -> TextGenerationResult:
    fallback_text = build_sms_template(region, navigation, analysis)
    # Update AI prompt to match the new 'risk-first' strategy instead of 'direct-to-source'
    prompt = (
        "Write one Somali SMS under 160 characters for a drought emergency alert. "
        "Do NOT tell them where to go. Instead, announce that water is running out "
        "and there is a high drought risk for nomadic communities. "
        f"Location: {region.name}. "
        f"Risk Level: {analysis.risk_level}. "
        "Keep it simple, urgent, and culturally direct. "
        "Do not add English or explanation."
    )
    return generate_somali_sms(
        prompt=prompt,
        fallback_text=fallback_text,
        settings=settings,
    )
