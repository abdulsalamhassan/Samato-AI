from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING

import requests

if TYPE_CHECKING:
    from app.core.settings import Settings
    from app.models.drought import DroughtAnalysis
    from app.models.navigation import NearestWaterResult
    from app.models.region import Region


def _format_count(value: int | None) -> str:
    return f"{value:,}" if value is not None else "Unknown"

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


def generate_ai_analysis(
    region: Region,
    analysis: DroughtAnalysis,
    settings: "Settings",
) -> str | None:
    if settings.ai_provider != "openai" or not settings.openai_api_key:
        return None
    
    prompt = (
        f"You are a Senior Drought Scientist. Analyze this data for {region.name}, {region.region}:\n"
        f"- Risk Score: {analysis.risk_score}/100\n"
        f"- Days Since Rain: {region.days_since_rain}\n"
        f"- NDVI (Vegetation): {region.satellite_ndvi}\n"
        f"- Population: {region.population}\n"
        f"- Infrastructure: {region.water_infrastructure_level}\n"
        "Provide a 2-sentence technical diagnostic on why this area is critical and what the atmospheric trend suggests."
    )
    return _call_openai(prompt, settings.openai_api_key)

def build_alert_report(
    region: Region,
    analysis: DroughtAnalysis,
    navigation: NearestWaterResult,
    settings: "Settings",
) -> str:
    # Deterministic base
    base = (
        f"Region: {region.name}, {region.region}\n"
        f"Population: {_format_count(region.population)}\n"
        f"Risk: {analysis.risk_level} ({analysis.risk_score})\n"
        f"Timeline: {analysis.estimated_days_remaining} days\n\n"
        f"STRATEGIC BRIEF:\n"
    )
    
    if settings.ai_provider == "openai" and settings.openai_api_key:
        prompt = (
            f"Write a professional humanitarian situation report for {region.name}. "
            f"Provide a 3-sentence summary of the crisis based on these stats: "
            f"Risk Score {analysis.risk_score}, Survival {analysis.estimated_days_remaining} days, "
            f"Vegetation NDVI {region.satellite_ndvi}. Focus on NGO logistics."
        )
        ai_brief = _call_openai(prompt, settings.openai_api_key)
        if ai_brief:
            return base + ai_brief

    return base + "Critical water shortage reported. Immediate logistics staging required."

def build_radio_script(
    region: Region,
    analysis: DroughtAnalysis,
    navigation: NearestWaterResult,
    settings: "Settings",
) -> str:
    # Deterministic base
    base = (
        f"Digniin: Degmada {region.name} waxaa ka jirta biyo yari {analysis.risk_level.lower()}. "
        f"Dadka deegaanka waxaa lagu wargelinayaa inay u socdaan "
        f"{navigation.water_source_name} oo {int(round(navigation.distance_km))}km {navigation.direction} ka xigta."
    )
    
    if settings.ai_provider == "openai" and settings.openai_api_key:
        prompt = (
            f"Write a Somali broadcast script for BBC Radio for {region.name}. "
            f"Announce a {analysis.risk_level} drought alert. Advise pastoralists to move to {navigation.water_source_name}. "
            "Keep it urgent and supportive. Max 3 sentences."
        )
        ai_script = _call_openai(prompt, settings.openai_api_key)
        if ai_script:
            return ai_script

    return base

def _call_openai(prompt: str, api_key: str, model: str = "gpt-4o") -> str | None:
    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": model,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 500,
            },
            timeout=30,
        )
        response.raise_for_status()
        payload = response.json()
        text = payload["choices"][0]["message"]["content"].strip()
        return text
    except (requests.RequestException, KeyError, IndexError):
        return None


def _normalize_text(text: str) -> str | None:
    if not text:
        return None
    compact = " ".join(text.split())
    return compact[:160]
