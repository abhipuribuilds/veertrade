from app.schemas.strategy import EntryCondition, ExitCondition, StopLoss, StrategyConfig, TrailingStop, ValidationError, ValidationResponse

VALID_INDICATORS = {"SMA", "EMA", "RSI", "MACD", "BB", "Volume"}
VALID_OPERATORS = {">", "<", ">=", "<=", "==", "cross_above", "cross_below"}
VALID_SOURCES = {"open", "high", "low", "close", "volume"}
VALID_EXIT_TYPES = {"stop_loss", "target", "trailing_sl", "time_exit"}
VALID_STOP_LOSS_TYPES = {"fixed", "percent", "atr"}


def _validate_entry_condition(cond: EntryCondition, path: str) -> list[ValidationError]:
    errors: list[ValidationError] = []
    if cond.indicator not in VALID_INDICATORS:
        errors.append(ValidationError(path=f"{path}.indicator", message=f"Invalid indicator '{cond.indicator}'. Must be one of {VALID_INDICATORS}"))
    if cond.operator not in VALID_OPERATORS:
        errors.append(ValidationError(path=f"{path}.operator", message=f"Invalid operator '{cond.operator}'. Must be one of {VALID_OPERATORS}"))
    if cond.source and cond.source not in VALID_SOURCES:
        errors.append(ValidationError(path=f"{path}.source", message=f"Invalid source '{cond.source}'. Must be one of {VALID_SOURCES}"))
    if cond.indicator in {"SMA", "EMA"} and cond.period is not None and (cond.period < 2 or cond.period > 500):
        errors.append(ValidationError(path=f"{path}.period", message="Period must be between 2 and 500"))
    if cond.indicator == "RSI" and cond.period is not None and (cond.period < 2 or cond.period > 100):
        errors.append(ValidationError(path=f"{path}.period", message="RSI period must be between 2 and 100"))
    if cond.indicator == "BB" and cond.period is not None and (cond.period < 2 or cond.period > 200):
        errors.append(ValidationError(path=f"{path}.period", message="BB period must be between 2 and 200"))
    return errors


def _validate_exit_condition(cond: ExitCondition, path: str) -> list[ValidationError]:
    errors: list[ValidationError] = []
    if cond.type not in VALID_EXIT_TYPES:
        errors.append(ValidationError(path=f"{path}.type", message=f"Invalid exit type '{cond.type}'. Must be one of {VALID_EXIT_TYPES}"))
    if cond.type in {"stop_loss", "target"} and cond.value is not None and cond.value <= 0:
        errors.append(ValidationError(path=f"{path}.value", message="Value must be positive"))
    if cond.type == "time_exit" and cond.time_seconds is not None and cond.time_seconds < 1:
        errors.append(ValidationError(path=f"{path}.time_seconds", message="Time must be at least 1 second"))
    return errors


def _validate_stop_loss(sl: StopLoss, path: str) -> list[ValidationError]:
    errors: list[ValidationError] = []
    if sl.type not in VALID_STOP_LOSS_TYPES:
        errors.append(ValidationError(path=f"{path}.type", message=f"Invalid stop loss type '{sl.type}'. Must be one of {VALID_STOP_LOSS_TYPES}"))
    if sl.value <= 0:
        errors.append(ValidationError(path=f"{path}.value", message="Value must be positive"))
    return errors


def _validate_trailing_stop(ts: TrailingStop, path: str) -> list[ValidationError]:
    errors: list[ValidationError] = []
    if ts.activation_percent <= 0 or ts.activation_percent > 100:
        errors.append(ValidationError(path=f"{path}.activation_percent", message="Activation percent must be between 0 and 100"))
    if ts.trail_percent <= 0 or ts.trail_percent > 100:
        errors.append(ValidationError(path=f"{path}.trail_percent", message="Trail percent must be between 0 and 100"))
    return errors


def validate_config(config: dict) -> ValidationResponse:
    try:
        parsed = StrategyConfig(**config)
    except Exception as e:
        return ValidationResponse(valid=False, errors=[ValidationError(path="config", message=str(e))])

    errors: list[ValidationError] = []

    for i, cond in enumerate(parsed.entry_conditions):
        errors.extend(_validate_entry_condition(cond, f"config.entry_conditions[{i}]"))

    for i, cond in enumerate(parsed.exit_conditions):
        errors.extend(_validate_exit_condition(cond, f"config.exit_conditions[{i}]"))

    if parsed.stop_loss:
        errors.extend(_validate_stop_loss(parsed.stop_loss, "config.stop_loss"))

    if parsed.trailing_stop:
        errors.extend(_validate_trailing_stop(parsed.trailing_stop, "config.trailing_stop"))

    return ValidationResponse(valid=len(errors) == 0, errors=errors)
