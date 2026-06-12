# Review Report

> Full audit of the VeerTrade monorepo as of Phase 1 completion.
> Inspects architecture, folder structure, Docker, Turborepo, pnpm, TypeScript, FastAPI, PostgreSQL, Redis, and CI/CD.

---

## Summary

| Category | Verdict |
|----------|---------|
| Architecture | Solid foundation, mild overengineering |
| Folder structure | Clean, a few gaps |
| Docker | Functional, one critical network bug |
| Turborepo | Correct v2 config, missing references |
| pnpm workspace | Correct, missing cross-package deps |
| TypeScript | Strict mode, project references absent |
| FastAPI | Empty shells — no entry points, no packages |
| PostgreSQL | Correct, missing init scripts |
| Redis | Correct, no issues |
| CI/CD | Lints/typechecks JS only, no Docker or Python coverage |

---

## 1. Architecture

### 1.1 Microservice Split

**Issue: Premature microservice decomposition.**

`MASTER_PROMPT.md` explicitly states "Avoid premature microservices", yet the repo defines 4 separate FastAPI services (api, broker, strategy, notification). At this stage, the API gateway service (`services/api`) could handle all routes behind a single FastAPI app. Splitting adds:

- 4× Docker images to maintain
- 4× deployment targets
- 4× port mappings to orchestrate
- Inter-service communication overhead (every service talks to the same PostgreSQL anyway)

**Recommendation:** Collapse into a single `services/api` app with modular route files until a concrete scaling need justifies the split. Reintroduce microservices per bounded context only when traffic patterns demand it.

### 1.2 No API Gateway

Each service is exposed as a separate origin/port. The nginx config proxies `/api/`, `/broker/`, `/strategy/`, `/notify/` to different backends, but the frontend would need to know about all 4 endpoints. A single API gateway entry point would simplify client configuration and centralize auth, rate limiting, and CORS.

### 1.3 Shared Database

All 4 microservices connect to the same PostgreSQL database. This defeats the purpose of microservice isolation — a schema change in one service can break others. Each service should own its data.

---

## 2. Folder Structure

### 2.1 Python Services — Missing `__init__.py`

All 4 services have `app/core/`, `app/models/`, `app/routes/`, `app/schemas/` directories but **none contain `__init__.py` files**. These directories will not be recognized as Python packages. Imports like `from app.core.config import settings` will fail with `ModuleNotFoundError`.

Also missing: `app/__init__.py`, `app/main.py`.

### 2.2 `packages/ui` — Barely Scaffolded

Has only a `package.json` and empty `src/components/` and `src/lib/` directories. Missing:

- `tsconfig.json`
- No test config
- No actual components

### 2.3 `apps/marketing` — No Test Config

No `vitest.config.ts` or any test files. The root `vitest.workspace.ts` tries to include `apps/*` but marketing will either fail or be silently skipped.

### 2.4 Missing Files

| File | Status | Impact |
|------|--------|--------|
| `LICENSE` | Missing | Required for open-source |
| `pnpm-lock.yaml` | Missing | Lockfile should be committed |
| `.dockerignore` | Missing | Build context includes `.git`, `node_modules` |
| `services/*/app/__init__.py` | Missing | Python packages won't work |
| `services/*/app/main.py` | Missing | Docker CMD references non-existent module |
| `apps/dashboard/src/app/layout.tsx` | Missing | Next.js App Router entry point |

---

## 3. Docker

### 3.1 CRITICAL: Dev Compose Network Mismatch

`docker-compose.dev.yml` declares the `veertrade` network as **external**:

```yaml
networks:
  veertrade:
    external: true
```

But `docker-compose.yml` (base) creates it as a regular bridge network:

```yaml
networks:
  veertrade:
    driver: bridge
```

When running `docker compose -f docker-compose.yml -f docker-compose.dev.yml up`, the dev overlay will fail because the network is defined in the base file but the overlay expects it to already exist externally. Docker Compose merges services but **network definitions are merged by name** — if the overlay says `external: true` and the base says `driver: bridge`, Compose throws an error.

**Fix:** Remove `external: true` from `docker-compose.dev.yml`, or use a separate network name.

### 3.2 Missing `.dockerignore`

The Docker build context is `.` (root). Without a `.dockerignore`, the entire `.git/` directory, `node_modules/` (if present), and other artifacts are sent to the Docker daemon, slowing builds and potentially leaking secrets.

### 3.3 Dev Dockerfile — Dependency Install Inefficiency

Dev Dockerfiles install dependencies via `pip install .[dev]` which installs the local package. But the `pyproject.toml` is the only file copied — the `app/` directory is not. This means:

1. `pip install .[dev]` succeeds (finds pyproject.toml)
2. The runtime `CMD` references `app.main:app` but `app/` is mounted as a volume at runtime
3. If `app/` is not mounted (e.g., CI), the container fails with `ModuleNotFoundError`

This works for local dev but not for CI or production builds.

### 3.4 Production Dockerfiles Copy Pattern

The builder stage copies `pyproject.toml` but `RUN pip install --no-cache-dir .` installs a package named `veertrade-api` (from pyproject.toml) with **zero Python files** because only `pyproject.toml` is present, not `app/`. The install succeeds but the installed package is a skeleton. The actual `app/` directory is copied in the final stage and Python finds it via the working directory, not via the installed package.

This works by accident but isn't the standard pattern. Convention is `COPY pyproject.toml . && RUN pip install` followed by `COPY . .` to get proper package install with metadata.

---

## 4. Turborepo

### 4.1 TypeScript Project References Not Configured

`turbo.json` does not declare project references. The root `tsconfig.json` has no `references` field. Running `tsc --build` at root will not typecheck any sub-project. `turbo typecheck` only runs per-package scripts (which exist for dashboard, types, shared) but has no workspace-aware typecheck.

### 4.2 `test` and `typecheck` Depend on `^build`

In `turbo.json`:

```json
"test": { "dependsOn": ["^build"] },
"typecheck": { "dependsOn": ["^build"] }
```

This means running `turbo test` or `turbo typecheck` first triggers a full build of all dependencies. For development iteration this adds unnecessary time. Consider removing the build dependency from `typecheck` and `test`, or making it opt-in via `--filter`.

### 4.3 Missing `outputs` for Lint, Test, Typecheck

`build` has `outputs` defined (`.next/**`, `dist/**`), but `lint`, `test`, and `typecheck` do not. This means Turborepo cannot cache their results. These should have `"outputs": []` (empty, meaning no artifacts) or log output caching configured.

---

## 5. pnpm Workspace

### 5.1 Cross-Package Dependencies Missing

`packages/types` and `packages/shared` are not listed as dependencies in `apps/dashboard`:

```json
// apps/dashboard/package.json — missing:
"dependencies": {
  "@veertrade/types": "workspace:*",
  "@veertrade/shared": "workspace:*"
}
```

Without this, `import { User } from "@veertrade/types"` in dashboard code will fail at build time. The types are also not referenced from `packages/ui` or `packages/shared`.

### 5.2 `packages/ui` Export Pattern May Break

```json
"exports": {
  "./*": "./src/components/*.tsx"
}
```

This maps `import { Button } from "@veertrade/ui/button"` to `./src/components/button.tsx`. However:

- No `tsconfig.json` exists for the package — won't be typechecked
- The export map uses `./*` which requires each component to be a single file directly under `src/components/`

---

## 6. TypeScript Configuration

### 6.1 Root `tsconfig.json` Is a Duplicate

`tsconfig.json` and `tsconfig.base.json` are **identical**:

```
tsconfig.base.json  →  same content
tsconfig.json       →  same content (no `references`, no `files`)
```

The root `tsconfig.json` should use `references` to compose sub-projects:

```json
{
  "files": [],
  "references": [
    { "path": "packages/types" },
    { "path": "packages/shared" },
    { "path": "packages/ui" },
    { "path": "apps/dashboard" },
  ]
}
```

### 6.2 `apps/dashboard` Targets ES2017

`target: "ES2017"` is unnecessarily old for a Node 20 / modern browser environment. Should be `ES2022` to match the base config and enable modern syntax like `Array.fromAsync`, `Error.cause`, etc.

---

## 7. FastAPI Structure

### 7.1 No Application Entry Points

Every service is missing `app/main.py` (or equivalent). The Dockerfiles reference `app.main:app` which does not exist. The entire `app/` tree is empty stubs.

### 7.2 No `__init__.py` Files

As noted in §2.1 — without these, `from app.core.config import settings` will throw `ModuleNotFoundError`.

### 7.3 No Pydantic Settings Module

The plan calls for `pydantic-settings` (included in dependencies) but no `app/core/config.py` or `app/core/settings.py` exists.

### 7.4 Ruff Lint Rules Are Identical Across All Services

Every `pyproject.toml` has the same `[tool.ruff.lint] select`. This is duplicated 4×. Consider a shared Ruff config or a root `ruff.toml`.

### 7.5 `httpx` in Both Main and Dev Dependencies

In `services/api/pyproject.toml`, `httpx` appears in both `[project.dependencies]` and `[project.optional-dependencies] dev`. Redundant.

---

## 8. PostgreSQL

### 8.1 No `init.sql` / Init Script

The `postgres` image supports `/docker-entrypoint-initdb.d/*.{sql,sql.gz,sh}`. There's no init script to:

- Create the `uuid-ossp` or `pgcrypto` extension
- Create initial schemas or roles
- Create test databases

### 8.2 Port Exposed to Host

`5432:5432` exposes PostgreSQL to the host network. In production this is a security risk. Should use a named network or expose only to other containers.

---

## 9. Redis

No issues. Configuration is minimal and correct.

---

## 10. CI/CD

### 10.1 No Python/Service Tests in CI

CI runs `pnpm test` which only covers JS/TS packages under Vitest. The Python services (4 of them) have no CI step. Ruff and pytest are configured in `pyproject.toml` but never invoked.

### 10.2 No Docker Image Build or Push

The `build` job runs `pnpm build` (JS/TS compilation) but never builds Docker images. CI does not validate that:

- Dockerfiles build successfully
- Docker Compose configuration is valid
- Services start correctly together

### 10.3 Deploy Workflow Does Nothing

`deploy.yml` runs `pnpm build` and stops. It doesn't:

- Push Docker images to a registry
- Deploy to any environment
- Run database migrations
- Notify any service

It is effectively a duplicate of the `build` CI job.

### 10.4 No Integration Test Step

There's no step that brings up `docker compose`, runs integration tests against real PostgreSQL/Redis, and tears down. Trading systems critically require integration testing.

---

## 11. Security

### 11.1 Secrets in `.env.example`

| Secret | Value | Risk |
|--------|-------|------|
| `POSTGRES_PASSWORD` | `veertrade_dev` | Weak default, no warning to change |
| `JWT_SECRET` | `change-me-in-production` | Commented but no enforcement |
| `ZERODHA_API_KEY` | Empty | Fine (placeholder) |

The Postgres password should be randomized or at least flagged with a comment like `# CHANGE THIS BEFORE PRODUCTION`.

### 11.2 No Docker Build Secrets

Zerodha API keys, JWT secrets, and other credentials will be baked into Docker images if passed as build args. No `--secret` flag usage in Dockerfiles.

### 11.3 No Secret Scanning in CI

No step to scan for accidentally committed secrets (e.g., `trufflehog`, `git-secrets`, `gitleaks`).

### 11.4 No `.dockerignore`

See §3.2. Could leak `.git/` history (which may contain secrets) into the Docker build context.

---

## 12. Code Quality

### 12.1 Weak Test Coverage

- `packages/types/src/index.test.ts` — only checks that the module exports exist
- `packages/shared/src/utils/format.test.ts` — `formatCurrency` test only asserts `toContain("1,500")` instead of the full formatted string `"₹ 1,500.00"`
- No tests for Zod schemas (validation rules like `password min(8)`, email format)
- No tests for any Python code (no Python code exists yet, but test infrastructure is incomplete)

### 12.2 Circular Reference in `broker.ts`

`BrokerConnection` has a `broker: Broker` field, creating a circular object reference. Fine for TypeScript types, but serialization (JSON.stringify) will handle it fine as long as it doesn't form a runtime cycle. Not critical, but worth noting.

### 12.3 `OrderType` Duplicated

Defined in `packages/types/src/trade.ts`:

```typescript
export type OrderType = "market" | "limit" | "sl" | "sl_m";
```

And imported in `packages/types/src/order.ts`. This is clean, but the `Order` interface uses `OrderType` imported from `./trade` while `TradeSide` is also in `trade.ts`. This creates a dependency from `order.ts` → `trade.ts` — acceptable but worth keeping an eye on.

### 12.4 `packages/ui` Unused

No workspace depends on `@veertrade/ui`. It's scaffolded but orphaned.

---

## Severity Matrix

| Issue | Severity | Category |
|-------|----------|----------|
| No `__init__.py` in Python services | **High** — broken imports | Structure |
| No `app/main.py` entry point | **High** — won't run | Code |
| Docker network external mismatch | **High** — dev compose fails | Docker |
| Missing cross-package workspace deps | **High** — imports fail at build | Monorepo |
| No CI for Python/Docker | **High** — untested services | CI/CD |
| No `.dockerignore` | **Medium** — slow builds, leak risk | Docker |
| No TypeScript project references | **Medium** — no workspace typecheck | TypeScript |
| Deploy workflow is a no-op | **Medium** — false sense of deployment | CI/CD |
| Root `tsconfig.json` is a duplicate | **Medium** — dead file | TypeScript |
| Tests depend on `^build` in turbo | **Medium** — slow dev iteration | Turborepo |
| ESLint has unused `@eslint/js` dep | **Low** — dead dependency | Linting |
| `httpx` duplicated in dev deps | **Low** — redundant | Backend |
| Postgres port exposed to host | **Low** (dev) | Security |
| Weak test assertions | **Low** — passes but shallow | Quality |
| `packages/ui` orphaned | **Low** — unused | Structure |

---

## Action Items

1. **Blocking** — Add `__init__.py` to all Python `app/` directories + create `app/main.py` with FastAPI app factory
2. **Blocking** — Fix `docker-compose.dev.yml` network: remove `external: true`
3. **Blocking** — Add `@veertrade/types` and `@veertrade/shared` as workspace deps in `apps/dashboard/package.json`
4. **High** — Add `.dockerignore`
5. **High** — Add Python service CI steps (ruff + pytest) to the workflow
6. **High** — Add Docker build validation to CI
7. **Medium** — Add TypeScript project references to root `tsconfig.json`
8. **Medium** — Rebuild deploy workflow to actually deploy (or remove it)
9. **Medium** — Collapse to 1 FastAPI service or keep 4 but give each its own DB schema
10. **Low** — Update `apps/dashboard` TS target to `ES2022`
11. **Low** — Remove unused `@eslint/js` from root `package.json`
12. **Low** — Remove duplicate `httpx` from `services/api/pyproject.toml` dev deps
