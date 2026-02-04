---
name: API / Integration Issue
description: Prayer times, geolocation, or external API problems
title: "[API]: "
labels: ["api", "triage"]
assignees: []
---

## API / Service

- [ ] Aladhan (prayer times)
- [ ] ipwho.is (IP geolocation)
- [ ] Nominatim / OpenStreetMap (city search)
- [ ] Open-Meteo (geocoding)
- [ ] Islamic Network CDN (Quran audio)
- [ ] Other: ___

## Issue Description

What's going wrong? (e.g., wrong prayer times, location not detected, audio fails)

## Expected vs Actual

- **Expected:** e.g., Prayer times for New York
- **Actual:** e.g., Defaults to wrong timezone, or request times out

## Environment

- **Location / timezone:** (if relevant)
- **Network:** (e.g., VPN, mobile data, offline)

## Relevant code

If you know the hook or file, mention it (e.g., `usePrayerTimes`, `src/lib/fetch.ts`).

## References

- API integration skill: `.cursor/skills/api-integrations/`
- Error handling / timeout: `fetchWithTimeout` in `src/lib/fetch.ts`
