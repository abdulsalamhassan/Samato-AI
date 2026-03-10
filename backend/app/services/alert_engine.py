from app.models.drought import DroughtAnalysis
from app.models.navigation import NearestWaterResult
from app.models.region import Region


def build_alert_report(
    region: Region,
    analysis: DroughtAnalysis,
    navigation: NearestWaterResult,
) -> str:
    return (
        f"Region: {region.name}, {region.region}\n"
        f"Population: {region.population:,}\n"
        f"Livestock: {region.livestock:,}\n"
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
