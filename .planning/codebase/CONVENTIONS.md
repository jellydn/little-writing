# Coding Conventions

**Analysis Date:** 2026-03-21

## Naming Patterns

**Files:**

- Components: `PascalCase.tsx` (e.g., `Canvas.tsx`, `Button.tsx`, `CharacterGrid.tsx`)
- Hooks: `usePascalCase.ts` (e.g., `useCanvas.ts`, `useTracing.ts`)
- Utils/Lib: `camelCase.ts` (e.g., `strokeValidator.ts`, `pathRenderer.ts`)
- Constants: `SCREAMING_SNAKE` in `theme.ts` (e.g., `VALIDATION_CONFIG`, `COLORS`)
- CSS Modules: `PascalCase.module.css` (e.g., `Button.module.css`)
- Test files: `filename.test.ts` or `filename.spec.ts` pattern

**Functions:**

- CamelCase for functions and methods (e.g., `validateStroke`, `createSession`)
- Helper functions can be private (unexported) and lowercase/camelCase
- Async functions use `async` keyword, return `Promise<T>`

**Variables:**

- CamelCase for variables (e.g., `currentScreen`, `sessionStore`)
- Use descriptive names; avoid single letters except in short loops
- Boolean variables use prefixes like `is`, `has`, `can` (e.g., `isComplete`, `hasError`)

**Types:**

- Interfaces: PascalCase (e.g., `CharacterTemplate`, `AppStore`, `Point`)
- Type aliases for unions: PascalCase (e.g., `Category`, `Screen`)
- Use `interface` for object shapes, `type` for unions/intersections

## Code Style

**Formatting:**

- Tool: oxfmt
- Semicolons: required
- Single quotes: true
- Tab width: 2 spaces
- Trailing comma: es5
- Arrow parens: always
- Print width: 80
- End of line: lf

**Linting:**

- Tool: oxlint
- Strict TypeScript mode enabled
- No `any` types; use `unknown` + narrow
- Always explicit return types and parameter types

**TypeScript:**

- Strict mode: enabled
- Target: ES2020
- Module: ESNext
- JSX: react-jsx
- Path alias: `@/*` maps to `./src/*`

## Import Organization

**Order:**

1. React and core libraries (e.g., `import React from 'react'`)
2. Third-party packages (e.g., `import { create } from 'zustand'`)
3. Internal modules with `@/` alias (e.g., `import { validateStroke } from '@/lib/canvas/strokeValidator'`)
4. Relative imports (e.g., `import styles from './Button.module.css'`)

**Path Aliases:**

- `@/*` for `src/` (e.g., `@/components/canvas/Canvas`)
- No default exports; named exports only

## Error Handling

**Patterns:**

- Guard clauses for invalid states (return early)
- Explicit error states in async interfaces (try/catch with typed errors)
- Never use `console.log`; only `console.warn` and `console.error`
- ErrorBoundary component (`src/components/layout/ErrorBoundary.tsx`) catches React errors
- Production error handling: error logging with environment checks

**Example from `sessionStore.ts`:**

```typescript
try {
  const nextChar = await getNextCharacter(
    currentCharacter.character,
    currentCategory
  );
  set({ currentCharacter: nextChar, session: createSession(nextChar) });
} catch (error) {
  console.error('Failed to navigate to next character:', error);
}
```

**Example from `soundPlayer.ts`:**

```typescript
try {
  // audio operations
} catch (error) {
  if (error instanceof Error) {
    if (error.name === 'NotAllowedError') {
      console.warn('Audio playback blocked by browser...');
    } else {
      console.warn('Failed to play success sound:', error.message);
    }
  }
}
```

## Logging

**Framework:** console (no external logging library)

**Patterns:**

- `console.warn`: Expected errors or degraded functionality
- `console.error`: Unexpected errors, caught exceptions
- Development-only logging with `process.env.NODE_ENV === 'development'` checks

## Comments

**When to Comment:**

- Complex algorithms with explanation of math/logic (see `strokeValidator.ts`)
- Reference to external specs/contracts
- Task references (e.g., `// Task: T054`)

**JSDoc/TSDoc:**

- Module-level JSDoc with description of purpose
- Function JSDoc with `@param` and `@returns` for public APIs
- Property JSDoc for exported interfaces

**Example:**

```typescript
/**
 * Stroke validation using point-to-segment distance algorithm
 *
 * Validates user-drawn strokes against guide paths by calculating
 * the minimum distance from each user point to the nearest segment
 * of the guide path.
 *
 * Reference: specs/001-handwriting-tracing/research.md section 2
 */
```

## Function Design

**Size:**

- Functions should be focused and single-purpose
- Complex functions (like `validateStroke`) are acceptable with clear structure

**Parameters:**

- Always explicit types on parameters
- Use interfaces for complex object parameters
- Limit primitive parameters; prefer options objects for 3+ parameters

**Return Values:**

- Always explicit return types
- Return `Promise<T>` for async functions
- Use `void` for procedures that don't return

## Module Design

**Exports:**

- Named exports only (no default exports per AGENTS.md)
- Public functions/classes exported from modules
- Private helpers kept internal to modules

**Barrel Files:**

- Used in `components/` subdirectories (e.g., `tracing/index.ts`, `screens/index.ts`)
- Export all public components from the directory
- Pattern: `export { Canvas } from './Canvas';`

**Structure:**

- One component/function per file
- Props interface defined above component
- Co-located CSS modules with same name

---

_Convention analysis: 2026-03-21_
