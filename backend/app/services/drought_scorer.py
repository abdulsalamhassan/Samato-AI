from app.schemas.region import AnalyzeRegionRequest, AnalyzeRegionResponse, Region
from app.services.data_loader import load_json


def get_ranked_regions() -> list[Region]:
    regions = [Region.model_validate(item) for item in load_json("mock_regions.json")]
    return sorted(regions, key=lambda item: item.urgency_score, reverse=True)


def analyze_region(payload: AnalyzeRegionRequest) -> AnalyzeRegionResponse | None:
    regions = get_ranked_regions()
    match = next(
        (region for region in regions if region.name.lower() == payload.region_name.lower()),
        None,
    )
    if match is None:
        return None

    days_since_rain = payload.days_since_rain or match.days_since_rain
    urgency_score = max(5, min(99, match.urgency_score + (days_since_rain - match.days_since_rain)))
    days_remaining = max(3, match.days_remaining - max(0, days_since_rain - match.days_since_rain) // 4)

    if urgency_score >= 85:
        risk_level = "CRITICAL"
        recommended_action = "Immediate water trucking and district alert required."
    elif urgency_score >= 55:
        risk_level = "WARNING"
        recommended_action = "Prepare water delivery and community messaging."
    else:
        risk_level = "STABLE"
        recommended_action = "Continue monitoring and verify local well conditions."

    return AnalyzeRegionResponse(
        region=match.name,
        district=match.district,
        riskLevel=risk_level,
        daysRemaining=days_remaining,
        urgencyScore=urgency_score,
        recommendedAction=recommended_action,
    )
