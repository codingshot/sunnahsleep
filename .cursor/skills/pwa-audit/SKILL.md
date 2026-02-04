---
name: pwa-audit-sunnahsleep
description: Audits PWA aspects of SunnahSleep. Use when working on offline support, service worker, manifest, caching, or install flow. Covers vite-plugin-pwa, Workbox, and PWA best practices.
---

# PWA Audit

## Current Setup

- **Build:** vite-plugin-pwa
- **Manifest:** public/manifest.webmanifest (or generated)
- **Service Worker:** Workbox (via plugin)
- **Offline:** Quran audio cached

## Audit Checklist

### Manifest

- [ ] name, short_name, description
- [ ] icons: 192x192, 512x512
- [ ] start_url, display: standalone
- [ ] theme_color, background_color
- [ ] scope

### Service Worker

- [ ] Precache app shell (HTML, JS, CSS)
- [ ] Runtime cache for API responses (prayer times—short TTL)
- [ ] Cache Quran audio (cdn.islamic.network)
- [ ] Offline fallback page
- [ ] Skip waiting / update prompt for new versions

### Caching Strategy

| Resource | Strategy | Notes |
|----------|----------|-------|
| App shell | precache | StaleWhileRevalidate |
| Quran audio | runtime cache | CacheFirst, long TTL |
| Prayer API | network first | Short cache, fallback to stale |
| Images | cache first | Static assets |

### Install

- [ ] beforeinstallprompt handled (if desired)
- [ ] /install page with platform-specific instructions
- [ ] Display mode: standalone works on home screen

### Performance

- [ ] Lazy load routes where possible
- [ ] Image optimization (WebP, sizes)
- [ ] Font loading (Amiri, Inter) – preload critical

## Common Issues

1. **Cache invalidation** – New deploy must update SW; use Workbox’s skipWaiting
2. **API in SW** – Fetch from SW can have different CORS behavior
3. **Storage** – localStorage available; IndexedDB for larger data if needed
4. **Notifications** – Require user permission; document in privacy policy
