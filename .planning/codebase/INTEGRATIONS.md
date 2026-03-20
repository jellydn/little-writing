# External Integrations

**Analysis Date:** 2026-03-20

## APIs & External Services

**None**
- No external API calls
- No third-party SDKs for analytics, auth, or data

## Data Storage

**Databases:**
- None (local state only)

**File Storage:**
- Local filesystem only
- Character templates: `src/assets/characters/{category}/{character}.json`

**Caching:**
- None

## Authentication & Identity

**Auth Provider:**
- None (app is stateless, no user accounts)

## Monitoring & Observability

**Error Tracking:**
- None

**Logs:**
- Console.error/warn for development debugging only
- ErrorBoundary component catches React errors

## CI/CD & Deployment

**Hosting:**
- Local development (Vite dev server)
- iOS app (via Capacitor)

**CI Pipeline:**
- None configured

## Environment Configuration

**Required env vars:**
- None

**Secrets location:**
- N/A (no secrets needed)

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

---

*Integration audit: 2026-03-20*
