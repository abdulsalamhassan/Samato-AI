from types import SimpleNamespace

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def deterministic_settings():
    return SimpleNamespace(
        ai_provider="deterministic",
        anthropic_api_key=None,
        openai_api_key=None,
    )
