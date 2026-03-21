# Codebase Concerns

**Analysis Date:** 2026-03-20  
**Review Scope:** Kids Handwriting Tracing App (MVP)

---

## Executive Summary

This document catalogs technical debt, known issues, security concerns, performance risks, and fragile areas in the codebase. Items are prioritized by impact severity and estimated remediation effort.

---

## Priority Issues (High Impact)

### CON-001: Duplicate/Unused Canvas Components

**Severity:** High  
**Category:** Code Quality / Technical Debt  
**Files:**

- `src/components/canvas/Canvas.tsx` (placeholder) - **REMOVED**
- `src/components/tracing/Canvas.tsx` (active implementation)
- `src/components/feedback/StrokeFeedback.tsx` (placeholder)

**Description:**  
Two Canvas implementations existed. The `canvas/` directory contained a TODO placeholder while the working implementation is in `tracing/`. This created confusion about which to use and wasted code.

**Impact:**

- Developer confusion about correct import paths
- Dead code maintenance burden
- Risk of wrong imports in future development

**Remediation:**

- ~~Remove `src/components/canvas/` directory entirely~~ ✅ Done
- ~~Update barrel exports to reference only active implementations~~ ✅ N/A
- ~~Delete or implement placeholder components~~ ✅ Removed canvas/

**Status:** ✅ Resolved (2026-03-21)

---

### CON-002: JavaScript Files Alongside TypeScript

**Severity:** Medium  
**Category:** Code Quality  
**Files:**

- `src/components/screens/*.js` (6 files) - **REMOVED**
- `src/components/tracing/*.js` (5 files) - **REMOVED**

**Description:**  
Multiple `.js` counterparts existed for `.tsx` files (e.g., both `Canvas.tsx` and `Canvas.js`). These were duplicate source files that could cause confusion.

**Impact:**

- Potential import conflicts
- Confusion about which files to edit
- If both are used, duplicated logic

**Remediation:**

- ~~Verify if `.js` files are build artifacts~~ ✅ Verified - were source files
- ~~If source files, convert to `.tsx` or remove~~ ✅ Removed duplicate .js files

**Status:** ✅ Resolved (2026-03-21)

---

### CON-003: Component API Mismatch

**Severity:** High  
**Category:** Bug  
**File:** `src/components/layout/AppLayout.tsx` (line 88)

**Description:**  
`AppLayout` passes `categoryCharacters` prop to `TracingScreen`, but `TracingScreen` interface does not define this prop:

```typescript
// AppLayout.tsx line 88
<TracingScreen
  template={currentCharacter}
  session={session}
  categoryCharacters={characters}  // ← Prop not in TracingScreen interface
  ...
/>
```

**Impact:**

- TypeScript compilation may fail (depending on tsconfig)
- Runtime undefined behavior if prop is accessed

**Remediation:**

- Add `categoryCharacters` to `TracingScreenProps` interface
- Or remove the prop if not used in TracingScreen

**Status:** Unresolved (potential bug)

---

### CON-004: Inline Styles vs CSS Modules Inconsistency

**Severity:** Medium  
**Category:** Code Quality  
**Files:** Multiple component files

**Description:**  
Components use inconsistent styling approaches:

- `CharacterGrid.tsx`: Inline styles throughout
- `CharacterGuide.tsx`: Uses react-konva primitives
- `TracingScreen.tsx`: Imports CSS file (`./TracingScreen.css`)
- `SuccessAnimation.tsx`: Inline styles + injected `<style>` tags

**Impact:**

- Inconsistent developer experience
- Harder to maintain themed styles
- CSS injection in components (SuccessAnimation) is fragile

**Remediation:**

- Establish consistent styling strategy (recommend CSS Modules)
- Extract shared styles to theme constants
- Remove inline `<style>` injection, use CSS Modules instead

**Status:** Unresolved

---

## Technical Debt

### CON-010: Unused Dependencies on Konva

**Severity:** Low  
**Category:** Technical Debt  
**File:** `src/components/tracing/CharacterGuide.tsx`

**Description:**  
`CharacterGuide.tsx` imports from `react-konva` (Line, Circle, Group), but the main `Canvas.tsx` uses vanilla HTML5 Canvas API. This suggests:

1. Konva was explored but abandoned
2. CharacterGuide is dead code
3. Mixed rendering approaches

**Impact:**

- Bundle size overhead (konva adds ~150kb)
- Confusing codebase architecture

**Remediation:**

- Either remove CharacterGuide if unused
- Or unify on Konva for all canvas rendering
- Currently CharacterGuide is exported but not used in active Canvas

**Status:** Unresolved

---

### CON-011: PathRenderer Type Duplication

**Severity:** Low  
**Category:** Technical Debt  
**File:** `src/lib/canvas/pathRenderer.ts` (lines 11-14, 33-47)

**Description:**  
`pathRenderer.ts` defines its own `Point`, `CharacterTemplate`, and other interfaces instead of importing from `src/types/index.ts`:

```typescript
// Local type definitions (duplicated)
export interface Point {
  x: number;
  y: number;
}

export interface CharacterTemplate {
  character: string;
  strokes: GuidePath[];
  ...
}
```

**Impact:**

- Type drift between modules
- Potential runtime errors if types diverge

**Remediation:**

- Import types from `@/types` and adapt functions
- Use type assertions where interface differences are intentional

**Status:** Unresolved

---

### CON-012: Global AudioContext Singleton

**Severity:** Low  
**Category:** Code Quality  
**File:** `src/lib/feedback/soundPlayer.ts` (lines 9-10)

**Description:**  
AudioContext is stored as a module-level singleton without cleanup guarantees:

```typescript
let audioContext: AudioContext | null = null;
let isAudioContextUnlocked = false;
```

**Impact:**

- Memory leak if app doesn't call `cleanupSounds()`
- State persists across app navigation

**Remediation:**

- Consider moving to React context or hook
- Add cleanup to App unmount
- Document required cleanup call

**Status:** Acknowledged, low priority

---

### CON-013: ErrorBoundary Uses Class Component

**Severity:** Low  
**Category:** Code Quality  
**File:** `src/components/layout/ErrorBoundary.tsx`

**Description:**  
Constitution requires functional components only, but ErrorBoundary uses class component pattern (required by React error boundary API).

**Impact:**

- Violates project convention
- Requires special exception handling

**Remediation:**

- Document this as a React API exception
- Consider wrapper pattern if React supports it in future

**Status:** Acknowledged (API limitation)

---

### CON-014: TODO Comments in Codebase

**Severity:** Low  
**Category:** Technical Debt  
**Files:**

- `src/components/canvas/Canvas.tsx` (lines 3-4, 24)
- `src/components/feedback/StrokeFeedback.tsx` (lines 3-4, 18)

**Description:**  
Two files contain explicit TODO markers:

```typescript
// Canvas.tsx line 4
* TODO: Implement canvas drawing functionality

// StrokeFeedback.tsx line 4
* TODO: Implement stroke feedback overlay
```

**Impact:**

- Incomplete features may be deployed
- Indicates placeholder code

**Remediation:**

- Implement or remove placeholder components
- Track in issue tracker if intentionally deferred

**Status:** Unresolved

---

## Performance Concerns

### CON-020: Interval-Based Animation

**Severity:** Medium  
**Category:** Performance  
**File:** `src/components/tracing/CharacterGuide.tsx` (lines 63-64)

**Description:**  
Pulse animation previously used `setInterval` instead of `requestAnimationFrame`:

```typescript
// OLD (removed)
const interval = setInterval(() => {
  setPulsePhase((prev) => (prev + 0.05) % (Math.PI * 2));
}, 16); // ~60fps
```

**Impact:**

- May cause jank on low-end devices
- setInterval runs even when tab is backgrounded
- Wastes battery

**Remediation:**

- ~~Use `requestAnimationFrame` with visibility check~~ ✅ Implemented
- ~~Or use CSS animations for opacity changes~~ ✅ Used rAF instead

**Status:** ✅ Resolved (2026-03-21) - Converted to requestAnimationFrame with proper cleanup

---

### CON-021: Canvas Re-render on Every State Change

**Severity:** Medium  
**Category:** Performance  
**File:** `src/components/tracing/Canvas.tsx` (lines 251-253)

**Description:**  
Canvas schedules render on every `template` or `session` change:

```typescript
useEffect(() => {
  scheduleRender();
}, [scheduleRender, template, session]);
```

Each user point added triggers a full canvas redraw.

**Impact:**

- May impact battery on prolonged use
- Could cause jank with complex character templates

**Remediation:**

- Consider throttling renders for point additions
- Batch point updates before render
- Profile on target device (iPad) before optimizing

**Status:** Acceptable for MVP (Constitution requires 60fps)

---

### CON-022: Character Data Loading Strategy

**Severity:** Low  
**Category:** Performance  
**File:** `src/lib/templates/characterData.ts`

**Description:**  
Characters are loaded lazily with a Map-based cache. `getCategory()` loads all 26 characters eagerly:

```typescript
export async function getCategory(category: Category): Promise<CategoryCollection> {
  const characters = await Promise.all(
    CHARACTER_REGISTRY[category].map((char) => loadCharacter(category, char)),
  );
  ...
}
```

**Impact:**

- Initial character selection screen may show loading states
- Memory usage spikes when entering a category

**Remediation:**

- Consider preloading next/previous characters only
- Add skeleton loading states for character grid
- Preload all characters on app start (62 total is manageable)

**Status:** Acceptable for MVP

---

## Security Concerns

### CON-030: Overly Broad Touch Event Prevention

**Severity:** Medium  
**Category:** Security / Accessibility  
**File:** `src/App.tsx` (lines 22-39)

**Description:**  
Touch event prevention was applied to entire document, not just canvas:

```typescript
// OLD (removed)
const preventDefaultTouch = (e: Event) => {
  if (e.target instanceof HTMLElement) {
    if (e.target.tagName === 'BUTTON') {
      return;
    }
  }
  e.preventDefault();
};
```

**Impact:**

- May break legitimate touch interactions outside canvas
- Accessibility issues for screen readers
- Scroll lock affects entire page

**Remediation:**

- ~~Move prevention logic to canvas element only~~ ✅ Canvas uses CSS `touch-action: none`
- ~~Use `touch-action: none` CSS on canvas~~ ✅ Already present in Canvas.tsx
- ~~Remove document-level listeners if possible~~ ✅ Removed document-level listeners

**Status:** ✅ Resolved (2026-03-21) - Touch prevention now handled by canvas CSS

---

### CON-031: Missing Input Sanitization

**Severity:** Low  
**Category:** Security  
**Files:** Character template loading

**Description:**  
Character templates are loaded from JSON files. No validation of template data structure before use:

```typescript
const template: CharacterTemplate = await response.json();
```

**Impact:**

- Malformed JSON could cause runtime errors
- Template data used directly in canvas rendering

**Remediation:**

- Add schema validation for template JSON
- Use Zod or similar for runtime type checking
- Validate bounds, points array lengths, etc.

**Status:** Low risk (templates are bundled assets)

---

## Fragile Areas

### CON-040: Character Template Quality

**Severity:** Medium  
**Category:** Data Quality  
**Files:** `src/assets/characters/**/*.json`

**Description:**  
Some character templates have questionable path data. Example: lowercase 'a' has a curved path that loops back to its start point:

```json
{
  "path": "M 50 50 Q 75 40 50 50",
  "startPoint": { "x": 50, "y": 50 },
  "endPoint": { "x": 50, "y": 50 }
}
```

This creates a zero-length stroke visually.

**Impact:**

- Confusing user experience
- Validation algorithm may behave unexpectedly

**Remediation:**

- Audit all 62 character templates
- Verify stroke paths match intended characters
- Test validation on actual device

**Status:** Needs manual review

---

### CON-041: Session State Synchronization

**Severity:** Medium  
**Category:** Fragility  
**Files:**

- `src/state/sessionStore.ts`
- `src/hooks/useTracing.ts`

**Description:**  
Two different session creation patterns exist:

1. `sessionStore.createSession()` in Zustand store
2. `useTracing.createSession()` hook-local

The store is the source of truth, but `useTracing` creates independent sessions.

**Impact:**

- Potential state inconsistency
- Session in hook may not reflect store state

**Remediation:**

- Eliminate `useTracing.ts` session creation if redundant
- Or make hook derive from store state only

**Status:** Needs architectural review

---

### CON-042: SVG Path Parsing Edge Cases

**Severity:** Low  
**Category:** Fragility  
**File:** `src/lib/canvas/pathRenderer.ts`

**Description:**  
SVG path parser handles basic commands (M, L, H, V, C, Q, A, Z) but:

- Elliptical arcs (A) have fallback to line approximation
- S (smooth bezier) not implemented
- T (smooth quadratic) not implemented

```typescript
// Line 366-368
} else {
  // Approximate elliptical arc with quadratic curves
  ctx.lineTo(x2, y2);
}
```

**Impact:**

- Some character templates may not render correctly
- Visual differences between template and rendered path

**Remediation:**

- Test all character templates for path command compatibility
- Implement remaining SVG commands if needed
- Document unsupported commands

**Status:** Needs testing

---

## Known Issues

### CON-050: E2E Tests Not Implemented

**Severity:** Low  
**Category:** Testing Gap

**Description:**  
Playwright is configured (`playwright.config.ts`, `@playwright/test` in deps) but no E2E tests exist.

**Impact:**

- No automated testing of full user flows
- Manual testing burden increased

**Status:** Planned but not implemented

---

### CON-051: Spec Status is "Draft"

**Severity:** Low  
**Category:** Process

**File:** `specs/001-handwriting-tracing/spec.md` (line 5)

**Description:**  
Feature specification has status "Draft" despite implementation underway.

**Impact:**

- Requirements may change
- Unclear scope boundaries

**Status:** Process issue, should finalize spec

---

## Recommendations Summary

| ID      | Priority | Category     | Estimated Fix | Status                   |
| ------- | -------- | ------------ | ------------- | ------------------------ |
| CON-001 | High     | Code Quality | 1 hour        | ✅ Fixed                 |
| CON-003 | High     | Bug          | 15 minutes    | ⚠️ N/A (already present) |
| CON-020 | Medium   | Performance  | 30 minutes    | ✅ Fixed                 |
| CON-030 | Medium   | Security     | 30 minutes    | ✅ Fixed                 |
| CON-040 | Medium   | Data Quality | 4 hours       | ⏳ Pending               |
| CON-041 | Medium   | Fragility    | 2 hours       | ⏳ Pending               |
| CON-002 | Medium   | Code Quality | 1 hour        | ✅ Fixed                 |
| CON-004 | Medium   | Code Quality | 2 hours       | ⏳ Pending               |

**Total estimated effort:** ~11 hours  
**Completed:** 4 items (~3 hours)  
**Remaining:** 4 items (~8 hours)

---

## Constitution Compliance

Reviewing concerns against the [Constitution](./constitution.md):

| Principle                    | Status       | Notes                                      |
| ---------------------------- | ------------ | ------------------------------------------ |
| Touch-First (60fps)          | ✅ Compliant | Canvas renders with requestAnimationFrame  |
| Child-Centric (44px targets) | ✅ Compliant | UI_CONFIG.MIN_TOUCH_TARGET = 44            |
| Immediate Feedback           | ⚠️ Partial   | Feedback exists but StrokeFeedback is TODO |
| Simplicity (MVP scope)       | ✅ Compliant | No auth, ads, or gamification              |

---

_Concerns analysis: 2026-03-20_  
_Fixes applied: 2026-03-21_
