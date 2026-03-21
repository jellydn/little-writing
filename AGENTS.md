# AGENTS.md - Little Writing

**Project**: Kids Handwriting Tracing App  
**Stack**: TypeScript, React 18, react-konva, Capacitor, Vitest  
**Updated**: 2026-03-21

---

## Commands

### Development

```bash
bun install                 # Install dependencies
bun run dev                 # Start dev server http://localhost:5173
bun run build               # Production build
bun run preview             # Preview production build
```

### Testing

```bash
# Single test file (most common)
bunx vitest src/path/file.test.ts

# All unit/component/integration tests
bunx vitest --run

# Interactive/watch mode
bunx vitest
bunx vitest --watch src/path/file.test.ts

# Coverage
bunx vitest --coverage

# E2E tests
bunx playwright install --with-deps chromium  # First time setup
bun run test:e2e           # Run e2e tests
bun run test:e2e:ui        # Run with UI
```

### Code Quality

```bash
bun run lint               # oxlint (see .oxlintrc.json)
bun run format             # oxfmt (see .oxfmtrc.json)
bun run format:check       # Check formatting without writing
bun run typecheck          # tsc --noEmit
```

### Quality Gate (before commit)

```bash
bunx vitest --run && bun run lint && bun run typecheck
```

### Justfile Recipes

```bash
just dev                   # Start dev server
just test-unit            # Run tests once
just test-watch           # Watch mode
just test-e2e             # Run e2e tests
just quality              # All quality checks
```

### Capacitor iOS

```bash
npx cap sync               # Sync web build to iOS
npx cap open ios           # Open in Xcode
```

---

## Code Style

### TypeScript

- Strict mode enabled, no `any` (use `unknown` + narrow)
- Explicit return types and parameter types
- Interfaces for object shapes, types for unions
- Use `as const` for immutable constants
- Named exports only (no default exports)

### React

- Functional components only, named exports
- Define props interface above component: `export interface Props`
- One component per file, filename = component name
- Use `React.FC<Props>` type for components

### JSDoc Comments

- Add JSDoc for public functions and complex logic
- Include `@param`, `@returns` tags
- Describe algorithms or reference specs

### Naming

| Element     | Convention       | Example                   |
| ----------- | ---------------- | ------------------------- |
| Components  | PascalCase.tsx   | `Canvas.tsx`              |
| Hooks       | usePrefix.ts     | `useTracing.ts`           |
| Utils       | camelCase.ts     | `strokeValidator.ts`      |
| Constants   | SCREAMING_SNAKE  | `VALIDATION_CONFIG`       |
| Interfaces  | PascalCase       | `CharacterTemplate`       |
| CSS Modules | camelCase.module | `Button.module.css`       |
| Test files  | name.test.ts     | `strokeValidator.test.ts` |

### Imports

```typescript
import React, { useState } from "react";
import { validateStroke } from "@/lib/canvas/strokeValidator";
import type { Point, StrokePath } from "@/types";
import { Button } from "../ui/Button";
import styles from "./MyComponent.module.css";
```

- Use `@/` alias for `src/`
- No default exports
- Group imports: React > external > internal (@/) > relative
- Type imports use `import type`

### Formatting (oxfmt - see .oxfmtrc.json)

- Semicolons: required
- Single quotes
- Tab width: 2 spaces
- Trailing comma: es5
- Arrow parens: always
- Print width: 80
- End of line: lf

### Linting (oxlint - see .oxlintrc.json)

- Plugins: react, typescript
- React version: 18.2.0
- No explicit `any` (warn)
- No console except warn/error (warn)
- No unused vars (error, allow `_` prefix)

### Error Handling

- Guard clauses for invalid states
- Explicit error states in async interfaces
- Never leave `console.log`; only `console.warn`/`console.error`
- Use ErrorBoundary for component errors

---

## Project Structure

```
src/
├── components/
│   ├── feedback/        # Feedback components
│   ├── layout/          # Layout components
│   ├── navigation/      # Navigation components
│   ├── screens/         # Screen components
│   ├── tracing/         # Tracing components
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks
├── lib/
│   ├── canvas/          # Canvas utilities
│   ├── feedback/        # Feedback utilities
│   └── templates/       # Character templates
├── state/               # Zustand store
├── styles/              # theme.ts, animations.ts
├── types/               # Type definitions
└── assets/              # Static assets

tests/
├── component/           # Component tests
├── e2e/                 # E2E tests (Playwright)
├── integration/         # Integration tests
├── unit/                # Unit tests
└── setup.ts             # Test setup
```

---

## Testing Patterns

### Unit/Integration Tests (Vitest)

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

| Purpose       | File                                |
| ------------- | ----------------------------------- |
| App           | `src/App.tsx`                       |
| State         | `src/state/sessionStore.ts`         |
| Validation    | `src/lib/canvas/strokeValidator.ts` |
| Theme         | `src/styles/theme.ts`               |
| Types         | `src/types/index.ts`                |
| Test Config   | `vitest.config.ts`                  |
| Lint Config   | `.oxlintrc.json`                    |
| Format Config | `.oxfmtrc.json`                     |
| Justfile      | `justfile`                          |

---

## Vitest Configuration

- Environment: `jsdom`
- Globals: enabled
- Setup: `tests/setup.ts`
- Test patterns: `tests/{unit,component,integration}/**/*.test.ts`
- Excludes: `tests/e2e/**`
- Coverage: v8 provider
