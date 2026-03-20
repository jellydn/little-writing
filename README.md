# Little Writing

A handwriting tracing app for kids built with React, react-konva, and Capacitor.

## Tech Stack

- **Frontend**: React 18+, TypeScript
- **Canvas**: react-konva
- **Mobile**: Capacitor (iOS)
- **Testing**: Vitest
- **State**: Zustand

## Getting Started

### Prerequisites

- Node.js 18+
- Bun (recommended) or npm

### Installation

```bash
bun install
```

### Development

```bash
bun run dev
```

Open http://localhost:5173 in your browser.

### Testing

```bash
bun test          # Run all tests
bun test --watch  # Watch mode
bun test --coverage  # With coverage
```

### Code Quality

```bash
just lint         # Oxlint
just typecheck   # TypeScript
just format      # Oxfmt (Prettier-compatible)
just quality     # Run all checks
```

### Building

```bash
bun run build
```

### Mobile (iOS)

```bash
npx cap sync       # Sync web assets to iOS
npx cap open ios   # Open in Xcode
```

## Project Structure

```
src/
├── components/     # React UI components
├── lib/            # Business logic (canvas, templates, feedback)
├── hooks/         # Custom React hooks
├── state/         # Zustand store
└── styles/        # Theme and animations
```

## Constitution Principles

1. **Child-Centric Design** - Touch targets ≥44px, bright colors, minimal UI
2. **Guided Stroke Learning** - Visual paths, real-time validation
3. **Touch-First Interaction** - 60fps performance, finger/stylus support
4. **Immediate Feedback** - Real-time validation, encouraging feedback
5. **Simplicity** - Focused on core tracing functionality
