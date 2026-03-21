# Justfile for handwriting-tracing-app

# Default recipe - run dev server
default: dev

# Install dependencies
install:
    bun install

# Development
dev:
    bun run dev

# Production build
build:
    bun run build

# Preview production build
preview:
    bun run preview

# Testing
test:
    bunx vitest

test-unit:
    bunx vitest --run

test-watch:
    bunx vitest --watch

test-coverage:
    bunx vitest --coverage

# E2E Testing
test-e2e:
    bun run test:e2e

test-e2e-ui:
    bun run test:e2e:ui

# Install Playwright browsers
playwright-install:
    PLAYWRIGHT_BROWSERS_PATH=/tmp/pw-browsers bunx playwright install --with-deps chromium

# Code quality
lint:
    oxlint .

typecheck:
    bun run typecheck

format:
    bun run format

format-check:
    bun run format:check

# Quality gate - runs all checks
quality: test-unit lint typecheck format-check

# Capacitor iOS
ios-build:
    CAPACITOR=true bun run build

ios-sync:
    bunx cap sync ios

ios-open:
    bunx cap open ios

ios-copy:
    bunx cap copy ios
