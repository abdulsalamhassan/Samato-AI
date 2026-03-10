from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING

import requests

if TYPE_CHECKING:
    from app.core.settings import Settings


@dataclass
class TextGenerationResult:
    text: str
    provider: str
    used_fallback: bool


def generate_somali_sms(
    *,
    prompt: str,
    fallback_text: str,
    settings: "Settings",
) -> TextGenerationResult:
    provider = settings.ai_provider.lower()

    if provider == "anthropic" and settings.anthropic_api_key:
        result = _call_anthropic(prompt, settings.anthropic_api_key)
        if result:
            return TextGenerationResult(text=result, provider="anthropic", used_fallback=False)

    if provider == "openai" and settings.openai_api_key:
        result = _call_openai(prompt, settings.openai_api_key)
        if result:
            return TextGenerationResult(text=result, provider="openai", used_fallback=False)

    return TextGenerationResult(
        text=fallback_text,
        provider="deterministic",
        used_fallback=True,
    )


def _call_anthropic(prompt: str, api_key: str) -> str | None:
    try:
        response = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": api_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": "claude-3-5-sonnet-latest",
                "max_tokens": 120,
                "messages": [{"role": "user", "content": prompt}],
            },
            timeout=15,
        )
        response.raise_for_status()
        payload = response.json()
        parts = payload.get("content", [])
        text = "".join(part.get("text", "") for part in parts if part.get("type") == "text").strip()
        return _normalize_text(text)
    except requests.RequestException:
        return None


def _call_openai(prompt: str, api_key: str) -> str | None:
    try:
        response = requests.post(
            "https://api.openai.com/v1/responses",
            headers={
                "Authorization": f"Bearer {api_key}",
                "content-type": "application/json",
            },
            json={
                "model": "gpt-4.1-mini",
                "input": prompt,
                "max_output_tokens": 120,
            },
            timeout=15,
        )
        response.raise_for_status()
        payload = response.json()
        text = payload.get("output_text", "").strip()
        return _normalize_text(text)
    except requests.RequestException:
        return None


def _normalize_text(text: str) -> str | None:
    if not text:
        return None
    compact = " ".join(text.split())
    return compact[:160]
