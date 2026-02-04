---
name: verify-translations-transliterations
description: Verifies Arabic-to-English translations and transliterations for accuracy. Cross-references against Quran.com, Sunnah.com, and standard romanization. Use when adding Islamic text, reviewing Arabic content, or ensuring translations and transliterations are correct and consistent.
---

# Verify Translations & Transliterations

## Purpose

Ensure all Arabic Islamic content has:
1. **Accurate English translations** (cross-referenced with authoritative sources)
2. **Correct transliterations** (consistent romanization of Arabic)
3. **Complete coverage** (every Arabic text that users recite should have both)

## Content Types to Verify

| Type | Location | Fields to Check |
|------|----------|-----------------|
| Quran verses | checklistData: ayatKursi, lastTwoAyahBaqarah, threeQuls | arabic, translation, transliteration |
| Duas | checklistData: duas | arabic, transliteration, translation |
| Hadith | hadithReference: arabicText, englishText | Cross-check englishText vs Sunnah.com |
| Wudu steps | Wudu.tsx: wuduSteps | arabic, transliteration, translation |
| Titles | titleArabic | Optional: add transliteration for learning |

## Verification Workflow

### 1. Quran Translation Cross-Reference

**Primary sources:** Quran.com, api.alquran.cloud

**Steps:**
1. Fetch verse from `https://api.alquran.cloud/v1/ayah/{surah}:{ayah}/en` (or quran.com)
2. Compare app translation with Saheeh International / Muhsin Khan
3. Allow minor paraphrasing; flag major meaning differences
4. Note: Our app may use different translation; ensure meaning is preserved

**Key verses in app:**
- 2:255 (Ayat al-Kursi)
- 2:285-286 (Last two of Baqarah)
- 112, 113, 114 (Three Quls)

### 2. Transliteration Standards

**Romanization style:** Use a consistent system (e.g., common Islamic romanization):

| Arabic | Preferred | Avoid |
|--------|-----------|-------|
| ا | a, aa | a, ah |
| ة | ah, a | h, t |
| ع | ' (ayn) | 3, a |
| ح | h | 7, kh |
| خ | kh | 5, x |
| ش | sh | ch |
| ذ | dh | z, th |
| ث | th | s, t |
| ص | s | s |
| ض | d | d |
| ط | t | t |
| ظ | z | z, dh |
| ق | q | k |
| غ | gh | g |
| أ، إ، آ | a, i, u + hamza | inconsistent |

**Consistency rules:**
- Allah (not God in transliteration)
- Bismillah, SubhanAllah, Alhamdulillah, Allahu Akbar
- Use apostrophe for ع and ء: `'` 
- Long vowels: aa, ii, uu or macrons
- Avoid numbers (2, 3, 5, 7) for letters

### 3. Dua & Quran Transliteration Cross-Check

**Steps:**
1. Ensure transliteration matches Arabic phonetically (syllable by syllable)
2. Cross-check with reputable sources: islamicity.org, islamicfinder.org, Sunnah.com
3. Common duas (Bismika Allahumma, etc.)—verify against multiple sources

### 4. Hadith English Text

**Source:** Sunnah.com (primary)
- hadithReference.englishText should match or closely paraphrase Sunnah.com
- Allow minor wording differences; flag if meaning diverges

## Verification Checklist

- [ ] Every Quran verse has: arabic, translation, transliteration
- [ ] Every dua has: arabic, transliteration, translation
- [ ] Transliteration uses consistent romanization
- [ ] Translation meaning matches quran.com / Sunnah.com
- [ ] No mixed systems (e.g., "Bismillah" + "bismi llāh" in same context)

## Reference URLs

- **Quran API:** https://api.alquran.cloud
- **Quran.com:** https://quran.com
- **Sunnah.com:** https://sunnah.com (for hadith English)
- **Transliteration guide:** ISO 233 or standard Islamic romanization tables
