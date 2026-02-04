# Local Sleep History - Full Functionality & Flow

## 1. Overview

Extend SunnahSleep to track and display **local sleep history** by day. All data stays on device (localStorage). Users can view past days, manually log missed nights, edit records, and see trends.

---

## 2. Data Model

### SleepRecord (existing, unchanged)
```ts
{
  id: string;
  date: string;           // YYYY-MM-DD
  bedtime: string;        // ISO string
  wakeTime: string | null;
  duration: number | null; // minutes
  madeIsha: boolean;
  madeFajr: boolean;
  quality: 'poor' | 'fair' | 'good' | 'excellent' | null;
}
```

### DiaryEntry (existing, unchanged)
```ts
{
  id: string;
  date: string;           // YYYY-MM-DD
  sleepNotes: string;
  dreamNotes: string;
  mood: ...;
  dreamType: ...;
  createdAt: string;
}
```

### DaySummary (new, computed)
Unified view for a single calendar day:
```ts
{
  date: string;           // YYYY-MM-DD
  sleepRecord: SleepRecord | null;
  diaryEntry: DiaryEntry | null;
  hasData: boolean;       // true if either exists
}
```

### Storage Keys
- `sunnahSleepRecords` — SleepRecord[]
- `sunnahSleepDiary` — DiaryEntry[] (from DIARY_KEY)
- No new keys; history is computed from existing data

---

## 3. Full Functionality

### 3.1 View History
| Feature | Description |
|---------|-------------|
| **Day list** | Chronological list of days with data (newest first) |
| **Date range** | Filter by: Last 7 days, Last 30 days, Last 90 days, All |
| **Empty days** | Option to show gaps (days with no data) for context |
| **Day detail** | Tap a day → full view: sleep record + diary (if any) |

### 3.2 Manual Log (Add Past Night)
| Feature | Description |
|---------|-------------|
| **Add missed night** | "Log Past Night" button → pick date → enter bedtime, wake time, Isha, Fajr, quality |
| **Validation** | Date must be in past; wake > bed; duration auto-calculated |
| **Conflict** | If record exists for date, offer Edit instead of Add |

### 3.3 Edit & Delete
| Feature | Description |
|---------|-------------|
| **Edit record** | From day detail → Edit sleep → change any field |
| **Delete record** | From day detail → Delete → confirm (diary entry stays if exists) |
| **Edit diary** | Existing flow via Diary button; link by date |

### 3.4 Stats & Trends (extend existing)
| Feature | Description |
|---------|-------------|
| **Average duration** | Per week, per month (from getStats) |
| **Isha / Fajr rate** | Per week, per month |
| **Streaks** | Consecutive days with Fajr (optional enhancement) |
| **Calendar heatmap** | Optional: dots or colors for days with data/quality |

### 3.5 Export (optional, phase 2)
| Feature | Description |
|---------|-------------|
| **Export JSON** | Download all records + diary as JSON file |
| **Export CSV** | Simple CSV for spreadsheet use |

---

## 4. User Flows

### Flow 1: View Past Week
```
1. User opens Sleep tab
2. Taps "View History" (or "History" link)
3. Sees list: Last 7 days (default filter)
4. Each row: date, duration, Isha ✓/✗, Fajr ✓/✗
5. Taps a row → Day Detail sheet/modal
6. Sees full record + "Edit" and "Delete"
7. If diary exists, sees diary summary; tap to open Diary
```

### Flow 2: Log Missed Night
```
1. User forgot to tap "Start Sleep" last night
2. Opens Sleep tab → View History
3. Taps "Log Past Night"
4. Picker: select date (yesterday)
5. Form: bedtime (time), wake time (time), Made Isha?, Made Fajr?, Quality
6. Taps Save → record added, appears in history
```

### Flow 3: Edit Past Record
```
1. User views History → taps a day
2. Day detail opens
3. Taps "Edit Sleep"
4. Form pre-filled with existing data
5. Changes quality from "Good" to "Excellent"
6. Taps Save → record updated
```

### Flow 4: Delete Record
```
1. User views Day detail
2. Taps "Delete" (with confirmation)
3. Sleep record removed; diary (if any) remains
4. Day disappears from list if no diary
```

---

## 5. UI Components

### 5.1 Sleep Tracker Card (existing)
- Add **"View History"** button below stats
- Keep: Start Sleep, Wake Up, Stats, Recent Nights, Diary

### 5.2 Sleep History View (new)
- **Header**: "Sleep History" + filter dropdown (7 / 30 / 90 / All)
- **Action**: "Log Past Night" button
- **List**: Scrollable list of DaySummary rows
  - Date (e.g. "Mon, Feb 3")
  - Duration
  - Isha / Fajr icons
  - Quality emoji
  - Tap → expand or open detail

### 5.3 Day Detail (new)
- **Sheet or modal** (mobile-friendly)
- Date header
- Sleep record block: bedtime, wake, duration, Isha, Fajr, quality
- Diary block (if exists): mood, dream type, notes preview
- Actions: Edit Sleep, Delete Record, Open Diary

### 5.4 Manual Log / Edit Form
- Date picker (manual log) or static date (edit)
- Bedtime (time input)
- Wake time (time input)
- Made Isha? (toggle)
- Made Fajr? (toggle)
- Quality (4 options)
- Save / Cancel

---

## 6. Implementation Plan

1. **useSleepHistory hook** — `getDaySummaries(range)`, `getRecordsByDateRange()`, `addManualRecord()`, `updateRecord()`, `deleteRecord()`
2. **SleepHistoryView component** — List + filter + Log Past Night
3. **SleepDayDetail component** — Day detail sheet with Edit/Delete
4. **ManualLogDialog component** — Form for add/edit
5. **Integrate** — Add "View History" to SleepTrackerCard, route or expand to History view
6. **Tests** — useSleepHistory, ManualLogDialog, DayDetail

---

## 7. Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      SLEEP TRACKER CARD                          │
├─────────────────────────────────────────────────────────────────┤
│  [Start Sleep] or [Wake Up]  │  [History] [Diary]                │
│  Stats: Avg Sleep, Week, Isha%, Fajr%                            │
│  Recent Nights (3)          │  Recent Diary (3)                  │
└────────────────────────────┬────────────────────────────────────┘
                             │ Tap History
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SLEEP HISTORY VIEW                          │
├─────────────────────────────────────────────────────────────────┤
│  [← Back]           Sleep History           [Log Past Night]     │
│  Filter: [Last 7 days ▼]                                          │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Mon, Feb 3    7h 30m  🌙☀️ 😊  📖  [View]                    │ │
│  │ Sun, Feb 2    6h 45m  🌙☀️  😐  [View]                       │ │
│  │ Sat, Feb 1    --      📖 only  [View]                        │ │
│  └─────────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │ Tap a day
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DAY DETAIL (sheet)                          │
├─────────────────────────────────────────────────────────────────┤
│  Monday, February 3, 2026                              [✕]       │
│  ┌─ Sleep Record ─────────────────── [Edit] [Delete]            │
│  │ Bed: 11:30 PM  Wake: 6:00 AM   Duration: 7h 30m              │
│  │ 🌙 Isha ✓  ☀️ Fajr ✓  😊 Excellent                           │
│  └─────────────────────────────────────────────────────────────┘
│  ┌─ Diary Entry ───────────────────────────── [View]            │
│  │ Mood: good                                                     │
│  └─────────────────────────────────────────────────────────────┘
│  or [Add Diary Entry]                                            │
└────────────────────────────┬────────────────────────────────────┘
                             │ Tap Edit
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                 MANUAL LOG / EDIT DIALOG                         │
├─────────────────────────────────────────────────────────────────┤
│  Log Past Night (or Edit Sleep Record)                  [✕]     │
│  Date:     [2026-02-02    ]                                      │
│  Bedtime:  [23:30]  Wake: [06:00]                                │
│  [✓] Prayed Isha    [✓] Prayed Fajr                              │
│  Quality: [😴][😐][🙂][😊]                                        │
│  [Cancel]  [Add Record] or [Save]                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Edge Cases

| Case | Handling |
|------|----------|
| Same date, multiple records | Disallow; one record per date. Edit replaces. |
| Date in future | Disallow for manual log |
| Empty history | Show empty state: "No sleep records yet. Start tracking!" |
| Very long history | Cap display (e.g. 365 days); paginate or virtualize if needed |
| Timezone | Use local date (toISOString().split('T')[0]) consistently |
| Midnight cross | bedtime "23:00" + wake "06:00" → duration spans midnight |
