# AGENTS.md - Little Writing

**Project**: Kids Handwriting Tracing App  
**Stack**: TypeScript, React 18, react-konva, Capacitor, Vitest  
**Updated**: 2026-03-21

---

## Commands

### Install & Dev

```bash
bun install                 # Install dependencies
bun run dev                 # Start dev server http://localhost:5173
```

### Build & Test

```bash
bun run build               # Production build
bun run preview             # Preview production build

# Single test file (most common usage)
bunx vitest src/path/test.ts

# Unit tests (non-interactive)
bunx vitest --run

# Interactive test mode
bunx vitest

# Watch mode for specific file
bunx vitest --watch src/path/test.ts

# With coverage report
bunx vitest --coverage
```

### E2E Tests

```bash
bunx playwright install --with-deps chromium  # Install browser (first time)
bun run test:e2e           # Run e2e tests
bun run test:e2e:ui        # Run e2e tests with UI
```

### Code Quality

```bash
bun run lint                # oxlint for linting
bun run format              # oxfmt for formatting
bun run format:check        # Check formatting without writing
bun run typecheck           # tsc --noEmit
```

### Quality Gate (before commit)

```bash
bunx vitest --run && bun run lint && bun run typecheck
```

### Justfile Recipes

```bash
just dev                    # Start dev server
just test                   # Run unit tests
just test-unit             # Run tests once (non-interactive)
just test-watch            # Watch mode
just test-e2e              # Run e2e tests
just quality               # Run all quality checks
```

### Capacitor iOS

```bash
npx cap sync                # Sync web build to iOS
npx cap open ios             # Open in Xcode
```

---

## Code Style

### TypeScript

- Strict mode enabled, no `any` (use `unknown` + narrow)
- Always explicit return types and parameter types
- Interfaces for object shapes, types for unions
- Use `as const` for immutable constants
- Named exports only (no default exports)

### React

- Functional components only, named exports
- Define props interface above component with `export interface`
- One component per file, filename = component name
- Use `React.FC<Props>` type for components

### JSDoc Comments

- Add JSDoc comments for public functions and complex logic
- Include `@param`, `@returns` tags for functions
- Describe algorithm or reference specs where applicable

## Naming

| Element     | Convention       | Example                   |
| ----------- | ---------------- | ------------------------- |
| Components  | PascalCase.tsx   | `Canvas.tsx`              |
| Hooks       | usePrefix.ts     | `useTracing.ts`           |
| Utils       | camelCase.ts     | `strokeValidator.ts`      |
| Constants   | SCREAMING_SNAKE  | `VALIDATION_CONFIG`       |
| Interfaces  | PascalCase       | `CharacterTemplate`       |
| CSS Modules | camelCase.module | `Button.module.css`       |
| Test files  | name.test.ts     | `strokeValidator.test.ts` |

## Imports

```typescript
import React, { useState } from "react";
import { validateStroke } from "@/lib/canvas/strokeValidator";
import type { Point, StrokePath } from "@/types";
import { Button } from "../ui/Button";
import styles from "./MyComponent.module.css";
```

- Use `@/` alias for `src/`
- No default exports
- Group imports: React > external libs > internal (@/) > relative
- Type imports use `import type`

## Formatting (oxfmt)

- Semicolons: required
- Single quotes
- Tab width: 2 spaces
- Trailing comma: es5
- Arrow parens: always
- Print width: 80
- End of line: lf

## Error Handling

- Guard clauses for invalid states
- Explicit error states in async interfaces
- Never leave `console.log`; only `console.warn`/`console.error`
- Use ErrorBoundary for component errors

---

## Project Structure

```
src/
├── components/
│   ├── canvas/          # Canvas-related components
│   ├── feedback/        # Feedback components
│   ├── layout/         # Layout components
│   ├── navigation/      # Navigation components
│   ├── screens/         # Screen components
│   ├── tracing/         # Tracing components
│   └── ui/             # Reusable UI components
├── hooks/               # Custom React hooks
├── lib/
│   ├── canvas/          # Canvas utilities
│   ├── feedback/        # Feedback utilities
│   └── templates/      # Character templates
├── state/               # Zustand store
├── styles/              # theme.ts, animations.ts
├── types/               # Type definitions
└── assets/              # Static assets

tests/
├── unit/                 # Unit tests
├── e2e/                  # E2E tests (Playwright)
└── setup.ts             # Test setup
```

---

## Testing

### Unit Tests (Vitest)

```typescript
import { describe, it, expect } from "vitest";
import { myFunction } from "@/lib/myModule";

describe("myFunction", () => {
  it("should do something", () => {
    const result = myFunction(input);
    expect(result).toBe(expected);
  });
});
```

### Component Tests (React Testing Library)

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

### E2E Tests (Playwright)

```typescript
import { test, expect } from "@playwright/test";

test("user can trace a character", async ({ page }) => {
  await page.goto("/");
  // ...
});
```

---

## Constitution (Non-Negotiable)

1. **Child-Centric**: Touch targets >=44px, bright colors, minimal UI
2. **Guided Learning**: Visual paths, real-time validation
3. **Touch-First**: 60fps, finger + stylus support
4. **Immediate Feedback**: Green/red validation, sounds/animations
5. **Simplicity**: No auth, ads, gamification, or AI (MVP scope)

---

## Quality Gates

- [ ] Tests pass (`bunx vitest --run`)
- [ ] Lint clean (`bun run lint`)
- [ ] Typecheck clean (`bun run typecheck`)
- [ ] Touch targets >=44px
- [ ] Canvas maintains 60fps

---

## Key Files

| Purpose    | File                                |
| ---------- | ----------------------------------- |
| App        | `src/App.tsx`                       |
| State      | `src/state/sessionStore.ts`         |
| Validation | `src/lib/canvas/strokeValidator.ts` |
| Theme      | `src/styles/theme.ts`               |
| Types      | `src/types/index.ts`                |
| Justfile   | `justfile`                          |

---

## Vitest Configuration

- Uses `@testing-library/jest-dom` for DOM assertions
- Uses `jsdom` environment
- Test files: `*.test.ts`, `*.test.tsx`
- Coverage via `@vitest/coverage-v8`
