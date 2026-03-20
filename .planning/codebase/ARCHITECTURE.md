# Architecture

**Analysis Date:** 2026-03-20

## Pattern Overview

**Overall:** Screen-based SPA with centralized state management

**Key Characteristics:**
- Screen navigation drives UI flow (category-selection → character-selection → tracing)
- Zustand store for global state (navigation, character selection, drawing session)
- Canvas-based rendering with react-konva for 60fps drawing
- Validation layer separates user input from feedback display

## Layers

**UI Layer (Components):**
- Purpose: React components for screens and interactive elements
- Location: `src/components/`
- Contains: Screen components, layout, canvas visualization, feedback UI
- Depends on: Zustand store, canvas utilities, types
- Used by: Main app entry point

**State Layer:**
- Purpose: Global application state and actions
- Location: `src/state/sessionStore.ts`
- Contains: Navigation state, current character, drawing session
- Depends on: Types, character data utilities
- Used by: All screen components

**Business Logic Layer (lib/):**
- Purpose: Core algorithms for validation and rendering
- Location: `src/lib/`
- Contains: Canvas rendering, stroke validation, touch handling, template loading
- Depends on: Types, theme configuration
- Used by: Canvas components, hooks

**Custom Hooks Layer:**
- Purpose: Reusable stateful logic
- Location: `src/hooks/`
- Contains: Canvas lifecycle, tracing session management, validation logic
- Depends on: lib utilities, Zustand store
- Used by: Canvas and screen components

## Data Flow

**User Drawing Flow:**
1. User touches canvas (touchHandler captures pointer/mouse/touch)
2. Points added to current stroke in Zustand store
3. On stroke end, validate against guide path (strokeValidator)
4. Update UI with feedback (green/red, animation)
5. Move to next stroke or mark character complete

**Navigation Flow:**
1. User selects category → selectCategory() action
2. Store updates currentScreen and currentCategory
3. CharacterSelectionScreen renders
4. User selects character → selectCharacter() action
5. New DrawingSession created in store
6. TracingScreen renders with canvas

**State Management:**
- Zustand global store with actions for state transitions
- No prop drilling - components consume store directly
- Session state includes: template, strokes array, current stroke index, completion flag

## Key Abstractions

**DrawingSession:**
- Purpose: Represents a single character tracing attempt
- Examples: `src/types/index.ts`, `src/state/sessionStore.ts`
- Pattern: Immutable updates via Zustand actions

**StrokePath:**
- Purpose: Guide path data for character strokes
- Examples: `src/assets/characters/**/*.json`
- Pattern: SVG-like path with guide points array for validation

**ValidationResult:**
- Purpose: Encapsulates stroke accuracy and feedback
- Examples: `src/lib/canvas/strokeValidator.ts`
- Pattern: Return object with isCorrect boolean, accuracy score, CSS color

## Entry Points

**main.tsx:**
- Location: `src/main.tsx`
- Triggers: Browser loads index.html
- Responsibilities: React 18 root creation, StrictMode wrapper, global styles import

**App.tsx:**
- Location: `src/App.tsx`
- Triggers: React mount
- Responsibilities: Touch behavior prevention, renders AppLayout

**AppLayout:**
- Location: `src/components/layout/AppLayout.tsx`
- Triggers: App render
- Responsibilities: Screen routing based on currentScreen state, ErrorBoundary wrapper

## Error Handling

**Strategy:** Component-level error boundaries with console logging

**Patterns:**
- ErrorBoundary catches React component errors
- Console.error for development debugging
- No global error handler (app is simple, low-risk)

## Cross-Cutting Concerns

**Logging:** console.error/warn in ErrorBoundary and soundPlayer only

**Validation:** Point-to-segment distance algorithm in strokeValidator

**Authentication:** N/A (no user accounts)

---

*Architecture analysis: 2026-03-20*
