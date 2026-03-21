# STRUCTURE.md - Little Writing

**Project**: Kids Handwriting Tracing App  
**Last Updated**: 2026-03-21

---

## 1. Directory Layout

```
/Users/huynhdung/src/tries/2026-03-20-little-writing/
├── .planning/
│   └── codebase/
│       ├── ARCHITECTURE.md          # This document
│       └── STRUCTURE.md             # Directory structure and conventions
├── specs/
│   └── 001-handwriting-tracing/     # Design specs and contracts
│       ├── spec.md
│       ├── plan.md
│       └── contracts/
├── src/
│   ├── components/                  # React components
│   │   ├── feedback/               # Visual feedback components
│   │   ├── layout/                 # App shell, ErrorBoundary
│   │   ├── navigation/             # Nav buttons, category/character selectors
│   │   ├── screens/                # Page-level screen components
│   │   ├── tracing/                # Canvas, guides, animations
│   │   └── ui/                     # Reusable UI primitives (Button, Card)
│   ├── hooks/                      # Custom React hooks
│   ├── lib/                        # Core library functions
│   │   ├── canvas/                 # Rendering, validation, touch handling
│   │   ├── feedback/               # Sound and visual feedback
│   │   └── templates/              # Character data and template utilities
│   ├── state/                      # Zustand store
│   ├── styles/                     # Theme, animations, global CSS
│   ├── types/                      # TypeScript type definitions
│   ├── assets/                     # Static assets
│   │   ├── characters/             # JSON character templates
│   │   │   ├── lowercase/          # a-z
│   │   │   ├── numbers/            # 0-9
│   │   │   └── uppercase/          # A-Z
│   │   └── sounds/                 # Audio files
│   ├── App.tsx                     # Root component
│   └── main.tsx                    # React entry point
├── tests/
│   ├── unit/                       # Unit tests for lib functions
│   ├── component/                  # React component tests
│   ├── integration/                # Feature integration tests
│   ├── e2e/                        # Playwright E2E tests
│   └── setup.ts                    # Test setup
├── index.html                      # HTML entry point
├── vite.config.ts                  # Vite build config
├── vitest.config.ts                # Vitest test config
├── tsconfig.json                   # TypeScript config
├── capacitor.config.ts             # Capacitor mobile config
└── justfile                        # Task runner recipes
```

---

## 2. Key File Locations

### 2.1 Entry Points

| Purpose     | File                                   | Description                            |
| ----------- | -------------------------------------- | -------------------------------------- |
| HTML Entry  | `/index.html`                          | Root HTML with viewport meta, root div |
| React Entry | `/src/main.tsx`                        | createRoot, StrictMode, global styles  |
| App Root    | `/src/App.tsx`                         | Renders AppLayout                      |
| Layout      | `/src/components/layout/AppLayout.tsx` | Screen routing, ErrorBoundary          |

### 2.2 Configuration Files

| Purpose     | File                   | Description                 |
| ----------- | ---------------------- | --------------------------- |
| Vite Config | `/vite.config.ts`      | Build, dev server, @/ alias |
| TypeScript  | `/tsconfig.json`       | Strict mode, path mapping   |
| Vitest      | `/vitest.config.ts`    | Test environment, coverage  |
| Linting     | `/.oxlintrc.json`      | oxlint rules                |
| Formatting  | `/.oxfmtrc.json`       | oxfmt rules                 |
| Capacitor   | `/capacitor.config.ts` | Mobile app config           |

### 2.3 State & Types

| Purpose | File                         | Description                          |
| ------- | ---------------------------- | ------------------------------------ |
| Store   | `/src/state/sessionStore.ts` | Zustand store (189 lines)            |
| Types   | `/src/types/index.ts`        | All TypeScript interfaces            |
| Theme   | `/src/styles/theme.ts`       | Colors, UI config, validation config |
| Globals | `/src/styles/globals.css`    | CSS reset, base styles               |

### 2.4 Core Library

| Domain     | File                                  | Description                                |
| ---------- | ------------------------------------- | ------------------------------------------ |
| Validation | `/src/lib/canvas/strokeValidator.ts`  | Point-to-segment distance (266 lines)      |
| Rendering  | `/src/lib/canvas/pathRenderer.ts`     | SVG parsing, Canvas2D (661 lines)          |
| Touch      | `/src/lib/canvas/touchHandler.ts`     | Pointer events, palm rejection (206 lines) |
| Characters | `/src/lib/templates/characterData.ts` | 62 character registry (247 lines)          |
| Sound      | `/src/lib/feedback/soundPlayer.ts`    | Web Audio API (160 lines)                  |

### 2.5 Character Assets

| Category  | Location                                  | Count    |
| --------- | ----------------------------------------- | -------- |
| Uppercase | `/src/assets/characters/uppercase/*.json` | 26 (A-Z) |
| Lowercase | `/src/assets/characters/lowercase/*.json` | 26 (a-z) |
| Numbers   | `/src/assets/characters/numbers/*.json`   | 10 (0-9) |

---

## 3. Naming Conventions

### 3.1 File Naming

| Type        | Convention                | Example                                 |
| ----------- | ------------------------- | --------------------------------------- |
| Components  | PascalCase.tsx            | `Canvas.tsx`, `TracingScreen.tsx`       |
| Hooks       | camelCase.ts              | `useTracing.ts`, `useCanvas.ts`         |
| Utils       | camelCase.ts              | `strokeValidator.ts`, `pathRenderer.ts` |
| Constants   | SCREAMING_SNAKE in config | `VALIDATION_CONFIG`, `COLORS`           |
| Interfaces  | PascalCase                | `CharacterTemplate`, `DrawingSession`   |
| CSS Modules | PascalCase.module.css     | `Button.module.css`                     |
| Tests       | name.test.ts              | `strokeValidator.test.ts`               |

### 3.2 Export Conventions

- **Named exports only** - no default exports
- Component filename matches component name
- Barrel exports in `index.ts` files for clean imports

```typescript
// ✅ Named export
export const Canvas: React.FC<Props> = () => { ... }

// ❌ No default exports
export default Canvas;  // NOT ALLOWED
```

### 3.3 Component Structure

```typescript
/**
 * Component description JSDoc
 *
 * Based on specs/... reference
 */

import type React from 'react';  // Type imports use 'import type'

// Define props interface above component
export interface Props {
  template: CharacterTemplate;
  onStrokeStart: (point: Point) => void;
}

// Use React.FC<Props> type
export const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  // Component logic
  return <div>...</div>;
};
```

---

## 4. Import Organization

```typescript
// 1. React
import React, { useState } from 'react';

// 2. External libraries
import { create } from 'zustand';

// 3. Internal (@/ alias)
import { validateStroke } from '@/lib/canvas/strokeValidator';
import type { Point } from '@/types';

// 4. Relative (only when necessary)
import { Button } from '../ui/Button';
import styles from './MyComponent.module.css';
```

---

## 5. Test Organization

| Test Type   | Location             | Pattern      | Example                     |
| ----------- | -------------------- | ------------ | --------------------------- |
| Unit        | `tests/unit/`        | `*.test.ts`  | `pathRenderer.test.ts`      |
| Component   | `tests/component/`   | `*.test.tsx` | `CategorySelector.test.tsx` |
| Integration | `tests/integration/` | `*.test.tsx` | `tracing-flow.test.tsx`     |
| E2E         | `tests/e2e/`         | `*.spec.ts`  | `tracing-screen.spec.ts`    |

---

## 6. Quick Reference: Finding Code

### By Feature

| Feature           | Primary Location                      |
| ----------------- | ------------------------------------- |
| Canvas Drawing    | `src/components/tracing/Canvas.tsx`   |
| Touch Handling    | `src/lib/canvas/touchHandler.ts`      |
| Stroke Validation | `src/lib/canvas/strokeValidator.ts`   |
| Screen Navigation | `src/components/layout/AppLayout.tsx` |
| State Management  | `src/state/sessionStore.ts`           |
| Character Data    | `src/lib/templates/characterData.ts`  |
| Sound Effects     | `src/lib/feedback/soundPlayer.ts`     |
| Theme Colors      | `src/styles/theme.ts`                 |

### By Data Type

| Type                | Definition       | Usage                    |
| ------------------- | ---------------- | ------------------------ |
| `Point`             | `types/index.ts` | Coordinates throughout   |
| `CharacterTemplate` | `types/index.ts` | Character data structure |
| `DrawingSession`    | `types/index.ts` | Active tracing state     |
| `AppStore`          | `types/index.ts` | Zustand store interface  |

---

## 7. Line Counts Summary

| File                 | Lines | Purpose                              |
| -------------------- | ----- | ------------------------------------ |
| `pathRenderer.ts`    | 661   | SVG path parsing, Canvas2D rendering |
| `characterData.ts`   | 247   | Character registry and navigation    |
| `strokeValidator.ts` | 266   | Point-to-segment validation          |
| `touchHandler.ts`    | 206   | Pointer events, palm rejection       |
| `sessionStore.ts`    | 189   | Zustand state management             |
| `soundPlayer.ts`     | 160   | Web Audio API playback               |
| `useTracing.ts`      | 165   | Tracing session hook                 |
| `Canvas.tsx`         | 344   | Main canvas component                |
| `TracingScreen.tsx`  | 129   | Tracing interface screen             |
| `useCanvas.ts`       | 169   | Canvas rendering hook                |
| `types/index.ts`     | 109   | All TypeScript types                 |
