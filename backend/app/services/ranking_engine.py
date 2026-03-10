from app.models.ranking import RankedRegion
from app.models.region import Region
from app.services.drought_engine import calculate_risk


def rank_regions(regions: list[Region], limit: int | None = None) -> list[RankedRegion]:
    ranked = [
        RankedRegion(
            regionId=analysis.region_id,
            regionName=analysis.region_name,
            area=analysis.area,
            riskScore=analysis.risk_score,
            riskLevel=analysis.risk_level,
            estimatedDaysRemaining=analysis.estimated_days_remaining,
            recommendedAction=analysis.recommended_action,
        )
        for analysis in (calculate_risk(region) for region in regions)
    ]
    ranked.sort(
        key=lambda item: (item.risk_score, -item.estimated_days_remaining),
        reverse=True,
    )
    return ranked[:limit] if limit is not None else ranked
