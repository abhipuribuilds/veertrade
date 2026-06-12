import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Header, HTTPException, Query
from sqlalchemy import select, func, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.strategy import Strategy, StrategyVersion
from app.schemas.strategy import (
    CreateStrategyRequest,
    StrategyListResponse,
    StrategyResponse,
    StrategyVersionResponse,
    UpdateStrategyRequest,
    ValidationResponse,
)
from app.services.templates import get_template, list_templates
from app.services.validation import validate_config

router = APIRouter(prefix="/strategies", tags=["strategies"])


def _strategy_to_response(s: Strategy) -> StrategyResponse:
    return StrategyResponse(
        id=s.id,
        user_id=s.user_id,
        name=s.name,
        description=s.description,
        type=s.type,
        config=s.config if isinstance(s.config, dict) else {},
        tags=s.tags if isinstance(s.tags, list) else [],
        status=s.status,
        version=s.version,
        created_at=s.created_at,
        updated_at=s.updated_at,
    )


async def _get_user_id(x_user_id: str = Header(...)) -> uuid.UUID:
    try:
        return uuid.UUID(x_user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid X-User-Id header")


@router.post("", response_model=StrategyResponse, status_code=201)
async def create_strategy(
    body: CreateStrategyRequest,
    user_id: uuid.UUID = Depends(_get_user_id),
    db: AsyncSession = Depends(get_db),
):
    now = datetime.now(timezone.utc)
    strategy = Strategy(
        user_id=user_id,
        name=body.name,
        description=body.description,
        type=body.type,
        config=body.config.model_dump() if body.config else {},
        tags=body.tags,
        status="draft",
        version=1,
        created_at=now,
        updated_at=now,
    )
    db.add(strategy)
    await db.flush()

    version = StrategyVersion(
        strategy_id=strategy.id,
        version_number=1,
        config=strategy.config,
        changelog="Initial version",
        created_at=now,
    )
    db.add(version)
    await db.commit()
    await db.refresh(strategy)
    return _strategy_to_response(strategy)


@router.get("", response_model=StrategyListResponse)
async def list_strategies(
    user_id: uuid.UUID = Depends(_get_user_id),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: str | None = Query(None),
    search: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(Strategy).where(
        Strategy.user_id == user_id,
        Strategy.deleted_at.is_(None),
    )
    count_query = select(func.count()).select_from(Strategy).where(
        Strategy.user_id == user_id,
        Strategy.deleted_at.is_(None),
    )

    if status:
        query = query.where(Strategy.status == status)
        count_query = count_query.where(Strategy.status == status)

    if search:
        pattern = f"%{search}%"
        query = query.where(Strategy.name.ilike(pattern))
        count_query = count_query.where(Strategy.name.ilike(pattern))

    total = (await db.execute(count_query)).scalar() or 0
    total_pages = max(1, (total + page_size - 1) // page_size)

    result = await db.execute(
        query.order_by(Strategy.updated_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    strategies = result.scalars().all()

    return StrategyListResponse(
        items=[_strategy_to_response(s) for s in strategies],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/templates")
async def list_strategy_templates():
    return list_templates()


@router.get("/{strategy_id}", response_model=StrategyResponse)
async def get_strategy(
    strategy_id: uuid.UUID,
    user_id: uuid.UUID = Depends(_get_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Strategy).where(
            Strategy.id == strategy_id,
            Strategy.user_id == user_id,
            Strategy.deleted_at.is_(None),
        )
    )
    strategy = result.scalar_one_or_none()
    if not strategy:
        raise HTTPException(status_code=404, detail="Strategy not found")
    return _strategy_to_response(strategy)


@router.put("/{strategy_id}", response_model=StrategyResponse)
async def update_strategy(
    strategy_id: uuid.UUID,
    body: UpdateStrategyRequest,
    user_id: uuid.UUID = Depends(_get_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Strategy).where(
            Strategy.id == strategy_id,
            Strategy.user_id == user_id,
            Strategy.deleted_at.is_(None),
        )
    )
    strategy = result.scalar_one_or_none()
    if not strategy:
        raise HTTPException(status_code=404, detail="Strategy not found")

    now = datetime.now(timezone.utc)
    update_data: dict = {"updated_at": now}

    if body.name is not None:
        update_data["name"] = body.name
    if body.description is not None:
        update_data["description"] = body.description
    if body.type is not None:
        update_data["type"] = body.type
    if body.tags is not None:
        update_data["tags"] = body.tags
    if body.status is not None:
        update_data["status"] = body.status

    config_changed = False
    if body.config is not None:
        update_data["config"] = body.config.model_dump()
        update_data["version"] = strategy.version + 1
        config_changed = True

    await db.execute(
        update(Strategy).where(Strategy.id == strategy_id).values(**update_data)
    )

    if config_changed:
        version = StrategyVersion(
            strategy_id=strategy_id,
            version_number=strategy.version + 1,
            config=update_data["config"],
            changelog=body.changelog or f"Updated to version {strategy.version + 1}",
            created_at=now,
        )
        db.add(version)

    await db.commit()
    await db.refresh(strategy)
    return _strategy_to_response(strategy)


@router.delete("/{strategy_id}", status_code=204)
async def delete_strategy(
    strategy_id: uuid.UUID,
    user_id: uuid.UUID = Depends(_get_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Strategy).where(
            Strategy.id == strategy_id,
            Strategy.user_id == user_id,
            Strategy.deleted_at.is_(None),
        )
    )
    strategy = result.scalar_one_or_none()
    if not strategy:
        raise HTTPException(status_code=404, detail="Strategy not found")

    strategy.deleted_at = datetime.now(timezone.utc)
    await db.commit()


@router.get("/{strategy_id}/versions", response_model=list[StrategyVersionResponse])
async def get_strategy_versions(
    strategy_id: uuid.UUID,
    user_id: uuid.UUID = Depends(_get_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Strategy).where(
            Strategy.id == strategy_id,
            Strategy.user_id == user_id,
            Strategy.deleted_at.is_(None),
        )
    )
    strategy = result.scalar_one_or_none()
    if not strategy:
        raise HTTPException(status_code=404, detail="Strategy not found")

    versions_result = await db.execute(
        select(StrategyVersion)
        .where(StrategyVersion.strategy_id == strategy_id)
        .order_by(StrategyVersion.version_number.desc())
    )
    versions = versions_result.scalars().all()
    return [
        StrategyVersionResponse(
            id=v.id,
            strategy_id=v.strategy_id,
            version_number=v.version_number,
            config=v.config if isinstance(v.config, dict) else {},
            changelog=v.changelog,
            created_at=v.created_at,
        )
        for v in versions
    ]


@router.post("/{strategy_id}/validate", response_model=ValidationResponse)
async def validate_strategy_config(
    strategy_id: uuid.UUID,
    body: dict,
    user_id: uuid.UUID = Depends(_get_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Strategy).where(
            Strategy.id == strategy_id,
            Strategy.user_id == user_id,
            Strategy.deleted_at.is_(None),
        )
    )
    strategy = result.scalar_one_or_none()
    if not strategy:
        raise HTTPException(status_code=404, detail="Strategy not found")
    return validate_config(body.get("config", {}))
