from pathlib import Path
from app.models.priority import GEEPriorityDistrict
from app.repositories.data_repository import JsonDataRepository

PRIORITY_CSV = Path(__file__).resolve().parents[2] / "data" / "somalia_nomad_priority.csv"

class PriorityRepository:
    def __init__(self, csv_path: Path = PRIORITY_CSV) -> None:
        self.csv_path = csv_path
        self.data_repository = JsonDataRepository()

    def get_all_priority_districts(self) -> list[GEEPriorityDistrict]:
        return self.data_repository.load_csv_many(
            str(self.csv_path),
            GEEPriorityDistrict
        )

    def get_top_priority_districts(self, limit: int = 10) -> list[GEEPriorityDistrict]:
        import math
        districts = self.get_all_priority_districts()
        
        # Senior Engineering Rewire: Prioritize the Nomadic Signal
        # We penalize stable urban districts and favor remote basins with high drought stress.
        def balanced_rank(x: GEEPriorityDistrict):
            urban_hubs = {"mogadishu", "hargeisa", "garowe", "baidoa", "kismayo", "bossaso", "galkayo", "berbera"}
            is_urban = (
                "banadir" in x.adm1_name.lower() or 
                x.adm2_name.lower() in urban_hubs or
                x.population > 200000
            )
            
            # Dampen population effect for urban areas, boost it for pastoralists
            urban_penalty = 0.15 if is_urban else 1.2
            
            # Nomadic stress = (Climatic Score) * (Sensitivity / Infrastructure)
            return (x.drought_score * math.sqrt(max(1, x.population))) * urban_penalty

        districts.sort(key=balanced_rank, reverse=True)
        return districts[:limit]
