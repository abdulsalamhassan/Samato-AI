from typing import Literal

RiskLevel = Literal["STABLE", "WARNING", "CRITICAL"]
ActionCode = Literal[
    "MONITOR_LOCAL_WATER",
    "PREPARE_WATER_DELIVERY",
    "DISPATCH_WATER_AND_MOVE_COMMUNITY",
]
