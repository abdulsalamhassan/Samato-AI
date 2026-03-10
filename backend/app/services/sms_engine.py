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
    return (
        f"Walaal, {region.name} biyuhu waa yar yihiin. "
        f"U tag {navigation.water_source_name}, {int(round(navigation.distance_km))}km "
        f"{navigation.direction}. {urgency_word}!"
    )[:160]


def generate_sms(
    region: Region,
    navigation: NearestWaterResult,
    analysis: DroughtAnalysis,
    settings: "Settings",
) -> TextGenerationResult:
    fallback_text = build_sms_template(region, navigation, analysis)
    prompt = (
        "Write one Somali SMS under 160 characters for a drought alert. "
        "Be simple, urgent, and direct. "
        f"Community: {region.name}. "
        f"Risk level: {analysis.risk_level}. "
        f"Destination: {navigation.water_source_name}. "
        f"Distance: {int(round(navigation.distance_km))}km. "
        f"Direction: {navigation.direction}. "
        "Do not add explanation or English."
    )
    return generate_somali_sms(
        prompt=prompt,
        fallback_text=fallback_text,
        settings=settings,
    )
