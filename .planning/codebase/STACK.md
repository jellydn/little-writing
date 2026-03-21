# Technology Stack

> Technology stack analysis for Little Writing - Kids Handwriting Tracing App
> Generated: 2026-03-21

## Overview

A client-side React application for children's handwriting practice. Built as a PWA with optional native iOS deployment via Capacitor. No backend or external APIs required.

---

## Languages

| Language   | Version | Purpose                                |
| ---------- | ------- | -------------------------------------- |
| TypeScript | 5.3.3   | Primary language (strict mode enabled) |
| CSS3       | -       | Styling with CSS Modules               |
| HTML5      | -       | Index template and semantic markup     |

---

## Runtime

| Runtime | Version | Purpose                           |
| ------- | ------- | --------------------------------- |
| Bun     | Latest  | Package manager and script runner |
| Node.js | ^18+    | Compatible runtime (via Bun)      |

---

## Core Frameworks & Libraries

### Production Dependencies

| Package     | Version  | Purpose                                                                    |
| ----------- | -------- | -------------------------------------------------------------------------- |
| react       | ^18.2.0  | UI framework                                                               |
| react-dom   | ^18.2.0  | React DOM renderer                                                         |
| konva       | ^9.2.0   | HTML5 Canvas library (alternative considered)                              |
| react-konva | ^18.2.10 | React bindings for Konva — used for canvas rendering in CharacterGuide.tsx |
| zustand     | ^4.4.7   | State management                                                           |

### Build Toolchain

| Package              | Version | Purpose                        |
| -------------------- | ------- | ------------------------------ |
| vite                 | 6       | Development server and bundler |
| @vitejs/plugin-react | 4       | React HMR and JSX transform    |
| typescript           | ^5.3.3  | Type checking                  |

---

## Development Tools

### Testing

| Package                     | Version | Purpose                      |
| --------------------------- | ------- | ---------------------------- |
| vitest                      | ^1.1.0  | Unit/integration test runner |
| @vitest/coverage-v8         | ^1.6.0  | Code coverage                |
| @testing-library/react      | ^14.1.2 | React component testing      |
| @testing-library/jest-dom   | ^6.1.4  | DOM assertions               |
| @testing-library/user-event | ^14.5.1 | User interaction simulation  |
| jsdom                       | ^23.0.1 | DOM environment for tests    |
| playwright                  | ^1.40.1 | E2E testing                  |
| @playwright/test            | ^1.58.2 | Playwright test runner       |

### Code Quality

| Package | Version | Purpose                      |
| ------- | ------- | ---------------------------- |
| oxlint  | ^1.56.0 | JavaScript/TypeScript linter |
| oxfmt   | ^0.41.0 | Code formatter               |

### Mobile Development

| Package         | Version | Purpose              |
| --------------- | ------- | -------------------- |
| @capacitor/core | ^6.0.0  | Native app runtime   |
| @capacitor/ios  | ^6.0.0  | iOS platform support |
| @capacitor/cli  | ^6.0.0  | Capacitor CLI tools  |

---

## Configuration Files

### TypeScript

| File                 | Purpose                                                |
| -------------------- | ------------------------------------------------------ |
| `tsconfig.json`      | Main TypeScript config (strict mode, ES2020, DOM libs) |
| `tsconfig.node.json` | Node-specific config for Vite                          |

### Vite

| File               | Purpose                                           |
| ------------------ | ------------------------------------------------- |
| `vite.config.ts`   | Dev server, build, path aliases (@/), CSS modules |
| `vitest.config.ts` | Test configuration (jsdom, coverage, aliases)     |

### Code Quality

| File             | Purpose                                        |
| ---------------- | ---------------------------------------------- |
| `.oxlintrc.json` | Lint rules (react, typescript plugins)         |
| `.oxfmtrc.json`  | Format config (semi, singleQuote, tabWidth: 2) |

### Mobile

| File                   | Purpose                                      |
| ---------------------- | -------------------------------------------- |
| `capacitor.config.ts`  | Capacitor config (appId, webDir, iOS scheme) |
| `ios/App/Podfile.lock` | iOS dependencies (Capacitor 6.2.1)           |

### CI/CD

| File                           | Purpose                               |
| ------------------------------ | ------------------------------------- |
| `.github/workflows/ci.yml`     | Quality checks, unit tests, E2E tests |
| `.github/workflows/deploy.yml` | Build and deploy to GitHub Pages      |
| `renovate.json`                | Dependency update automation          |

### Task Runner

| File       | Purpose                                     |
| ---------- | ------------------------------------------- |
| `justfile` | Task runner recipes (dev, test, build, ios) |

---

## Project Structure

```
src/
├── components/          # React components
│   ├── feedback/        # Feedback components
│   ├── layout/          # Layout components
│   ├── navigation/      # Navigation components
│   ├── screens/         # Screen-level components
│   ├── tracing/         # Canvas and tracing components
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
│   ├── canvas/          # Canvas rendering and validation
│   ├── feedback/        # Sound and visual feedback
│   └── templates/       # Character template data
├── state/               # Zustand store
├── styles/              # Global styles and theme
├── types/               # TypeScript type definitions
└── assets/              # Static assets (sounds, characters)

tests/
├── unit/                # Unit tests
├── component/           # Component tests
├── integration/         # Integration tests
├── e2e/                 # Playwright E2E tests
└── setup.ts             # Test setup and mocks
```

---

## Key Technical Decisions

1. **No Backend Required**: Pure client-side application with no server dependencies
2. **State Management**: Zustand for simple, lightweight global state
3. **Canvas Rendering**: HTML5 Canvas API (not Konva, despite dependency)
4. **Mobile Strategy**: Capacitor for native iOS wrapper
5. **Audio**: Web Audio API for sound feedback (no external audio libraries)
6. **Storage**: No persistent storage; in-memory session state only
7. **Styling**: CSS Modules + global CSS (no CSS-in-JS library)

---

## Browser APIs Used

- **Canvas API**: 2D rendering context for drawing
- **Pointer Events**: Touch, mouse, and stylus input handling
- **Web Audio API**: Sound playback and audio context management
- **RequestAnimationFrame**: Smooth 60fps canvas rendering
- **Intersection Observer**: Mocked in tests only
