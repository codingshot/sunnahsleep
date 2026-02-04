# SunnahSleep i18n Strategy

Design document for internationalization (i18n) with support for Arabic text, transliteration, translations, and locale-specific fiqh clarifications.

---

## 1. Locale Roadmap

| Phase | Locale | Code | Script | Priority | Notes |
|-------|--------|------|--------|----------|-------|
| 0 | English | `en` | Latin | Baseline | Default; already in use |
| 1 | Arabic | `ar` | Arabic | High | RTL; many users read Arabic natively |
| 2 | Urdu | `ur` | Perso-Arabic | High | Large Muslim population; RTL |
| 3 | Turkish | `tr` | Latin | Medium | Modern Turkish orthography |
| 4 | Indonesian | `id` | Latin | Medium | Largest Muslim population |
| 5 | Malay | `ms` | Latin | Medium | Malaysia, Brunei, Singapore |
| 6 | French | `fr` | Latin | Medium | Francophone Africa, Europe |

**Suggested rollout order:** en → ar → ur → tr → id → ms → fr

---

## 2. Folder Structure

```
docs/
└── schemas/                          # JSON schemas (reference until implementation)
    ├── checklist-item-content.schema.json
    └── fiqh-clarification.schema.json

src/
├── i18n/
│   ├── index.ts              # i18n init, locale detection, t() helper
│   ├── locales.ts            # Supported locales, metadata
│   └── messages/
│       ├── en/
│       │   ├── common.json           # UI: buttons, labels, nav, errors
│       │   ├── checklist.json        # Checklist items (keys only; content in content/)
│       │   ├── install.json          # Install page copy
│       │   ├── pages.json            # Page titles, meta
│       │   └── faq.json              # FAQ Q&A
│       ├── ar/
│       │   ├── common.json
│       │   ├── checklist.json
│       │   └── ...
│       ├── ur/
│       ├── tr/
│       ├── id/
│       ├── ms/
│       └── fr/
│
└── data/
    └── content/                      # Locale-agnostic Islamic content (source of truth)
        ├── checklist.json            # IDs + arabic + transliteration + translations by locale
        ├── duas.json
        ├── hadith.json
        └── fiqh-clarifications.json  # Locale-specific fiqh notes
```

**Convention:**
- **messages/{locale}/** — UI strings (buttons, labels, nav, page copy). One JSON per domain.
- **data/content/** — Islamic content (checklist, duas, hadith) with multi-locale structure. Shared across locales; referenced by key.

---

## 3. Naming Conventions

### Locale codes
- Use [BCP 47](https://tools.ietf.org/html/bcp47): `en`, `ar`, `ur`, `tr`, `id`, `ms`, `fr`
- Future: `en-US`, `ar-SA` only if needed for regional variants

### Translation keys
- **Format:** `domain.section.key` or `domain.key` for flat files
- **Examples:**
  - `common.buttons.save`
  - `common.labels.location`
  - `install.steps.ios.1`
  - `checklist.items.wudu.title` (references content ID; UI layer)
  - `content.checklist.pray-isha.title` (full path into content)

### Content IDs (stable, never translated)
- Use kebab-case: `pray-isha`, `dust-bed`, `ayat-kursi`, `last-two-baqarah`, `three-quls`
- Map 1:1 to existing `checklistData` and `DuaItem` ids

---

## 4. JSON Schema for Islamic Content

Schema supporting Arabic, transliteration, translations, and fiqh clarifications.

### 4.1 Checklist / Dua content (single item)

Full schema: `docs/schemas/checklist-item-content.schema.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://sunnahsleep.app/schemas/checklist-item.json",
  "title": "ChecklistItem",
  "description": "Checklist or Dua item with multi-locale support",
  "type": "object",
  "required": ["id", "arabic", "transliteration", "translations"],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^[a-z0-9-]+$",
      "description": "Stable content ID (never translated)"
    },
    "arabic": {
      "type": "string",
      "description": "Original Arabic text (U+0600–U+06FF)"
    },
    "transliteration": {
      "type": "string",
      "description": "Romanized Arabic for non-Arabic readers"
    },
    "translations": {
      "type": "object",
      "description": "Translations by locale code",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "title": { "type": "string" },
          "description": { "type": "string" },
          "detailedExplanation": { "type": "string" }
        }
      }
    },
    "hadithReference": {
      "type": "object",
      "properties": {
        "collection": { "type": "string" },
        "arabicText": { "type": "string" },
        "translations": {
          "type": "object",
          "additionalProperties": { "type": "string" }
        }
      }
    },
    "fiqhClarifications": {
      "type": "object",
      "description": "Locale-specific fiqh notes where scholarly views differ",
      "additionalProperties": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "locale": { "type": "string" },
            "note": { "type": "string" },
            "school": { "type": "string", "description": "e.g. Hanafi, Maliki, Shafi'i, Hanbali" }
          }
        }
      }
    }
  }
}
```

### 4.2 Fiqh clarifications schema (standalone)

Full schema: `docs/schemas/fiqh-clarification.schema.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://sunnahsleep.app/schemas/fiqh-clarification.json",
  "title": "FiqhClarification",
  "description": "Locale-specific fiqh note for content that may vary by madhab or region",
  "type": "object",
  "required": ["contentId", "locale", "note"],
  "properties": {
    "contentId": {
      "type": "string",
      "description": "Reference to checklist/dua/hadith ID"
    },
    "locale": {
      "type": "string",
      "enum": ["ar", "ur", "tr", "id", "ms", "fr", "en"]
    },
    "note": {
      "type": "string",
      "description": "Short clarification for this locale (e.g. Hanafi view on wiping over socks)"
    },
    "school": {
      "type": "string",
      "enum": ["hanafi", "maliki", "shafii", "hanbali"],
      "description": "Optional: which school this note applies to"
    }
  }
}
```

---

## 5. Example Translation Files

### 5.1 `messages/en/common.json`

```json
{
  "buttons": {
    "save": "Save",
    "cancel": "Cancel",
    "back": "Back",
    "add": "Add",
    "done": "Done"
  },
  "labels": {
    "location": "Location",
    "language": "Language"
  },
  "nav": {
    "checklist": "Checklist",
    "recitations": "Recitations",
    "tasbih": "Tasbih",
    "sleep": "Sleep",
    "alarms": "Alarms"
  }
}
```

### 5.2 `messages/ar/common.json` (RTL)

```json
{
  "buttons": {
    "save": "حفظ",
    "cancel": "إلغاء",
    "back": "رجوع"
  }
}
```

### 5.3 `data/content/checklist.json` (multi-locale content)

```json
{
  "items": [
    {
      "id": "wudu",
      "arabic": "الوضوء",
      "transliteration": "Al-Wudu",
      "translations": {
        "en": {
          "title": "Perform Wudu",
          "description": "Perform ablution before going to bed",
          "detailedExplanation": "The Prophet ﷺ instructed believers to make wudu before sleeping..."
        },
        "ar": {
          "title": "توضأ",
          "description": "توضأ قبل النوم",
          "detailedExplanation": "أمر النبي ﷺ المؤمنين بالوضوء قبل النوم..."
        },
        "ur": {
          "title": "وضو کریں",
          "description": "سونے سے پہلے وضو کریں"
        }
      },
      "fiqhClarifications": {
        "ur": [
          {
            "note": "حنفیہ کے ہاں خشک موزوں پر مسح کی اجازت ہے۔",
            "school": "hanafi"
          }
        ]
      }
    }
  ]
}
```

---

## 6. Locale-Specific Fiqh Clarifications

| Content | Locale | Example note |
|---------|--------|--------------|
| Wudu / wiping over socks | ur, tr | Hanafi: Masah on leather socks (khuffayn) allowed |
| Qailulah timing | id, ms | Local preference for post-Dhuhr nap window |
| Tahajjud calculation | fr, tr | 1/3 night calculation; some prefer fixed before Fajr |
| Last two verses recitation | ar | Some scholars include بِسْمِ اللَّهِ before 2:285 |

**Storage:** Either inline in `data/content/checklist.json` under `fiqhClarifications`, or in a separate `fiqh-clarifications.json` keyed by `contentId` + `locale`.

**UI:** Show as collapsible "Note for your region" or "Fiqh note" when present for the active locale.

---

## 7. Implementation Notes

### Library
- **Recommendation:** `react-i18next` + `i18next` + `i18next-resources-to-backend` (or static JSON imports)
- Alternative: Custom lightweight `t(key)` + JSON loader (no deps for PWA size)

### RTL support
- Set `dir="rtl"` and `lang="ar"` on `<html>` when `locale === 'ar' | 'ur'`
- Use logical CSS (`margin-inline`, `padding-inline`) or Tailwind RTL plugin
- Mirror layout for RTL (icons, navigation order)

### Fallback chain
- `ar` → `en` (if key missing)
- `ur` → `ar` → `en` (Urdu often borrows Arabic terms; fallback to Arabic then English)

### Lazy loading
- Load only active locale JSON at runtime to keep initial bundle small
- Consider splitting: `common` (critical) + `checklist`, `install`, etc. (lazy)

### Interpolation
- Support `{{variable}}` in strings, e.g. `"alarmSet": "Alarm set for {{time}}"`

---

## 8. Migration Path

1. **Phase 0 (Current):** All strings in components/data; English only.
2. **Phase 1:** Extract UI strings to `messages/en/*.json`; add `t()`; keep content in `checklistData.ts` temporarily.
3. **Phase 2:** Move Islamic content to `data/content/*.json` with schema; add `arabic`, `transliteration`, `translations`, optional `fiqhClarifications`.
4. **Phase 3:** Add `ar`; implement RTL; validate with schema.
5. **Phase 4+:** Add `ur`, `tr`, `id`, `ms`, `fr` per roadmap.

---

## 9. File Naming Summary

| Type | Pattern | Example |
|------|---------|---------|
| Locale messages | `messages/{locale}/{domain}.json` | `messages/ar/common.json` |
| Content (shared) | `data/content/{type}.json` | `data/content/checklist.json` |
| Schema | `docs/schemas/*.schema.json` | `checklist-item-content.schema.json` |
| Locale metadata | `i18n/locales.ts` | — |

---

## 10. Translation Key Domains

| Domain | Purpose |
|--------|---------|
| `common` | Buttons, labels, nav, errors, generic UI |
| `checklist` | Checklist UI strings (content comes from content/) |
| `install` | Install page steps, FAQ, Why SunnahSleep |
| `pages` | Page titles, meta descriptions |
| `alarms` | Alarm labels, microcopy |
| `sleep` | Sleep tracker, diary labels |
| `wudu` | Wudu steps (if moved to content) |
