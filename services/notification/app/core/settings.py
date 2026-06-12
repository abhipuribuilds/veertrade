from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "veertrade-notification"
    debug: bool = False

    redis_url: str = "redis://redis:6379/0"

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
