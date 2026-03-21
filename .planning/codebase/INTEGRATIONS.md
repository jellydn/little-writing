# INTEGRATIONS.md - External Integrations

**Project**: Little Writing - Kids Handwriting Tracing App  
**Last Updated**: 2026-03-20

## External APIs

**None** - This is a standalone mobile/web application with no backend APIs.

## Databases

**None** - Character templates are loaded from static JSON files bundled with the app.

## Authentication Providers

**None** - The app has no authentication system per Constitution requirements (MVP scope: "No auth").

## Storage & Persistence

### Local Asset Storage

- Character templates stored as JSON files in `/public/assets/characters/`
- Organized by category: `numbers/`, `uppercase/`, `lowercase/`
- Loaded dynamically via fetch at runtime

### Character Template Loading

```typescript
// Files loaded from public/assets/characters/{category}/{char}.json
// Example: /assets/characters/uppercase/A.json
const response = await fetch('/assets/characters/uppercase/A.json');
const template = await response.json();
```

## External Resources

### Audio Files

- **Location**: `/public/sounds/success.mp3`
- **Purpose**: Success feedback sound for completed strokes
- **API**: HTML5 Audio API (`new Audio()`)
- **Note**: Preloaded on first user interaction to bypass autoplay restrictions

### Fonts

**None** - App uses system fonts for simplicity (child-friendly design).

### Icons

- **Location**: `/public/icons/` (see README)
- Custom app icons for Capacitor/iOS deployment

## Third-Party Libraries (No External Services)

| Library     | Purpose               | Integration Type  |
| ----------- | --------------------- | ----------------- |
| Konva       | 2D Canvas rendering   | npm package       |
| react-konva | React Konva bindings  | npm package       |
| Zustand     | State management      | npm package       |
| Capacitor   | Native mobile wrapper | npm package + CLI |

## Web APIs Used

| API              | Purpose                          |
| ---------------- | -------------------------------- |
| HTML5 Audio API  | Sound playback for feedback      |
| Touch Events API | Finger/stylus input handling     |
| Canvas API       | Drawing strokes (via Konva)      |
| Fetch API        | Loading character template JSON  |
| Web Storage API  | Not used (no persistence in MVP) |

## Capacitor Native Integrations

| Plugin          | Purpose                     |
| --------------- | --------------------------- |
| @capacitor/core | Core Capacitor runtime      |
| @capacitor/ios  | iOS native platform support |
| @capacitor/cli  | Build and sync tooling      |

### Capacitor Configuration

```typescript
// capacitor.config.ts
{
  appId: 'com.handwriting.tracing',
  appName: 'Handwriting Tracing',
  webDir: './dist',
  ios: { scheme: 'App' }
}
```

## Offline Capability

**Yes** - The app works offline after initial load:

- All character templates are bundled or cached
- No external API calls required
- Audio files can be preloaded
- No network dependency for core functionality

## Analytics & Tracking

**None** - No analytics, tracking, or telemetry per Constitution requirements.

## Error Reporting

**None** - No external error reporting service. Errors logged to console only.

## Internationalization (i18n)

**None** - Single language (English) for MVP scope.

## Cloud Services

**None** - All data and assets are local.

## Future Integration Considerations

The following could be considered for future iterations:

- Cloud backup of progress (requires auth + storage API)
- Sound asset CDN for smaller bundle size
- Analytics for usage patterns (requires privacy consideration)
- Progress sync across devices (requires auth + database)
