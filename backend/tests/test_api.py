from app.api.alerts import get_settings
from app.main import app


def test_health_endpoint(client):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_regions_endpoint_returns_seed_data(client):
    response = client.get("/regions")

    payload = response.json()
    assert response.status_code == 200
    assert len(payload) >= 6
    assert payload[0]["id"] == "ceel_buur"


def test_rankings_endpoint_returns_computed_priority_list(client):
    response = client.get("/rankings?limit=2")

    payload = response.json()
    assert response.status_code == 200
    assert payload["total"] == 2
    assert payload["regions"][0]["regionName"] == "Ceel Garas"


def test_analyze_region_endpoint_returns_drought_analysis(client):
    response = client.post("/analyze-region", json={"regionId": "ceel_buur"})

    payload = response.json()
    assert response.status_code == 200
    assert payload["regionId"] == "ceel_buur"
    assert payload["riskLevel"] == "CRITICAL"


def test_nearest_water_endpoint_returns_navigation(client):
    response = client.post("/nearest-water", json={"regionId": "ceel_buur"})

    payload = response.json()
    assert response.status_code == 200
    assert payload["waterSourceName"] == "Ceel Dheer Borehole"


def test_generate_sms_endpoint_uses_deterministic_fallback(client, deterministic_settings):
    app.dependency_overrides[get_settings] = lambda: deterministic_settings
    try:
        response = client.post("/generate-sms", json={"regionId": "ceel_buur"})
    finally:
        app.dependency_overrides.clear()

    payload = response.json()
    assert response.status_code == 200
    assert payload["provider"] == "deterministic"
    assert payload["usedFallback"] is True
    assert "Ceel Dheer Borehole" in payload["message"]
