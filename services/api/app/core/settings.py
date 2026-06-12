from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "veertrade-api"
    debug: bool = False

    database_url: str = "postgresql+asyncpg://veertrade:veertrade_dev@postgres:5432/veertrade"
    redis_url: str = "redis://redis:6379/0"

    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7

    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:4321"]

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
