from app.repositories.region_repo import RegionRepository
from app.services.ranking_engine import rank_regions


def test_rank_regions_sorts_by_highest_risk_first():
    ranked = rank_regions(RegionRepository().get_all_regions())

    assert len(ranked) >= 3
    assert ranked[0].risk_score >= ranked[1].risk_score
    assert ranked[0].action_code in {
        "MONITOR_LOCAL_WATER",
        "PREPARE_WATER_DELIVERY",
        "DISPATCH_WATER_AND_MOVE_COMMUNITY",
    }


def test_rank_regions_honors_limit():
    ranked = rank_regions(RegionRepository().get_all_regions(), limit=2)

    assert len(ranked) == 2
