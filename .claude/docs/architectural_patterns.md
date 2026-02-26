# Architectural Patterns

Patterns and conventions observed across the codebase.

## Component Structure

- **Named exports** for components (`export function CatCard`), **default export** only for `App` (`App.tsx:123`)
- **Interface-per-component**: Props interfaces defined in the same file, directly above the component (`CatCard.tsx:5-8`, `CatSection.tsx:13-18`)
- **Shared types** live in `data/types.ts` — components import `Cat`, `Photo`, `CatStatus` from there
- Components are **function components** (no class components except the `ErrorBoundary` in `main.tsx:6-35`)

## State-Based Routing

No router library. `App.tsx` uses `selectedCatId` state to toggle between list view and `CatProfilePage`. Back navigation calls `setSelectedCatId(null)`. This pattern works for the current two-view app but will need a router if more pages are added.

## Data Fetching Pattern

- Single `useEffect` in `App.tsx:21-55` fetches `/cat-data.json` with `AbortController` for cleanup and a 10-second timeout
- Data is filtered client-side by `cat.status` into `ownedCats` and `plannedCats` arrays (`App.tsx:63-64`)
- Loading/error states handled with early returns before the main render (`App.tsx:67-78`)

## CSS Conventions

- **Single CSS file** (`App.css`) for all styles — no CSS modules or styled-components
- **CSS custom properties** in `:root` for theming (`App.css:8-21`): colors (`--color-primary`, `--color-owned`, `--color-planned`), shadow, border-radius, max-width
- **BEM-like class names** without strict BEM: `.cat-card`, `.cat-image-container`, `.status-badge.owned`
- **Scoped overrides** using parent selectors to avoid collisions: `.cat-profile .cat-name` vs `.cat-name` (`App.css:268-278`)
- **Responsive**: CSS Grid with `auto-fill` + `minmax(300px, 1fr)` for card layout; single breakpoint at 600px (`App.css:402-422`)

## Accessibility Patterns

- `CatCard` renders as a `<button>` element (not div with onClick) for native keyboard/screen-reader support (`CatCard.tsx:27-31`)
- `aria-label` on interactive elements with contextual descriptions (`CatCard.tsx:30`)
- `aria-labelledby` connecting section headings to their content (`CatSection.tsx:22-24`)
- `role="list"` / `role="listitem"` on the card grid for assistive technology (`CatSection.tsx:32-34`)
- Lazy loading images with `loading="lazy"` on cards, `loading="eager"` on profile hero (`CatCard.tsx:39`, `CatProfilePage.tsx:49`)

## Data Model Decisions

- **Age is computed, not stored**: `birthDate` stored as ISO string, age calculated at render time via `calculateAge()` (`utils/ageCalculator.ts:11-52`). This avoids stale data.
- **Dual status model**: Cats are either `"owned"` or `"planned"` — the same `Cat` interface handles both, with optional fields (`birthDate` for owned, `expectedDate` for planned) (`data/types.ts:13-35`)
- **Gallery as optional array**: `Photo[]` with url + optional caption, only rendered when present (`data/types.ts:8-11`)

## Error Handling

- Class-based `ErrorBoundary` wraps the entire app in `main.tsx:6-35`
- Fetch errors in `App.tsx` distinguish between `AbortError` (timeout) and general failures (`App.tsx:42-44`)
- Image load errors in `CatCard` fall back to an emoji placeholder via `onError` handler (`CatCard.tsx:16`, `CatCard.tsx:40`)
