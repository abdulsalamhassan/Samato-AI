from collections import deque
from threading import Lock
from time import monotonic
from typing import Callable

from fastapi import Depends, HTTPException, Request, status

from app.core.settings import Settings, get_settings

_REQUEST_LOG: dict[str, deque[float]] = {}
_LOCK = Lock()


def clear_rate_limit_store() -> None:
    with _LOCK:
        _REQUEST_LOG.clear()


def rate_limit(scope: str) -> Callable:
    def dependency(
        request: Request,
        settings: Settings = Depends(get_settings),
    ) -> None:
        client_host = request.client.host if request.client else "unknown"
        now = monotonic()
        window_start = now - settings.rate_limit_window_seconds
        bucket_key = f"{scope}:{client_host}"

        with _LOCK:
            bucket = _REQUEST_LOG.setdefault(bucket_key, deque())
            while bucket and bucket[0] < window_start:
                bucket.popleft()

            if len(bucket) >= settings.rate_limit_requests:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Rate limit exceeded",
                )

            bucket.append(now)

    return dependency
