# Codebase Concerns

**Analysis Date:** 2026-03-20

## Tech Debt

**Placeholder character data:**
- Issue: `src/lib/templates/characterData.ts` contains placeholder data with TODO comments to replace with actual JSON imports
- Files: `src/lib/templates/characterData.ts`
- Impact: Only 3 sample characters (0, 1, A, a) instead of full 62 character set
- Fix approach: Import JSON files from `src/assets/characters/` or use dynamic import

**Stroke validation placeholder:**
- Issue: `src/state/sessionStore.ts` line 133-135 has hardcoded validation (accuracy = 100, isValid = true) with TODO comment
- Files: `src/state/sessionStore.ts`
- Impact: Strokes always validate as correct, validation logic not connected to store
- Fix approach: Call `validateStroke()` from `src/lib/canvas/strokeValidator.ts`

**Unused canvas components directory:**
- Issue: `src/components/canvas/` directory exists but components are superseded by `src/components/tracing/`
- Files: `src/components/canvas/*.tsx`
- Impact: Code duplication, confusion about which components to use
- Fix approach: Remove unused `src/components/canvas/` directory

## Known Bugs

**None documented**
- Application is in early development stage
- No production bugs reported

## Security Considerations

**Area: None**
- Risk: No significant security concerns (local app with no external APIs or auth)
- Files: N/A
- Current mitigation: N/A
- Recommendations: None needed for MVP scope

## Performance Bottlenecks

**Canvas rendering on each frame:**
- Problem: `useCanvas` hook uses requestAnimationFrame on every render call
- Files: `src/hooks/useCanvas.ts`
- Cause: May cause unnecessary re-renders if called frequently
- Improvement path: Add useMemo/useCallback optimization for render elements

**No identified bottlenecks**
- App is simple with minimal state
- Canvas operations are lightweight
- 60fps target achievable with current implementation

## Fragile Areas

**Stroke validation configuration:**
- Files: `src/styles/theme.ts` (VALIDATION_CONFIG), `src/lib/canvas/strokeValidator.ts`
- Why fragile: Hard-coded tolerance values (25px, 70% accuracy) may not work for all devices/screen sizes
- Safe modification: Make tolerance configurable per character or screen size
- Test coverage: No tests for validation edge cases

**Character template format:**
- Files: `src/assets/characters/*.json`, `src/types/index.ts`
- Why fragile: Schema changes require regenerating 62 JSON files
- Safe modification: Use versioned schema or migration script
- Test coverage: No tests for template loading

## Scaling Limits

**Character count:**
- Current capacity: ~62 characters (26 uppercase + 26 lowercase + 10 numbers)
- Limit: No hard limit, but JSON imports may increase bundle size
- Scaling path: Dynamic imports or lazy loading for character templates

**Concurrent sessions:**
- Current capacity: Single session (Zustand store is singleton)
- Limit: Not designed for multiple users
- Scaling path: Not applicable (single-user app)

## Dependencies at Risk

**react-konva:**
- Risk: Konva API changes may break canvas rendering
- Impact: Core tracing functionality would fail
- Migration plan: Keep updated with major versions, test canvas features after upgrades

**Capacitor 6.0:**
- Risk: iOS platform changes may require updates
- Impact: iOS app deployment would fail
- Migration plan: Follow Capacitor release notes, test on physical devices

## Missing Critical Features

**Sound feedback:**
- Problem: `src/lib/feedback/soundPlayer.ts` exists but references non-existent sound files
- Blocks: Audio feedback on successful tracing
- Priority: Medium (visual feedback works, sound is enhancement)

**Success animation:**
- Problem: `src/components/tracing/SuccessAnimation.tsx` is placeholder
- Blocks: Celebration animation on character completion
- Priority: Medium (visual feedback works, animation is enhancement)

**Touch gesture support:**
- Problem: Only basic touch/mouse events handled, no multi-touch or palm rejection
- Blocks: Stylus and palm rejection features
- Priority: High for tablet usage

## Test Coverage Gaps

**Untested area: Business logic**
- What's not tested: Stroke validation algorithm, path rendering, template loading
- Files: `src/lib/canvas/strokeValidator.ts`, `src/lib/canvas/pathRenderer.ts`
- Risk: Math errors or edge cases in validation could produce incorrect feedback
- Priority: High

**Untested area: State management**
- What's not tested: Zustand store actions and state transitions
- Files: `src/state/sessionStore.ts`
- Risk: Navigation bugs or session state corruption
- Priority: High

**Untested area: Component interactions**
- What's not tested: Screen navigation, canvas drawing, feedback display
- Files: All component files
- Risk: UI bugs, broken user flows
- Priority: Medium

---

*Concerns audit: 2026-03-20*
