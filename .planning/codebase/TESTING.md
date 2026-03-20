# Testing Patterns

**Analysis Date:** 2026-03-21

## Test Framework

**Runner:**

- Vitest 1.1.0 (unit, component, integration tests)
- Config: `vitest.config.ts`
- Playwright 1.40.1 (E2E tests)
- Config: `playwright.config.ts`

**Assertion Library:**

- Vitest built-in `expect`
- `@testing-library/jest-dom` for DOM assertions
- `@testing-library/react` for component testing
- `@testing-library/user-event` for user interaction simulation

**Run Commands:**

```bash
bunx vitest                 # Run all tests (interactive)
bunx vitest --run           # Run all tests once (CI)
bunx vitest --watch         # Watch mode
bunx vitest --coverage      # Coverage report

bun run test:e2e            # Run E2E tests
bun run test:e2e:ui         # Run E2E tests with UI

# Quality gate
bunx vitest --run && pnpm run lint && pnpm run typecheck
```

## Test File Organization

**Location:**

- Separate `tests/` directory at project root
- Not co-located with source files

**Naming:**

- Unit tests: `tests/unit/{module}.test.ts`
- Component tests: `tests/component/{Component}.test.tsx`
- Integration tests: `tests/integration/{flow}.test.tsx`
- E2E tests: `tests/e2e/{screen}.spec.ts`

**Structure:**

```
tests/
├── setup.ts              # Global test setup
├── unit/
│   ├── strokeValidator.test.ts
│   ├── pathRenderer.test.ts
│   └── touchHandler.test.ts
├── component/
│   ├── CharacterGrid.test.tsx
│   └── CategorySelector.test.tsx
├── integration/
│   ├── tracing-flow.test.tsx
│   ├── navigation-flow.test.tsx
│   └── clear-reset-flow.test.tsx
└── e2e/
    ├── character-selection.spec.ts
    ├── category-selection.spec.ts
    └── tracing-screen.spec.ts
```

## Test Structure

**Suite Organization:**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Group related tests with describe blocks
describe('ModuleName', () => {
  // Setup before each test
  beforeEach(() => {
    // Reset mocks, clear state
    mockFn.mockClear();
  });

  // Nested describe for related functionality
  describe('specific behavior', () => {
    it('should do something specific', () => {
      // Arrange - set up test data
      const input = createTestData();

      // Act - perform the action
      const result = myFunction(input);

      // Assert - verify the result
      expect(result).toBe(expected);
    });
  });
});
```

**Patterns:**

- Setup: `beforeEach` for resetting mocks/state
- Teardown: `afterEach` for cleanup (via `cleanup()` from testing-library)
- Test isolation: Each test sets up its own data

## Mocking

**Framework:** Vitest's `vi` (via `import { vi } from 'vitest'`)

**Patterns:**

```typescript
// Mock entire module
vi.mock('@/lib/feedback/soundPlayer', () => ({
  playSuccessSound: vi.fn(),
}));

// Mock hook with return value
vi.mock('@/hooks/useCanvas', () => ({
  useCanvas: vi.fn(() => ({
    canvasRef: { current: document.createElement('canvas') },
    ctx: mockContext,
    clear: vi.fn(),
  })),
}));

// Create mock function
const mockFn = vi.fn();
mockFn.mockClear();
mockFn.mockResolvedValue(value);
mockFn.mockRejectedValue(error);
```

**What to Mock:**

- External services (sound player, analytics)
- Canvas context (DOM-dependent operations)
- Network requests (if any)
- Time-dependent functionality (use `vi.useFakeTimers()`)

**What NOT to Mock:**

- Internal utility functions (test them directly)
- Simple pure functions
- Type definitions

## Fixtures and Factories

**Test Data:**

```typescript
// Helper function to create test data
const createGuidePath = (points: Point[]): StrokePath => ({
  id: 1,
  path: 'M 0 0 L 100 0',
  startPoint: points[0],
  endPoint: points[points.length - 1],
  guidePoints: points,
});

// Inline fixtures for simple tests
const mockCharacter: CharacterTemplate = {
  character: 'A',
  category: 'uppercase' as Category,
  displayName: 'Letter A',
  bounds: { width: 100, height: 100, viewBox: '0 0 100 100' },
  strokes: [],
  totalStrokes: 3,
};
```

**Location:**

- Defined inline in test files
- Helper functions at top of test file
- Complex fixtures can be in `tests/fixtures/` (not currently used)

## Coverage

**Requirements:** None enforced (no coverage threshold)

**View Coverage:**

```bash
bunx vitest --coverage
```

**Coverage Output:**

- Text report in terminal
- JSON and HTML reports generated
- Provider: v8
- Excludes: `node_modules/`, `tests/`, `dist/`

## Test Types

**Unit Tests:**

- Scope: Individual functions and utilities
- Location: `tests/unit/`
- Example: `strokeValidator.test.ts` - tests distance calculations
- Approach: Pure function testing with edge cases

**Integration Tests:**

- Scope: Multi-component flows and store interactions
- Location: `tests/integration/`
- Example: `tracing-flow.test.tsx` - tests category→character→trace flow
- Uses `act()` for state updates
- Mocks external dependencies (canvas, audio)

**E2E Tests:**

- Framework: Playwright
- Location: `tests/e2e/`
- Browser targets: Chromium (desktop + mobile Chrome)
- Uses real browser rendering
- Server auto-started with `bun run dev`

## Common Patterns

**Async Testing:**

```typescript
import { render, screen, waitFor, act } from '@testing-library/react';

// With waitFor for async state updates
await waitFor(() => {
  expect(screen.getByText('Expected')).toBeInTheDocument();
});

// With act for synchronous state updates
act(() => {
  store.startStroke({ x: 50, y: 20 });
  store.endStroke();
});
```

**Error Testing:**

```typescript
// For sync functions
expect(() => myFunction(invalidInput)).toThrow();

// For async functions
await expect(myAsyncFunction()).rejects.toThrow();

// For testing error boundaries
```

**Store Testing (Zustand):**

```typescript
import { useAppStore } from '@/state/sessionStore';

// Reset store state
act(() => {
  useAppStore.setState({
    currentScreen: 'category-selection',
    session: null,
  });
});

// Access store directly in tests
const store = useAppStore.getState();
```

---

_Testing analysis: 2026-03-21_
