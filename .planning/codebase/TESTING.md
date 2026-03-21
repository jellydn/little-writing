# TESTING.md - Little Writing

## Overview

**Project**: Kids Handwriting Tracing App  
**Framework**: Vitest + React Testing Library + Playwright (E2E)  
**Last Updated**: 2026-03-21

---

## Testing Framework

### Core Stack

| Tool                        | Version | Purpose                     |
| --------------------------- | ------- | --------------------------- |
| Vitest                      | ^1.1.0  | Test runner                 |
| jsdom                       | ^23.0.1 | DOM environment             |
| @testing-library/react      | ^14.1.2 | Component testing utilities |
| @testing-library/jest-dom   | ^6.1.4  | Custom matchers             |
| @testing-library/user-event | ^14.5.1 | User interaction simulation |
| @vitest/coverage-v8         | ^1.6.0  | Code coverage               |
| Playwright                  | ^1.40.1 | E2E testing                 |

### Configuration

**File**: `vitest.config.ts`

```typescript
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: [
      'tests/unit/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'tests/component/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'tests/integration/**/*.{test,spec}.{js,ts,jsx,tsx}',
    ],
    exclude: ['tests/e2e/**'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/', 'dist/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env.NODE_ENV': '"test"',
  },
});
```

---

## Test Setup

**File**: `tests/setup.ts`

The setup file configures:

- Testing library jest-dom matchers
- Cleanup after each test
- Global mocks for browser APIs

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) as unknown as typeof IntersectionObserver;

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback: FrameRequestCallback) =>
  setTimeout(callback, 0) as unknown as number;

global.cancelAnimationFrame = (id: number) => {
  clearTimeout(id);
};

// Mock PointerEvent for canvas tests
class MockPointerEvent extends MouseEvent {
  // ... implementation
}
global.PointerEvent = MockPointerEvent as typeof PointerEvent;
```

---

## Test Structure

### Directory Layout

```
tests/
├── unit/                    # Unit tests for pure functions/utilities
│   ├── strokeValidator.test.ts
│   ├── touchHandler.test.ts
│   └── pathRenderer.test.ts
├── component/               # Component tests (rendering, props, events)
│   ├── CategorySelector.test.tsx
│   └── CharacterGrid.test.tsx
├── integration/             # Integration tests (user flows)
│   ├── tracing-flow.test.tsx
│   ├── navigation-flow.test.tsx
│   └── clear-reset-flow.test.tsx
├── e2e/                     # E2E tests (Playwright)
│   ├── category-selection.spec.ts
│   ├── character-selection.spec.ts
│   └── tracing-screen.spec.ts
└── setup.ts                 # Test setup and global mocks
```

### Test File Naming

- Unit/Component/Integration: `name.test.ts` or `name.test.tsx`
- E2E: `name.spec.ts`

---

## Unit Testing

### Pattern

Unit tests focus on pure functions and isolated logic.

**Example** from `strokeValidator.test.ts`:

```typescript
/**
 * Unit tests for strokeValidator.ts
 *
 * Tests distance calculation, accuracy scoring, and stroke validation
 */

import { describe, it, expect } from 'vitest';
import {
  pointToSegmentDistance,
  validateStroke,
} from '@/lib/canvas/strokeValidator';
import type { Point, StrokePath } from '@/types';

describe('pointToSegmentDistance', () => {
  describe('point on segment', () => {
    it('should return 0 when point is exactly on the segment', () => {
      const point: Point = { x: 5, y: 5 };
      const start: Point = { x: 0, y: 5 };
      const end: Point = { x: 10, y: 5 };

      const distance = pointToSegmentDistance(point, start, end);
      expect(distance).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should handle empty user points', () => {
      // test implementation
    });
  });
});
```

### Key Practices

1. **Describe blocks** group related tests by feature/scenario
2. **Nested describe** for sub-scenarios (edge cases, happy path, etc.)
3. **Explicit types** in test data
4. **Use `@/` imports** for source files
5. **Use `type` imports** for type-only imports

---

## Component Testing

### Pattern

Component tests verify rendering, props, and user interactions.

**Example** from `CategorySelector.test.tsx`:

```typescript
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CategorySelector } from '@/components/navigation/CategorySelector';

describe('CategorySelector', () => {
  const mockOnSelectCategory = vi.fn();

  beforeEach(() => {
    mockOnSelectCategory.mockClear();
  });

  it('should render all category cards', () => {
    render(<CategorySelector onSelectCategory={mockOnSelectCategory} />);

    expect(
      screen.getByRole('button', { name: /Select Numbers/i })
    ).toBeInTheDocument();
  });

  it('should call onSelectCategory when clicked', () => {
    render(<CategorySelector onSelectCategory={mockOnSelectCategory} />);

    const numbersCard = screen.getByRole('button', { name: /Select Numbers/i });
    fireEvent.click(numbersCard);

    expect(mockOnSelectCategory).toHaveBeenCalledTimes(1);
    expect(mockOnSelectCategory).toHaveBeenCalledWith('number');
  });

  it('should handle keyboard navigation with Enter key', () => {
    render(<CategorySelector onSelectCategory={mockOnSelectCategory} />);

    const numbersCard = screen.getByRole('button', { name: /Select Numbers/i });
    fireEvent.keyDown(numbersCard, { key: 'Enter' });

    expect(mockOnSelectCategory).toHaveBeenCalledWith('number');
  });
});
```

### Key Practices

1. **Mock functions** with `vi.fn()` for callbacks
2. **Clear mocks** in `beforeEach`
3. **Use `screen` queries** for element selection
4. **Test accessibility** (roles, labels)
5. **Test user interactions** (click, keyboard)

---

## Integration Testing

### Pattern

Integration tests verify user flows across multiple components.

**Example** from `tracing-flow.test.tsx`:

```typescript
/**
 * Integration Tests: Tracing Flow
 *
 * Tests the complete user flow from selecting a category to tracing a character
 */

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAppStore } from '@/state/sessionStore';

// Mock dependencies
vi.mock('@/lib/feedback/soundPlayer', () => ({
  playSuccessSound: vi.fn(),
}));

vi.mock('@/hooks/useCanvas', () => ({
  useCanvas: vi.fn(() => ({ /* mock implementation */ })),
}));

describe('Tracing Flow Integration', () => {
  beforeEach(() => {
    act(() => {
      useAppStore.setState({
        currentScreen: 'category-selection',
        currentCategory: 'uppercase',
        currentCharacter: null,
        session: null,
      });
    });
  });

  it('should complete full flow: category -> character -> trace -> success', async () => {
    render(<AppLayout />);

    // Step 1: Select Numbers category
    const numbersButton = screen.getByText('Numbers');
    fireEvent.click(numbersButton);

    await waitFor(() => {
      expect(screen.getByText(/Select Number/i)).toBeInTheDocument();
    });

    // Step 2: Select character
    const characterButton = screen.getByText('0');
    fireEvent.click(characterButton);

    // Step 3: Complete stroke
    act(() => {
      const store = useAppStore.getState();
      store.startStroke({ x: 50, y: 10 });
      store.addStrokePoint({ x: 50, y: 50 });
      store.endStroke();
    });

    // Step 4: Verify success
    await waitFor(() => {
      expect(useAppStore.getState().session?.isComplete).toBe(true);
    });
  });
});
```

### Key Practices

1. **Wrap state changes in `act()`**
2. **Use `waitFor`** for async assertions
3. **Mock external dependencies** (audio, canvas)
4. **Reset store state** in `beforeEach`
5. **Test complete user journeys**

---

## Mocking

### Module Mocking

```typescript
// Mock entire module
vi.mock('@/lib/feedback/soundPlayer', () => ({
  playSuccessSound: vi.fn(),
}));

// Mock with implementation
vi.mock('@/hooks/useCanvas', () => ({
  useCanvas: vi.fn(() => ({
    canvasRef: { current: document.createElement('canvas') },
    ctx: {
      /* mock context */
    },
    clear: vi.fn(),
  })),
}));
```

### Function Mocking

```typescript
const mockCallbacks = {
  onStrokeStart: vi.fn(),
  onStrokeMove: vi.fn(),
  onStrokeEnd: vi.fn(),
};

// Verify calls
expect(mockCallbacks.onStrokeStart).toHaveBeenCalledWith({ x: 100, y: 200 });
expect(mockCallbacks.onStrokeStart).toHaveBeenCalledTimes(1);
```

### Clearing Mocks

```typescript
beforeEach(() => {
  mockOnSelectCategory.mockClear();
  // or vi.clearAllMocks()
});
```

---

## Coverage

### Configuration

```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html'],
  exclude: ['node_modules/', 'tests/', 'dist/'],
}
```

### Running Coverage

```bash
bunx vitest --coverage
```

### Reports

- **text**: Console output
- **json**: `coverage/coverage-final.json`
- **html**: `coverage/index.html`

---

## E2E Testing (Playwright)

### Configuration

Tests located in `tests/e2e/`. Run separately from unit/component/integration tests.

### Pattern

**Example** from `category-selection.spec.ts`:

```typescript
import { expect, test } from '@playwright/test';

test.describe('Category Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display category selection screen', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Select a Category');
    await expect(page.getByRole('button', { name: 'Numbers' })).toBeVisible();
  });

  test('should navigate to character selection when clicked', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Numbers' }).click();
    await expect(page.locator('h1')).toContainText('Select Number');
  });
});
```

### Running E2E Tests

```bash
# Install Playwright browsers
bunx playwright install --with-deps chromium

# Run E2E tests
bun run test:e2e

# Run with UI
bun run test:e2e:ui
```

---

## Running Tests

### Commands

```bash
# Single test file (most common)
bunx vitest src/path/file.test.ts

# All unit/component/integration tests
bunx vitest --run

# Watch mode
bunx vitest --watch src/path/file.test.ts

# Coverage
bunx vitest --coverage

# E2E tests
bun run test:e2e
bun run test:e2e:ui
```

### Justfile Recipes

```bash
just test-unit     # Run tests once
just test-watch    # Watch mode
just test-e2e      # Run e2e tests
just quality       # All quality checks
```

---

## Testing Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// ✅ Good - test behavior
it('should display success message when tracing is complete', () => {
  // test user-facing behavior
});

// ❌ Bad - test implementation details
it('should call setState with isComplete: true', () => {
  // testing internal state
});
```

### 2. Use Explicit Test Data

```typescript
// ✅ Good
const userPoints: Point[] = [
  { x: 0, y: 0 },
  { x: 25, y: 0 },
  { x: 50, y: 0 },
];

// ❌ Bad
const userPoints = generateRandomPoints();
```

### 3. Clear Descriptions

```typescript
// ✅ Good
describe('pointToSegmentDistance', () => {
  describe('point on segment', () => {
    it('should return 0 when point is exactly on the segment', () => {
      // test
    });
  });
});
```

### 4. One Assertion Per Concept

```typescript
// ✅ Good
expect(result.isCorrect).toBe(true);
expect(result.accuracy).toBe(1);
expect(result.feedbackColor).toBe('#4CAF50');
```

### 5. Mock at Boundaries

Mock external dependencies (APIs, audio, canvas) but not internal functions.

```typescript
// ✅ Good - mock external module
vi.mock('@/lib/feedback/soundPlayer', () => ({
  playSuccessSound: vi.fn(),
}));

// ❌ Bad - mock internal function
vi.mock('@/lib/canvas/strokeValidator', () => ({
  validateStroke: vi.fn(),
}));
```

---

## Test Types Summary

| Type        | Location             | Focus                      | Speed  |
| ----------- | -------------------- | -------------------------- | ------ |
| Unit        | `tests/unit/`        | Pure functions, logic      | Fast   |
| Component   | `tests/component/`   | Component rendering, props | Fast   |
| Integration | `tests/integration/` | User flows, interactions   | Medium |
| E2E         | `tests/e2e/`         | Full browser testing       | Slow   |

---

## Quality Gates

Before committing, ensure:

- [ ] All tests pass (`bunx vitest --run`)
- [ ] Coverage thresholds met
- [ ] No test-only code in production
- [ ] Tests are deterministic (no random failures)
