# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A cat cattery website (`cat-site/`) that displays owned and planned cats. Built as a multi-agent collaboration demo where AI agents (Kimi K2.5, Codex) implement features and Sonnet reviews PRs. See `DEVELOPMENT_PLAN.md` for the phased roadmap and `docs/cat-website-design.md` for the full design doc.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite (in `cat-site/`)
- **Data**: Static JSON (`cat-site/public/cat-data.json`) fetched at runtime — no backend
- **CI**: GitHub Actions (`.github/workflows/ci.yml`, `.github/workflows/multi-agent-review.yml`)
- **Linting**: ESLint 9 flat config with react-hooks and react-refresh plugins

## Commands

All commands run from `cat-site/`:

```bash
npm run dev        # Start Vite dev server
npm run build      # TypeScript check + Vite production build
npm run preview    # Preview production build locally
```

No test framework is configured yet.

## Key Directories

```
cat-site/src/
  components/    # React components (CatCard, CatSection, CatProfilePage)
  data/types.ts  # TypeScript interfaces: Cat, Photo, CatStatus
  utils/         # Helpers (ageCalculator.ts)
  App.tsx        # Root component — state-based routing, data fetching
  main.tsx       # Entry point with ErrorBoundary
  App.css        # All styles (CSS variables in :root, responsive grid)
cat-site/public/
  cat-data.json  # Cat data — edit this to add/update cats
docs/            # Design documents
.github/         # CI workflows + CODEOWNERS + PR template
```

## Data Flow

`App.tsx` fetches `/cat-data.json` on mount, filters cats by `status` ("owned" | "planned"), and renders them in two `CatSection` groups. Clicking a `CatCard` sets `selectedCatId` state, switching to `CatProfilePage` view. No router library — navigation is state-driven via `useState`.

## PR Workflow

All PRs require 1 AI agent approval + 1 human approval before merge. See `CONTRIBUTING.md` for agent tagging conventions (`@agent-kimi`, `@agent-codex`, `@agent-sonnet`).

## Additional Documentation

- `.claude/docs/architectural_patterns.md` — Component patterns, styling conventions, accessibility approach, and data model decisions
- `docs/cat-website-design.md` — Full v1 design doc with data model, component hierarchy, and architecture rationale
- `DEVELOPMENT_PLAN.md` — Phased feature roadmap (hero carousel, gallery, contact page, etc.)
- `CHANGELOG.md` — Version history and what shipped in each PR
