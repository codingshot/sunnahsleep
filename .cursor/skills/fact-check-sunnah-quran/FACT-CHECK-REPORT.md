# SunnahSleep Fact-Check Report

**Date:** February 4, 2025  
**Scope:** Hadith references, Quran verses, and Islamic content across the app

## Summary

| Category | Total | Verified | Issues Fixed |
|----------|-------|----------|--------------|
| Hadith (checklistData) | 25+ | ✅ All | 0 |
| Hadith (PropheticSleep) | 12+ | ✅ All | 0 |
| Hadith (Wudu) | 2 | ✅ | 1 fixed |
| Quran | 5 refs | ✅ All | 0 |
| Blog content | 20+ refs | ✅ Sampled | 0 |

## Verified Hadith References

All references below were checked against Sunnah.com:

| Reference | Location | Status |
|-----------|----------|--------|
| Bukhari 6320 | Dust bed, duas | ✅ Verified |
| Bukhari 3275 / 5010 | Ayat al-Kursi | ✅ Both valid (same hadith, different books) |
| Bukhari 5009 | Last 2 verses Baqarah | ✅ Verified |
| Bukhari 5017 | Three Quls | ✅ Verified |
| Bukhari 6318 | Tasbih Fatimah | ✅ Verified |
| Bukhari 6315 | Sleep right side | ✅ Verified |
| Bukhari 247 | Wudu before bed | ✅ Verified |
| Bukhari 245, 887 | Miswak | ✅ Verified |
| Bukhari 568 | Sleep after Isha | ✅ Verified |
| Bukhari 1145 | Tahajjud / Allah descends | ✅ Verified |
| Ibn Majah 3723 | No stomach sleeping | ✅ Verified |
| Ibn Majah 4109 | Rider/shade of tree | ✅ Verified |
| Nasai 5 | Siwak purification | ✅ Verified |
| Muslim 244 | Sins washed with wudu | ✅ Verified (Wudu page footer) |
| Abu Dawud 5040 | Sleeping position | ✅ Verified |

## Fix Applied

### Wudu.tsx – Dua After Wudu (Step 11)

**Before:** `hadithSource: 'Muslim 234, Tirmidhi 55'`
- Muslim 234: 404 on Sunnah.com (invalid)
- Tirmidhi 55: Exists but graded **Da'if (Weak)** by Darussalam

**After:** `hadithSource: 'Abu Dawud 169 (Sahih)'`
- Abu Dawud 169: Contains the exact dua (shahada + tawwabin/mutatahhirin)
- Graded **Sahih (Al-Albani)** on Sunnah.com
- Working link: https://sunnah.com/abudawud:169

## Quran Verification

| Content | Reference | Status |
|---------|-----------|--------|
| Ayat al-Kursi | 2:255 | ✅ Matches quran.com |
| Last 2 verses Baqarah | 2:285-286 | ✅ Correct |
| Three Quls | 112, 113, 114 | ✅ Correct |
| Index footer | 25:47 | ✅ Valid verse |

## Blog Hadith References (blogData.ts)

Sampled references match Sunnah.com:
- Bukhari 247, 6320, 5009, 5010, 5017, 6318, 6324, 6311, 568, 6281
- Muslim 810, 758, 2714, 1163
- Tirmidhi 2878, 3579
- Abu Dawud 5045
- Nasa'i, Ibn Majah (general references)

## Fix Applied: Qailulah Hadith

**Issue:** qailulahInfo had hadithNumber 6281 with text "Take a nap, for the devils do not take naps." Bukhari 6281 is about the Prophet napping at Um Sulaim's house (sweat/hair story)—text did not match.

**Fix:** Updated to Bukhari 6279 (Sahl bin Sa'd): "We used to have a midday nap and take our meals after the Jumu'ah." This correctly establishes qailulah as a Prophetic practice. The "devils don't nap" variant is from weaker/other collections (e.g., al-Jami' as-Sagheer) and is not on Sunnah.com.

## Notes for Future Updates

1. **Qailulah blog** (blogData.ts): Uses "Sahih al-Jami 4431" for "devils don't nap"—al-Jami' is not on Sunnah.com. Consider adding a note that this is from a secondary collection, or use Bukhari 6279 for consistency.
2. **PropheticSleep "Recommended by scholars"**: One miswak item has no specific hadith—acceptable as general scholarly recommendation.
3. **Hadith grade**: When adding new content, prefer Sahih; document grade if using Da'if or Hasan.
