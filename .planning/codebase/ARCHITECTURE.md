# Architecture

Kids Handwriting Tracing App - Architectural Overview

## Pattern

**Layered Architecture with State-Driven UI**

```
┌─────────────────────────────────────────────────────────────┐
│                      Presentation Layer                      │
│  ┌─────────────┐ ┌──────────────┐ ┌─────────────────────┐  │
│  │   Screens   │ │   Canvas &   │ │   UI Components     │  │
│  │   (Pages)   │ │   Tracing    │ │   (Button, Card)    │  │
│  └─────────────┘ └──────────────┘ └─────────────────────┘  │
│                              │                                │
│                    ┌─────────▼─────────┐                     │
│                    │  Custom Hooks     │                     │
│                    │  useTracing       │                     │
│                    │  useCanvas        │                     │
│                    │  useValidation    │                     │
│                    └─────────┬─────────┘                     │
└──────────────────────────────┼───────────────────────────────┘
                               │
┌──────────────────────────────┼───────────────────────────────┐
│                      State Layer                             │
│                    ┌─────────▼─────────┐                     │
│                    │   Zustand Store    │                     │
│                    │   useAppStore      │                     │
│                    └─────────┬─────────┘                     │
└──────────────────────────────┼───────────────────────────────┘
                               │
┌──────────────────────────────┼───────────────────────────────┐
│                      Business Logic Layer                     │
│  ┌─────────────┐ ┌──────────────┐ ┌─────────────────────┐  │
│  │   Canvas    │ │   Templates  │ │     Feedback        │  │
│  │   Logic     │ │   Loading    │ │   (Sound/Visual)    │  │
│  └─────────────┘ └──────────────┘ └─────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                               │
┌──────────────────────────────┼───────────────────────────────┐
│                      Data Layer                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Character Template JSON Files               │ │
│  │     /assets/characters/{category}/{char}.json          │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

## Layers

### 1. Presentation Layer (React Components)

| Component      | Purpose                                                                |
| -------------- | ---------------------------------------------------------------------- |
| `screens/*`    | Page-level components (CategorySelection, CharacterSelection, Tracing) |
| `canvas/*`     | Canvas rendering and drawing functionality                             |
| `tracing/*`    | Tracing-specific components (Canvas, StrokeFeedback, SuccessAnimation) |
| `layout/*`     | App shell (AppLayout, ErrorBoundary)                                   |
| `navigation/*` | Navigation controls (NavButtons, CharacterGrid)                        |
| `ui/*`         | Reusable primitives (Button, Card)                                     |
| `feedback/*`   | Visual feedback overlays                                               |

### 2. State Layer (Zustand)

Single global store (`useAppStore`) managing:

- Navigation state (`currentScreen`, `currentCategory`, `currentCharacter`)
- Drawing session (`session: DrawingSession`)
- Action dispatchers for all user interactions

### 3. Business Logic Layer (Pure Functions)

| Module                        | Responsibility                                            |
| ----------------------------- | --------------------------------------------------------- |
| `lib/canvas/strokeValidator`  | Point-to-segment distance algorithm for stroke validation |
| `lib/canvas/pathRenderer`     | SVG path parsing and canvas rendering                     |
| `lib/canvas/touchHandler`     | Pointer event handling with palm rejection                |
| `lib/templates/characterData` | Character loading, caching, navigation                    |
| `lib/feedback/soundPlayer`    | Web Audio API synthetic sound generation                  |
| `lib/feedback/visualFeedback` | Visual feedback utilities                                 |

### 4. Data Layer

Static JSON files in `/public/assets/characters/` containing:

- Character templates with SVG paths
- Stroke order data
- Bounds and metadata

## Data Flow

### Screen Navigation Flow

```
App.tsx
    │
    ▼
AppLayout.tsx (reads currentScreen from store)
    │
    ├─── "category-selection" ────► CategorySelectionScreen
    │
    ├─── "character-selection" ───► CharacterSelectionScreen
    │                                    │
    │                                    └──► onSelectCharacter() → store.selectCharacter()
    │
    └─── "tracing" ───────────────► TracingScreen
                                       │
                                       ├──► Canvas (reads template, session)
                                       │
                                       └──► NavButtons
                                            │
                                            ├──► onBack() ──► store.navigateToCategorySelection()
                                            ├──► onNext() ───► store.nextCharacter()
                                            └──► onClear() ──► store.clearSession()
```

### Drawing Session Flow

```
Touch/Pointer Event
        │
        ▼
createPointerHandlers() (touchHandler.ts)
        │
        ├── onPointerDown() ──► store.startStroke(point)
        │
        ├── onPointerMove() ──► store.addStrokePoint(point)
        │
        └── onPointerUp() ─────► store.endStroke()
                                      │
                                      ▼
                              strokeValidator.validateStroke()
                                      │
                                      ▼
                              Store updates session.strokes[]
                                      │
                                      ▼
                              Canvas re-renders (60fps via requestAnimationFrame)
```

## Abstractions

### Key Interfaces

| Interface           | Location         | Purpose                                          |
| ------------------- | ---------------- | ------------------------------------------------ |
| `CharacterTemplate` | `types/index.ts` | Defines character with strokes, bounds, metadata |
| `DrawingSession`    | `types/index.ts` | Tracks user's tracing progress                   |
| `Stroke`            | `types/index.ts` | Single user-drawn stroke with validation state   |
| `StrokePath`        | `types/index.ts` | Guide path for validation                        |
| `AppStore`          | `types/index.ts` | Complete store interface                         |

### Abstraction Boundaries

1. **Canvas vs Store**: Canvas reads session state but never writes directly. All mutations go through store actions.

2. **Hooks vs Components**: Hooks encapsulate logic, components handle rendering.

3. **Validation vs Rendering**: Stroke validation is pure math (point-to-segment distance), decoupled from visual feedback.

4. **Template Loading vs App**: Character data loaded asynchronously, app remains responsive.

## Entry Points

### Web Entry

```
index.html
    │
    ▼
src/main.tsx
    │
    ▼
src/App.tsx
    │
    ▼
AppLayout.tsx
```

### Mobile Entry (Capacitor)

```
ios/App/
    │
    ▼
CapacitorWebView
    │
    ▼
(Same as web entry)
```

### Key Files

| File                                       | Role                                 |
| ------------------------------------------ | ------------------------------------ |
| `src/main.tsx`                             | React 18 createRoot entry            |
| `src/App.tsx`                              | App initialization, touch prevention |
| `src/state/sessionStore.ts`                | Zustand store definition             |
| `src/components/layout/AppLayout.tsx`      | Screen routing                       |
| `src/components/screens/TracingScreen.tsx` | Main tracing interface               |

## State Management

### Zustand Store Structure

```typescript
interface AppStore {
  // State
  currentScreen: 'category-selection' | 'character-selection' | 'tracing';
  currentCategory: Category;
  currentCharacter: CharacterTemplate | null;
  session: DrawingSession | null;

  // Actions
  navigateToCategorySelection: () => void;
  selectCategory: (category: Category) => void;
  selectCharacter: (character: CharacterTemplate) => void;
  startStroke: (point: Point) => void;
  addStrokePoint: (point: Point) => void;
  endStroke: () => void;
  clearSession: () => void;
  nextCharacter: () => Promise<void>;
  previousCharacter: () => Promise<void>;
}
```

## Performance Considerations

1. **60fps Canvas**: Uses `requestAnimationFrame` for smooth rendering
2. **Device Pixel Ratio Scaling**: Canvas supports Retina displays
3. **Touch Optimization**: Palm rejection, pointer capture, minimum stroke length
4. **Lazy Loading**: Character templates loaded on-demand with caching
5. **Memoization**: `useMemo` and `useCallback` prevent unnecessary re-renders
