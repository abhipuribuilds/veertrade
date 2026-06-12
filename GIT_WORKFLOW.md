# Git Workflow Rules

## Branch Strategy

The main branch must always remain stable and deployable.

Never develop directly on main.

Always create a feature branch before making changes.

Examples:

* feature/authentication
* feature/kite-integration
* feature/strategy-builder
* feature/backtesting
* feature/paper-trading
* feature/landing-page

## Agent Workflow

Before starting work:

1. Read all project documentation.
2. Determine the feature being implemented.
3. Create or switch to the appropriate feature branch.
4. Make only changes related to that feature.
5. Commit changes with clear commit messages.
6. Push the feature branch.
7. Open a Pull Request into main.

Never merge directly into main.

## Scope Control

Agents must not modify unrelated modules.

Example:

If implementing authentication:

Allowed:

* auth APIs
* auth UI
* auth database tables
* auth tests

Not allowed:

* strategy engine
* broker integration
* landing page redesign

## Pull Requests

Every feature should:

* Build successfully
* Pass tests
* Pass linting
* Update documentation if needed

## Worktree Usage

When multiple agents are working simultaneously:

Use git worktrees.

Each worktree must correspond to a dedicated feature branch.

Avoid multiple agents modifying the same files.
