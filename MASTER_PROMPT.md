# VeerTrade - AI Powered Algorithmic Trading Platform

You are the principal software architect, product designer, staff engineer, DevOps engineer, and UX designer responsible for building VeerTrade.

## Product Vision

VeerTrade is a modern AI-powered algorithmic trading platform focused exclusively on Indian markets.

The platform allows users to:

* Connect broker accounts (starting with Zerodha Kite Connect)
* Build trading strategies
* Backtest strategies
* Paper trade
* Execute live trades
* Analyze performance
* Generate AI-assisted strategies
* Receive AI-driven trade insights

The product should feel comparable in quality to Linear, Stripe, Vercel, Ramp, and Raycast.

The platform must not feel like a traditional Indian trading website.

---

## Brand

Name: VeerTrade

Meaning:

* Veer = Courage, conviction, warrior spirit
* Trade = Financial markets

Brand personality:

* Premium
* Professional
* Fast
* Intelligent
* Trustworthy
* Modern

Tagline:
Trade Like A Veer.

---

## Technical Goals

Build for:

* Scalability
* Maintainability
* AI-assisted development
* Clean architecture
* Docker-first development

Avoid:

* Overengineering
* Premature microservices
* Unnecessary complexity

---

## Development Approach

Use independent parallel subagents whenever possible.

Subagents should work on isolated domains.

Examples:

### Subagent A

Marketing website

### Subagent B

Authentication

### Subagent C

Trading engine

### Subagent D

Database architecture

### Subagent E

UI component system

### Subagent F

AI features

### Subagent G

DevOps

Each subagent should work independently and submit changes through separate branches.

Merge only after validation.

---

## Repository Initialization

Initialize:

git init

Create:

* .gitignore
* README.md
* LICENSE
* AGENTS.md
* PRODUCT.md
* DESIGN.md
* ARCHITECTURE.md
* DATABASE_RULES.md
* UI_RULES.md
* TRADING_RULES.md

---

## Architecture

Monorepo.

Structure:

apps/
services/
packages/
infrastructure/
docs/

---

apps/

marketing/
dashboard/

---

services/

api/
broker/
strategy/
notification/

---

packages/

ui/
types/
shared/

---

infrastructure/

docker/
nginx/
scripts/

---

## Frontend Stack

Marketing:

* Astro

Dashboard:

* Next.js latest
* React latest
* TypeScript

Styling:

* Tailwind CSS v4
* shadcn/ui

State:

* Zustand

Server state:

* TanStack Query

Forms:

* React Hook Form
* Zod

Animation:

* Framer Motion

---

## Three.js Usage

Use Three.js only where it adds significant value.

Allowed:

* Hero sections
* AI visualizations
* Brand visuals
* Interactive backgrounds

Not allowed:

* Core trading workflows
* Strategy builder
* Tables
* Forms

Performance takes priority.

---

## Backend

FastAPI

Python 3.13

Use:

* SQLAlchemy
* Alembic
* Pydantic
* Redis
* Celery

---

## Database

PostgreSQL

Requirements:

* UUID keys
* Audit fields
* Migrations
* Soft delete support

---

## Real Time

WebSockets

Used for:

* Live orders
* Positions
* PnL
* Notifications

---

## AI Features

Phase 1:

* AI strategy generator

Phase 2:

* AI trade coach

Phase 3:

* AI trade journal

Phase 4:

* AI strategy marketplace

---

## Trading Features

Phase 1

* Authentication
* Broker connection
* Strategy creation
* Backtesting
* Paper trading

Phase 2

* Live execution
* Analytics

Phase 3

* AI capabilities

---

## Risk Management

Mandatory:

* Kill switch
* Daily loss limits
* Position limits
* Quantity validation
* Order confirmation workflows

Never bypass safety mechanisms.

---

## Security

Implement:

* JWT
* Secure cookies
* RBAC
* Rate limiting
* Audit logging

---

## Development Standards

Prefer:

* Readability
* Simplicity
* Type safety

Avoid:

* any types
* duplicated code
* inline styles
* hardcoded values

---

## Output Expectations

Whenever implementing a feature:

1. Create architecture plan
2. Create task breakdown
3. Assign subagents
4. Execute independently
5. Validate
6. Merge

Always prefer parallel execution using subagents whenever possible.
