---
name: implement-translations-transliterations
description: Implements missing transliterations and ensures translation/transliteration consistency across Arabic content. Use when adding new Islamic text, filling transliteration gaps, or updating components to display transliterations. Works with verify-translations-transliterations skill.
---

# Implement Translations & Transliterations

## Purpose

1. Add missing transliterations to Quran verses, duas, and other Arabic content
2. Update components to display transliterations where absent
3. Ensure data structures support translation + transliteration

## Data Structure Updates

### QuranVerse (for QuranVerseCard)

**Current:**
```ts
interface QuranVerse {
  ayah: number;
  arabic: string;
  translation: string;
  audioUrl?: string;
}
```

**Add:**
```ts
transliteration?: string;  // Optional for backwards compatibility
```

### checklistData Changes

**lastTwoAyahBaqarah.verses** – Add transliteration to each:
```ts
{
  ayah: 285,
  arabic: '...',
  transliteration: 'Amanar-rasulu bima unzila ilayhi...',
  translation: '...',
  audioUrl: '...'
}
```

**threeQuls** – Add transliteration to each:
```ts
{
  id: 'ikhlas',
  surah: 112,
  name: 'Al-Ikhlas',
  nameArabic: 'الإخلاص',
  arabic: '...',
  transliteration: 'Qul Huwa Allahu Ahad...',
  translation: '...',
  audioUrl: '...'
}
```

## Component Updates

### QuranVerseCard

1. Extend QuranVerse interface to include `transliteration?: string`
2. Render transliteration between Arabic and Translation when present:

```tsx
{/* Arabic */}
<p className="font-arabic ...">{verse.arabic}</p>

{/* Transliteration - add this block */}
{verse.transliteration && (
  <div>
    <p className="text-xs text-muted-foreground mb-1 uppercase">Transliteration</p>
    <p className="text-cream-dim italic">{verse.transliteration}</p>
  </div>
)}

{/* Translation */}
<p className="text-foreground ...">{verse.translation}</p>
```

### Index.tsx (Three Quls mapping)

When passing verses to QuranVerseCard, include transliteration:
```tsx
verses={[{
  ayah: 1,
  arabic: qul.arabic,
  transliteration: qul.transliteration,  // Add
  translation: qul.translation,
  audioUrl: qul.audioUrl
}]}
```

## Transliteration Source Guidelines

1. **Quran** – Use Saheeh International / common romanization (match quran.com style)
2. **Consistency** – Match existing app style (e.g., ayatKursi uses "Allahu la ilaha illa Huwa")
3. **Format** – Italic, smaller text; label "Transliteration"

## Implementation Checklist

- [ ] Add transliteration to lastTwoAyahBaqarah verses (2:285, 2:286)
- [ ] Add transliteration to threeQuls (Al-Ikhlas, Al-Falaq, An-Nas)
- [ ] Update QuranVerse interface in QuranVerseCard
- [ ] Update QuranVerseCard to render transliteration when present
- [ ] Update Index.tsx threeQuls map to pass transliteration
- [ ] Cross-verify with verify-translations-transliterations skill
- [ ] Run fact-check skill on any changed content

## Reference: Standard Transliterations

See [TRANSLATION-AUDIT.md](../verify-translations-transliterations/TRANSLATION-AUDIT.md) in verify-translations-transliterations skill for reference transliterations.
