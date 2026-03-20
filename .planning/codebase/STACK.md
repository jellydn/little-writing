# Technology Stack

**Analysis Date:** 2026-03-20

## Languages

**Primary:**
- TypeScript 5.3+ - All source files (.ts, .tsx)

**Secondary:**
- CSS Modules (.module.css) - Component-scoped styles
- JSON - Character templates and configuration

## Runtime

**Environment:**
- Node.js 18+ (development)
- Browser ES2020+ (production)

**Package Manager:**
- Bun (recommended, primary)
- pnpm (lockfile present: pnpm-lock.yaml)
- Lockfile: present (pnpm-lock.yaml)

## Frameworks

**Core:**
- React 18.2+ - UI framework with StrictMode
- react-konva 18.2.10 - Canvas rendering wrapper around Konva
- Konva 9.2.0 - 2D canvas library
- Zustand 4.4.7 - Global state management

**Testing:**
- Vitest 1.1.0 - Test runner with globals
- @testing-library/react 14.1.2 - Component testing
- @testing-library/user-event 14.5.1 - User interaction simulation
- Playwright 1.40.1 - E2E testing (configured)

**Build/Dev:**
- Vite 6 - Build tool and dev server
- TypeScript 5.3+ - Static type checking
- @vitejs/plugin-react 4 - React JSX transform

## Key Dependencies

**Critical:**
- react-konva - Canvas rendering for handwriting tracing
- zustand - Global navigation and drawing session state
- konva - Core 2D drawing engine

**Infrastructure:**
- @capacitor/core 6.0.0 - iOS app wrapper
- @capacitor/ios 6.0.0 - iOS platform support

## Configuration

**Environment:**
- No environment variables required for core functionality
- Optional: import.meta.env for build-time config

**Build:**
- vite.config.ts - Vite bundler configuration
- tsconfig.json - TypeScript strict mode configuration
- capacitor.config.ts - iOS app configuration
- .oxlintrc.json - Oxlint rules
- .oxfmtrc.json - Oxfmt formatter settings

## Platform Requirements

**Development:**
- Node.js 18+
- Bun or pnpm

**Production:**
- iOS 13+ (Capacitor 6.0 minimum)
- Modern browser with Canvas 2D support

---

*Stack analysis: 2026-03-20*
