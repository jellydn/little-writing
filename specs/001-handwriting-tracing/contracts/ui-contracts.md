# UI Contracts: Kids Handwriting Tracing App

**Feature**: 001-handwriting-tracing
**Date**: 2026-03-20
**Purpose**: Component interface contracts and UI behavior specifications

---

## Overview

This document defines the contracts for UI components in the Kids Handwriting Tracing App. These contracts specify the public interface, behavior, and state management requirements for each major component.

**Note**: This is an internal application, so contracts are UI-focused rather than external API contracts.

---

## Screen Contracts

### CategorySelectionScreen

**Purpose**: First screen displayed when app opens. Allows choosing between Numbers and Letters.

**Component Interface**:

```typescript
interface CategorySelectionScreenProps {
  onSelectCategory: (category: Category) => void;
}
```

**Behavior Contract**:

- Displays two large cards: "Numbers" and "Letters"
- Each card is tappable with minimum 44x44 point touch target
- On tap, calls `onSelectCategory` with the selected category
- No other navigation or actions available

**Visual Requirements**:

- Bright, friendly colors
- Large, clear text (minimum 18pt font)
- Icons or representative images for each category

---

### CharacterSelectionScreen

**Purpose**: Grid of all characters in the selected category.

**Component Interface**:

```typescript
interface CharacterSelectionScreenProps {
  category: Category; // Current category
  characters: CharacterTemplate[]; // All characters in category
  onSelectCharacter: (char: CharacterTemplate) => void;
  onBack: () => void; // Return to category selection
}
```

**Behavior Contract**:

- Displays grid of character cards (A-Z or 0-9)
- Each card shows the character prominently
- On tap, calls `onSelectCharacter` with the selected template
- Back button returns to category selection
- Grid should be scrollable if needed

**Visual Requirements**:

- Grid layout (3-4 columns on iPad)
- Each card: minimum 88x88 points (2x minimum touch target)
- Highlight visual feedback on tap

---

### TracingScreen

**Purpose**: Main tracing interface where user draws the character.

**Component Interface**:

```typescript
interface TracingScreenProps {
  template: CharacterTemplate;
  session: DrawingSession;
  onStrokeStart: (point: Point) => void;
  onStrokeMove: (point: Point) => void;
  onStrokeEnd: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onBack: () => void;
  onClear: () => void;
}
```

**Behavior Contract**:

- Displays character outline with stroke guides
- Captures touch/stylus input
- Provides real-time visual feedback
- Shows success animation when all strokes complete
- Navigation buttons (Next, Previous, Back, Clear)

**Visual Requirements**:

- Large character centered on screen
- Minimal UI controls (no distractions)
- Large touch targets (44x44 minimum)

---

## Component Contracts

### Canvas

**Purpose**: Renders the character guide and captures user drawing.

**Component Interface**:

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

// Emits (via callbacks):
interface CanvasEvents {
  strokeStarted: Point; // First point of new stroke
  strokeMoved: Point; // Each subsequent point
  strokeEnded: void; // Stroke completed
}
```

**Behavior Contract**:

- Renders character guide (dotted lines for all strokes)
- Highlights current stroke start point
- Renders user's drawn strokes (color-coded by validity)
- Captures pointer events (touch, mouse, pen)
- Implements palm rejection for stylus
- Re-renders on each frame (60fps)

**Rendering Order** (bottom to top):

1. Canvas background (white)
2. Character guide lines (gray, dotted)
3. Completed strokes (green)
4. Current stroke (drawing in progress)
5. Stroke feedback (green/red overlay)

---

### CharacterGuide

**Purpose**: Renders the character outline and stroke path indicators.

**Component Interface**:

```typescript
interface CharacterGuideProps {
  template: CharacterTemplate;
  currentStrokeIndex: number;
  completedStrokes: number[];
}

// Visual elements rendered:
// - Character outline (faded, background)
// - Stroke guide paths (dotted lines)
// - Start point indicators (colored dots)
// - Directional arrows (optional)
// - Current stroke highlight (pulsing animation)
```

**Behavior Contract**:

- Renders all stroke paths from the template
- Current stroke (at `currentStrokeIndex`) is highlighted
- Completed strokes are dimmed or solid green
- Start point of current stroke has a pulsing indicator
- No interaction (pure display component)

---

### StrokeFeedback

**Purpose**: Visual feedback overlay for stroke validation.

**Component Interface**:

```typescript
interface StrokeFeedbackProps {
  stroke: Stroke;
  isVisible: boolean;
}

// Displays:
// - Color overlay (green/red) on the stroke
// - Shake animation for incorrect strokes
// - Glow effect for correct strokes
```

**Behavior Contract**:

- Shows only when `isVisible` is true
- Green color with subtle glow if `stroke.isValid === true`
- Red color with shake animation if `stroke.isValid === false`
- Auto-hides after animation completes (2 seconds)

---

### SuccessAnimation

**Purpose**: Celebration animation when character is completed.

**Component Interface**:

```typescript
interface SuccessAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
}

// Displays:
// - Large star emoji or SVG
// - Scale and bounce animation
// - Confetti particles (optional)
```

**Behavior Contract**:

- Shows only when `isVisible` is true
- Plays animation sequence (scale up, bounce, settle)
- Calls `onComplete` after animation finishes
- Plays success sound via SoundPlayer

---

### NavButtons

**Purpose**: Navigation controls for the tracing screen.

**Component Interface**:

```typescript
interface NavButtonsProps {
  hasNext: boolean; // Is there a next character?
  hasPrevious: boolean; // Is there a previous character?
  isSessionComplete: boolean; // Has user completed current character?
  onNext: () => void;
  onPrevious: () => void;
  onBack: () => void;
  onClear: () => void;
}
```

**Behavior Contract**:

- "Next" button enabled only when `isSessionComplete` is true
- "Previous" button always enabled (unless at first character)
- "Back" button always enabled
- "Clear" button always enabled
- All buttons meet minimum 44x44 touch target

---

## Hook Contracts

### useTracing

**Purpose**: Manages tracing session state and logic.

**Hook Interface**:

```typescript
interface UseTracingReturn {
  // State
  session: DrawingSession | null;

  // Actions
  startStroke: (point: Point) => void;
  addStrokePoint: (point: Point) => void;
  endStroke: () => void;
  clearSession: () => void;

  // Computed
  currentStrokeIndex: number;
  isComplete: boolean;
  accuracy: number;
}

function useTracing(template: CharacterTemplate): UseTracingReturn;
```

**Behavior Contract**:

- Creates new `DrawingSession` when `template` changes
- Validates stroke on `endStroke`
- Updates `currentStrokeIndex` after each completed stroke
- `isComplete` is true when all required strokes are validated as correct

---

### useCanvas

**Purpose**: Manages canvas rendering lifecycle.

**Hook Interface**:

```typescript
interface UseCanvasReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  clear: () => void;
  render: (elements: RenderableElement[]) => void;
}

function useCanvas(props: { width: number; height: number }): UseCanvasReturn;
```

**Behavior Contract**:

- Sets up canvas with proper device pixel ratio scaling
- Returns reference for DOM attachment
- `clear()` empties the canvas
- `render()` draws provided elements in order

---

### useValidation

**Purpose**: Real-time stroke validation.

**Hook Interface**:

```typescript
interface UseValidationReturn {
  validateStroke: (stroke: Stroke, guide: StrokePath) => ValidationResult;
  isWithinTolerance: (point: Point, path: StrokePath) => boolean;
}

function useValidation(config: {
  tolerancePx: number;
  minAccuracy: number;
}): UseValidationReturn;
```

**Behavior Contract**:

- `validateStroke` returns accuracy percentage and boolean validity
- `isWithinTolerance` checks if a point is within distance of a path
- Uses point-to-segment distance algorithm

---

## Store Contract (Zustand)

### AppStore

**Store Interface**:

```typescript
interface AppStore {
  // State
  currentScreen: Screen;
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
  nextCharacter: () => void;
  previousCharacter: () => void;
}
```

**Behavior Contract**:

- `selectCharacter` creates a new `DrawingSession` for the character
- `startStroke` creates a new `Stroke` and adds to session
- `endStroke` validates the completed stroke
- `nextCharacter` loads the next character in sequence (loops if at end)
- `previousCharacter` loads the previous character (stops at beginning)

---

## Asset Contracts

### Character Template JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["character", "category", "bounds", "strokes"],
  "properties": {
    "character": {
      "type": "string",
      "minLength": 1,
      "maxLength": 1
    },
    "category": {
      "type": "string",
      "enum": ["number", "uppercase", "lowercase"]
    },
    "displayName": {
      "type": "string"
    },
    "bounds": {
      "type": "object",
      "required": ["width", "height", "viewBox"],
      "properties": {
        "width": { "type": "number" },
        "height": { "type": "number" },
        "viewBox": { "type": "string" }
      }
    },
    "strokes": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["id", "path", "startPoint", "endPoint"],
        "properties": {
          "id": { "type": "number" },
          "path": { "type": "string" },
          "startPoint": {
            "type": "object",
            "properties": {
              "x": { "type": "number" },
              "y": { "type": "number" }
            }
          },
          "endPoint": {
            "type": "object",
            "properties": {
              "x": { "type": "number" },
              "y": { "type": "number" }
            }
          },
          "guidePoints": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "x": { "type": "number" },
                "y": { "type": "number" }
              }
            }
          }
        }
      }
    }
  }
}
```

---

## Accessibility Contracts

### Keyboard Navigation

| Key         | Action                                     |
| ----------- | ------------------------------------------ |
| Arrow Right | Next character                             |
| Arrow Left  | Previous character                         |
| Escape      | Clear current drawing / Back               |
| Space       | Start stroke (when tracing screen focused) |
| Enter       | Confirm / Next                             |

### Screen Reader Support

- All interactive elements have `aria-label`
- Canvas has fallback text: "Tracing canvas for character {X}"
- Navigation buttons describe their action: "Go to next character"
- Feedback states announced: "Stroke correct", "Stroke incorrect, try again"

---

## Testing Contracts

### Unit Test Requirements

Each utility function must have unit tests covering:

- Happy path (expected inputs)
- Edge cases (empty arrays, boundary values)
- Error conditions (invalid inputs)

### Component Test Requirements

Each component must have tests covering:

- Render with default props
- Render with various prop combinations
- User interaction callbacks
- State changes

### Integration Test Requirements

Critical user flows must have E2E tests:

- Complete tracing of one character
- Navigate between characters
- Clear and retry character
- Category selection

---

## Performance Contracts

### Frame Rate

- Canvas rendering MUST maintain 60fps during active drawing
- Measure using `performance.now()` between frames
- Alert if frame time exceeds 16.67ms

### Touch Latency

- Time from `pointerdown` to visual feedback < 50ms
- Time from `pointermove` to stroke update < 16ms

### Asset Loading

- Character template loading < 100ms (from local storage)
- App startup to interactive < 2 seconds
