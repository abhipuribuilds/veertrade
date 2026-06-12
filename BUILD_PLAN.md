# Build Plan — VeerTrade

> Product: AI-powered algorithmic trading platform for Indian markets.
> Architecture: Monorepo — Astro (marketing) + Next.js (dashboard) + FastAPI microservices + PostgreSQL.

---

## Key

| Symbol | Meaning |
|--------|---------|
| 🧩 | Can be built by an independent subagent |
| ⏱ | Complexity: XS / S / M / L / XL |

---

## Epic 1: Project Foundation

| # | Feature | Task | ⏱ | Subagent |
|---|---------|------|----|----------|
| 1.1 | Monorepo scaffolding | Initialize pnpm workspace with `apps/`, `services/`, `packages/`, `infrastructure/`, `docs/` | S | 🧩 A |
| 1.2 | Monorepo scaffolding | Configure TypeScript project references across workspace | M | 🧩 A |
| 1.3 | Monorepo scaffolding | Set up ESLint + Prettier shared configs | S | 🧩 A |
| 1.4 | Monorepo scaffolding | Create `.gitignore`, `LICENSE`, root `README.md` | XS | 🧩 A |
| 1.5 | Monorepo scaffolding | Set up Husky + lint-staged for pre-commit hooks | S | 🧩 A |
| 1.6 | Dev tooling | Configure Docker Compose for local dev (PostgreSQL, Redis) | M | 🧩 A |
| 1.7 | Dev tooling | Create `turbo.json` pipeline for build/lint/test across workspace | M | 🧩 A |
| 1.8 | CI/CD | GitHub Actions: lint → typecheck → test → build on PR | M | 🧩 A |
| 1.9 | CI/CD | GitHub Actions: deploy on merge to main | M | 🧩 A |
| 1.10 | Shared types package | Define core TypeScript interfaces: User, Strategy, Order, Position, etc. | M | 🧩 A |
| 1.11 | Shared utils package | Shared Zod schemas, date helpers, formatting utilities | M | 🧩 A |

---

## Epic 2: Database & Schema

| # | Feature | Task | ⏱ | Subagent |
|---|---------|------|----|----------|
| 2.1 | Database provisioning | Create PostgreSQL Docker image with init scripts | S | 🧩 B |
| 2.2 | Database provisioning | Set up Alembic for migrations | S | 🧩 B |
| 2.3 | Schema: users | Create `users` table (UUID PK, email, password hash, profile, status) | S | 🧩 B |
| 2.4 | Schema: subscriptions | Create `subscriptions` table (plan, period, billing, status) | S | 🧩 B |
| 2.5 | Schema: brokers | Create `brokers` table (name, type, config template) | XS | 🧩 B |
| 2.6 | Schema: broker_connections | Create `broker_connections` table (user FK, broker FK, encrypted credentials, status) | M | 🧩 B |
| 2.7 | Schema: strategies | Create `strategies` table (user FK, name, config JSON, version, status) | M | 🧩 B |
| 2.8 | Schema: backtests | Create `backtests` table (strategy FK, params, metrics JSON, status) | M | 🧩 B |
| 2.9 | Schema: paper_trades | Create `paper_trades` table (strategy FK, order details, executed price, status) | M | 🧩 B |
| 2.10 | Schema: live_trades | Create `live_trades` table (strategy FK, broker FK, order details, status) | M | 🧩 B |
| 2.11 | Schema: orders | Create `orders` table (trade FK, broker order ID, side, qty, price, status) | M | 🧩 B |
| 2.12 | Schema: positions | Create `positions` table (user FK, instrument, qty, avg price, PnL) | M | 🧩 B |
| 2.13 | Schema: notifications | Create `notifications` table (user FK, type, title, body, read_at) | S | 🧩 B |
| 2.14 | Schema: audit_logs | Create `audit_logs` table (user FK, action, resource, details JSON, IP) | S | 🧩 B |
| 2.15 | Migration management | Write initial Alembic migration for all tables | M | 🧩 B |
| 2.16 | Seed data | Create seed scripts for dev/test data | S | 🧩 B |

---

## Epic 3: API Gateway & Authentication

| # | Feature | Task | ⏱ | Subagent |
|---|---------|------|----|----------|
| 3.1 | API service scaffold | Initialize FastAPI project with Pydantic settings, DI container, middleware stack | M | 🧩 C |
| 3.2 | API service scaffold | Set up SQLAlchemy async engine + session factory | M | 🧩 C |
| 3.3 | API service scaffold | Set up Redis connection for caching/sessions | S | 🧩 C |
| 3.4 | Auth: registration | POST /auth/register — email + password, email verification flow | M | 🧩 C |
| 3.5 | Auth: login | POST /auth/login — JWT access + refresh token pair | M | 🧩 C |
| 3.6 | Auth: token refresh | POST /auth/refresh — rotate refresh token | S | 🧩 C |
| 3.7 | Auth: logout | POST /auth/logout — blacklist token | S | 🧩 C |
| 3.8 | Auth: password reset | POST /auth/forgot-password + POST /auth/reset-password | M | 🧩 C |
| 3.9 | Auth: RBAC middleware | Role-based access control decorator (admin, user, etc.) | M | 🧩 C |
| 3.10 | Auth: rate limiting | Token bucket / sliding window rate limiter per endpoint group | M | 🧩 C |
| 3.11 | User profile | GET/PUT /users/me — read & update profile | S | 🧩 C |
| 3.12 | User preferences | GET/PUT /users/me/preferences — dashboard prefs, notification prefs | S | 🧩 C |
| 3.13 | Subscription management | GET /subscriptions — list plans; POST /subscriptions — create checkout | M | 🧩 C |

---

## Epic 4: Marketing Site

| # | Feature | Task | ⏱ | Subagent |
|---|---------|------|----|----------|
| 4.1 | Astro project setup | Initialize Astro with Tailwind v4, TypeScript strict | S | 🧩 D |
| 4.2 | Pages: hero | Hero section with Three.js animated background | M | 🧩 D |
| 4.3 | Pages: features | Feature showcase section (glass cards, grid layout) | M | 🧩 D |
| 4.4 | Pages: pricing | Pricing tier cards (Free / Pro / Enterprise) | M | 🧩 D |
| 4.5 | Pages: about | About / brand story page | S | 🧩 D |
| 4.6 | Pages: blog | Blog/insights list + article pages | M | 🧩 D |
| 4.7 | Pages: docs | Documentation/help section | M | 🧩 D |
| 4.8 | Pages: legal | Privacy policy, terms of service | XS | 🧩 D |
| 4.9 | Components: navigation | Responsive nav with mobile hamburger, CTA buttons | M | 🧩 D |
| 4.10 | Components: footer | Footer with links, social, newsletter signup | S | 🧩 D |
| 4.11 | Components: CTAs | Waitlist signup, "Get Started" → dashboard link | S | 🧩 D |
| 4.12 | SEO | Meta tags, structured data, sitemap.xml, robots.txt | M | 🧩 D |
| 4.13 | Performance | Lighthouse audit — ensure 90+ on all pages | M | 🧩 D |
| 4.14 | Accessibility | Keyboard nav, screen reader support, contrast compliance | M | 🧩 D |

---

## Epic 5: Dashboard UI Framework

| # | Feature | Task | ⏱ | Subagent |
|---|---------|------|----|----------|
| 5.1 | Next.js scaffold | Initialize Next.js with Tailwind v4, TypeScript strict | S | 🧩 E |
| 5.2 | shadcn/ui setup | Configure shadcn/ui with custom VeerTrade theme (Zinc/Slate/Emerald) | M | 🧩 E |
| 5.3 | Theme provider | Dark/light mode toggle with system preference detection | S | 🧩 E |
| 5.4 | Figma-to-code: color | Implement color system: bg, surface, border, text, accent tokens | M | 🧩 E |
| 5.5 | Figma-to-code: typography | Set up font stack (Inter/Satoshi), heading scale, body scale | M | 🧩 E |
| 5.6 | Layout: shell | App shell: sidebar nav + top bar + main content area | M | 🧩 E |
| 5.7 | Layout: sidebar | Collapsible sidebar with nav groups, active states, icons | M | 🧩 E |
| 5.8 | Layout: top bar | User menu, notification bell, search shortcut | M | 🧩 E |
| 5.9 | Layout: responsive | Responsive breakpoints — desktop → tablet → mobile | M | 🧩 E |
| 5.10 | Shared: data table | Sortable, filterable, paginated data table component | L | 🧩 E |
| 5.11 | Shared: forms | Form input, select, date picker, switch, combobox | M | 🧩 E |
| 5.12 | Shared: charts | Line chart, bar chart, area chart, candlestick with Framer Motion | L | 🧩 E |
| 5.13 | Shared: cards | Glass card, stat card, metric card components | S | 🧩 E |
| 5.14 | Shared: modals | Slide-over panel, dialog, confirm dialog | M | 🧩 E |
| 5.15 | Shared: toast / notification | Notification toast system with queue | M | 🧩 E |
| 5.16 | Zustand stores | Auth store, UI store, notification store | M | 🧩 E |
| 5.17 | TanStack Query setup | Global fetch configuration, error handling, retry logic | M | 🧩 E |
| 5.18 | Middleware: auth guard | Redirect unauthenticated users to login | S | 🧩 E |
| 5.19 | Route groups | Organize pages: /dashboard, /strategies, /trading, /analytics, /settings | M | 🧩 E |

---

## Epic 6: Broker Integration

| # | Feature | Task | ⏱ | Subagent |
|---|---------|------|----|----------|
| 6.1 | Broker service scaffold | FastAPI service with broker abstraction layer | M | 🧩 F |
| 6.2 | Zerodha Kite Connect | Implement OAuth handshake (request token → access token) | L | 🧩 F |
| 6.3 | Zerodha Kite Connect | Encrypted storage of API keys + tokens | M | 🧩 F |
| 6.4 | Zerodha Kite Connect | Fetch instruments, live quotes, historical data endpoints | L | 🧩 F |
| 6.5 | Zerodha Kite Connect | Place/modify/cancel orders via Kite API | L | 🧩 F |
| 6.6 | Zerodha Kite Connect | WebSocket streaming for market data | XL | 🧩 F |
| 6.7 | Broker: connection UI | OAuth connect/disconnect flow in dashboard | M | 🧩 F |
| 6.8 | Broker: connection UI | Connection status indicator + health check | S | 🧩 F |
| 6.9 | Broker: instrument selector | Searchable instrument picker (equity, F&O, currency) | M | 🧩 F |
| 6.10 | Broker: abstraction | Interface for multi-broker support (Angel One, Upstox stubs) | M | 🧩 F |

---

## Epic 7: Strategy Engine

| # | Feature | Task | ⏱ | Subagent |
|---|---------|------|----|----------|
| 7.1 | Strategy service scaffold | FastAPI service for strategy CRUD + execution | M | 🧩 G |
| 7.2 | Strategy: CRUD | Create, read, update, delete strategies | M | 🧩 G |
| 7.3 | Strategy: visual builder | Drag-and-drop block-based strategy builder UI | XL | 🧩 G |
| 7.4 | Strategy: visual builder | Block library — entry conditions, exit conditions, SL, trailing, quantity | L | 🧩 G |
| 7.5 | Strategy: visual builder | JSON serialization of strategy block graph | M | 🧩 G |
| 7.6 | Strategy: code editor | Monaco/CodeMirror editor for custom Python strategy scripts | L | 🧩 G |
| 7.7 | Strategy: validation | Server-side validation of strategy logic + syntax checks | M | 🧩 G |
| 7.8 | Strategy: versioning | Version tracking for strategy edits + rollback support | M | 🧩 G |
| 7.9 | Strategy: templates | Pre-built strategy templates (MA crossover, RSI, etc.) | M | 🧩 G |
| 7.10 | Strategy: marketplace | Browse, import, rate strategies from community marketplace | L | 🧩 G |

---

## Epic 8: Backtesting Engine

| # | Feature | Task | ⏱ | Subagent |
|---|---------|------|----|----------|
| 8.1 | Backtest service scaffold | FastAPI service + Celery worker for async backtests | M | 🧩 H |
| 8.2 | Backtest: executor | Historical data fetcher, strategy runner, trade simulator | XL | 🧩 H |
| 8.3 | Backtest: metrics | Sharpe ratio, max drawdown, win rate, profit factor, CAGR | L | 🧩 H |
| 8.4 | Backtest: date range | Configurable date range with granularity selector | M | 🧩 H |
| 8.5 | Backtest: results UI | Results dashboard with equity curve, drawdown chart, trade list | L | 🧩 H |
| 8.6 | Backtest: results UI | Trade-by-trade replay viewer | M | 🧩 H |
| 8.7 | Backtest: comparison | Side-by-side comparison of multiple strategy backtests | M | 🧩 H |
| 8.8 | Backtest: reports | PDF/CSV export of backtest reports | M | 🧩 H |

---

## Epic 9: Paper Trading

| # | Feature | Task | ⏱ | Subagent |
|---|---------|------|----|----------|
| 9.1 | Paper trading service | FastAPI service for virtual order execution | M | 🧩 I |
| 9.2 | Paper trading: engine | Virtual order book, fill simulation with market data | L | 🧩 I |
| 9.3 | Paper trading: slippage | Configurable slippage model (percentage, fixed) | M | 🧩 I |
| 9.4 | Paper trading: positions | Track virtual positions, PnL, margin | M | 🧩 I |
| 9.5 | Paper trading: UI | Dedicated paper trading view with live order book | L | 🧩 I |
| 9.6 | Paper trading: reset | Ability to reset paper account and start fresh | S | 🧩 I |
| 9.7 | Paper ↔ live | One-click promote paper strategy to live | M | 🧩 I |

---

## Epic 10: Live Trading

| # | Feature | Task | ⏱ | Subagent |
|---|---------|------|----|----------|
| 10.1 | Live trading service | FastAPI service + Celery beat for scheduled strategy execution | L | 🧩 J |
| 10.2 | Live: order execution | Sync orders via connected broker API with retry/idempotency | L | 🧩 J |
| 10.3 | Live: position sync | Real-time position sync from broker | M | 🧩 J |
| 10.4 | Live: PnL tracking | Realized + unrealized PnL calculation | M | 🧩 J |
| 10.5 | Live: WebSocket stream | Live order/position/PnL push to dashboard | XL | 🧩 J |
| 10.6 | Risk: kill switch | Global emergency stop — cancel all orders, close positions | M | 🧩 J |
| 10.7 | Risk: daily loss limit | Configurable max daily loss — auto-stop on breach | M | 🧩 J |
| 10.8 | Risk: position limits | Max position size, max leverage, concentration limits | M | 🧩 J |
| 10.9 | Risk: order validation | Pre-order checks: quantity, price, margin, duplicate detection | M | 🧩 J |
| 10.10 | Risk: order confirmation | 2-step confirm for live orders (optional) | S | 🧩 J |
| 10.11 | Live: trading UI | Trading dashboard — open orders, positions, portfolio summary | L | 🧩 J |
| 10.12 | Live: order entry | Order form with quick presets (Market, LIMIT, SL, SL-M) | M | 🧩 J |
| 10.13 | Live: audit logging | Every trade decision logged with timestamp, reason, parameters | M | 🧩 J |

---

## Epic 11: Analytics & Reporting

| # | Feature | Task | ⏱ | Subagent |
|---|---------|------|----|----------|
| 11.1 | Analytics service | FastAPI service for aggregating trade data and computing metrics | M | 🧩 K |
| 11.2 | Analytics: P&L charts | Daily/weekly/monthly PnL chart | M | 🧩 K |
| 11.3 | Analytics: performance | Win rate, avg win/loss, expectancy, Sharpe, Calmar ratio | L | 🧩 K |
| 11.4 | Analytics: trade log | Filterable, searchable trade history with export | M | 🧩 K |
| 11.5 | Analytics: strategy comparison | Compare performance across multiple strategies | M | 🧩 K |
| 11.6 | Analytics: insights | Top performers, worst trades, time-based performance patterns | M | 🧩 K |
| 11.7 | Analytics: reports | Generate PDF reports for download | M | 🧩 K |
| 11.8 | Analytics: dashboard | Analytics overview page with key metrics grid | L | 🧩 K |

---

## Epic 12: AI Features

| # | Feature | Task | ⏱ | Subagent |
|---|---------|------|----|----------|
| 12.1 | AI service scaffold | FastAPI service + Celery worker for async AI tasks | M | 🧩 L |
| 12.2 | AI: LLM integration | OpenAI/LLM client wrapper with prompt templates | M | 🧩 L |
| 12.3 | AI: strategy generator (Phase 1) | Generate strategy logic from natural language description | L | 🧩 L |
| 12.4 | AI: strategy generator UI | Chat-like interface for describing strategy + preview output | M | 🧩 L |
| 12.5 | AI: trade coach (Phase 2) | Analyze open positions + give entry/exit suggestions | L | 🧩 L |
| 12.6 | AI: trade coach UI | Coach panel on trading dashboard with suggestions | M | 🧩 L |
| 12.7 | AI: trade journal (Phase 3) | Auto-tag trades, generate performance narratives | L | 🧩 L |
| 12.8 | AI: trade journal UI | Journal view with AI-written summaries per trade | M | 🧩 L |
| 12.9 | AI: marketplace (Phase 4) | AI-curated strategy recommendations + risk scores | L | 🧩 L |
| 12.10 | AI: market insights | Daily market summary, volatility alerts, regime detection | M | 🧩 L |

---

## Epic 13: Notifications

| # | Feature | Task | ⏱ | Subagent |
|---|---------|------|----|----------|
| 13.1 | Notification service | FastAPI service + Celery for email/push/in-app delivery | M | 🧩 M |
| 13.2 | In-app notifications | Real-time notification via WebSocket | M | 🧩 M |
| 13.3 | Email notifications | Transactional emails (welcome, order fill, breach alert) | M | 🧩 M |
| 13.4 | Push notifications | Web push / mobile push for critical alerts | M | 🧩 M |
| 13.5 | Notification preferences | Per-user channel preferences + quiet hours | M | 🧩 M |
| 13.6 | Notification center | Inbox UI in dashboard with read/unread, filters | M | 🧩 M |
| 13.7 | Alert rules | User-configurable alert triggers (price, PnL, drawdown) | M | 🧩 M |

---

## Epic 14: Infrastructure & DevOps

| # | Feature | Task | ⏱ | Subagent |
|---|---------|------|----|----------|
| 14.1 | Docker Compose | Multi-service Docker Compose for local development | M | 🧩 N |
| 14.2 | Dockerfiles | Optimized Dockerfiles for each service (multi-stage build) | M | 🧩 N |
| 14.3 | Nginx config | Reverse proxy for API + dashboard + websockets | M | 🧩 N |
| 14.4 | Deployment | Production deployment manifests (Docker Compose or K8s) | L | 🧩 N |
| 14.5 | Environment management | Dev/staging/prod environment variable strategy | M | 🧩 N |
| 14.6 | Monitoring | Health check endpoints, Prometheus metrics, structured logging | M | 🧩 N |
| 14.7 | Error tracking | Sentry/error tracking integration for frontend + backend | S | 🧩 N |
| 14.8 | Backup | Automated PostgreSQL backup strategy | S | 🧩 N |
| 14.9 | SSL / DNS | Certbot/Let's Encrypt automation, DNS setup | S | 🧩 N |
| 14.10 | Scripts | Dev bootstrap script, DB reset script, lint-all script | S | 🧩 N |

---

## Epic 15: Testing & QA

| # | Feature | Task | ⏱ | Subagent |
|---|---------|------|----|----------|
| 15.1 | Backend testing | Pytest suite for API endpoints (unit + integration) | L | 🧩 K |
| 15.2 | Backend testing | Pytest suite for trading engine (strategy execution, order flow) | L | 🧩 K |
| 15.3 | Frontend testing | Vitest + React Testing Library for components | L | 🧩 K |
| 15.4 | Frontend testing | Playwright/Cypress E2E tests for critical flows | L | 🧩 K |
| 15.5 | API contract tests | Pydantic response validation tests | M | 🧩 K |
| 15.6 | Security audit | JWT validation, SQL injection, XSS, CSRF checks | M | 🧩 K |
| 15.7 | Load testing | k6 / locust scripts for broker API + WebSocket load | M | 🧩 K |

---

## Subagent Assignment Summary

| Subagent | Domain | Epics |
|----------|--------|-------|
| 🧩 A | Foundation & Tooling | Epic 1 |
| 🧩 B | Database | Epic 2 |
| 🧩 C | API & Auth | Epic 3 |
| 🧩 D | Marketing Site | Epic 4 |
| 🧩 E | Dashboard UI | Epic 5 |
| 🧩 F | Broker Integration | Epic 6 |
| 🧩 G | Strategy Engine | Epic 7 |
| 🧩 H | Backtesting | Epic 8 |
| 🧩 I | Paper Trading | Epic 9 |
| 🧩 J | Live Trading & Risk | Epic 10 |
| 🧩 K | Analytics, Testing, QA | Epic 11, 15 |
| 🧩 L | AI Features | Epic 12 |
| 🧩 M | Notifications | Epic 13 |
| 🧩 N | Infrastructure & DevOps | Epic 14 |

---

## Execution Order

```
Phase 1 — Foundation
  Epic 1, Epic 2, Epic 14 (parallel: A, B, N)
    ↓
Phase 2 — Core Services
  Epic 3, Epic 4, Epic 5 (parallel: C, D, E)
    ↓
Phase 3 — Trading Infrastructure
  Epic 6, Epic 7, Epic 8 (parallel: F, G, H)
    ↓
Phase 4 — Trading Execution
  Epic 9, Epic 10 (parallel: I, J)
    ↓
Phase 5 — Intelligence & Polish
  Epic 11, Epic 12, Epic 13, Epic 15 (parallel: K, L, M)
```

Total: **15 Epics**, **~120 tasks**, **14 parallel subagents**.
