# SunnahSleep Feature-to-Test Mapping

This document maps every feature from README.md to specific test targets. Use when implementing tests to ensure full coverage.

## From README: User Flow

| Step | Feature | Test Target | Assertions |
|------|---------|-------------|------------|
| Open App | App loads | App.test.tsx | Index renders |
| Evening? | - | - | (UI logic, low priority) |
| Pray Isha | Checklist item | useChecklist, ChecklistCard | toggleItem, "pray-isha" |
| Bedtime Prep | Wudu, Dust Bed | useChecklist | "wudu", "dust-bed" items |
| Recitations | Ayat, Baqarah, Quls | checklistData, QuranVerseCard | Data shape, render |
| Dhikr | Tasbih 33-33-34 | useChecklist.tasbih, TasbihCounter | incrementTasbih, reset |
| Bedtime Duas | Duas | DuaCard, checklistData.duas | Render, audio button |
| Sleep Right | Position item | useChecklist | "right-side" |
| Wake Last Third | Tahajjud | usePrayerTimes, TahajjudCard | Tahajjud calculation |
| Tahajjud | Prayer alarm | useAlarms, TahajjudCard | Alarm type tahajjud |
| Fajr | Fajr alarm | useAlarms | type fajr |
| Complete | Streak | useChecklist | isFullyComplete, streak |

---

## From README: Features Section

### Sunnah Sleep Checklist

| Sub-feature | Test Target | Tests |
|-------------|-------------|-------|
| Preparation (Wudu, bed dusting, Isha) | useChecklist, checklistData | Items w/ id, toggle, persistence |
| Position (right-side) | useChecklist | "right-side" item |
| Recitation (Ayat al-Kursi, duas) | checklistData, AyatKursiCard | ayatKursi, lastTwoAyahBaqarah |
| Dhikr | useChecklist.tasbih | subhanAllah, alhamdulillah, allahuAkbar |
| Hadith references + Sunnah.com | HadithTooltip, checklistData | getSunnahUrl, hadithReference |

### Quran Recitations

| Sub-feature | Test Target | Tests |
|-------------|-------------|-------|
| Ayat al-Kursi (2:255) | checklistData.ayatKursi | reference, arabic, quranReference |
| Last 2 verses Baqarah | lastTwoAyahBaqarah | verses[285, 286], reference |
| Three Quls | threeQuls | Al-Ikhlas, Al-Falaq, An-Nas |
| Arabic, transliteration, translation | checklistData | Fields exist |
| Audio recitation | useAudio, QuranVerseCard | playAudio, audioUrl |

### Tasbih Counter

| Sub-feature | Test Target | Tests |
|-------------|-------------|-------|
| 33 / 33 / 34 | useChecklist.incrementTasbih | Max 33 for subhan/alhamd, 34 for akbar |
| Visual progress | TasbihCounter | Renders progress |
| Haptic (if testable) | - | Skip (browser API) |
| Auto-reset | useChecklist | Daily reset via date check |
| Persistence | useChecklist | localStorage save/load |

### Sleep Tracker

| Sub-feature | Test Target | Tests |
|-------------|-------------|-------|
| Start/end sleep | useSleepTracker | startSleep, endSleep |
| Isha/Fajr adherence | useSleepTracker | madeIsha, madeFajr in record |
| Sleep quality | useSleepTracker | quality field |
| Weekly stats | useSleepTracker.getStats | thisWeek, averageDuration |
| Isha/Fajr rates | useSleepTracker.getStats | ishaRate, fajrRate |

### Prayer Alarms

| Sub-feature | Test Target | Tests |
|-------------|-------------|-------|
| Auto-detect location | usePrayerTimes.detectLocationByIP | Mock fetch, returns coords |
| Manual city search | usePrayerTimes.searchCity | Mock fetch, returns results |
| Fajr/Isha alarms | useAlarms | type fajr, isha |
| X minutes before Fajr | useAlarms | type fajr-before, beforeFajrMinutes |
| Tahajjud alarm | useAlarms, usePrayerTimes | type tahajjud, calculated time |
| Qailulah reminder | useAlarms, usePrayerTimes | QailulahSettings |
| Sound options | useAlarms | sound: adhan-makkah, etc. |
| Snooze | useAlarms.snoozeAlarm | Extends time |
| Browser notifications | useAlarms | Mock Notification |

### PWA

| Sub-feature | Test Target | Tests |
|-------------|-------------|-------|
| Install prompt | Install page | Renders |
| Offline | - | E2E / manual |
| Quran cache | - | E2E / manual |

---

## From README: Folder Structure (Components)

| Component | Test File | Priority |
|-----------|-----------|----------|
| AlarmsCard | AlarmsCard.test.tsx | High |
| AyatKursiCard | AyatKursiCard.test.tsx | High |
| ChecklistCard | ChecklistCard.test.tsx | High |
| CompletionCelebration | CompletionCelebration.test.tsx | Medium |
| DuaCard | DuaCard.test.tsx | Medium |
| HadithTooltip | HadithTooltip.test.tsx | High |
| Header | Header.test.tsx | Medium |
| ProgressRing | ProgressRing.test.tsx | Medium |
| QailulahCard | QailulahCard.test.tsx | Medium |
| QuranVerseCard | QuranVerseCard.test.tsx | High |
| SleepTrackerCard | SleepTrackerCard.test.tsx | High |
| TahajjudCard | TahajjudCard.test.tsx | Medium |
| TasbihCounter | TasbihCounter.test.tsx | High |

## From README: Hooks

| Hook | Test File | Key Functions |
|------|-----------|---------------|
| useChecklist | useChecklist.test.ts | toggleItem, incrementTasbih, resetTasbih, streak |
| useAudio | useAudio.test.ts | playAudio, stopAudio |
| usePrayerTimes | usePrayerTimes.test.ts | detectLocationByIP, getPrayerTimes, tahajjud |
| useAlarms | useAlarms.test.ts | addAlarm, removeAlarm, snoozeAlarm |
| useSleepTracker | useSleepTracker.test.ts | startSleep, endSleep, getStats |
| useSleepDiary | useSleepDiary.test.ts | (if used) |

## From README: Pages

| Page | Test | Assertions |
|------|------|------------|
| Index | Index.test.tsx | Renders checklist, tasbih, main sections |
| Privacy | Privacy.test.tsx | Renders content |
| Terms | Terms.test.tsx | Renders content |
| Legal | Legal.test.tsx | Renders content |
| Install | Install.test.tsx | Renders install instructions |
| Wudu | Wudu.test.tsx | Steps render, hadith source |
| Blog | Blog.test.tsx | Article list |
| BlogArticle | BlogArticle.test.tsx | Article by slug |
| Demo | Demo.test.tsx | Renders |
| Guides | Guides.test.tsx | Renders |
| PropheticSleep | PropheticSleep.test.tsx | Hadith cards |
| NotFound | App.test.tsx | 404 for unknown route |

## Recommended Test Order

1. **Data** – checklistData.test.ts (no mocks)
2. **Utils** – utils.test.ts
3. **Hooks** – useChecklist, useSleepTracker, useAudio (simplest first)
4. **Hooks with mocks** – useAlarms, usePrayerTimes
5. **Components** – HadithTooltip, ProgressRing, TasbihCounter
6. **Pages** – Index, App routing
