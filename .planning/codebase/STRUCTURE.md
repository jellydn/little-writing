# Structure

Kids Handwriting Tracing App - Directory Layout and Conventions

## Directory Layout

```
little-writing/
├── .planning/              # Project planning documents
│   └── codebase/          # Architecture and structure docs
│       ├── ARCHITECTURE.md
│       ├── STRUCTURE.md
│       ├── STACK.md
│       ├── CONVENTIONS.md
│       ├── CONCERNS.md
│       ├── INTEGRATIONS.md
│       └── TESTING.md
│
├── .specify/              # Specification and requirements
│   └── memory/
│       └── constitution.md
│
├── src/                   # Main application source
│   ├── App.tsx           # App component entry
│   ├── main.tsx          # React createRoot entry
│   │
│   ├── components/       # React UI components
│   │   ├── canvas/       # Canvas drawing components
│   │   │   ├── Canvas.tsx
│   │   │   └── CharacterGuide.tsx
│   │   │
│   │   ├── feedback/     # Visual feedback components
│   │   │   └── StrokeFeedback.tsx
│   │   │
│   │   ├── layout/       # App shell components
│   │   │   ├── AppLayout.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   │
│   │   ├── navigation/   # Navigation controls
│   │   │   ├── NavButtons.tsx
│   │   │   ├── CharacterGrid.tsx
│   │   │   └── CategorySelector.tsx
│   │   │
│   │   ├── screens/      # Page-level components
│   │   │   ├── CategorySelectionScreen.tsx
│   │   │   ├── CharacterSelectionScreen.tsx
│   │   │   └── TracingScreen.tsx
│   │   │
│   │   ├── tracing/      # Tracing-specific components
│   │   │   ├── Canvas.tsx
│   │   │   ├── CharacterGuide.tsx
│   │   │   ├── StrokeFeedback.tsx
│   │   │   └── SuccessAnimation.tsx
│   │   │
│   │   └── ui/           # Reusable UI primitives
│   │       ├── Button.tsx
│   │       └── Card.tsx
│   │
│   ├── hooks/           # Custom React hooks
│   │   ├── useCanvas.ts      # Canvas lifecycle management
│   │   ├── useTracing.ts     # Tracing session logic
│   │   └── useValidation.ts # Stroke validation
│   │
│   ├── lib/              # Business logic (framework-agnostic)
│   │   ├── canvas/       # Canvas utilities
│   │   │   ├── strokeValidator.ts  # Point-to-segment distance
│   │   │   ├── pathRenderer.ts     # SVG path parsing & rendering
│   │   │   └── touchHandler.ts     # Pointer event handling
│   │   │
│   │   ├── feedback/     # Feedback systems
│   │   │   ├── soundPlayer.ts      # Web Audio API sounds
│   │   │   └── visualFeedback.ts
│   │   │
│   │   └── templates/    # Character template management
│   │       ├── characterData.ts    # Template loading & navigation
│   │       ├── generateCharacterTemplates.ts
│   │       └── templateLoader.ts
│   │
│   ├── state/            # State management
│   │   └── sessionStore.ts  # Zustand store
│   │
│   ├── styles/          # Styling
│   │   ├── theme.ts     # Colors, config constants
│   │   ├── animations.ts # CSS keyframes & utilities
│   │   └── globals.css  # Global styles
│   │
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts     # All shared types
│   │
│   └── assets/          # Static assets (bundled)
│
├── public/              # Static public assets
│   └── assets/
│       └── characters/  # Character JSON templates
│           ├── numbers/
│           │   ├── 0.json
│           │   ├── 1.json
│           │   └── ...
│           ├── uppercase/
│           │   ├── A.json
│           │   └── ...
│           └── lowercase/
│               ├── a.json
│               └── ...
│
├── tests/               # Test suites
│   ├── unit/           # Unit tests (Vitest)
│   ├── component/      # Component tests
│   ├── integration/    # Integration tests
│   └── e2e/            # End-to-end tests (Playwright)
│
├── ios/                 # Capacitor iOS project
├── android/             # Capacitor Android project (if added)
│
├── specs/               # Feature specs and contracts
│
├── capacitor.config.ts # Capacitor configuration
├── vite.config.ts      # Vite build config
├── vitest.config.ts    # Vitest test config
├── tsconfig.json       # TypeScript config
├── package.json
├── justfile            # Task recipes
└── playwright.config.ts
```

## Key Locations

| Purpose             | Path                                  |
| ------------------- | ------------------------------------- |
| App entry           | `src/main.tsx`                        |
| Root component      | `src/App.tsx`                         |
| State management    | `src/state/sessionStore.ts`           |
| Type definitions    | `src/types/index.ts`                  |
| Theme & constants   | `src/styles/theme.ts`                 |
| Canvas logic        | `src/components/tracing/Canvas.tsx`   |
| Stroke validation   | `src/lib/canvas/strokeValidator.ts`   |
| Character templates | `public/assets/characters/`           |
| Screen routing      | `src/components/layout/AppLayout.tsx` |
| Tests               | `tests/`                              |

## Naming Conventions

### Components

| Element         | Convention             | Example                 |
| --------------- | ---------------------- | ----------------------- |
| Component files | `PascalCase.tsx`       | `Canvas.tsx`            |
| Component names | PascalCase export      | `export const Canvas`   |
| Props interface | `ComponentNameProps`   | `interface CanvasProps` |
| CSS Modules     | `camelCase.module.css` | `Button.module.css`     |

### Hooks

| Element          | Convention        | Example                      |
| ---------------- | ----------------- | ---------------------------- |
| Hook files       | `usePrefix.ts`    | `useTracing.ts`              |
| Hook names       | `useVerb` pattern | `useCanvas`, `useValidation` |
| Return interface | `HookNameReturn`  | `interface UseTracingReturn` |

### Utils & Lib

| Element               | Convention     | Example                           |
| --------------------- | -------------- | --------------------------------- |
| Utils files           | `camelCase.ts` | `strokeValidator.ts`              |
| Function names        | verbNoun       | `validateStroke`, `renderSVGPath` |
| Pure function modules | nounVerb       | `characterData.ts`                |

### Constants

| Element          | Convention        | Example                               |
| ---------------- | ----------------- | ------------------------------------- |
| Config objects   | `SCREAMING_SNAKE` | `UI_CONFIG`, `COLORS`                 |
| Enum-like values | `as const`        | `COLORS.correct = '#4CAF50' as const` |

### Interfaces & Types

| Element      | Convention | Example                                     |
| ------------ | ---------- | ------------------------------------------- |
| Interfaces   | PascalCase | `CharacterTemplate`, `DrawingSession`       |
| Type aliases | PascalCase | `Category`, `Screen`                        |
| Union types  | PascalCase | `type Screen = 'category-selection' \| ...` |

## File Organization Rules

### One Component Per File

Each component lives in its own file matching the component name:

```
components/
  canvas/
    Canvas.tsx       # Canvas component
    Canvas.css        # Canvas styles (if any)
    index.ts          # Barrel export
```

### Barrel Exports

Use `index.ts` files for clean imports:

```typescript
// Instead of:
import { Canvas } from '../../components/canvas/Canvas';
import { CharacterGuide } from '../../components/canvas/CharacterGuide';

// Do:
import { Canvas, CharacterGuide } from '../../components/canvas';
```

### Import Alias

Use `@/` alias for `src/`:

```typescript
import { Button } from '@/components/ui/Button';
import type { Point } from '@/types';
```

## Component Categories

### Screens

Full-page components that represent app states:

- `CategorySelectionScreen` - Landing page
- `CharacterSelectionScreen` - Grid of characters
- `TracingScreen` - Main drawing interface

### Layout

App shell components:

- `AppLayout` - Screen router
- `ErrorBoundary` - Error catching wrapper

### UI Primitives

Reusable design system components:

- `Button` - Three variants (primary, secondary, action)
- `Card` - Clickable container with states

### Feature Components

Domain-specific components:

- `Canvas` - Drawing surface
- `CharacterGuide` - Template overlay
- `StrokeFeedback` - Validation feedback
- `SuccessAnimation` - Completion celebration
- `NavButtons` - Tracing navigation

## State Architecture

### Store Location

Single Zustand store at `src/state/sessionStore.ts`

### Store Slices (Conceptual)

```typescript
// Navigation slice
{
  (currentScreen, currentCategory, currentCharacter);
}

// Session slice
{
  session: DrawingSession;
}

// Computed (derived, not stored)
// - isComplete (from session.isComplete)
// - currentStrokeIndex (from session.currentStrokeIndex)
```

### Actions vs Queries

- All state mutations via store actions
- Components use selectors for reads:
  ```typescript
  const currentScreen = useAppStore((state) => state.currentScreen);
  ```

## CSS Organization

### Module CSS

Component-scoped styles with `.module.css`:

```typescript
import styles from './Button.module.css';
// Usage: <button className={styles.primary}>
```

### Global CSS

Reset and base styles in `src/styles/globals.css`

### Inline Styles

For dynamic values and computed styles in components

### CSS Constants

Theme values from `src/styles/theme.ts`:

```typescript
import { COLORS, UI_CONFIG, VALIDATION_CONFIG } from '@/styles/theme';
```

## Test Organization

```
tests/
├── unit/
│   ├── strokeValidator.test.ts
│   ├── pathRenderer.test.ts
│   └── ...
├── component/
│   ├── Button.test.tsx
│   ├── Canvas.test.tsx
│   └── ...
├── integration/
│   └── tracing-session.test.tsx
└── e2e/
    └── tracing.spec.ts
```

## Asset Structure

### Character Templates

JSON files in `public/assets/characters/`:

```json
{
  "character": "A",
  "category": "uppercase",
  "displayName": "Letter A",
  "bounds": { "width": 100, "height": 100, "viewBox": "0 0 100 100" },
  "strokes": [
    {
      "id": 1,
      "path": "M 10 90 L 50 10 L 90 90",
      "startPoint": { "x": 10, "y": 90 },
      "endPoint": { "x": 90, "y": 90 },
      "guidePoints": [...]
    }
  ],
  "totalStrokes": 3
}
```

### Audio Assets

Generated synthetically via Web Audio API (no external files)

## Key Dependencies

| Package     | Purpose          | Location           |
| ----------- | ---------------- | ------------------ |
| react       | UI framework     | All components     |
| react-konva | Canvas rendering | Canvas.tsx         |
| zustand     | State management | sessionStore.ts    |
| typescript  | Type safety      | All .ts/.tsx files |
| vite        | Build tool       | Root config        |
| vitest      | Unit testing     | tests/             |
| playwright  | E2E testing      | tests/e2e/         |
