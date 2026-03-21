# STACK.md - Technology Stack

**Project**: Little Writing - Kids Handwriting Tracing App  
**Last Updated**: 2026-03-20

## Languages

| Language   | Version     | Purpose                                 |
| ---------- | ----------- | --------------------------------------- |
| TypeScript | 5.3.3       | Primary language - type-safe JavaScript |
| HTML       | HTML5       | Markup (index.html)                     |
| CSS        | CSS Modules | Component-scoped styling                |

## Runtime & Environment

- **Runtime**: Browser (Web) via Vite dev server
- **Target**: ES2020 (JavaScript/TypeScript compilation target)
- **Module System**: ESNext with bundler resolution

## Core Frameworks

| Framework   | Version | Purpose                        |
| ----------- | ------- | ------------------------------ |
| React       | 18.2.0  | UI component framework         |
| react-konva | 18.2.10 | Canvas rendering with Konva.js |
| konva       | 9.2.0   | 2D canvas library for drawing  |
| Zustand     | 4.4.7   | Lightweight state management   |

## Build & Development Tools

| Tool                 | Version | Purpose                       |
| -------------------- | ------- | ----------------------------- |
| Vite                 | 6       | Build tool and dev server     |
| @vitejs/plugin-react | 4       | React plugin for Vite         |
| TypeScript           | 5.3.3   | Type checking and compilation |

## Mobile Framework

| Framework       | Version | Purpose                      |
| --------------- | ------- | ---------------------------- |
| Capacitor       | 6.0.0   | Native iOS/Android wrapper   |
| @capacitor/cli  | 6.0.0   | Capacitor command-line tools |
| @capacitor/core | 6.0.0   | Capacitor runtime            |
| @capacitor/ios  | 6.0.0   | iOS native platform          |

## Testing Stack

| Tool                        | Version | Purpose                    |
| --------------------------- | ------- | -------------------------- |
| Vitest                      | 1.1.0   | Unit and component testing |
| @vitest/coverage-v8         | 1.6.0   | V8-based code coverage     |
| Playwright                  | 1.40.1  | End-to-end browser testing |
| @playwright/test            | 1.58.2  | Playwright test framework  |
| @testing-library/react      | 14.1.2  | React component testing    |
| @testing-library/jest-dom   | 6.1.4   | DOM assertion matchers     |
| @testing-library/user-event | 14.5.1  | Simulate user interactions |
| jsdom                       | 23.0.1  | DOM environment for tests  |

## Code Quality Tools

| Tool   | Version | Purpose                   |
| ------ | ------- | ------------------------- |
| oxlint | 1.56.0  | Linting (based on ESLint) |
| oxfmt  | 0.41.0  | Code formatting           |

## Package Manager

- **Primary**: Bun (for scripts and dev)
- **Secondary**: pnpm (for linting and formatting via AGENTS.md)

## Configuration Files

| File                   | Purpose                                 |
| ---------------------- | --------------------------------------- |
| `tsconfig.json`        | TypeScript configuration (strict mode)  |
| `tsconfig.node.json`   | TypeScript config for Vite config files |
| `vite.config.ts`       | Vite build configuration                |
| `vitest.config.ts`     | Vitest test configuration               |
| `playwright.config.ts` | Playwright E2E configuration            |
| `capacitor.config.ts`  | Capacitor mobile app configuration      |
| `package.json`         | Dependencies and scripts                |
| `index.html`           | Application entry HTML                  |
| `justfile`             | Task runner recipes                     |

## TypeScript Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

## Project Structure

```
src/
├── App.tsx                 # Main app component
├── main.tsx               # React entry point
├── components/             # React UI components
│   ├── canvas/            # Canvas-related (Konva)
│   ├── feedback/           # Visual/haptic feedback
│   ├── layout/             # App layout (AppLayout, ErrorBoundary)
│   ├── navigation/         # Navigation components
│   ├── screens/            # Screen components
│   ├── tracing/            # Tracing UI components
│   └── ui/                # Reusable UI primitives (Button, Card)
├── hooks/                  # Custom React hooks
├── lib/                    # Business logic
│   ├── canvas/            # Canvas utilities (validation, rendering, touch)
│   ├── feedback/          # Feedback systems (visual, sound)
│   └── templates/         # Character template loading
├── state/                  # Zustand store
├── styles/                 # Theme and animations
├── types/                  # TypeScript type definitions
└── assets/                # Static assets

tests/
├── unit/                  # Unit tests
├── component/             # Component tests
├── integration/           # Integration tests
└── e2e/                   # End-to-end tests

public/
├── sounds/               # Audio feedback files
└── icons/                # App icons
```

## Key Dependencies Summary

### Runtime Dependencies (3)

- `react` - UI framework
- `react-dom` - React DOM renderer
- `react-konva` - Konva bindings for React
- `konva` - Canvas drawing library
- `zustand` - State management

### Dev Dependencies (14)

- Build tools (Vite, TypeScript)
- Testing (Vitest, Playwright, Testing Library)
- Mobile (Capacitor)
- Code quality (oxlint, oxfmt)

## Node.js Compatibility

- Targets modern browsers (ES2020+)
- Requires bundler for module resolution
- No server-side Node.js dependencies
