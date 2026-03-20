# Testing Patterns

**Analysis Date:** 2026-03-20

## Test Framework

**Runner:**
- Vitest 1.1.0
- Config: Built-in defaults (no vitest.config.ts present)

**Assertion Library:**
- Vitest built-in assertions + @testing-library/jest-dom matchers

**Run Commands:**
```bash
bun test              # Run all tests (interactive mode)
bun test --run        # Run tests once (CI mode)
bun test --coverage   # With coverage report
bun test --watch      # Watch mode
```

## Test File Organization

**Location:**
- Separate directory: `tests/` at project root
- Currently: Empty (no tests written yet)

**Naming:**
- Pattern not yet established (likely `*.test.ts` or `*.spec.ts`)

**Structure:**
```
tests/
├── components/    # Component tests
├── hooks/         # Hook tests
├── lib/           # Business logic tests
└── __mocks__/     # Mocks (if needed)
```

## Test Structure

**Suite Organization:**
Not yet established (tests not written)

**Patterns:**
- Testing Library used for React components
- describe/test blocks expected
- Setup/teardown with beforeEach/afterEach when needed

## Mocking

**Framework:** Vitest built-in vi module

**Patterns:**
Not yet established (tests not written)

**What to Mock:**
- Canvas rendering (Konva)
- Sound playback (soundPlayer)
- Capacitor plugins

**What NOT to Mock:**
- Business logic (strokeValidator, pathRenderer)

## Fixtures and Factories

**Test Data:**
Not yet established (tests not written)

**Location:**
- Likely `tests/fixtures/` or inline in test files

## Coverage

**Requirements:** None enforced (target not specified)

**View Coverage:**
```bash
bun test --coverage
```

## Test Types

**Unit Tests:**
- Scope and approach: Test individual functions and hooks in isolation
- Focus: Business logic (validation, path rendering, state management)

**Integration Tests:**
- Scope and approach: Test component interactions with store and hooks
- Focus: Screen navigation, drawing session lifecycle

**E2E Tests:**
- Framework: Playwright 1.40.1 (configured in devDependencies)
- Status: Not implemented (no tests written)

## Common Patterns

**Async Testing:**
```typescript
// Example pattern (not yet in codebase)
test('async operation', async () => {
  await waitFor(() => expect(result).toBe(expected));
});
```

**Error Testing:**
```typescript
// Example pattern (not yet in codebase)
test('throws on invalid input', () => {
  expect(() => validateStroke([], guidePath)).toThrow();
});
```

---

*Testing analysis: 2026-03-20*
