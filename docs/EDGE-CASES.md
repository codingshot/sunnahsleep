# SunnahSleep Edge Cases

## Documented & Handled

### Prayer times
- **Missing/null prayerTimes** – SleepTimeCalculator returns null; components check before rendering
- **Malformed time string** – parseTime validates `HH:MM` format; invalid returns null
- **API returns unexpected structure** – Optional chaining on `data?.data?.timings`; null if Fajr/Isha missing
- **Negative sleep duration** – Clamped to 0 (polar regions, odd daylight)

### localStorage
- **Corrupted JSON** – getStorageJson catches parse errors, returns null
- **Invalid schema** – Array.isArray() check for arrays; fallback to defaults
- **Quota exceeded** – setStorageJson catches QuotaExceededError

### Time parsing
- **getTimeBeforeFajr** – Validates fajr format before split
- **formatDuration** – Clamps negative minutes to 0

### Navigation
- **Invalid tab in URL** – VALID_TABS check; defaults to 'checklist'
- **Missing blog slug** – BlogArticle shows "Article Not Found"

## To Monitor

- **Empty city search** – Returns []; UI handles empty state
- **Alarm time format** – Assumes HH:MM; consider validation when adding alarms
- **Date parsing** – `new Date(r.date)` on invalid date strings may produce Invalid Date
