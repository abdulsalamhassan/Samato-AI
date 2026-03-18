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
    # Senior Engineering Rule: Never promise aid or logistics we don't control.
    # Focus only on high-trust risk awareness (Early Warning).
    urgency_word = "Degdeg" if analysis.risk_level == "CRITICAL" else "Fiiro gaar ah"
    return (
        f"SAMATO_ALER: Walaal, deegaanka {region.name} waxaa ka jira abaar daran iyo biyo yari. "
        f"Maamulka degmada iyo hay'adaha ayaa ka shaqeynaya xaaladda. "
        f"Fadlan la xiriir odayaasha deegaanka. {urgency_word}!"
    )[:160]


def generate_sms(
    region: Region,
    navigation: NearestWaterResult,
    analysis: DroughtAnalysis,
    settings: "Settings",
) -> TextGenerationResult:
    fallback_text = build_sms_template(region, navigation, analysis)
    # ETHICAL AI COMMUNICATION MODEL
    # External (Community): Risk Awareness & Early Warning Only
    # Internal (NGO): Decision Intelligence & Planning (Calculated elsewhere)
    prompt = (
        "Write one Somali SMS under 160 characters for a drought early warning alert. "
        "STRICT RULE: Never promise aid arrival, water trucks, or specific travel paths. "
        "STRICT RULE: Do not say 'Aid is coming'. "
        "Instead, only announce severe drought risk and high water scarcity. "
        "Advise them to seek information from local authorities or community leaders. "
        f"Location: {region.name}. "
        f"Risk Level: {analysis.risk_level}. "
        "Keep it ethically responsible, urgent, and culturally direct."
    )
    return generate_somali_sms(
        prompt=prompt,
        fallback_text=fallback_text,
        settings=settings,
    )
