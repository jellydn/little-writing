# Research: Kids Handwriting Tracing App

**Feature**: 001-handwriting-tracing
**Date**: 2026-03-20
**Purpose**: Technology research and design decisions for implementation

## Overview

This document captures research findings and decisions for the Kids Handwriting Tracing App. All clarifications from the Technical Context have been resolved.

---

## 1. Character Template Format

### Decision: SVG with Embedded Stroke Data

**Rationale**: SVG is natively scalable, can be rendered to Canvas, and allows embedding custom stroke order data as metadata. Several open-source handwriting font projects provide SVG files that can be extended.

**Format Specification**:

```typescript
interface CharacterTemplate {
  character: string; // e.g., "A", "5"
  category: 'number' | 'uppercase' | 'lowercase';
  strokes: StrokePath[]; // Ordered array of strokes
  bounds: { width: number; height: number };
}

interface StrokePath {
  id: number; // Stroke order (1, 2, 3...)
  path: string; // SVG path data (d attribute)
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  guidePoints: Point[]; // Array of points for validation
}
```

**Template Sources**:

- Open-source SVG fonts can be converted to templates
- For MVP: Create 62 templates manually using SVG path tools
- Each stroke can be drawn as a separate SVG path element

**Implementation Approach**:

- Store templates as JSON files in `src/assets/characters/`
- Use SVG `<path>` d attribute for rendering guide lines
- Extract stroke order from the sequence of paths in the template

---

## 2. Stroke Validation Algorithm

### Decision: Point-to-Segment Distance with Relaxed Tolerance

**Rationale**: Distance-based validation is simple, performant, and aligns with the "relaxed tolerance" principle. No AI or complex shape matching needed for MVP.

**Algorithm**:

1. User draws a stroke → capture array of {x, y} points
2. For each user point, find minimum distance to the guide path
3. Calculate percentage of points within tolerance distance (±20-30px)
4. If ≥70% of points are within tolerance → stroke is "correct"

**Pseudocode**:

```typescript
function validateStroke(
  userPoints: Point[],
  guidePath: StrokePath
): ValidationResult {
  let pointsWithinTolerance = 0;
  const tolerance = 25; // pixels

  for (const point of userPoints) {
    const distance = pointToSegmentDistance(point, guidePath);
    if (distance <= tolerance) {
      pointsWithinTolerance++;
    }
  }

  const accuracy = pointsWithinTolerance / userPoints.length;
  return {
    isCorrect: accuracy >= 0.7,
    accuracy: accuracy,
    feedbackColor: accuracy >= 0.7 ? 'green' : 'red',
  };
}
```

**Libraries**: Simple geometric distance calculation (no heavy libraries needed)

---

## 3. Canvas Performance Optimization

### Decision: Single Canvas Layer with requestAnimationFrame

**Rationale**: A single canvas with requestAnimationFrame ensures 60fps rendering. Complex layered approaches add unnecessary complexity for this use case.

**Optimization Strategies**:

1. **Render Loop**:

   ```typescript
   function renderLoop() {
     ctx.clearRect(0, 0, width, height);
     drawCharacterGuide(); // Static guide lines
     drawUserStrokes(); // User's drawn strokes
     drawCurrentStroke(); // Currently drawing stroke
     requestAnimationFrame(renderLoop);
   }
   ```

2. **Dirty Rectangles** (optional optimization): Only re-draw changed regions if performance issues arise

3. **Stroke Simplification**: Reduce number of points captured using Douglas-Peucker algorithm (simplification tolerance ~2px)

4. **Device Pixel Ratio**: Scale canvas for Retina displays
   ```typescript
   const dpr = window.devicePixelRatio || 1;
   canvas.width = width * dpr;
   canvas.height = height * dpr;
   ctx.scale(dpr, dpr);
   ```

**Monitoring**: Measure fps using `performance.now()` in development

---

## 4. Touch Input Handling

### Decision: Unified Pointer Events with Stylus Detection

**Rationale**: Pointer Events API provides unified handling for mouse, touch, and pen. Capacitor enhances this with additional stylus capabilities.

**Implementation**:

```typescript
canvas.addEventListener('pointerdown', handleStart);
canvas.addEventListener('pointermove', handleMove);
canvas.addEventListener('pointerup', handleEnd);

function handleStart(e: PointerEvent) {
  // Detect input type
  const isStylus = e.pointerType === 'pen';
  const pressure = e.pressure; // 0-1 for stylus

  // Palm rejection: ignore large contact areas (likely palm)
  if (e.width > 50 && e.height > 50) {
    return; // Ignore potential palm touch
  }

  // Begin stroke capture
  currentStroke = {
    points: [{ x: e.offsetX, y: e.offsetY }],
    isStylus: isStylus,
  };
}
```

**Capacitor Integration**:

- Use `@capacitor/clipboard` only if needed (not required for MVP)
- Capacitor automatically provides touch optimizations for iOS

**Edge Cases Handled**:

- Multi-touch: Ignore secondary touches during drawing
- Accidental taps: Require minimum stroke length (~20px movement)
- Lifted stylus: `pointerup` event ends the stroke

---

## 5. Sound Playback

### Decision: HTML5 Audio API with Simple MP3

**Rationale**: No complex audio engine needed. A simple success sound is sufficient for MVP.

**Implementation**:

```typescript
const successSound = new Audio('/sounds/success.mp3');
successSound.volume = 0.5; // Not too loud for children

function playSuccessSound() {
  successSound.currentTime = 0;
  successSound.play().catch((e) => {
    // Handle autoplay restrictions (play on first user interaction)
  });
}
```

**Asset**: Short, cheerful sound effect (~1 second)

---

## 6. Capacitor Setup & iPad Deployment

### Decision: Capacitor 6.x with Vite Build

**Rationale**: Capacitor 6 has excellent React support, Vite provides fast development experience, and the combination is well-documented.

**Setup Commands**:

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios
npx cap init "Handwriting App" "com.example.handwriting"
npx cap add ios
```

**Configuration** (capacitor.config.ts):

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.handwriting',
  appName: 'Handwriting Tracing',
  webDir: 'dist',
  bundledWebRuntime: false,
  ios: {
    scheme: 'App',
    splashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
```

**Development Workflow**:

1. `npm run dev` - Vite dev server for web testing
2. `npm run build` - Build for production
3. `npx cap sync` - Sync assets to native project
4. `npx cap open ios` - Open Xcode for device testing

---

## 7. State Management

### Decision: Zustand for Global State, React useState for Component State

**Rationale**: Zustand is lightweight, has excellent TypeScript support, and avoids Redux boilerplate. Component-level state (e.g., currently drawing stroke) stays in React state.

**Store Structure**:

```typescript
interface SessionStore {
  // Current session
  currentCharacter: CharacterTemplate | null;
  currentCategory: 'number' | 'uppercase' | 'lowercase';
  completedStrokes: number[];

  // Actions
  selectCharacter: (char: CharacterTemplate) => void;
  completeStroke: (strokeId: number) => void;
  resetCharacter: () => void;
  nextCharacter: () => void;
  previousCharacter: () => void;
}
```

---

## 8. Animation & Visual Feedback

### Decision: CSS Animations + Framer Motion for Complex Animations

**Rationale**: CSS animations for simple effects (shake, pulse), Framer Motion for coordinated sequences (star appearance, confetti).

**Animations**:

- Success: Star scales up with bounce effect
- Error: Gentle shake of the stroke
- Stroke complete: Green color transition (200ms ease-in-out)

---

## Summary of Key Decisions

| Area                | Decision                                    | Rationale                                    |
| ------------------- | ------------------------------------------- | -------------------------------------------- |
| Character Templates | SVG with embedded stroke data (JSON)        | Scalable, can embed metadata                 |
| Validation          | Point-to-segment distance (±25px tolerance) | Simple, performant, sufficient for MVP       |
| Canvas              | Single canvas with requestAnimationFrame    | Ensures 60fps, simpler than layered approach |
| Touch Input         | Pointer Events API with palm rejection      | Unified handling, Capacitor compatible       |
| Sound               | HTML5 Audio API with MP3 asset              | Sufficient for single success sound          |
| Mobile Wrapper      | Capacitor 6.x with Vite                     | Well-documented React integration            |
| State Management    | Zustand + React useState                    | Lightweight, good TypeScript support         |
| Animations          | CSS + Framer Motion                         | CSS for simple, Framer for complex           |

---

## Open Questions (All Resolved)

| Question                              | Resolution                                   |
| ------------------------------------- | -------------------------------------------- |
| How to represent stroke order?        | Ordered array of strokes in template         |
| How strict should validation be?      | 70% accuracy with ±25px tolerance            |
| Which drawing library?                | react-konva for declarative canvas API       |
| How to handle iPad-specific features? | Capacitor provides native access when needed |
| How to organize 62 character files?   | Group by category in assets/characters/      |
