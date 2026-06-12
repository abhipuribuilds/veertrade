from app.schemas.strategy import StrategyConfig


def _make_config(
    entry_conditions: list[dict] | None = None,
    exit_conditions: list[dict] | None = None,
    stop_loss: dict | None = None,
    trailing_stop: dict | None = None,
    quantity: int | None = None,
) -> dict:
    return StrategyConfig(
        entry_conditions=entry_conditions or [],
        exit_conditions=exit_conditions or [],
        stop_loss=stop_loss,
        trailing_stop=trailing_stop,
        quantity=quantity,
    ).model_dump()


def macd_crossover() -> dict:
    return _make_config(
        entry_conditions=[
            {"indicator": "MACD", "operator": "cross_above", "source": "close", "value": 0.0},
        ],
        exit_conditions=[
            {"type": "stop_loss", "value": 2.0},
        ],
        stop_loss={"type": "percent", "value": 2.0},
    )


def rsi_crossover() -> dict:
    return _make_config(
        entry_conditions=[
            {"indicator": "RSI", "period": 14, "source": "close", "operator": "cross_above", "value": 30.0},
        ],
        exit_conditions=[
            {"type": "target", "value": 5.0},
        ],
        stop_loss={"type": "percent", "value": 2.0},
    )


def bollinger_bands_reversal() -> dict:
    return _make_config(
        entry_conditions=[
            {"indicator": "BB", "period": 20, "source": "close", "operator": "<=", "value": 2.0},
        ],
        exit_conditions=[
            {"type": "target", "value": 3.0},
        ],
        stop_loss={"type": "percent", "value": 1.5},
    )


def ema_cross() -> dict:
    return _make_config(
        entry_conditions=[
            {"indicator": "EMA", "period": 9, "source": "close", "operator": "cross_above", "compare_to": "EMA_21"},
        ],
        exit_conditions=[
            {"type": "stop_loss", "value": 2.0},
            {"type": "time_exit", "time_seconds": 86400},
        ],
        stop_loss={"type": "percent", "value": 2.0},
    )


TEMPLATES: dict[str, dict] = {
    "MACrossover": {
        "name": "MACD Crossover",
        "description": "Enter when MACD crosses above signal line",
        "type": "visual",
        "config": macd_crossover(),
        "tags": ["momentum", "macd"],
    },
    "RSICrossover": {
        "name": "RSI Crossover",
        "description": "Enter when RSI crosses above oversold level",
        "type": "visual",
        "config": rsi_crossover(),
        "tags": ["mean-reversion", "rsi"],
    },
    "BollingerBandsReversal": {
        "name": "Bollinger Bands Reversal",
        "description": "Enter when price touches lower Bollinger Band",
        "type": "visual",
        "config": bollinger_bands_reversal(),
        "tags": ["volatility", "bb"],
    },
    "EMACross": {
        "name": "EMA Cross",
        "description": "Enter when fast EMA crosses above slow EMA",
        "type": "visual",
        "config": ema_cross(),
        "tags": ["trend-following", "ema"],
    },
}


def get_template(template_id: str) -> dict | None:
    return TEMPLATES.get(template_id)


def list_templates() -> list[dict]:
    return [
        {"id": tid, **tpl}
        for tid, tpl in TEMPLATES.items()
    ]
