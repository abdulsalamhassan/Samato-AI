from types import SimpleNamespace

import pytest
from fastapi.testclient import TestClient

from app.core.rate_limit import clear_rate_limit_store
from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture(autouse=True)
def reset_rate_limit_store():
    clear_rate_limit_store()
    yield
    clear_rate_limit_store()


@pytest.fixture
def deterministic_settings():
    return SimpleNamespace(
        ai_provider="deterministic",
        anthropic_api_key=None,
        openai_api_key=None,
        rate_limit_requests=20,
        rate_limit_window_seconds=60,
    )
