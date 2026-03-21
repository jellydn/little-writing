<h1 align="center">Welcome to Little Writing 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000" />
  <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-blue.svg" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

<p align="center">
  <img src="./public/logo.png" alt="Little Writing Logo" width="200" height="200">
</p>

> A handwriting tracing app for kids built with React, react-konva, and Capacitor.

## Tech Stack

- **Frontend**: React 18+, TypeScript
- **Canvas**: react-konva
- **Mobile**: Capacitor (iOS)
- **Testing**: Vitest
- **State**: Zustand

## Getting Started

### Prerequisites

- Node.js LTS
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

## Troubleshooting

### iOS: `Podfile` not found during `cap sync`

```
Error: ENOENT: no such file or directory, open '.../ios/App/Podfile'
```

The iOS platform was only partially initialized. Reinitialize it:

```bash
rm -rf ios
npx cap add ios
```

Then sync again:

```bash
npx cap sync
```

### iOS: CocoaPods not installed

```
Error: pod: command not found
```

Install CocoaPods:

```bash
sudo gem install cocoapods
# or with Homebrew
brew install cocoapods
```

### Build fails with missing `dist/` directory

Run the web build before syncing to iOS:

```bash
bun run build
npx cap sync
```

### Dev server not starting on port 5173

Check if another process is using the port:

```bash
lsof -i :5173
```

Kill the process or use a different port via `--port`:

```bash
bun run dev -- --port 5174
```

## Resources

- [React Konva Documentation](https://konvajs.org/docs/react/)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Vitest Documentation](https://vitest.dev/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## Author

👤 **Dung Huynh**

- Website: [https://productsway.com](https://productsway.com)
- Twitter: [@jellydn](https://twitter.com/jellydn)
- GitHub: [@jellydn](https://github.com/jellydn)

## Show your support

Give a ⭐️ if this project helped you!

[![kofi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/dunghd)
[![paypal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.me/dunghd)
[![buymeacoffee](https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/dunghd)
