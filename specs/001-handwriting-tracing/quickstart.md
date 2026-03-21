# Quickstart Guide: Kids Handwriting Tracing App

**Feature**: 001-handwriting-tracing
**Last Updated**: 2026-03-20

---

## Overview

This guide helps you get started with development of the Kids Handwriting Tracing App. The app is built with React, TypeScript, and Capacitor for iPad deployment.

---

## Prerequisites

- **Node.js**: 18.x or later
- **Bun** (recommended for faster package operations) or npm
- **iOS Development** (for iPad deployment): Xcode 15+, Mac with Apple Silicon
- **Web Browser**: For development testing

---

## Initial Setup

### 1. Install Dependencies

```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install
```

### 2. Initialize Capacitor (iOS)

```bash
# Install iOS platform
npm install @capacitor/ios
npx cap add ios

# Sync assets to iOS project
npx cap sync
```

### 3. Start Development Server

```bash
# Web development (fastest iteration)
bun run dev

# Or
npm run dev
```

The app will be available at `http://localhost:5173`

---

## Project Structure

```
src/
├── components/           # React UI components
│   ├── ui/              # Reusable UI (buttons, cards)
│   ├── tracing/         # Tracing-specific components
│   ├── navigation/      # Navigation components
│   └── layout/          # App layout
├── lib/                 # Core business logic
│   ├── canvas/          # Canvas utilities
│   ├── templates/       # Character template loading
│   └── feedback/        # Feedback generation
├── hooks/               # Custom React hooks
├── state/               # Zustand global state
├── styles/              # Theme and animations
└── assets/              # Static assets
    ├── characters/      # Character templates (JSON)
    └── sounds/          # Sound effects
```

---

## Key Concepts

### Character Templates

Each character (A-Z, 0-9) is defined as a JSON file with stroke order data:

```typescript
// Example: src/assets/characters/uppercase/A.json
{
  "character": "A",
  "category": "uppercase",
  "bounds": { "width": 100, "height": 100, "viewBox": "0 0 100 100" },
  "strokes": [
    {
      "id": 1,
      "path": "M 50 20 L 20 80",
      "startPoint": { "x": 50, "y": 20 },
      "endPoint": { "x": 20, "y": 80 },
      "guidePoints": [{ "x": 50, "y": 20 }, { "x": 35, "y": 50 }, { "x": 20, "y": 80 }]
    },
    {
      "id": 2,
      "path": "M 50 20 L 80 80",
      "startPoint": { "x": 50, "y": 20 },
      "endPoint": { "x": 80, "y": 80 },
      "guidePoints": [{ "x": 50, "y": 20 }, { "x": 65, "y": 50 }, { "x": 80, "y": 80 }]
    },
    {
      "id": 3,
      "path": "M 35 60 L 65 60",
      "startPoint": { "x": 35, "y": 60 },
      "endPoint": { "x": 65, "y": 60 },
      "guidePoints": [{ "x": 35, "y": 60 }, { "x": 50, "y": 60 }, { "x": 65, "y": 60 }]
    }
  ]
}
```

### Stroke Validation

Strokes are validated using point-to-segment distance:

```typescript
// 70% of points must be within ±25px of the guide path
const accuracy = pointsWithinTolerance / totalPoints;
const isCorrect = accuracy >= 0.7;
```

### State Management Flow

```
[User selects character]
    ↓
[AppStore.selectCharacter]
    ↓
[useTracing hook creates DrawingSession]
    ↓
[Canvas captures pointer events]
    ↓
[Strokes validated on pointerup]
    ↓
[Feedback shown, session updated]
```

---

## Development Workflow

### 1. Add a New Character Template

1. Create SVG path data for the character
2. Split into individual strokes (each stroke = one continuous line)
3. Create JSON file in appropriate category folder
4. Add guide points for validation
5. Test by loading in dev server

```bash
# Template locations
src/assets/characters/numbers/0-9.json
src/assets/characters/uppercase/A-Z.json
src/assets/characters/lowercase/a-z.json
```

### 2. Test Tracing Logic

```bash
# Run unit tests for validation
bun test strokeValidator

# Run component tests for Canvas
bun test Canvas.test
```

### 3. Test on iPad

```bash
# Build for production
bun run build

# Sync to iOS
npx cap sync

# Open in Xcode
npx cap open ios

# Then in Xcode: Run > iPad Simulator or connected device
```

### 4. Debug Performance

```bash
# Run with performance profiling
bun run dev --profile

# Check Chrome DevTools > Performance tab
# Look for:
# - Frame rate (should be 60fps)
# - Long tasks (>16ms indicates lag)
# - Memory usage
```

---

## Common Tasks

### Change Validation Tolerance

Edit `src/lib/validation/strokeValidator.ts`:

```typescript
const VALIDATION_CONFIG = {
  TOLERANCE_PX: 25, // Increase for easier validation
  MIN_ACCURACY: 0.7, // Decrease for easier validation
} as const;
```

### Add a New Sound Effect

1. Place MP3 file in `src/assets/sounds/`
2. Import in `src/lib/feedback/soundPlayer.ts`
3. Call `playSuccessSound()` or add new function

### Customize Colors

Edit `src/styles/theme.ts`:

```typescript
export const COLORS = {
  guide: 'rgba(150, 150, 150, 0.5)',
  correct: '#4CAF50',
  incorrect: '#FF5252',
  // ...
} as const;
```

---

## Troubleshooting

### Canvas Not Rendering

- Check browser console for errors
- Verify `canvas.width` and `canvas.height` are set
- Ensure `requestAnimationFrame` loop is running
- Check device pixel ratio scaling

### Strokes Not Validating

- Check guide points in character template
- Verify tolerance settings
- Log stroke points to console for debugging
- Check if stroke order matches template

### iPad Build Issues

```bash
# Clean and rebuild
rm -rf ios/build
npx cap sync ios
npx cap open ios

# In Xcode: Product > Clean Build Folder
```

### Performance Issues

- Reduce guide point sampling in templates
- Enable stroke simplification (Douglas-Peucker)
- Check for memory leaks (unclosed event listeners)
- Profile with React DevTools

---

## Useful Commands

```bash
# Development
bun run dev              # Start dev server
bun run build            # Build for production
bun run test             # Run all tests
bun run test:unit        # Unit tests only
bun run lint             # Lint code
bun run typecheck        # TypeScript check

# Capacitor/iOS
npx cap sync             # Sync web assets to native
npx cap open ios         # Open Xcode
npx cap copy             # Copy built files to native

# Quality
bun run format           # Format with Prettier
bun run format:check     # Check formatting
```

---

## Constitution Checklist

Before committing changes, verify:

- [ ] Touch targets are ≥44x44 points
- [ ] Canvas maintains 60fps during drawing
- [ ] Validation uses relaxed tolerance (±25px)
- [ ] Colors are bright and child-friendly
- [ ] UI is minimal and not cluttered
- [ ] No unnecessary features added (YAGNI)
- [ ] Success feedback is immediate and encouraging
- [ ] Code follows TypeScript strict mode

---

## Resources

- **Constitution**: `.specify/memory/constitution.md`
- **Data Model**: `specs/001-handwriting-tracing/data-model.md`
- **UI Contracts**: `specs/001-handwriting-tracing/contracts/ui-contracts.md`
- **Research**: `specs/001-handwriting-tracing/research.md`

---

## Getting Help

1. Check the constitution for principles and standards
2. Review the data model for entity definitions
3. Check UI contracts for component interfaces
4. Review research for technology decisions
5. Ask a question in the team chat

---

**Happy coding! Remember: we're building for 5-year-olds. Keep it simple, fun, and forgiving.**
