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
    bun test

test-unit:
    bun test --run

test-watch:
    bun test --watch

test-coverage:
    bun test --coverage

# Code quality
lint:
    oxlint .

typecheck:
    bun run typecheck

format:
    pnpm run format

format-check:
    pnpm run format:check

# Quality gate - runs all checks
quality: test lint typecheck

# Capacitor iOS
ios-sync:
    npx cap sync

ios-open:
    npx cap open ios

ios-copy:
    npx cap copy
