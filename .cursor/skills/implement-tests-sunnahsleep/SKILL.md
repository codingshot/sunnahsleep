---
name: implement-tests-sunnahsleep
description: Implements comprehensive tests for SunnahSleep features. Use when adding tests, achieving test coverage, or verifying functionality against README features. Covers hooks, components, data, routing, and integration.
---

# SunnahSleep Test Implementation

## Quick Reference

**Test stack:** Vitest + @testing-library/react + jsdom  
**Run:** `npm run test` or `npm run test:watch`  
**Pattern:** `src/**/*.{test,spec}.{ts,tsx}`  
**Setup:** `src/test/setup.ts` (jest-dom, matchMedia mock)

## Feature-to-Test Mapping

Use [FEATURE-TEST-MAP.md](FEATURE-TEST-MAP.md) for the complete mapping of README features to test targets.

### Core Test Targets

| README Feature | Primary Target | Test Type |
|----------------|----------------|-----------|
| Sunnah Sleep Checklist | useChecklist, ChecklistCard | Hook + Component |
| Quran Recitations | AyatKursiCard, QuranVerseCard, checklistData | Data + Component |
| Tasbih Counter | useChecklist (tasbih), TasbihCounter | Hook + Component |
| Sleep Tracker | useSleepTracker, SleepTrackerCard | Hook + Component |
| Prayer Alarms | useAlarms, AlarmsCard | Hook + Component |
| Prayer Times | usePrayerTimes | Hook (mock fetch) |
| PWA/Routing | App, pages | Integration |
| Wudu Guide | Wudu page | Component |

## Test Implementation Workflow

### 1. Hook Tests

**Location:** `src/hooks/use{Name}.test.ts`

**Pattern:** Use `@testing-library/react`'s `renderHook` and `act`.

**Mock localStorage:**
```ts
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
```

**Example (useChecklist):**
- Toggle item, verify localStorage
- incrementTasbih caps at 33/33/34
- resetTasbih clears counts
- progressPercentage, isTasbihComplete, isFullyComplete
- Streak logic (same day, yesterday, broken)

**Example (useSleepTracker):**
- startSleep creates record with correct shape
- endSleep computes duration, saves to records
- getStats (average, ishaRate, fajrRate)
- formatDuration outputs "Xh Ym"
- cancelSleep clears current

**Example (useAlarms):**
- addAlarm, removeAlarm, updateAlarm
- snoozeAlarm extends time
- saveSettings persists

**Example (usePrayerTimes):**
- Mock `fetch` for Aladhan API
- detectLocationByIP (mock ipwho.is)
- getPrayerTimes returns expected shape
- Tahajjud/Qailulah calculations

**Example (useAudio):**
- Mock `Audio` constructor
- playAudio sets isPlaying, currentAudioId
- stopAudio clears state

### 2. Component Tests

**Location:** `src/components/{Name}.test.tsx`

**Wrappers:** Provide required providers (Router, QueryClient) when needed.

```tsx
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>
    <BrowserRouter>{children}</BrowserRouter>
  </QueryClientProvider>
);
render(<Component />, { wrapper });
```

**Priorities:**
- ChecklistCard: renders item, toggle fires, hadith tooltip present
- TasbihCounter: buttons increment, progress updates
- QuranVerseCard: verses render, play button exists
- HadithTooltip: builds correct Sunnah.com URL
- ProgressRing: shows correct percentage

### 3. Data Tests

**Location:** `src/data/checklistData.test.ts`

- checklistItems: required fields (id, hadithReference, quranReference where applicable)
- duas: arabic, transliteration, source present
- ayatKursi: arabic length, reference "2:255"
- lastTwoAyahBaqarah: verses 285, 286
- threeQuls: 3 items, surah 112/113/114
- hadithReference: collection + hadithNumber for Sunnah.com links

### 4. Utility Tests

**Location:** `src/lib/utils.test.ts`

- `cn()`: merges classes, handles conditionals

### 5. Page/Routing Tests

**Location:** `src/pages/Index.test.tsx` or `src/App.test.tsx`

- Routes render without crash
- Index shows main sections (checklist, tasbih, etc.)
- NotFound for unknown paths

### 6. Integration Notes

- Mock `fetch` for prayer times, location
- Mock `Audio` for audio playback
- Mock `Notification` for alarm notifications
- Use `vi.useFakeTimers()` for alarm/time-based logic

## Code Examples

See [examples.md](examples.md) for copy-paste examples: useChecklist, useSleepTracker, checklistData, HadithTooltip, App routing, fetch mocking.

## File Naming

- `useChecklist.test.ts` next to `useChecklist.ts`
- Or `src/hooks/__tests__/useChecklist.test.ts`

## Checklist Before Adding Tests

- [ ] Clear localStorage before/after if testing persistence
- [ ] Mock external APIs (fetch)
- [ ] Wrap components needing Router/QueryClient
- [ ] Use `act()` for state updates in async tests
- [ ] Avoid testing implementation details; test behavior
