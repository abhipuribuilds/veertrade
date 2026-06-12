from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "veertrade-broker"
    debug: bool = False

    redis_url: str = "redis://redis:6379/0"

    zerodha_api_key: str = ""
    zerodha_api_secret: str = ""

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
