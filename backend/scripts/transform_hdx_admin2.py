import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
SOURCE_FILE = ROOT / "data" / "hdx" / "som_admin2.geojson"
OUTPUT_FILE = ROOT / "app" / "data" / "region_baselines.json"


def slugify(value: str) -> str:
    return (
        value.strip()
        .lower()
        .replace("'", "")
        .replace("/", " ")
        .replace("-", " ")
        .replace(".", " ")
        .replace(",", " ")
        .replace("(", " ")
        .replace(")", " ")
    )


def normalize_id(properties: dict[str, Any]) -> str:
    district_pcode = (properties.get("adm2_pcode") or "").strip().lower()
    if district_pcode:
        return district_pcode
    return "_".join(part for part in slugify(properties.get("adm2_name", "")).split() if part)


def transform_feature(feature: dict[str, Any]) -> dict[str, Any]:
    properties = feature.get("properties", {})
    return {
        "id": normalize_id(properties),
        "name": properties.get("adm2_name"),
        "district": properties.get("adm2_name"),
        "district_pcode": properties.get("adm2_pcode"),
        "region": properties.get("adm1_name"),
        "region_pcode": properties.get("adm1_pcode"),
        "country": properties.get("adm0_name", "Somalia"),
        "latitude": properties.get("center_lat"),
        "longitude": properties.get("center_lon"),
        "area_sqkm": properties.get("area_sqkm"),
        "population": None,
        "livestock": None,
        "water_sources": [],
        "temperature_c": None,
    }


def main() -> None:
    with SOURCE_FILE.open("r", encoding="utf-8") as file:
        payload = json.load(file)

    features = payload.get("features", [])
    records = [transform_feature(feature) for feature in features]
    records.sort(key=lambda item: (item["region"] or "", item["district"] or ""))

    with OUTPUT_FILE.open("w", encoding="utf-8") as file:
        json.dump(records, file, indent=2)
        file.write("\n")

    print(f"Wrote {len(records)} records to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
