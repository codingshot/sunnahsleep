---
name: fact-check-sunnah-quran
description: Verifies Sunnah, Hadith, and Quran content for accuracy and correct sourcing. Use when adding Islamic content, reviewing religious references, or ensuring hadith and Quran verses have valid sources and match authentic texts.
---

# Sunnah, Hadith & Quran Fact-Checking

## Purpose

Ensure all Islamic content in the codebase has:
1. **Correct source references** (valid hadith numbers, proper collection names)
2. **Working verification links** (Sunnah.com, Quran.com)
3. **Accurate text** (Arabic/English matching authentic sources)
4. **Appropriate grading** (prefer Sahih; note if Da'if/weak)

## Verification Workflow

### 1. Hadith References

**Required fields for each hadith:**
- `collection`: bukhari, muslim, abudawud, tirmidhi, nasai, ibnmajah
- `hadithNumber`: Sunnah.com uses global numbering (e.g., Bukhari 6320, not Book 80 Hadith 17)
- `narrator`: Should match Sunnah.com

**Verification steps:**
1. Build URL: `https://sunnah.com/{collection}:{hadithNumber}`
2. Fetch the page and verify:
   - Hadith exists (no 404)
   - Arabic/English text matches or is appropriately paraphrased
   - Narrator is correct
   - Grade: prefer Sahih; document if Da'if
3. Link format in HadithTooltip: uses `collectionMap` for URL building

**Sunnah.com collection mapping:**
- bukhari, muslim, abudawud, tirmidhi, nasai, ibnmajah

### 2. Quran References

**Required fields:**
- `surah`: 1-114
- `ayahStart`, `ayahEnd` (optional for single verse)
- `surahName`, `surahNameArabic`

**Verification steps:**
1. Build URL: `https://quran.com/{surah}/{ayah}`
2. Verify Arabic text matches Uthmani script (minor variants acceptable)
3. Translation should be from a reputable source (e.g., Saheeh International, Muhsin Khan)
4. Audio URLs: islamic.network CDN uses format `.../ar.alafasy/{verse_number}.mp3` (verse number = global position in Quran)

**Quran verse numbering:**
- Surah 2:255 = Ayat al-Kursi
- Surah 2:285-286 = Last two verses of Al-Baqarah
- Surah 112-114 = Three Quls (Al-Ikhlas, Al-Falaq, An-Nas)

### 3. Common Pitfalls

| Issue | Fix |
|-------|-----|
| Wrong hadith number (404) | Cross-check different numbering schemes (USC-MSA vs Sunnah.com) |
| Da'if hadith used for essential practices | Prefer Sahih; if Da'if is only source, note the grade |
| Mismatch between hadithSource text and link | Ensure link URL matches the displayed reference |
| Quran audio verse number wrong | Use global verse index (e.g., 2:255 = verse 262 in standard Uthmani) |

### 4. Key Verification Sources

- **Hadith:** https://sunnah.com (primary)
- **Quran text/translation:** https://quran.com
- **Quran API:** https://api.alquran.cloud (for programmatic verification)
- **Audio:** https://cdn.islamic.network/quran/audio/

## Fact-Check Checklist

When adding or reviewing Islamic content:

- [ ] Every hadith has valid Sunnah.com link
- [ ] Hadith number matches collection (Bukhari 1-7563, Muslim 1-3030, etc.)
- [ ] Quran verses have correct surah:ayah
- [ ] Arabic text matches authenticated source
- [ ] Translation is accurate paraphrase
- [ ] Weak (Da'if) hadith are noted when used
- [ ] No conflicting references (e.g., "Muslim 234" when 234 is wrong)
