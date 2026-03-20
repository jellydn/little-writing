# AGENTS.md - Little Writing

**Project**: Kids Handwriting Tracing App  
**Stack**: TypeScript, React 18, react-konva, Capacitor, Vitest  
**Updated**: 2026-03-20

---

## Commands

```bash
# Install & dev
bun install                 # Install dependencies
bun run dev                 # Start dev server http://localhost:5173

# Build & test
bun run build               # Production build with typecheck
bun run preview             # Preview production build
bunx vitest                 # Run unit/component/integration tests (interactive)
bunx vitest --run           # Run unit tests once (CI)
bunx vitest src/path/test.ts # Run single test file
bunx vitest --watch         # Watch mode
bunx vitest --coverage      # With coverage report

# E2E tests (requires playwright install)
bunx playwright install --with-deps chromium  # Install browser
bun run test:e2e           # Run e2e tests
bun run test:e2e:ui        # Run e2e tests with UI

# Code quality
pnpm run lint               # oxlint for linting
pnpm run format             # oxfmt for formatting
pnpm run format:check       # Check formatting without writing
pnpm run typecheck          # tsc --noEmit

# Quality gate (before commit)
bunx vitest --run && pnpm run lint && pnpm run typecheck

# Justfile recipes
just dev                    # Start dev server
just test                   # Run unit tests
just test-e2e              # Run e2e tests
just quality                # Run all quality checks

# Capacitor iOS
npx cap sync                # Sync web build to iOS
npx cap open ios            # Open in Xcode
```

---

## Code Style

### TypeScript

- Strict mode enabled, no `any` (use `unknown` + narrow)
- Always explicit return types and parameter types
- Interfaces for object shapes, types for unions
- Use `as const` for immutable constants

### React

- Functional components only, named exports
- Define props interface above component
- One component per file, filename = component name
- Use `React.FC<Props>` type for components

## Naming

| Element     | Convention       | Example              |
| ----------- | ---------------- | -------------------- |
| Components  | PascalCase.tsx   | `Canvas.tsx`         |
| Hooks       | usePrefix.ts     | `useTracing.ts`      |
| Utils       | camelCase.ts     | `strokeValidator.ts` |
| Constants   | SCREAMING_SNAKE  | `VALIDATION_CONFIG`  |
| Interfaces  | PascalCase       | `CharacterTemplate`  |
| CSS Modules | camelCase.module | `Button.module.css`  |

## Imports

```typescript
import React, { useState } from "react";
import { validateStroke } from "@/lib/canvas/strokeValidator";
import { Button } from "../ui/Button";
import styles from "./MyComponent.module.css";
```

- Use `@/` alias for `src/`; no default exports; group imports by category

## Error Handling

- Guard clauses for invalid states
- Explicit error states in async interfaces
- Never leave `console.log`, only `console.warn/error`
- Use ErrorBoundary for component errors

### Formatting (oxfmt)

- Semicolons: required
- Single quotes
- Tab width: 2 spaces
- Trailing comma: es5
- Arrow parens: always
- Print width: 80
- End of line: lf

---

## Project Structure

```
src/
├── components/    # React UI (ui/, layout/, screens/, canvas/)
├── lib/           # Business logic (canvas/, templates/, feedback/)
├── hooks/         # Custom React hooks
├── state/         # Zustand store
├── styles/        # theme.ts, animations.ts
├── types/         # Type definitions
└── assets/        # Static assets
tests/             # Unit, component, integration tests
specs/             # Feature specs and contracts
public/            # Static public assets
```

---

## Constitution (Non-Negotiable)

1. **Child-Centric**: Touch targets ≥44px, bright colors, minimal UI
2. **Guided Learning**: Visual paths, real-time validation
3. **Touch-First**: 60fps, finger + stylus support
4. **Immediate Feedback**: Green/red validation, sounds/animations
5. **Simplicity**: No auth, ads, gamification, or AI (MVP scope)

---

## Quality Gates

- [ ] Tests pass (`bunx vitest --run`)
- [ ] Lint clean (`pnpm run lint`)
- [ ] Typecheck clean (`pnpm run typecheck`)
- [ ] Touch targets ≥44px
- [ ] Canvas maintains 60fps

---

## Key Files

| Purpose      | File                                |
| ------------ | ----------------------------------- |
| App          | `src/App.tsx`                       |
| State        | `src/state/sessionStore.ts`         |
| Validation   | `src/lib/canvas/strokeValidator.ts` |
| Theme        | `src/styles/theme.ts`               |
| Types        | `src/types/index.ts`                |
| Constitution | `.specify/memory/constitution.md`   |
| Justfile     | `justfile`                          |
