# Codebase Structure

**Analysis Date:** 2026-03-20

## Directory Layout

```
little-writing/
├── src/
│   ├── assets/characters/ # Character template JSON files
│   │   ├── lowercase/ # a-z letter templates
│   │   ├── numbers/ # 0-9 templates
│   │   └── uppercase/ # A-Z letter templates
│   ├── components/ # React UI components
│   │   ├── canvas/ # Canvas-related components (deprecated, moved to tracing/)
│   │   ├── feedback/ # Feedback display components
│   │   ├── layout/ # App structure components (AppLayout, ErrorBoundary)
│   │   ├── navigation/ # Navigation helpers (CategorySelector, CharacterGrid, NavButtons)
│   │   ├── screens/ # Main app screens (CategorySelection, CharacterSelection, TracingScreen)
│   │   ├── tracing/ # Canvas and tracing components
│   │   └── ui/ # Reusable UI components (Button, Card)
│   ├── hooks/ # Custom React hooks
│   ├── lib/ # Business logic modules
│   │   ├── canvas/ # Canvas rendering and validation
│   │   ├── feedback/ # Visual/audio feedback utilities
│   │   └── templates/ # Character template generation and loading
│   ├── state/ # Global state management
│   ├── styles/ # Theme and global styles
│   ├── types/ # TypeScript type definitions
│   ├── App.tsx # Root component
│   └── main.tsx # Entry point
├── public/ # Static assets
├── specs/ # Feature specifications
├── tests/ # Test files (currently empty)
├── .planning/codebase/ # This documentation
├── package.json # Dependencies and scripts
├── tsconfig.json # TypeScript configuration
├── vite.config.ts # Vite bundler config
└── capacitor.config.ts # iOS app wrapper config
```

## Directory Purposes

**src/assets/characters/:**
- Purpose: SVG path data for each character with stroke order
- Contains: JSON files with path data and guide points
- Key files: `src/assets/characters/uppercase/A.json`, etc.

**src/components/:**
- Purpose: React UI components organized by function
- Contains: Screen components, canvas visualization, UI elements
- Key files: `AppLayout.tsx`, `TracingScreen.tsx`, `Canvas.tsx`, `Button.tsx`

**src/hooks/:**
- Purpose: Reusable stateful logic for canvas and tracing
- Contains: useCanvas, useTracing, useValidation
- Key files: `useCanvas.ts`, `useTracing.ts`, `useValidation.ts`

**src/lib/:**
- Purpose: Business logic separated from React
- Contains: Stroke validation, canvas rendering, template loading
- Key files: `strokeValidator.ts`, `pathRenderer.ts`, `touchHandler.ts`

**src/state/:**
- Purpose: Zustand global state store
- Contains: Navigation, character selection, drawing session
- Key files: `sessionStore.ts`

**src/styles/:**
- Purpose: Theme configuration and global CSS
- Contains: Colors, UI dimensions, validation thresholds
- Key files: `theme.ts`, `globals.css`, `animations.ts`

**src/types/:**
- Purpose: Shared TypeScript interfaces
- Contains: Point, StrokePath, CharacterTemplate, DrawingSession, etc.
- Key files: `index.ts`

## Key File Locations

**Entry Points:**
- `src/main.tsx`: React 18 root creation with StrictMode
- `src/App.tsx`: Root component with touch handling
- `index.html`: HTML entry point with #root div

**Configuration:**
- `tsconfig.json`: TypeScript strict mode, path aliases (@/*)
- `vite.config.ts`: Dev server, build output, CSS modules, @ alias
- `capacitor.config.ts`: iOS app wrapper configuration
- `.oxlintrc.json`: Oxlint rules
- `.oxfmtrc.json`: Oxfmt formatter settings

**Core Logic:**
- `src/lib/canvas/strokeValidator.ts`: Point-to-segment validation algorithm
- `src/state/sessionStore.ts`: Zustand store with navigation and session state
- `src/lib/templates/characterData.ts`: Character data exports

**Testing:**
- `tests/`: Test files (currently no tests written)
- `vitest.config.ts` not present (uses Vitest defaults)

## Naming Conventions

**Files:**
- Components: `PascalCase.tsx` (e.g., `TracingScreen.tsx`)
- Hooks: `usePrefix.ts` (e.g., `useCanvas.ts`)
- Utilities: `camelCase.ts` (e.g., `strokeValidator.ts`)
- CSS Modules: `camelCase.module.css` (e.g., `Button.module.css`)
- Types: `index.ts` barrel exports

**Directories:**
- `camelCase/` for most directories
- `PascalCase/` for component subdirectories (optional, not consistently used)

## Where to Add New Code

**New Feature:**
- Primary code: `src/components/screens/` or `src/components/tracing/`
- Tests: `tests/` (co-located with feature or in tests/ directory)

**New Component/Module:**
- Implementation: `src/components/` by category (ui/, layout/, screens/, tracing/)

**Utilities:**
- Shared helpers: `src/lib/canvas/` for canvas-related, `src/lib/feedback/` for feedback

## Special Directories

**specs/:**
- Purpose: Feature specifications and requirements
- Generated: No
- Committed: Yes
- Contains: Spec documents, plan, tasks, contracts

**public/:**
- Purpose: Static assets served by Vite
- Generated: No
- Committed: Yes

**.planning/:**
- Purpose: Planning documentation (codebase map, etc.)
- Generated: Yes (by codemap skill)
- Committed: Optional (typically gitignored)

---

*Structure analysis: 2026-03-20*
