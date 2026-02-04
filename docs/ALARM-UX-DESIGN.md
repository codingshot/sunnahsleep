# Humane Alarm UX Design — SunnahSleep

A design for Fajr, Tahajjud, and pre-Fajr alarms that supports spiritual intention while encouraging wakefulness without harshness.

---

## 1. Alarm Types & Spiritual Context

### Fajr
**Purpose:** Wake for the dawn prayer—the most precious time of the day.

| Microcopy Context | Use |
|-------------------|-----|
| **Alarm name** | "Fajr Prayer" |
| **On set** | "You'll wake when it's time for Fajr. May Allah make it easy." |
| **At ring** | "Fajr time. Hayya 'alas-salah, hayya 'alal-falah." |
| **Dismiss** | "Pray Fajr" (primary CTA) |
| **Snooze** | "A few more minutes" |

---

### Tahajjud
**Purpose:** Wake in the last third of the night—when Allah descends and answers duas.

| Microcopy Context | Use |
|-------------------|-----|
| **Alarm name** | "Tahajjud" |
| **On set** | "The last third of the night. When Allah is closest." |
| **At ring** | "Allah descends. Your duas are heard." |
| **Dismiss** | "Wake for Tahajjud" (primary CTA) |
| **Snooze** | "Rest a bit longer" |

---

### X Minutes Before Fajr
**Purpose:** Buffer to wake, make wudu, and be ready for Fajr when the time enters.

| Microcopy Context | Use |
|-------------------|-----|
| **Alarm name** | "30 min before Fajr" (or user-chosen) |
| **On set** | "Time to wake and prepare. Fajr is in [X] minutes." |
| **At ring** | "Fajr in [X] minutes. Prepare with wudu." |
| **Dismiss** | "Start preparing" (primary CTA) |
| **Snooze** | "A few more minutes" |

---

## 2. Sound Design

### Suggested Sound Options by Alarm Type

| Alarm Type | Default Sound | Alternatives |
|------------|---------------|--------------|
| **Fajr** | Adhan (Makkah) | Adhan (Madinah), Gentle tones |
| **Tahajjud** | Gentle tones | Soft adhan, Nature |
| **Before Fajr** | Gentle tones | Soft adhan, Nature |

### Sound Profiles

| Profile | Description | Use Case |
|---------|-------------|----------|
| **Adhan (Makkah)** | Full adhan—commanding, sacred | Fajr when user prefers strong signal |
| **Adhan (Madinah)** | Alternative adhan—different reciter | Variety, preference |
| **Soft Adhan** | Lower volume, gentle fade-in | Tahajjud, sensitive sleepers |
| **Gentle Tones** | Non-adhan, calm chimes or soft bells | Tahajjud, pre-Fajr, shared room |
| **Nature** | Birds, soft rain | Minimal disruption |

### Volume Ramp
- **First ring:** 60% volume
- **Second ring (after snooze):** 75%
- **Third ring onward:** 85%
- Avoid sudden loud starts—respect sleep inertia.

---

## 3. Snooze Rules (Humane, Not Harsh)

### Core Principle
Snooze supports natural wake-up, not guilt. Frame it as grace, not failure.

### Snooze Limits by Type

| Alarm Type | Max snoozes | Snooze durations | After limit |
|------------|-------------|------------------|-------------|
| **Fajr** | 3 | 5, 5, 3 min | After 3rd: show dismiss only; message: "Fajr time is passing. Pray when you can." |
| **Tahajjud** | 2 | 10, 5 min | After 2nd: "The last third is slipping away. Wake when ready." |
| **Before Fajr** | 3 | 5, 5, 3 min | Same as Fajr; remind of remaining time before Fajr |

### Snooze Microcopy

| Action | Microcopy |
|--------|-----------|
| **First snooze** | "5 more minutes" |
| **Second snooze** | "Another 5 minutes" |
| **Third snooze** | "3 more minutes" (shorter) |
| **After max** | "No more snoozes. When you're ready, tap to dismiss." |

### Snooze UI
- Show snooze count: "Snooze 2 of 3"
- Don’t disable snooze until limit—allow the user to choose
- After limit: only "Dismiss" button; hide "Snooze"
- Soft reminder text, not shame-based

---

## 4. Alarm Screen (When Ringing)

### Layout

```
┌─────────────────────────────────────┐
│                                     │
│   [Spiritual microcopy—see above]   │
│                                     │
│   ─────────────────────────────     │
│   Fajr Prayer                       │
│   5:42 AM                           │
│   ─────────────────────────────     │
│                                     │
│   [  Snooze 5m  ]  [  Pray Fajr  ]  │
│    (secondary)       (primary)      │
│                                     │
│   Snooze 1 of 3                     │
│                                     │
└─────────────────────────────────────┘
```

### Button Hierarchy
- **Primary (Dismiss):** Full-width or larger—"Pray Fajr" / "Wake for Tahajjud" / "Start preparing"
- **Secondary (Snooze):** Smaller or outline—"5 more minutes"

### States
- **Snooze available:** Show both buttons
- **Snooze at limit:** Show only primary; microcopy: "When you're ready, tap below."

---

## 5. Setting Flow Microcopy

### When Creating Alarm

| Step | Fajr | Tahajjud | Before Fajr |
|------|------|----------|-------------|
| **Title** | Fajr Prayer | Tahajjud | [X] min before Fajr |
| **Subtitle** | Dawn prayer—the most precious | Last third of the night | Time to prepare for Fajr |
| **Sound hint** | "Adhan recommended" | "Gentle tones recommended for night" | "Gentle tones recommended" |

### Confirmation Toast
- **Fajr:** "Fajr alarm set for 5:42 AM. May Allah make it easy."
- **Tahajjud:** "Tahajjud alarm set. The last third awaits."
- **Before Fajr:** "You'll wake 30 min before Fajr. Time to prepare."

---

## 6. Accessibility & Edge Cases

### Accessibility
- Large touch targets (min 44×44px) for dismiss/snooze
- High-contrast text for microcopy
- Screen reader: announce alarm type and time, then primary action
- Optional: "Speak microcopy" for users who want to hear the spiritual prompt

### Edge Cases
- **App closed:** Browser notification with same microcopy; tap opens app to alarm screen
- **Multiple alarms:** If Fajr and Before-Fajr overlap, trigger only one (user preference or earlier)
- **Missed Fajr:** Optional "Fajr missed" reminder 30 min after Fajr time (off by default)

---

## 8. Copy Reference (Implementation)

```ts
// Alarm type → microcopy map
const ALARM_MICROCOPY = {
  fajr: {
    onSet: "You'll wake when it's time for Fajr. May Allah make it easy.",
    atRing: "Fajr time. Hayya 'alas-salah, hayya 'alal-falah.",
    dismissLabel: "Pray Fajr",
    snoozeLabel: "A few more minutes",
    afterMaxSnooze: "Fajr time is passing. Pray when you can.",
    toastSet: "Fajr alarm set for {time}. May Allah make it easy.",
  },
  tahajjud: {
    onSet: "The last third of the night. When Allah is closest.",
    atRing: "Allah descends. Your duas are heard.",
    dismissLabel: "Wake for Tahajjud",
    snoozeLabel: "Rest a bit longer",
    afterMaxSnooze: "The last third is slipping away. Wake when ready.",
    toastSet: "Tahajjud alarm set. The last third awaits.",
  },
  "fajr-before": {
    onSet: "Time to wake and prepare. Fajr is in {minutes} minutes.",
    atRing: "Fajr in {minutes} minutes. Prepare with wudu.",
    dismissLabel: "Start preparing",
    snoozeLabel: "A few more minutes",
    afterMaxSnooze: "Fajr is approaching. Prepare when ready.",
    toastSet: "You'll wake {minutes} min before Fajr. Time to prepare.",
  },
};

// Snooze config by type
const SNOOZE_CONFIG = {
  fajr: { maxSnoozes: 3, durations: [5, 5, 3] },
  tahajjud: { maxSnoozes: 2, durations: [10, 5] },
  "fajr-before": { maxSnoozes: 3, durations: [5, 5, 3] },
};

// Default sound by type
const DEFAULT_SOUND_BY_TYPE = {
  fajr: "adhan-makkah",
  tahajjud: "gentle",
  "fajr-before": "gentle",
};
```

---

## 9. Summary: Design Principles

1. **Intention over guilt** — Microcopy supports spiritual purpose, not shame
2. **Grace in snooze** — Limits prevent infinite delay; wording stays gentle
3. **Sound appropriate to time** — Adhan for Fajr; softer options for Tahajjud
4. **Clear primary action** — Dismiss is always obvious and spiritually framed
5. **Progressive volume** — Start softer; increase only if needed
