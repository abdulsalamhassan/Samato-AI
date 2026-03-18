import json
from pathlib import Path
from uuid import uuid4

from app.api.alerts import get_settings
from app.api.deps import get_rainfall_repository
from app.main import app
from app.repositories.rainfall_repo import RainfallRepository


def test_health_endpoint(client):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_regions_endpoint_returns_seed_data(client):
    response = client.get("/regions")

    payload = response.json()
    assert response.status_code == 200
    assert len(payload) >= 6
    assert payload[0]["district"]
    assert payload[0]["region"]
    assert payload[0]["country"] == "Somalia"


def test_districts_endpoint_alias_returns_seed_data(client):
    response = client.get("/districts")

    payload = response.json()
    assert response.status_code == 200
    assert len(payload) >= 6
    assert payload[0]["district"]


def test_rankings_endpoint_returns_computed_priority_list(client):
    response = client.get("/rankings?limit=2")

    payload = response.json()
    assert response.status_code == 200
    assert payload["total"] == 2
    assert payload["regions"][0]["riskScore"] >= payload["regions"][1]["riskScore"]
    assert payload["regions"][0]["actionCode"] in {
        "MONITOR_LOCAL_WATER",
        "PREPARE_WATER_DELIVERY",
        "DISPATCH_WATER_AND_MOVE_COMMUNITY",
    }


def test_crisis_ranking_endpoint_alias_returns_computed_priority_list(client):
    response = client.get("/crisis-ranking?limit=2")

    payload = response.json()
    assert response.status_code == 200
    assert payload["total"] == 2
    assert payload["regions"][0]["riskScore"] >= payload["regions"][1]["riskScore"]


def test_analyze_region_endpoint_returns_drought_analysis(client):
    response = client.post("/analyze-region", json={"regionName": "Ceel Buur"})

    payload = response.json()
    assert response.status_code == 200
    assert payload["regionName"] == "Ceel Buur"
    assert payload["riskLevel"] in {"WARNING", "CRITICAL"}
    assert payload["actionCode"] in {
        "PREPARE_WATER_DELIVERY",
        "DISPATCH_WATER_AND_MOVE_COMMUNITY",
    }


def test_aid_plan_endpoint_returns_distribution_recommendation(client):
    response = client.post("/aid-plan", json={"regionName": "Ceel Buur"})

    payload = response.json()
    assert response.status_code == 200
    assert payload["regionName"] == "Ceel Buur"
    assert payload["distributionCenter"] == "Ceel Buur District Center"
    assert payload["planningStatus"] == "PLANNING_RECOMMENDATION_ONLY"
    assert payload["nearestWaterSourceName"] == "Ceel Dheer Borehole"
    assert payload["truckTripsFor7DayWindow"] >= payload["waterTrucksRequired"]
    assert payload["planningBasis"]


def test_aid_plan_list_endpoint_returns_ranked_plans(client):
    response = client.get("/aid-plan?limit=2")

    payload = response.json()
    assert response.status_code == 200
    assert payload["total"] == 2
    assert len(payload["plans"]) == 2


def test_nearest_water_endpoint_returns_navigation(client):
    response = client.post("/nearest-water", json={"regionName": "Ceel Buur"})

    payload = response.json()
    assert response.status_code == 200
    assert payload["waterSourceName"] == "Ceel Dheer Borehole"


def test_generate_sms_endpoint_uses_deterministic_fallback(client, deterministic_settings):
    app.dependency_overrides[get_settings] = lambda: deterministic_settings
    try:
        response = client.post("/generate-sms", json={"regionName": "Ceel Buur"})
    finally:
        app.dependency_overrides.clear()

    payload = response.json()
    assert response.status_code == 200
    assert payload["provider"] == "deterministic"
    assert payload["usedFallback"] is True
    assert "SAMATO_ALERT" in payload["message"]
    assert "Ceel Buur" in payload["message"]


def test_generate_sms_endpoint_returns_429_when_rate_limit_exceeded(client):
    limited_settings = type(
        "SettingsStub",
        (),
        {
            "ai_provider": "deterministic",
            "anthropic_api_key": None,
            "openai_api_key": None,
            "rate_limit_requests": 1,
            "rate_limit_window_seconds": 60,
        },
    )()
    app.dependency_overrides[get_settings] = lambda: limited_settings
    try:
        first = client.post("/generate-sms", json={"regionName": "Ceel Buur"})
        second = client.post("/generate-sms", json={"regionName": "Ceel Buur"})
    finally:
        app.dependency_overrides.clear()

    assert first.status_code == 200
    assert second.status_code == 429
    assert second.json()["detail"] == "Rate limit exceeded"


def test_dashboard_bootstrap_returns_regions_rankings_and_rainfall_status(client):
    response = client.get("/dashboard/bootstrap")

    payload = response.json()
    assert response.status_code == 200
    assert payload["regions"]
    assert payload["rankings"]
    assert "rainfallStatus" in payload


def test_dashboard_region_details_returns_aggregated_decision_context(client):
    region_response = client.get("/regions")
    region_id = region_response.json()[0]["id"]

    response = client.get(f"/dashboard/regions/{region_id}")

    payload = response.json()
    assert response.status_code == 200
    assert payload["region"]["id"] == region_id
    assert payload["analysis"]["regionId"] == region_id
    assert payload["aidPlan"]["regionId"] == region_id
    assert payload["waterNavigation"]["regionId"] == region_id
    assert payload["sms"]["message"]
    assert payload["alert"]["report"]
    assert payload["radio"]["script"]


def test_generate_radio_script_does_not_direct_people_to_specific_water_points(
    client,
    deterministic_settings,
):
    app.dependency_overrides[get_settings] = lambda: deterministic_settings
    try:
        response = client.post("/radio-script", json={"regionName": "Zeylac"})
    finally:
        app.dependency_overrides.clear()

    payload = response.json()
    assert response.status_code == 200
    assert "Cadaado Water Point" not in payload["script"]
    assert "km" not in payload["script"]
    assert "maamulka deegaanka" in payload["script"]


def test_analysis_center_returns_batch_workflow_items(client):
    response = client.get("/analysis-center?limit=3")

    payload = response.json()
    assert response.status_code == 200
    assert payload["total"] == 3
    assert len(payload["items"]) == 3
    assert payload["items"][0]["ranking"]["riskScore"] >= payload["items"][1]["ranking"]["riskScore"]


def test_geo_districts_returns_matching_feature_collection(client):
    response = client.get("/geo/districts")

    payload = response.json()
    assert response.status_code == 200
    assert payload["type"] == "FeatureCollection"
    assert payload["features"]
    assert payload["features"][0]["properties"]["adm2_pcode"]


def test_refresh_rainfall_without_feed_returns_idle_status(client, deterministic_settings):
    deterministic_settings.rainfall_feed_url = None
    deterministic_settings.rainfall_feed_path = None
    deterministic_settings.rainfall_auto_refresh_enabled = False
    deterministic_settings.rainfall_refresh_interval_minutes = 60
    app.dependency_overrides[get_settings] = lambda: deterministic_settings
    try:
        response = client.post("/refresh-rainfall")
    finally:
        app.dependency_overrides.clear()

    payload = response.json()
    assert response.status_code == 200
    assert payload["status"] == "idle"
    assert payload["message"] == "No rainfall feed configured."



def test_import_rainfall_endpoint_merges_observations(client):
    temp_dir = Path("tests/.tmp")
    temp_dir.mkdir(parents=True, exist_ok=True)
    temp_file = temp_dir / f"rainfall_observations_{uuid4().hex}.json"
    temp_file.write_text(
        json.dumps(
            [
                {
                    "regionId": "so1904",
                    "observedOn": "2026-01-07",
                    "precipitationMm": 3.2,
                }
            ]
        ),
        encoding="utf-8",
    )
    app.dependency_overrides[get_rainfall_repository] = lambda: RainfallRepository(temp_file)
    try:
        response = client.post(
            "/import-rainfall",
            json={
                "observations": [
                    {
                        "regionId": "so1904",
                        "observedOn": "2026-03-10",
                        "precipitationMm": 4.0,
                    }
                ]
            },
        )
    finally:
        app.dependency_overrides.pop(get_rainfall_repository, None)
        if temp_file.exists():
            temp_file.unlink()

    payload = response.json()
    assert response.status_code == 200
    assert payload["imported"] == 1
    assert payload["totalObservations"] == 2
