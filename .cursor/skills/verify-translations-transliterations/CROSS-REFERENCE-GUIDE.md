# Cross-Reference Guide for Translations

How to verify Arabic → English translations and transliterations against authoritative sources.

## Quran

### API: api.alquran.cloud

```
GET https://api.alquran.cloud/v1/ayah/2:255/en.sahih
GET https://api.alquran.cloud/v1/ayah/2:285/en.sahih
```

Response includes `data.text` (translation) and `data.surah` / `data.numberInSurah`.

### Manual: Quran.com

- https://quran.com/2/255 (Ayat al-Kursi)
- https://quran.com/2/285 (First of last two verses)
- https://quran.com/2/286 (Second of last two verses)
- https://quran.com/112 (Al-Ikhlas)
- https://quran.com/113 (Al-Falaq)
- https://quran.com/114 (An-Nas)

Compare:
1. Arabic (Uthmani) – character-for-character or accept minor diacritic variants
2. Translation – meaning should match; wording can differ (Saheeh International vs Muhsin Khan vs our app)
3. Transliteration – not on Quran.com; use islamicity.org, islamicfinder.org, or standard romanization tables

## Duas & Hadith

### Sunnah.com

- Hadith English: https://sunnah.com/{collection}:{hadithNumber}
- Compare `hadithReference.englishText` with Sunnah.com’s English translation
- Allow paraphrasing; flag major meaning differences

### Common Duas

| Dua | Reference |
|-----|-----------|
| Bismika Allahumma amutu wa ahya | Bukhari 6324 |
| Rabbi wada'tu janbi | Bukhari 6320 |
| Allahumma aslamtu nafsi | Bukhari 6311 |
| Dua after wudu | Abu Dawud 169 |

## Transliteration Romanization

Use one system and keep it consistent:

- **Apostrophe** for ع and hamza: `'` (e.g., `a'udhu`, `Rabbana`)
- **Double letters** for emphatics: `S`, `D`, `T`, `Z` vs `s`, `d`, `t`, `z`
- **Common spellings**: Allah, Bismillah, SubhanAllah, Alhamdulillah, Allahu Akbar
- **Long vowels**: aa, ii, uu or ā, ī, ū (pick one)
