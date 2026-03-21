# CONVENTIONS.md - Little Writing

## Overview

**Project**: Kids Handwriting Tracing App  
**Stack**: TypeScript, React 18, react-konva, Capacitor, Zustand  
**Last Updated**: 2026-03-21

---

## Code Style

### TypeScript

| Rule              | Setting   |
| ----------------- | --------- |
| Strict Mode       | Enabled   |
| Target            | ES2020    |
| Module            | ESNext    |
| JSX               | react-jsx |
| Module Resolution | bundler   |

- No `any` type - use `unknown` + type narrowing
- Explicit return types on all functions
- Explicit parameter types
- Interfaces for object shapes
- Types for unions
- Use `as const` for immutable constants
- Named exports only (no default exports)

### React

- Functional components only
- Define props interface above component: `export interface Props`
- One component per file, filename matches component name
- Use `React.FC<Props>` type for components
- Named exports only

Example:

```typescript
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'action';
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  onClick,
  children,
  ...props
}) => {
  // component logic
};
```

---

## Naming Conventions

| Element     | Convention           | Example                   |
| ----------- | -------------------- | ------------------------- |
| Components  | PascalCase.tsx       | `Canvas.tsx`              |
| Hooks       | usePrefix.ts         | `useTracing.ts`           |
| Utils       | camelCase.ts         | `strokeValidator.ts`      |
| Constants   | SCREAMING_SNAKE      | `VALIDATION_CONFIG`       |
| Interfaces  | PascalCase           | `CharacterTemplate`       |
| CSS Modules | camelCase.module.css | `Button.module.css`       |
| Test files  | name.test.ts         | `strokeValidator.test.ts` |

---

## Imports

### Order

1. React imports
2. External library imports
3. Internal imports (using `@/` alias)
4. Relative imports

### Type Imports

Use `import type` for type-only imports:

```typescript
import React, { useState, useCallback } from 'react';
import { validateStroke } from '@/lib/canvas/strokeValidator';
import type { Point, StrokePath } from '@/types';
import { Button } from '../ui/Button';
import styles from './MyComponent.module.css';
```

### Path Alias

- `@/` maps to `src/`
- Configured in `tsconfig.json` and `vitest.config.ts`

---

## Formatting (oxfmt)

| Setting           | Value    |
| ----------------- | -------- |
| Semicolons        | Required |
| Quotes            | Single   |
| Tab Width         | 2 spaces |
| Trailing Comma    | es5      |
| Arrow Parens      | Always   |
| Print Width       | 80       |
| End of Line       | lf       |
| Sort Package JSON | false    |

Configuration: `.oxfmtrc.json`

Run formatting:

```bash
bun run format        # Format files
bun run format:check  # Check formatting
```

---

## Linting (oxlint)

| Setting       | Value             |
| ------------- | ----------------- |
| Plugins       | react, typescript |
| React Version | 18.2.0            |

### Rules

| Rule                                 | Level | Notes                      |
| ------------------------------------ | ----- | -------------------------- |
| `@typescript-eslint/no-explicit-any` | warn  | Prefer unknown + narrowing |
| `no-console`                         | warn  | Only allow warn/error      |
| `no-unused-vars`                     | error | Allow `_` prefix           |
| `react/only-export-components`       | warn  | Allow constant exports     |
| `correctness`                        | off   | Disabled category          |

Configuration: `.oxlintrc.json`

Run linting:

```bash
bun run lint
```

---

## Error Handling

### Patterns

1. **Guard Clauses**: Early return for invalid states
2. **Explicit Error States**: Use explicit error states in async interfaces
3. **Logging**: Never leave `console.log`; use `console.warn` or `console.error`
4. **Error Boundaries**: Use ErrorBoundary for component errors

Example from `ErrorBoundary.tsx`:

```typescript
export class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error);

    if (process.env.NODE_ENV === 'production') {
      // Send to error reporting service
    }
  }
}
```

---

## JSDoc

Add JSDoc for:

- Public functions
- Complex logic
- Include `@param` and `@returns` tags

Example from `strokeValidator.ts`:

```typescript
/**
 * Validates a user-drawn stroke against a guide path
 *
 * Algorithm:
 * 1. For each point, calculate minimum distance to guide path
 * 2. Count points within tolerance distance
 * 3. Calculate accuracy as percentage
 * 4. Return validation result
 *
 * @param userPoints - Array of points from user's drawn stroke
 * @param guidePath - The guide stroke path to validate against
 * @returns Validation result with accuracy and feedback
 */
export function validateStroke(
  userPoints: Point[],
  guidePath: StrokePath
): ValidationResult {
  // implementation
}
```

---

## Project Structure

```
src/
├── components/
│   ├── feedback/        # Feedback components
│   ├── layout/          # Layout components (AppLayout, ErrorBoundary)
│   ├── navigation/      # Navigation components
│   ├── screens/         # Screen-level components
│   ├── tracing/         # Tracing-specific components
│   └── ui/              # Reusable UI components (Button, Card)
├── hooks/               # Custom React hooks
├── lib/
│   ├── canvas/          # Canvas utilities (strokeValidator, touchHandler)
│   ├── feedback/        # Feedback utilities (soundPlayer, visualFeedback)
│   └── templates/       # Template loading and generation
├── state/               # Zustand store
├── styles/              # theme.ts, animations.ts
├── types/               # Type definitions
└── assets/              # Static assets

tests/
├── unit/                # Unit tests
├── component/           # Component tests
├── integration/         # Integration tests
├── e2e/                 # E2E tests (Playwright)
└── setup.ts             # Test setup
```

---

## File Organization Patterns

### Component File

```typescript
// 1. Imports
import React from 'react';
import type { SomeType } from '@/types';

// 2. Props Interface (exported)
export interface ComponentProps {
  // props
}

// 3. JSDoc comment
/**
 * Component description
 */

// 4. Component (exported, named)
export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // implementation
};
```

### Hook File

```typescript
// 1. Imports
import { useState, useCallback } from 'react';

// 2. Return type interface (exported)
export interface UseHookReturn {
  // return values
}

// 3. JSDoc comment
/**
 * Hook description
 */

// 4. Hook function (exported, named)
export function useHook(): UseHookReturn {
  // implementation
}
```

### Utility File

```typescript
// 1. Imports
import type { SomeType } from '@/types';

// 2. Constants (if any)
const INTERNAL_CONFIG = { ... };

// 3. Helper functions (private, not exported)
function helperFn(): void { }

// 4. Public functions with JSDoc (exported, named)
/**
 * Public function description
 * @param param - Description
 * @returns Description
 */
export function publicFn(param: Type): ReturnType {
  // implementation
}
```

---

## Constitution (Non-Negotiable Principles)

1. **Child-Centric**: Touch targets >=44px, bright colors, minimal UI
2. **Guided Learning**: Visual paths, real-time validation
3. **Touch-First**: 60fps, finger + stylus support
4. **Immediate Feedback**: Green/red validation, sounds/animations
5. **Simplicity**: No auth, ads, gamification, or AI (MVP scope)

---

## Quality Gates

Before committing, ensure:

- [ ] Tests pass (`bunx vitest --run`)
- [ ] Lint clean (`bun run lint`)
- [ ] Typecheck clean (`bun run typecheck`)
- [ ] Touch targets >=44px
- [ ] Canvas maintains 60fps

---

## Key Files Reference

| Purpose       | File                                |
| ------------- | ----------------------------------- |
| App Entry     | `src/App.tsx`                       |
| State Store   | `src/state/sessionStore.ts`         |
| Validation    | `src/lib/canvas/strokeValidator.ts` |
| Theme         | `src/styles/theme.ts`               |
| Types         | `src/types/index.ts`                |
| Test Config   | `vitest.config.ts`                  |
| Lint Config   | `.oxlintrc.json`                    |
| Format Config | `.oxfmtrc.json`                     |
