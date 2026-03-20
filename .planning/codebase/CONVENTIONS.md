# Coding Conventions

**Analysis Date:** 2026-03-20

## Naming Patterns

**Files:**
- Components: `PascalCase.tsx` (e.g., `TracingScreen.tsx`, `Button.tsx`)
- Hooks: `usePrefix.ts` (e.g., `useCanvas.ts`, `useTracing.ts`)
- Utilities/Modules: `camelCase.ts` (e.g., `strokeValidator.ts`, `pathRenderer.ts`)
- Constants: `SCREAMING_SNAKE_CASE` or `camelCase` (e.g., `COLORS`, `UI_CONFIG`)
- CSS Modules: `ComponentName.module.css` (e.g., `Button.module.css`)

**Functions:**
- camelCase for regular functions (e.g., `validateStroke`, `pointToSegmentDistance`)
- camelCase for React components (functional components only)

**Variables:**
- camelCase (e.g., `currentStroke`, `isComplete`, `accuracy`)

**Types:**
- PascalCase for interfaces and types (e.g., `StrokePath`, `DrawingSession`, `Category`)
- Union types: `PascalCase` with literal values (e.g., `'number' | 'uppercase' | 'lowercase'`)

## Code Style

**Formatting:**
- Tool: oxfmt (Prettier-compatible)
- Key settings:
  - Semicolons: required
  - Single quotes
  - Tab width: 2 spaces
  - Trailing comma: es5
  - Print width: 80

**Linting:**
- Tool: oxlint
- Key rules: TypeScript strict mode enabled, no `any` type (use `unknown`)
- Config: `.oxlintrc.json`

## Import Organization

**Order:**
1. React and external libraries
2. `@/` absolute imports (lib, hooks, state, types)
3. Relative imports (siblings, parent directories)
4. Assets (last)

```typescript
// Example from src/components/tracing/CharacterGuide.tsx
import React from 'react';
import { Line, Circle, Group } from 'react-konva';
import type { CharacterTemplate, Point } from '@/types';
import { COLORS, UI_CONFIG } from '@/styles/theme';
```

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in vite.config.ts and tsconfig.json)

## Error Handling

**Patterns:**
- Guard clauses for early returns
- ErrorBoundary for React component errors
- Console.error/warn for development debugging
- Explicit error types in async interfaces (not heavily used yet)

```typescript
// Guard clause example
if (userPoints.length === 0) {
  return { isCorrect: false, accuracy: 0, feedbackColor: COLORS.incorrect };
}
```

## Logging

**Framework:** console (development only)

**Patterns:**
- `console.error` for caught errors (ErrorBoundary)
- `console.warn` for non-critical issues (soundPlayer, templateLoader)
- No console.log in production code (except comments in examples)
- No structured logging framework

## Comments

**When to Comment:**
- JSDoc/TSDoc above all exported functions and interfaces
- Complex algorithm explanations (stroke validation math)
- References to spec documents (e.g., `// Based on specs/001-handwriting-tracing/...`)
- TODO comments for placeholder code

**JSDoc/TSDoc:**
- Used consistently on exported functions and interfaces
- Includes parameter descriptions with @param
- Includes return type descriptions with @returns

```typescript
/**
 * Validates a user-drawn stroke against a guide path
 *
 * @param userPoints - Array of points from user's drawn stroke
 * @param guidePath - The guide stroke path to validate against
 * @returns Validation result with accuracy and feedback
 */
export function validateStroke(
  userPoints: Point[],
  guidePath: StrokePath
): ValidationResult
```

## Function Design

**Size:** Prefer small, focused functions (<50 lines typically)

**Parameters:** Destructured objects for multiple params

**Return Values:** Explicit return types on all functions (TypeScript strict mode)

## Module Design

**Exports:**
- Named exports preferred (no default exports except for React components)
- Barrel files (`index.ts`) for grouping related exports
- One component per file (filename = component name)

**Barrel Files:**
- `src/types/index.ts` - All type exports
- `src/components/screens/index.ts` - Screen component exports
- `src/components/tracing/index.ts` - Tracing component exports

---

*Convention analysis: 2026-03-20*
