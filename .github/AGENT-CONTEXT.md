# SunnahSleep – Agent Context for PR Review & Bug Fixing

This document gives AI agents (OpenClaw, Moltbot, Cursor, etc.) the context needed to review PRs, triage issues, and propose fixes.

---

## Project Overview

**SunnahSleep** is an Islamic bedtime companion PWA. It helps Muslims follow the Prophetic Sunnah before sleep.

- **Stack:** React 18, TypeScript, Vite, Tailwind, shadcn/ui
- **State:** React hooks + localStorage (no backend)
- **Deploy:** Vercel

---

## Key Directories

| Path | Purpose |
|------|---------|
| `src/components/` | React components (AlarmsCard, SleepTrackerCard, QuranVerseCard, etc.) |
| `src/hooks/` | usePrayerTimes, useAlarms, useChecklist, useSleepTracker, useSleepDiary, useSleepHistory |
| `src/data/` | checklistData (Hadith, Quran), blogData |
| `src/lib/` | storage.ts (safe localStorage), fetch.ts (fetchWithTimeout), utils |
| `src/pages/` | Index, Wudu, Blog, Guides, PropheticSleep, Install, etc. |
| `.cursor/skills/` | Project-specific guidance for fact-check, storage, APIs, tests |

---

## Critical Skills (Use When Relevant)

| Skill | Path | Use when |
|-------|------|----------|
| **Fact-check Hadith/Quran** | `.cursor/skills/fact-check-sunnah-quran/` | Islamic content, hadith refs, Quran verses |
| **Local storage security** | `.cursor/skills/local-storage-security/` | localStorage, JSON parse, XSS |
| **API integrations** | `.cursor/skills/api-integrations/` | Aladhan, ipwho.is, Nominatim, fetch timeouts |
| **Implement tests** | `.cursor/skills/implement-tests-sunnahsleep/` | Adding/updating tests |
| **Translations** | `.cursor/skills/verify-translations-transliterations/` | Arabic, transliteration |

---

## Bug Fixing Checklist

1. **Reproduce** – Use steps from issue; note component/hook
2. **Identify** – Check `src/hooks/`, `src/components/`, `src/lib/`
3. **Storage** – Use `getStorageJson`/`setStorageJson` from `src/lib/storage.ts`
4. **APIs** – Use `fetchWithTimeout` from `src/lib/fetch.ts`
5. **Islamic content** – Verify against Sunnah.com/Quran.com per fact-check skill
6. **Tests** – Add/update in `src/**/*.test.ts`
7. **Lint** – Run `npm run lint`
8. **Test** – Run `npm run test`

---

## Issue Categories (from templates)

- **bug** – Bug report
- **enhancement** – Feature request
- **islamic-content** – Hadith, Quran, translation
- **documentation** – README, docs, marketing
- **api** – Prayer times, geolocation, external APIs
- **security** / **performance** – Security/performance concerns

---

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint
npm run test     # Vitest
```

---

## Data Model (Key Types)

- **SleepRecord** – `src/hooks/useSleepTracker.ts` – id, date, bedtime, wakeTime, duration, madeIsha, madeFajr, quality
- **DiaryEntry** – `src/components/SleepDiaryDialog.tsx` – date, sleepNotes, dreamNotes, mood, dreamType
- **ChecklistItem** – `src/types/checklist.ts` – id, title, hadithReference, etc.
- **PrayerTimes** – fajr, isha, maghrib, dhuhr, asr, sunrise

---

## External APIs

- **Aladhan** – Prayer times
- **ipwho.is** – IP geolocation
- **Nominatim / Open-Meteo** – City search
- **Islamic Network CDN** – Quran audio

All API calls should use `fetchWithTimeout` and handle errors. See `.cursor/skills/api-integrations/`.
