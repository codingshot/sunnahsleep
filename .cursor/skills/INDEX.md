# SunnahSleep Skills Index

Organized skills for maintaining and improving SunnahSleep. Use the index to find the right skill for each task.

## Islamic Content & Authenticity

| Skill | Purpose |
|-------|---------|
| [fact-check-sunnah-quran](fact-check-sunnah-quran/SKILL.md) | Verify hadith and Quran references, Sunnah.com links, grading |
| [verify-translations-transliterations](verify-translations-transliterations/SKILL.md) | Cross-reference Arabic→English translations and transliterations |
| [implement-translations-transliterations](implement-translations-transliterations/SKILL.md) | Add missing transliterations, update data structures and components |

## Testing

| Skill | Purpose |
|-------|---------|
| [implement-tests-sunnahsleep](implement-tests-sunnahsleep/SKILL.md) | Implement Vitest tests for hooks, components, data, routing |

## API Integrations

| Skill | Purpose |
|-------|---------|
| [api-integrations](api-integrations/SKILL.md) | Aladhan, ipwho.is, Nominatim, Islamic Network CDN—error handling, timeouts, fallbacks |

## Security & Data

| Skill | Purpose |
|-------|---------|
| [local-storage-security](local-storage-security/SKILL.md) | Safe localStorage usage, JSON validation, XSS prevention, data integrity |

## PWA & Performance

| Skill | Purpose |
|-------|---------|
| [pwa-audit](pwa-audit/SKILL.md) | Service worker, offline, manifest, caching, install prompt |

## Usage

When working on SunnahSleep:
1. **Adding Islamic content** → fact-check-sunnah-quran, verify-translations-transliterations
2. **Adding tests** → implement-tests-sunnahsleep
3. **Changing APIs or fetch calls** → api-integrations
4. **Changing localStorage** → local-storage-security
5. **PWA / offline / install** → pwa-audit

## Full Audit Order

For a comprehensive app review, apply in this order:
1. fact-check-sunnah-quran
2. verify-translations-transliterations
3. local-storage-security
4. api-integrations
5. pwa-audit
6. implement-tests-sunnahsleep
