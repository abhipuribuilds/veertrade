from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import engine
from app.core.settings import settings
from app.routes.strategies import router as strategies_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        pass
    yield
    await engine.dispose()


app = FastAPI(title=settings.app_name, version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(strategies_router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": settings.app_name}
