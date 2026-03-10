from app.schemas.alerts import SmsRequest


def generate_sms(payload: SmsRequest) -> str:
    return (
        f"Walaal, biyuhu waa dhamaaday. Fadlan u tag {payload.water_source}, "
        f"{payload.distance_km}km {payload.direction}, si aad u hesho caawimad. Degdeg."
    )
