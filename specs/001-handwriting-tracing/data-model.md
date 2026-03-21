# Data Model: Kids Handwriting Tracing App

**Feature**: 001-handwriting-tracing
**Date**: 2026-03-20
**Purpose**: Entity definitions, state structures, and data flow

---

## Core Entities

### 1. CharacterTemplate

Represents a single letter or number with stroke order data.

```typescript
interface CharacterTemplate {
  // Identity
  character: string; // The displayed character (e.g., "A", "5")
  category: Category; // Which collection this belongs to
  displayName?: string; // Optional phonetic name ("Ay", "Five")

  // Geometry
  bounds: Bounds; // Bounding box for scaling
  strokes: StrokePath[]; // Ordered array of stroke guides
  totalStrokes: number; // Number of strokes required
}

type Category = 'number' | 'uppercase' | 'lowercase';

interface Bounds {
  width: number; // SVG coordinate space width
  height: number; // SVG coordinate space height
  viewBox: string; // SVG viewBox attribute
}

interface StrokePath {
  id: number; // Stroke order (1 = first stroke)
  path: string; // SVG path data (d attribute)
  startPoint: Point; // Where to begin tracing
  endPoint: Point; // Where the stroke ends
  guidePoints: Point[]; // Sampled points for validation
}
```

**Validation Rules**:

- `character` must be exactly one character
- `strokes` array must have at least 1 element
- Stroke `id` values must be sequential starting from 1

---

### 2. Point

Represents a 2D coordinate.

```typescript
interface Point {
  x: number;
  y: number;
}
```

---

### 3. Stroke

Represents a user's drawn stroke.

```typescript
interface Stroke {
  id: number; // Which stroke index this corresponds to
  points: Point[]; // Captured touch/mouse points
  isComplete: boolean; // Has user lifted finger/stylus?
  isValid: boolean | null; // null = not yet validated, true = correct, false = incorrect
  accuracy: number; // 0-1, percentage of points within tolerance
}

interface StrokeCreationParams {
  strokeId: number; // Template stroke id this corresponds to
  points: Point[];
}
```

**State Transitions**:

```
[Created] → [Drawing] → [Complete] → [Validated]
                  ↓           ↓
              [Abandoned]  [Correct / Incorrect]
```

---

### 4. DrawingSession

Represents the current tracing attempt for a single character.

```typescript
interface DrawingSession {
  // Template
  template: CharacterTemplate; // The character being traced

  // Progress
  strokes: Stroke[]; // Strokes drawn so far
  currentStrokeIndex: number; // Which stroke user should draw next (0 = first)
  isComplete: boolean; // Has user completed all required strokes?

  // Timestamps
  startedAt: number; // Session start timestamp
  lastActivityAt: number; // Last user interaction timestamp
}

interface DrawingSessionState {
  session: DrawingSession | null;
  isLoading: boolean;
  error: string | null;
}
```

**Validation Rules**:

- `currentStrokeIndex` must be ≤ `strokes.length`
- `isComplete` is true only when all strokes are validated as correct

---

### 5. Category

Represents a character collection for navigation.

```typescript
interface Category {
  id: Category;
  displayName: string; // "Numbers", "Uppercase", "Lowercase"
  characters: CharacterTemplate[]; // All characters in this category
}

interface CategoryMap {
  number: Category;
  uppercase: Category;
  lowercase: Category;
}
```

---

## State Management Structure

### Global Store (Zustand)

```typescript
interface AppStore {
  // Navigation state
  currentScreen: Screen;
  currentCategory: Category;
  currentCharacter: CharacterTemplate | null;

  // Drawing state
  session: DrawingSession | null;

  // Actions
  navigateToCategorySelection: () => void;
  selectCategory: (category: Category) => void;
  selectCharacter: (character: CharacterTemplate) => void;
  startStroke: (point: Point) => void;
  addStrokePoint: (point: Point) => void;
  endStroke: () => void;
  clearSession: () => void;
  nextCharacter: () => void;
  previousCharacter: () => void;
}

type Screen =
  | 'category-selection' // Choose Numbers/Letters
  | 'character-selection' // Choose A-Z or 0-9
  | 'tracing'; // Active tracing screen
```

---

## Component Props Contracts

### Canvas Component

```typescript
interface CanvasProps {
  template: CharacterTemplate;
  session: DrawingSession;
  onStrokeStart: (point: Point) => void;
  onStrokeMove: (point: Point) => void;
  onStrokeEnd: () => void;
  width: number;
  height: number;
}
```

### CharacterGuide Component

```typescript
interface CharacterGuideProps {
  template: CharacterTemplate;
  currentStrokeIndex: number; // Which stroke to highlight
  completedStrokes: number[]; // Which strokes are done
}
```

### StrokeFeedback Component

```typescript
interface StrokeFeedbackProps {
  stroke: Stroke;
  isVisible: boolean; // Only show for the most recent stroke
}
```

---

## Data Flow Diagrams

### 1. Character Selection Flow

```
[App Launch]
    ↓
[CategorySelection Screen]
    ↓ [User taps "Letters"]
[Load uppercase category]
    ↓
[CharacterGrid Screen]
    ↓ [User taps "A"]
[Load character "A" template]
    ↓
[Create new DrawingSession]
    ↓
[Tracing Screen]
```

### 2. Tracing Flow

```
[Tracing Screen - Initial State]
    ↓ [User touches canvas]
[Stroke starts - capture point]
    ↓ [User drags]
[Add points to current stroke]
    ↓ [User releases]
[Stroke ends - validate stroke]
    ↓ [Is stroke correct?]
    ├─ Yes → [Mark green, show success animation]
    └─ No  → [Mark red, show gentle shake]
    ↓ [Was this the last stroke?]
    ├─ Yes → [Show completion animation, enable Next button]
    └─ No  → [Highlight next stroke start point]
```

### 3. Navigation Flow

```
[Any Screen with Nav Buttons]
    ↓ [User taps "Next"]
    ├─ [Is there a next character?]
    │   ├─ Yes → [Load next character, reset session]
    │   └─ No  → [Loop to first character OR show Done screen]
    ↓ [User taps "Previous"]
    ├─ [Is there a previous character?]
    │   ├─ Yes → [Load previous character, reset session]
    │   └─ No  → [Stay on current character]
    ↓ [User taps "Back"]
    └──→ [Return to character selection]
```

---

## Constants & Configuration

### Validation Constants

```typescript
const VALIDATION_CONFIG = {
  TOLERANCE_PX: 25, // Distance tolerance for correct stroke
  MIN_ACCURACY: 0.7, // 70% of points must be within tolerance
  MIN_STROKE_LENGTH: 20, // Minimum pixels to register as stroke (ignore accidental taps)
  SIMPLIFICATION_TOLERANCE: 2, // Douglas-Peucker simplification
} as const;
```

### UI Constants

```typescript
const UI_CONFIG = {
  MIN_TOUCH_TARGET: 44, // Minimum touch target size (points)
  CANVAS_PADDING: 40, // Padding around character in canvas
  GUIDE_LINE_WIDTH: 8, // Width of dotted guide lines
  USER_STROKE_WIDTH: 12, // Width of user's drawn stroke
} as const;
```

### Colors

```typescript
const COLORS = {
  guide: 'rgba(150, 150, 150, 0.5)', // Dotted guide lines
  correct: '#4CAF50', // Green for correct strokes
  incorrect: '#FF5252', // Red for incorrect strokes
  highlight: '#2196F3', // Blue for current stroke highlight
  background: '#FFFFFF', // White canvas background
} as const;
```

---

## Asset File Organization

```
src/assets/characters/
├── numbers/
│   ├── 0.json
│   ├── 1.json
│   └── ... (0-9)
├── uppercase/
│   ├── A.json
│   ├── B.json
│   └── ... (A-Z)
└── lowercase/
    ├── a.json
    ├── b.json
    └── ... (a-z)

src/assets/sounds/
└── success.mp3

src/assets/icons/
└── ... (app icons for Capacitor)
```

Each character JSON file contains a `CharacterTemplate` object.

---

## Event Handlers

### Pointer Event Handlers

```typescript
interface PointerHandlers {
  onPointerDown: (e: PointerEvent) => void;
  onPointerMove: (e: PointerEvent) => void;
  onPointerUp: (e: PointerEvent) => void;
  onPointerCancel: (e: PointerEvent) => void;
}
```

### Keyboard Handlers (Accessibility)

```typescript
interface KeyboardHandlers {
  onNext: () => void; // Arrow right, Space
  onPrevious: () => void; // Arrow left
  onReset: () => void; // Escape, Delete
  onBack: () => void; // Escape (when no active session)
}
```
