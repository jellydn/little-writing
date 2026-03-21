# External Integrations

> External services, APIs, databases, and third-party integrations
> Generated: 2026-03-21

## Overview

**None.** This is a purely client-side application with no external integrations.

The app is designed to work completely offline with:

- No backend API calls
- No external databases
- No authentication providers
- No third-party analytics
- No cloud services
- No webhooks

---

## External Services

### None

The application has zero external service dependencies. All functionality is implemented client-side using:

- **Browser APIs**: Canvas API, Web Audio API, Pointer Events
- **Static Assets**: Locally hosted character templates (JSON) and sound files (MP3)
- **In-Memory State**: Zustand store with no persistence

---

## Data Sources

### Local Character Templates

| Source                            | Format | Purpose                                         |
| --------------------------------- | ------ | ----------------------------------------------- |
| `src/assets/characters/**/*.json` | JSON   | Character stroke data (SVG paths, guide points) |
| `public/sounds/*.mp3`             | MP3    | Success sound effects                           |

### Template Data Structure

```typescript
interface CharacterTemplate {
  character: string; // e.g., "a", "1", "A"
  category: Category; // "lowercase" | "uppercase" | "number"
  displayName?: string; // e.g., "Lowercase A"
  bounds: Bounds; // SVG viewBox dimensions
  strokes: StrokePath[]; // Ordered stroke paths
  totalStrokes: number;
}

interface StrokePath {
  id: number;
  path: string; // SVG path data
  startPoint: Point;
  endPoint: Point;
  guidePoints: Point[]; // Validation points along path
}
```

---

## Authentication

### None

No authentication or user accounts required. The app is designed for immediate use without:

- Login/registration
- User profiles
- Progress tracking across sessions
- Cloud sync

---

## Storage

### No Persistent Storage

| Storage Type   | Usage    |
| -------------- | -------- |
| LocalStorage   | Not used |
| IndexedDB      | Not used |
| SessionStorage | Not used |
| Cookies        | Not used |
| File System    | Not used |

All application state is stored in-memory using Zustand and resets on page reload.

---

## Build & Deployment Integrations

### CI/CD Pipeline

| Platform       | Integration                    | Purpose                      |
| -------------- | ------------------------------ | ---------------------------- |
| GitHub Actions | `.github/workflows/ci.yml`     | Quality checks, testing      |
| GitHub Actions | `.github/workflows/deploy.yml` | GitHub Pages deployment      |
| GitHub Pages   | Static hosting                 | Production deployment        |
| Renovate       | `renovate.json`                | Automated dependency updates |

### Mobile Build

| Platform  | Integration            | Purpose                      |
| --------- | ---------------------- | ---------------------------- |
| Capacitor | `@capacitor/ios`       | iOS native app wrapper       |
| CocoaPods | `ios/App/Podfile.lock` | iOS dependency management    |
| Xcode     | iOS project files      | iOS app building and signing |

---

## Development Tools

### Local-Only Tools

| Tool         | Purpose                        | External Connection           |
| ------------ | ------------------------------ | ----------------------------- |
| Bun          | Package manager, script runner | Required for install only     |
| Vite         | Dev server, bundler            | No external connection        |
| Vitest       | Test runner                    | No external connection        |
| Playwright   | E2E testing                    | Downloads browsers on install |
| oxlint/oxfmt | Linting/formatting             | No external connection        |

---

## Potential Future Integrations

### MVP Scope Exclusions

Per the project constitution, these are explicitly NOT in scope:

- User accounts / authentication
- Cloud storage / sync
- Analytics / tracking
- In-app purchases
- Advertisements
- Social features
- AI/ML handwriting recognition

### Possible Post-MVP Additions

| Integration    | Purpose                          | Complexity |
| -------------- | -------------------------------- | ---------- |
| LocalStorage   | Persist progress locally         | Low        |
| IndexedDB      | Store custom character templates | Medium     |
| Service Worker | Offline PWA support              | Medium     |

---

## Security Considerations

### No External Attack Surface

- No API keys to expose
- No database connections
- No user data to protect
- No third-party scripts
- No tracking pixels

### Content Security Policy

Recommended CSP for production:

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
media-src 'self';
connect-src 'self';
font-src 'self';
```

---

## Network Requirements

### Offline-First Design

The application can run entirely offline once loaded:

| Resource            | Loading      | Offline           |
| ------------------- | ------------ | ----------------- |
| HTML/CSS/JS         | Initial load | Cached by browser |
| Character templates | Bundled      | Available offline |
| Sound effects       | Bundled      | Available offline |
| App shell           | Cached       | Works offline     |

No network requests are made during normal operation.
