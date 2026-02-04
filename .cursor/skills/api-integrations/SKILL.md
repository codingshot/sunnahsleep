---
name: api-integrations-sunnahsleep
description: Manages external API integrations for SunnahSleep. Use when working with Aladhan, ipwho.is, Nominatim, Open-Meteo, or Islamic Network CDN. Covers error handling, timeouts, fallbacks, and rate limiting.
---

# API Integrations

## APIs Used by SunnahSleep

| API | Purpose | Endpoint | Key Required |
|-----|---------|----------|--------------|
| Aladhan | Prayer times | api.aladhan.com/v1/timings | No |
| ipwho.is | IP geolocation | ipwho.is | No |
| Nominatim | City search | nominatim.openstreetmap.org | No |
| Open-Meteo | City search fallback | geocoding-api.open-meteo.com | No |
| Islamic Network | Quran audio CDN | cdn.islamic.network | No |

## Requirements

### 1. Error Handling

- Wrap `fetch` in try/catch
- Check `response.ok` before parsing
- Handle network errors, 4xx/5xx, JSON parse errors
- Provide user-facing error messages
- Log errors for debugging (avoid leaking sensitive data)

### 2. Timeouts

- Add AbortController with timeout (e.g., 10s) for fetch
- Prevent hanging requests
- Clear timeout on success

### 3. Fallbacks

- **Location:** Fallback to Mecca if IP detection fails
- **City search:** Try Nominatim first, then Open-Meteo
- **Prayer times:** Show error state; do not corrupt UI

### 4. User-Agent

- Set `User-Agent` for Nominatim: `SunnahSleep/1.0 (https://sunnahsleep.app)`
- Some APIs require identifiable User-Agent

### 5. Rate Limiting

- Nominatim: 1 req/sec; cache results
- Aladhan: Cache prayer times by date/location
- Avoid repeated calls for same input

## Example: Safe Fetch with Timeout

```ts
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    clearTimeout(id);
    if (err instanceof Error) throw err;
    throw new Error('Network request failed');
  }
}
```

## Checklist

- [ ] All fetch calls have try/catch
- [ ] response.ok checked before JSON parse
- [ ] Timeout on long-running requests
- [ ] Fallback for location detection
- [ ] User-Agent where required
- [ ] Prayer times cached (localStorage) by date+coords
