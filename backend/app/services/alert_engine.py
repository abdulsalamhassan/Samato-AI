from app.models.drought import DroughtAnalysis
from app.models.navigation import NearestWaterResult
from app.models.region import Region


def _format_count(value: int | None) -> str:
    return f"{value:,}" if value is not None else "Unknown"


def build_alert_report(
    region: Region,
    analysis: DroughtAnalysis,
    navigation: NearestWaterResult,
) -> str:
    return (
        f"Region: {region.name}, {region.region}\n"
        f"Population: {_format_count(region.population)}\n"
        f"Livestock: {_format_count(region.livestock)}\n"
        f"Risk Level: {analysis.risk_level}\n"
        f"Water Remaining: {analysis.estimated_days_remaining} days\n"
        f"Action: {analysis.recommended_action}\n"
        f"Nearest Source: {navigation.water_source_name} ({navigation.distance_km} km {navigation.direction})\n"
        f"Coordinates: {region.latitude}, {region.longitude}"
    )



def build_radio_script(
    region: Region,
    analysis: DroughtAnalysis,
    navigation: NearestWaterResult,
) -> str:
    return (
        f"Digniin: Degmada {region.name} waxaa ka jirta biyo yari {analysis.risk_level.lower()}. "
        f"Dadka deegaanka waxaa lagu wargelinayaa inay u socdaan "
        f"{navigation.water_source_name} oo {int(round(navigation.distance_km))}km {navigation.direction} ka xigta."
    )
