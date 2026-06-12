# VeerTrade Agent Rules

## Design Philosophy

Dark mode first.

Inspired by:

* Linear
* Vercel
* Stripe
* Ramp
* Raycast

Avoid:

* Generic templates
* Bootstrap appearance
* Indian brokerage aesthetics

---

## UI Rules

Use:

* Tailwind CSS v4
* shadcn/ui
* Framer Motion

Prefer:

* Glass cards
* Clean spacing
* Large typography
* Smooth transitions

---

## Color System

Primary:

* Zinc
* Slate

Accent:

* Emerald

Use color sparingly.

---

## Accessibility

All pages must:

* Support keyboard navigation
* Support screen readers
* Meet WCAG standards

---

## Code Quality

TypeScript:

Strict mode enabled.

Never use:

* any
* ts-ignore

---

## Python

Use:

* type hints
* pydantic validation
* dependency injection

---

## Database

All tables require:

* id
* created_at
* updated_at

Use UUIDs.

---

## Trading Rules

All order placement code must include:

* validation
* safety checks
* logging

No direct order execution without validation.

---

## Performance

Targets:

* Lighthouse 90+
* Fast initial load
* Lazy loaded modules

---

## Testing

Every feature must include:

* Unit tests
* Integration tests

---

## Documentation

Every major module requires:

* README
* architecture notes
* usage examples

---

## Git

Refer: GIT_WORKFLOW.md
