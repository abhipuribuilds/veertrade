from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "veertrade-strategy"
    debug: bool = False

    database_url: str = "postgresql+asyncpg://veertrade:veertrade_dev@postgres:5432/veertrade"
    redis_url: str = "redis://redis:6379/0"

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
