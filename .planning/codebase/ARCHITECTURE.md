# ARCHITECTURE.md - Little Writing

**Project**: Kids Handwriting Tracing App  
**Stack**: TypeScript, React 18, HTML5 Canvas, Zustand, Capacitor  
**Last Updated**: 2026-03-21

---

## 1. Architectural Pattern

### Pattern: Feature-Based Layered Architecture

The codebase follows a **layered architecture** with clear separation of concerns organized by features:

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Screens   │  │  Components │  │         Hooks           │  │
│  │  (Pages)    │  │   (UI)      │  │    (Logic/State)        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      STATE MANAGEMENT                            │
│                    (Zustand Store)                               │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  sessionStore.ts - Navigation + Session + Drawing State │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       CORE LIBRARY                               │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────────────┐  │
│  │ canvas/       │  │ feedback/     │  │ templates/          │  │
│  │ - Rendering   │  │ - Sound       │  │ - Character Data    │  │
│  │ - Validation  │  │ - Visual      │  │ - Template Loader   │  │
│  │ - Touch       │  │ - Animation   │  │ - Generation        │  │
│  └───────────────┘  └───────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Static JSON Assets (Character Templates)               │    │
│  │  /src/assets/characters/{category}/{character}.json     │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Layer Responsibilities

### 2.1 Presentation Layer

**Screens** (`src/components/screens/`)

- Full-page components representing application states
- Handle high-level layout and composition
- Wire together domain logic from hooks with UI components

**Components** (`src/components/`)

- Reusable UI building blocks
- Organized by domain: `feedback/`, `layout/`, `navigation/`, `tracing/`, `ui/`
- React functional components with explicit Props interfaces

**Hooks** (`src/hooks/`)

- Encapsulate component logic and state
- Bridge between UI components and core library functions
- Custom hooks: `useTracing`, `useCanvas`, `useValidation`, `useCanvasSize`

### 2.2 State Management

**Zustand Store** (`src/state/sessionStore.ts`)

- Single source of truth for application state
- Handles:
  - Screen navigation (category-selection → character-selection → tracing)
  - Category and character selection
  - Drawing session lifecycle
  - Stroke collection and validation flow

**State Flow:**

```
User Action → Store Action → State Update → Component Re-render → Canvas Update
```

### 2.3 Core Library

**Canvas Module** (`src/lib/canvas/`)

- `pathRenderer.ts`: SVG path parsing and Canvas2D rendering
- `strokeValidator.ts`: Point-to-segment distance algorithm for validation
- `touchHandler.ts`: Pointer event handling with palm rejection

**Feedback Module** (`src/lib/feedback/`)

- `soundPlayer.ts`: Web Audio API for success sounds
- `visualFeedback.ts`: Color and animation state utilities

**Templates Module** (`src/lib/templates/`)

- `characterData.ts`: Registry of all 62 characters (A-Z, a-z, 0-9)
- `templateLoader.ts`: Dynamic loading utilities
- `generateCharacterTemplates.ts`: Template generation from SVG

### 2.4 Data Layer

**Static Assets** (`src/assets/characters/`)

- JSON files with character stroke data
- Organized by category: `uppercase/`, `lowercase/`, `numbers/`
- Each file contains: bounds, viewBox, stroke paths, guide points

---

## 3. Data Flow

### 3.1 Navigation Flow

```
┌─────────────────────┐     selectCategory()      ┌─────────────────────┐
│  Category Selection │ ────────────────────────▶ │ Character Selection │
│    Screen           │                           │    Screen           │
└─────────────────────┘                           └─────────────────────┘
         ▲                                                  │
         │                                                  │ selectCharacter()
         │                                                  ▼
         │                                         ┌─────────────────────┐
         │         navigateToCategorySelection()   │    Tracing Screen   │
         └──────────────────────────────────────── │   (Canvas + UI)     │
                                                   └─────────────────────┘
```

### 3.2 Drawing Flow

```
User Touch/Pointer
        │
        ▼
┌───────────────────┐
│  Pointer Events   │  (touchHandler.ts)
│  - pointerdown    │
│  - pointermove    │
│  - pointerup      │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│  Store Actions    │  (sessionStore.ts)
│  - startStroke()  │
│  - addStrokePoint │
│  - endStroke()    │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│  Validation       │  (strokeValidator.ts)
│  Point-to-segment │
│  distance calc    │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│  Canvas Render    │  (Canvas.tsx + pathRenderer.ts)
│  - Guide paths    │
│  - User strokes   │
│  - Feedback colors│
└───────────────────┘
```

### 3.3 Validation Flow

```
Stroke End
    │
    ▼
┌────────────────────────────────────────┐
│ For each user point:                   │
│   - Calculate distance to each segment │
│     of guide path                      │
│   - Find minimum distance              │
└────────────────────────────────────────┘
    │
    ▼
┌────────────────────────────────────────┐
│ Calculate accuracy:                    │
│   - Points within tolerance /          │
│     Total points                       │
└────────────────────────────────────────┘
    │
    ▼
┌────────────────────────────────────────┐
│ Compare to threshold:                  │
│   - accuracy >= MIN_ACCURACY (0.7)     │
│   - Mark stroke valid/invalid          │
│   - Update session state               │
└────────────────────────────────────────┘
```

---

## 4. Key Abstractions

### 4.1 Type System (`src/types/index.ts`)

| Type                | Purpose                                                     |
| ------------------- | ----------------------------------------------------------- | --------------------- | ----------- |
| `Point`             | 2D coordinate {x, y}                                        |
| `StrokePath`        | Guide path with id, SVG path, start/end points, guidePoints |
| `CharacterTemplate` | Complete character: bounds, strokes, metadata               |
| `Stroke`            | User-drawn stroke: points array, validation state           |
| `DrawingSession`    | Active session: template, strokes, progress                 |
| `AppStore`          | Zustand store interface (state + actions)                   |
| `Screen`            | Union: 'category-selection'                                 | 'character-selection' | 'tracing'   |
| `Category`          | Union: 'number'                                             | 'uppercase'           | 'lowercase' |

### 4.2 Canvas Rendering Architecture

**Coordinate Systems:**

- **Template Space**: Original SVG coordinates (varies by character)
- **Canvas Space**: Screen pixels (device pixel ratio aware)
- **Conversion**: `templateToCanvasPoint()` / `canvasToTemplatePoint()`

**Rendering Pipeline:**

1. Clear canvas
2. Draw white background
3. Draw guide paths (gray/dashed for upcoming, green for completed, blue for current)
4. Draw user strokes (green for valid, red for invalid)

### 4.3 Validation Algorithm

**Point-to-Segment Distance:**

1. Project point onto line containing segment
2. Clamp projection to segment bounds [0, 1]
3. Calculate Euclidean distance to clamped point
4. Return minimum distance across all segments

**Accuracy Calculation:**

- `accuracy = pointsWithinTolerance / totalPoints`
- Valid if `accuracy >= MIN_ACCURACY (0.7)`

---

## 5. Entry Points

### 5.1 Application Entry

**`index.html`**

- Root HTML template
- Viewport: `maximum-scale=1.0, user-scalable=no` (touch-optimized)
- Mount point: `<div id="root">`

**`src/main.tsx`**

- React 18 `createRoot` initialization
- StrictMode wrapper
- Global styles import

**`src/App.tsx`**

- Root component
- Renders `AppLayout`

### 5.2 Layout Entry

**`src/components/layout/AppLayout.tsx`**

- Screen router based on `currentScreen` state
- ErrorBoundary wrapper
- Skip link for accessibility

### 5.3 Screen Components

| Screen              | Path                                   | Purpose                            |
| ------------------- | -------------------------------------- | ---------------------------------- |
| Category Selection  | `screens/CategorySelectionScreen.tsx`  | Choose uppercase/lowercase/numbers |
| Character Selection | `screens/CharacterSelectionScreen.tsx` | Grid of characters in category     |
| Tracing             | `screens/TracingScreen.tsx`            | Main drawing interface             |

---

## 6. Module Dependencies

```
sessionStore.ts
    ├── types/index.ts
    ├── lib/templates/characterData.ts
    │       └── types/index.ts
    └── lib/templates/templateLoader.ts

Canvas.tsx
    ├── hooks/useCanvas.ts
    │       └── lib/canvas/pathRenderer.ts
    ├── lib/canvas/pathRenderer.ts
    ├── lib/canvas/touchHandler.ts
    ├── styles/theme.ts
    └── types/index.ts

strokeValidator.ts
    ├── types/index.ts
    └── styles/theme.ts
```

---

## 7. Configuration

### 7.1 Build Configuration

**`vite.config.ts`**

- React plugin
- `@/` alias to `./src`
- CSS modules with camelCase locals
- Conditional base path for Capacitor

**`tsconfig.json`**

- Strict mode, ES2020 target
- Path mapping: `@/*` → `./src/*`
- Types: vite/client, vitest/globals

### 7.2 Test Configuration

**`vitest.config.ts`**

- jsdom environment
- Test directories: unit/, component/, integration/
- Excludes: e2e/
- Coverage with v8 provider

---

## 8. Performance Considerations

- **Canvas**: `requestAnimationFrame` for 60fps rendering
- **Device Pixel Ratio**: Automatic scaling for Retina displays
- **Touch Handling**: Palm rejection, minimum stroke length (20px)
- **State Updates**: Minimal re-renders via Zustand selectors
- **SVG Parsing**: Cached guide points in character templates

---

## 9. Child-Centric Design Principles

1. **Touch Targets**: All interactive elements >= 44px (WCAG)
2. **Colors**: Bright, high-contrast palette in `theme.ts`
3. **Feedback**: Immediate visual + audio feedback
4. **Simplicity**: No auth, ads, gamification (MVP scope)
5. **Accessibility**: ARIA labels, keyboard navigation, screen reader support
