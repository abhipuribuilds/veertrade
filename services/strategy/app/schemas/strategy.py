from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class EntryCondition(BaseModel):
    indicator: str
    period: int | None = None
    source: str | None = "close"
    operator: str
    value: float | str | None = None
    compare_to: str | None = None


class ExitCondition(BaseModel):
    type: str
    value: float | None = None
    trail_percent: float | None = None
    time_seconds: int | None = None


class StopLoss(BaseModel):
    type: str = "fixed"
    value: float
    trail: bool = False
    trail_activation: float | None = None
    trail_distance: float | None = None


class TrailingStop(BaseModel):
    activation_percent: float
    trail_percent: float


class StrategyConfig(BaseModel):
    entry_conditions: list[EntryCondition] = Field(default_factory=list)
    exit_conditions: list[ExitCondition] = Field(default_factory=list)
    stop_loss: StopLoss | None = None
    trailing_stop: TrailingStop | None = None
    quantity: int | None = None


class CreateStrategyRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=500)
    type: str = Field(default="visual", pattern="^(visual|code)$")
    config: StrategyConfig | None = None
    tags: list[str] = Field(default_factory=list, max_length=10)


class UpdateStrategyRequest(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=500)
    type: str | None = Field(default=None, pattern="^(visual|code)$")
    config: StrategyConfig | None = None
    tags: list[str] | None = Field(default=None, max_length=10)
    status: str | None = Field(default=None, pattern="^(draft|active|archived)$")
    changelog: str | None = Field(default=None, max_length=1000)


class StrategyResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    description: str | None
    type: str
    config: dict
    tags: list[str]
    status: str
    version: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class StrategyVersionResponse(BaseModel):
    id: UUID
    strategy_id: UUID
    version_number: int
    config: dict
    changelog: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class StrategyListResponse(BaseModel):
    items: list[StrategyResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class ValidationError(BaseModel):
    path: str
    message: str


class ValidationResponse(BaseModel):
    valid: bool
    errors: list[ValidationError] = Field(default_factory=list)
