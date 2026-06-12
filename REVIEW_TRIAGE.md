# Review Triage

> Priority classification and action plan for each finding from REVIEW_REPORT.md.

---

## Priority Levels

| Level | Meaning | Gate |
|-------|---------|------|
| **P0** | Must fix before any development starts | Development blocker |
| **P1** | Must fix before production launch | Production gate |
| **P2** | Can be postponed | Tech debt bucket |

---

## P0 — Must Fix Before Development Starts

### P0.1 — Python Services: Missing `__init__.py` (#2.1 / #7.2)

| Field | |
|-------|---|
| **Why it matters** | Python requires `__init__.py` to treat directories as importable packages. Every `from app.x import y` will raise `ModuleNotFoundError`. |
| **Impact if ignored** | Zero lines of Python can execute. Every import fails. Development cannot proceed on any backend service. |
| **Effort** | **XS** — 1 command per service: `touch services/*/app/{__init__.py,core/__init__.py,models/__init__.py,routes/__init__.py,schemas/__init__.py}` |
| **Action** | Create `__init__.py` in every `app/` subdirectory across all 4 services. |

### P0.2 — Python Services: Missing `app/main.py` (#7.1)

| Field | |
|-------|---|
| **Why it matters** | Dockerfiles reference `app.main:app` as the uvicorn entry point. The file doesn't exist. |
| **Impact if ignored** | Containers exit immediately with `ModuleNotFoundError`. No backend service can start. |
| **Effort** | **S** — Create `app/main.py` with a minimal FastAPI app factory in each service. |
| **Action** | Create `app/main.py` with FastAPI app instance, lifespan handler, and root health endpoint in all 4 services. |

### P0.3 — Python Services: No Pydantic Settings Module (#7.3)

| Field | |
|-------|---|
| **Why it matters** | `pydantic-settings` is listed as a dependency. No `app/core/settings.py` exists. No config can be loaded. No service can read environment variables, DB URLs, or secrets. |
| **Impact if ignored** | Every service will fail at startup during config initialization. Hardcoded values proliferate. |
| **Effort** | **S** — 30–40 lines per settings module, shared across services. |
| **Action** | Create `app/core/settings.py` with `BaseSettings` class reading from environment. |

### P0.4 — Docker Dev Compose Network Mismatch (#3.1)

| Field | |
|-------|---|
| **Why it matters** | `docker-compose.dev.yml` declares `veertrade` network as `external: true`. Base compose creates it as a bridge. Compose merge logic rejects the conflict. |
| **Impact if ignored** | `docker compose -f docker-compose.yml -f docker-compose.dev.yml up` throws an error. No one can run the dev environment with services. |
| **Effort** | **XS** — Remove `external: true` from `docker-compose.dev.yml` (2 words). |
| **Action** | Edit `docker-compose.dev.yml`: change `external: true` to `driver: bridge` or just remove the network block entirely. |

### P0.5 — Cross-Package pnpm Dependencies Missing (#5.1)

| Field | |
|-------|---|
| **Why it matters** | `apps/dashboard/package.json` does not list `@veertrade/types` or `@veertrade/shared` as dependencies. TypeScript and pnpm will not resolve imports like `import { User } from "@veertrade/types"`. |
| **Impact if ignored** | Any import from shared packages in dashboard code fails at build time. All frontend development against shared types is blocked. |
| **Effort** | **XS** — Add 2 entries to `apps/dashboard/package.json` dependencies. |
| **Action** | Add `"@veertrade/types": "workspace:*"` and `"@veertrade/shared": "workspace:*"` to `apps/dashboard/package.json`. |

### P0.6 — Dashboard Missing Next.js App Router Entry Point (#2.4)

| Field | |
|-------|---|
| **Why it matters** | Next.js App Router requires `src/app/layout.tsx` (or `app/layout.tsx`) as the root layout. It does not exist. |
| **Impact if ignored** | `next dev` and `next build` fail immediately. The dashboard app cannot start. |
| **Effort** | **XS** — Single file with HTML shell and `{children}`. |
| **Action** | Create `apps/dashboard/src/app/layout.tsx` with minimal root layout + `apps/dashboard/src/app/page.tsx` placeholder. |

---

## P1 — Must Fix Before Production

### P1.1 — Missing `.dockerignore` (#3.2 / #11.4)

| Field | |
|-------|---|
| **Why it matters** | Docker build context is `.` (the repo root). Without `.dockerignore`, the daemon receives `.git/` (history with potential secrets), `node_modules/`, and other build artifacts. |
| **Impact if ignored** | 10–100× slower builds; risk of git history / secrets leaking into image layers. |
| **Effort** | **XS** — Single file, ~10 lines. |
| **Action** | Create `.dockerignore` excluding `.git`, `node_modules`, `dist`, `.next`, `*.md`, `docs/`, etc. |

### P1.2 — No Python / Docker in CI (#10.1 / #10.2)

| Field | |
|-------|---|
| **Why it matters** | CI only runs `pnpm test` (Vitest). Four Python services with ruff + pytest configured are never validated. Docker images are never built. |
| **Impact if ignored** | Python regressions reach production undetected. Dockerfiles that break pass CI. False confidence in pipeline. |
| **Effort** | **M** — Add ruff check + pytest to CI matrix; add `docker compose build` validation step. |
| **Action** | Add a `python-lint` job (ruff), `python-test` job (pytest), and `docker-build` job to `.github/workflows/ci.yml`. |

### P1.3 — Deploy Workflow Is a No-Op (#10.3)

| Field | |
|-------|---|
| **Why it matters** | `deploy.yml` only runs `pnpm build`. No images are pushed, no migrations run, no environment is updated. The workflow name "Deploy" is misleading. |
| **Impact if ignored** | Team believes deploys are automated when they are not. No path to production. |
| **Effort** | **S** — Either implement actual deployment steps or remove the file. |
| **Action** | Either implement real deploy steps (Docker build/push, SSH/deploy, migration run) or delete `deploy.yml` until deployment infrastructure exists. |

### P1.4 — TypeScript Project References Not Configured (#4.1 / #6.1)

| Field | |
|-------|---|
| **Why it matters** | Root `tsconfig.json` is identical to `tsconfig.base.json` and has no `references` array. `tsc --build` at root typechecks nothing. Workspace-wide type safety is unenforced. |
| **Impact if ignored** | Type errors across package boundaries go undetected until runtime. No incremental typechecking. |
| **Effort** | **S** — Add `references` to root `tsconfig.json`. |
| **Action** | Convert root `tsconfig.json` to use `{ "files": [], "references": [...] }` pointing to each workspace package. |

### P1.5 — No PostgreSQL Init Script (#8.1)

| Field | |
|-------|---|
| **Why it matters** | Database needs `uuid-ossp` / `pgcrypto` extensions for UUID primary keys. No init script creates them. Also no schema or test database provisioning. |
| **Impact if ignored** | Migrations fail if they depend on extensions. Manual setup required every time the DB is created. |
| **Effort** | **XS** — Single SQL file, 3–5 lines. |
| **Action** | Create `infrastructure/docker/postgres/init.sql` with extension creation and any base setup. Mount into `docker-compose.yml`. |

### P1.6 — Dashboard TS Target Is ES2017 (#6.2)

| Field | |
|-------|---|
| **Why it matters** | Dashboard targets `ES2017` while base config targets `ES2022`. Features like `Array.fromAsync`, `Error.cause`, and modern `flatMap` are unavailable or require polyfills. |
| **Impact if ignored** | Mismatch between packages — shared code compiled to ES2022 may not run in the dashboard's target. Unnecessary polyfill weight. |
| **Effort** | **XS** — Change `"target": "ES2017"` to `"target": "ES2022"` in `apps/dashboard/tsconfig.json`. |
| **Action** | Align dashboard tsconfig target with base. |

### P1.7 — Weak Default Secrets in `.env.example` (#11.1)

| Field | |
|-------|---|
| **Why it matters** | Dev env uses `veertrade_dev` as Postgres password and `change-me-in-production` as JWT secret. No warnings about changing these before production. |
| **Impact if ignored** | Production deployment with defaults = trivially guessable credentials. JWT tokens forgeable. |
| **Effort** | **XS** — Add comments to `.env.example` flagging secrets that must change. |
| **Action** | Add `# !!! CHANGE THIS BEFORE PRODUCTION !!!` comments next to `POSTGRES_PASSWORD` and `JWT_SECRET`. Optionally generate random defaults. |

### P1.8 — No Ruff/Python Linting in CI (#10.1)

| Field | |
|-------|---|
| **Why it matters** | Python code has no automated linting in CI. Ruff is configured in `pyproject.toml` but never invoked by CI. |
| **Impact if ignored** | Code style drifts. Import ordering, naming, and basic bugs go unchecked. |
| **Effort** | **S** — Add `ruff check .` to CI step. |
| **Action** | Add a `services-lint` job or step running `ruff check services/` in CI. |

### P1.9 — No Integration Tests in CI (#10.4)

| Field | |
|-------|---|
| **Why it matters** | Trading systems require integration tests against real DB and broker stubs. No such step exists in CI. |
| **Impact if ignored** | Integration regressions undetected. Database schema changes don't get tested against actual queries. |
| **Effort** | **M** — Docker Compose up, run pytest with asyncpg, tear down. |
| **Action** | Add a CI job that starts postgres + redis via Docker Compose, runs Python integration tests, and tears down. |

### P1.10 — Missing `pnpm-lock.yaml` (#2.4)

| Field | |
|-------|---|
| **Why it matters** | Lockfile ensures deterministic installs across environments. Missing means every `pnpm install` may resolve differently. |
| **Impact if ignored** | CI and local dev may get different dependency versions. Non-reproducible builds. |
| **Effort** | **XS** — Run `pnpm install` once and commit the generated lockfile. |
| **Action** | Run `pnpm install && git add pnpm-lock.yaml`. |

---

## P2 — Can Be Postponed

### P2.1 — Premature Microservice Split (#1.1)

| Field | |
|-------|---|
| **Why it matters** | 4 separate FastAPI services when 1 would suffice for MVP. Adds maintenance surface, port orchestration, 4× Docker images. |
| **Impact if ignored** | Slower build times, more docker-compose complexity, harder local development. Not a correctness issue. |
| **Effort** | **M** to collapse into 1 service. |
| **Action** | Monitor. If the overhead becomes painful, collapse into `services/api` with modular route files. |

### P2.2 — No API Gateway (#1.2)

| Field | |
|-------|---|
| **Why it matters** | Frontend must know 4 different endpoints. Auth and CORS configured per-service. |
| **Impact if ignored** | More complex frontend config. Duplicated middleware. Not a blocker — the nginx config already proxies paths. |
| **Effort** | **M** to introduce a gateway service. |
| **Action** | Defer until microservice count grows or auth centralization becomes painful. |

### P2.3 — Shared Database Across Services (#1.3)

| Field | |
|-------|---|
| **Why it matters** | All 4 services connect to the same PostgreSQL. A schema change by one service can break others. |
| **Impact if ignored** | Potential coupling, but for MVP this is acceptable. Schema is small and team is small. |
| **Effort** | **L** to split into separate databases/schemas. |
| **Action** | Defer. Revisit when services are independently deployed or when schema ownership conflicts arise. |

### P2.4 — `packages/ui` Barely Scaffolded (#2.2)

| Field | |
|-------|---|
| **Why it matters** | Package exists but has no tsconfig, no components, no tests. |
| **Impact if ignored** | None — not consumed by any workspace yet. |
| **Effort** | **S** — Add tsconfig, vitest config, first component. |
| **Action** | Defer until dashboard UI work begins. |

### P2.5 — `apps/marketing` No Test Config (#2.3)

| Field | |
|-------|---|
| **Why it matters** | Marketing app (Astro) has no test config. `vitest.workspace.ts` tries to include it. |
| **Impact if ignored** | Vitest workspace may throw an error trying to load marketing as a project without a vitest config. |
| **Effort** | **XS** — Add empty vitest config or exclude from workspace. |
| **Action** | Either create `apps/marketing/vitest.config.ts` or remove it from `vitest.workspace.ts`. |

### P2.6 — Dev Dockerfile Dependency Install Pattern (#3.3)

| Field | |
|-------|---|
| **Why it matters** | Dev Dockerfiles install via `pip install .[dev]` with only `pyproject.toml` present. No `app/` directory at build time. |
| **Impact if ignored** | Works because `app/` is volume-mounted at runtime. CI builds with these Dockerfiles would fail. |
| **Effort** | **S** — Copy `app/` before pip install. |
| **Action** | Fix when Docker images need to run in CI or production without volume mounts. |

### P2.7 — Production Dockerfile Copy Pattern (#3.4)

| Field | |
|-------|---|
| **Why it matters** | Builder installs a skeleton package (no source), then source is copied raw in final image. Works by accident. |
| **Impact if ignored** | Package metadata incomplete. Editable install not available. But app runs. |
| **Effort** | **S** — Restructure Dockerfiles to `COPY . .` after pip install. |
| **Action** | Fix during Docker hardening pass before production. |

### P2.8 — `test`/`typecheck` Depend on `^build` in turbo.json (#4.2)

| Field | |
|-------|---|
| **Why it matters** | Running `turbo test` triggers a full build first. Slows down dev iteration. |
| **Impact if ignored** | Adds 10–30s to every test run. Annoying but not blocking. |
| **Effort** | **XS** — Remove `dependsOn: ["^build"]` from test/typecheck tasks. |
| **Action** | Fix when dev iteration speed becomes a complaint. |

### P2.9 — Missing `outputs` for Lint/Test/Typecheck (#4.3)

| Field | |
|-------|---|
| **Why it matters** | Without `outputs`, Turborepo cannot cache these task results. |
| **Impact if ignored** | Cache misses on every run. Slower CI but functionally correct. |
| **Effort** | **XS** — Add `"outputs": []` to each task in turbo.json. |
| **Action** | Fix as part of any turbo.json tuning pass. |

### P2.10 — `packages/ui` Export Pattern (#5.2)

| Field | |
|-------|---|
| **Why it matters** | `"./*": "./src/components/*.tsx"` requires flat component structure. No tsconfig. |
| **Impact if ignored** | Won't matter until components are added. |
| **Effort** | **S** — Add tsconfig, validate export map when first component is created. |
| **Action** | Fix when `@veertrade/ui` is actually consumed. |

### P2.11 — Ruff Rules Duplicated 4× (#7.4)

| Field | |
|-------|---|
| **Why it matters** | Same `[tool.ruff.lint] select` repeated in all 4 pyproject.toml files. |
| **Impact if ignored** | Maintenance nuisance. Inconsistency possible if one copy drifts. |
| **Effort** | **XS** — Extract to root `ruff.toml`. |
| **Action** | Defer. Fix if/when a 5th Python service is added. |

### P2.12 — `httpx` Duplicated in Dev Dependencies (#7.5)

| Field | |
|-------|---|
| **Why it matters** | `httpx` appears in both `dependencies` and `[dev]` in `services/api/pyproject.toml`. |
| **Impact if ignored** | No functional impact. pip deduplicates. Minor noise. |
| **Effort** | **XS** — Remove `httpx` from `[dev]`. |
| **Action** | Clean up during next pyproject.toml pass. |

### P2.13 — Postgres Port Exposed to Host (#8.2)

| Field | |
|-------|---|
| **Why it matters** | `5432:5432` exposes PostgreSQL on the host network. |
| **Impact if ignored** | In dev, acceptable. In production, a direct attack vector. |
| **Effort** | **XS** — Remove port mapping in production compose or use `127.0.0.1:5432:5432` for dev. |
| **Action** | Fix before production deployment, not before dev starts. |

### P2.14 — Weak Test Coverage (#12.1)

| Field | |
|-------|---|
| **Why it matters** | Existing tests are superficial — `index.test.ts` checks module existence only; `format.test.ts` uses weak assertions. |
| **Impact if ignored** | Tests pass even if code is broken. False sense of coverage. |
| **Effort** | **M** to write meaningful unit tests for all existing schemas and utils. |
| **Action** | Improve tests as part of regular feature development. Not a blocker. |

### P2.15 — Circular Reference in `broker.ts` (#12.2)

| Field | |
|-------|---|
| **Why it matters** | `BrokerConnection` references `Broker` creating a circular type structure. |
| **Impact if ignored** | Fine for TypeScript types. JSON serialization is unaffected since these are interfaces, not runtime objects. |
| **Effort** | **XS** — Flatten to `brokerId` + optional joined `broker` if needed. |
| **Action** | Fix if serialization issues arise. Low priority. |

### P2.16 — Unused `@eslint/js` Dependency (#11, table row)

| Field | |
|-------|---|
| **Why it matters** | `@eslint/js` is in root `devDependencies` but never imported in `eslint.config.mjs`. |
| **Impact if ignored** | Dead package in `node_modules`. No functional impact. |
| **Effort** | **XS** — `pnpm remove @eslint/js`. |
| **Action** | Remove during next dependency cleanup. |

### P2.17 — `packages/ui` Orphaned (#12.4)

| Field | |
|-------|---|
| **Why it matters** | No workspace depends on `@veertrade/ui`. |
| **Impact if ignored** | None — it's dead code until consumed. |
| **Effort** | **XS** — Remove if it stays unused past Phase 2; keep if dashboard UI work begins. |
| **Action** | No action needed. It will be used when dashboard components are built. |

### P2.18 — No Secret Scanning in CI (#11.3)

| Field | |
|-------|---|
| **Why it matters** | No automated check for committed secrets (API keys, passwords, tokens). |
| **Impact if ignored** | Secret leaks go undetected until exploited. Mitigated by `.dockerignore` and `.gitignore`. |
| **Effort** | **S** — Add `gitleaks` or `trufflehog` scan to CI. |
| **Action** | Add when security audit is performed before production. |

### P2.19 — No Docker Build Secrets (#11.2)

| Field | |
|-------|---|
| **Why it matters** | Credentials may be baked into Docker images as build args if not using `--secret`. |
| **Impact if ignored** | Secrets exposed in image layers. Medium risk — only matters if build-time secrets are needed. |
| **Effort** | **S** — Use Docker `--secret` flag and `RUN --mount=type=secret`. |
| **Action** | Address when deployment infrastructure is built (Phase 4). |

### P2.20 — No LICENSE File (#2.4)

| Field | |
|-------|---|
| **Why it matters** | No license means default copyright restrictions apply. Others cannot legally use the code. |
| **Impact if ignored** | Only matters if the project is open-sourced or contributions are expected. |
| **Effort** | **XS** — Copy a license file (MIT recommended). |
| **Action** | Add when the repository is made public. |

---

## Summary

| Priority | Count | Cumulative |
|----------|-------|------------|
| **P0** | 6 | 6 |
| **P1** | 10 | 16 |
| **P2** | 20 | 36 |
| **Total findings** | 36 | |

## Execution Order

```
Before first line of code:
  ├── P0.1 — __init__.py files (XS)
  ├── P0.2 — app/main.py entry points (S)
  ├── P0.3 — Pydantic settings module (S)
  ├── P0.4 — Docker network mismatch fix (XS)
  ├── P0.5 — Cross-package workspace deps (XS)
  └── P0.6 — Next.js root layout (XS)

Before production:
  ├── P1.1 — .dockerignore (XS)
  ├── P1.2 — Python + Docker CI (M)
  ├── P1.3 — Deploy workflow (S)
  ├── P1.4 — TS project references (S)
  ├── P1.5 — PostgreSQL init script (XS)
  ├── P1.6 — Dashboard TS target (XS)
  ├── P1.7 — .env.example warnings (XS)
  ├── P1.8 — Ruff in CI (S)
  ├── P1.9 — Integration tests (M)
  └── P1.10 — pnpm lockfile (XS)

When convenient:
  └── 20 P2 items across all categories
```
