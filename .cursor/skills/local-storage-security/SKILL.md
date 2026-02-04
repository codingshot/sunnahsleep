---
name: local-storage-security
description: Ensures safe localStorage usage in SunnahSleep. Use when reading/writing localStorage. Covers JSON validation, parse error handling, XSS prevention, and data integrity.
---

# Local Storage Security & Safety

## Storage Keys Used

| Key | Hook | Data Type |
|-----|------|-----------|
| islamicSleep | useChecklist | { date, items, tasbih } |
| islamicSleepStreak | useChecklist | { count, lastDate } |
| sunnahSleepRecords | useSleepTracker | SleepRecord[] |
| sunnahCurrentSleep | useSleepTracker | Partial<SleepRecord> |
| sunnahSleepAlarms | useAlarms | Alarm[] |
| sunnahSleepAlarmSettings | useAlarms | AlarmSettings |
| sunnahSleepSnoozed | useAlarms | Record<string, number> |
| sunnahSleepPrayerTimes | usePrayerTimes | { times, date } |
| sunnahSleepTahajjud | usePrayerTimes | TahajjudSettings |
| sunnahSleepQailulah | usePrayerTimes | QailulahSettings |
| sunnahSleepLocation | usePrayerTimes | LocationSettings |
| sunnahSleepDiary | useSleepDiary | DiaryEntry[] |

## Risks

1. **JSON.parse throws** – Invalid/corrupted data crashes app
2. **Schema mismatch** – Old format, manual edits, extensions
3. **XSS** – Stored HTML/script if data ever rendered as raw HTML (we use React; low risk)
4. **Quota exceeded** – localStorage has ~5–10MB limit

## Requirements

### 1. Safe JSON Parse

Never `JSON.parse` without try/catch:

```ts
// BAD
const data = JSON.parse(localStorage.getItem(key)!);

// GOOD
function getJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
```

### 2. Schema Validation

Validate shape before use:

```ts
function isStoredData(obj: unknown): obj is StoredData {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'date' in obj &&
    typeof (obj as StoredData).date === 'string' &&
    'items' in obj &&
    typeof (obj as StoredData).items === 'object'
  );
}

const parsed = getJson<unknown>(STORAGE_KEY);
const data = isStoredData(parsed) ? parsed : null;
```

### 3. Fallback on Invalid Data

- If parse fails or validation fails, use default state
- Do not throw; app should keep working
- Optionally clear corrupted key: `localStorage.removeItem(key)`

### 4. Sanitization

- Only store primitive JSON (no functions, no DOM)
- React escaping handles most XSS; avoid `dangerouslySetInnerHTML` with stored data
- Quran/Hadith text is static from codebase, not user input—low risk

### 5. Quota

- For large arrays (e.g., sleep records), consider trimming old entries
- Catch `QuotaExceededError` if writing large data

## Checklist

- [ ] All `JSON.parse` wrapped in try/catch
- [ ] Invalid data falls back to defaults
- [ ] Optional: validate schema before use
- [ ] No raw user input stored without sanitization
- [ ] Large datasets trimmed or handled for quota
