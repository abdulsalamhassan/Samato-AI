from app.schemas.alerts import AlertRequest, RadioScriptRequest


def build_alert_report(payload: AlertRequest) -> str:
    return (
        f"{payload.risk_level} alert for {payload.region_name}, {payload.district}. "
        f"Estimated {payload.days_remaining} days remaining. "
        f"Prioritize support for {payload.population:,} people and {payload.livestock:,} livestock."
    )


def build_radio_script(payload: RadioScriptRequest) -> str:
    return (
        f"Ogaysiis degdeg ah: dadka ku sugan {payload.region_name}, "
        f"fadlan u dhaqaaqa {payload.water_source}. Xaaladdu waa {payload.urgency.lower()}."
    )
