# Translation & Transliteration Audit

**Scope:** All Arabic content in SunnahSleep

## Current Coverage

### Quran Content

| Item | Arabic | Translation | Transliteration | Status |
|------|--------|-------------|-----------------|--------|
| Ayat al-Kursi (2:255) | ✓ | ✓ | ✓ | Complete |
| Last 2 verses Baqarah (2:285) | ✓ | ✓ | ✓ | Complete |
| Last 2 verses Baqarah (2:286) | ✓ | ✓ | ✓ | Complete |
| Al-Ikhlas (112) | ✓ | ✓ | ✓ | Complete |
| Al-Falaq (113) | ✓ | ✓ | ✓ | Complete |
| An-Nas (114) | ✓ | ✓ | ✓ | Complete |

### Duas

| Item | Arabic | Translation | Transliteration | Status |
|------|--------|-------------|-----------------|--------|
| Bismika Allahumma | ✓ | ✓ | ✓ | Complete |
| Rabbi wada'tu janbi | ✓ | ✓ | ✓ | Complete |
| Allahumma aslamtu | ✓ | ✓ | ✓ | Complete |
| Wake dua | ✓ | ✓ | ✓ | Complete |

### Hadith (checklistData hadithReference)

| Field | Used For | Transliteration Needed? |
|-------|----------|-------------------------|
| arabicText | Display in tooltips | Optional (learning aid) |
| englishText | English translation | N/A |

### Wudu Steps

| Step | Arabic | Transliteration | Translation | Status |
|------|--------|-----------------|-------------|--------|
| All 11 steps | ✓ | ✓ | ✓ (some optional) | Complete |

## Standard Transliterations (Reference)

### Last 2 Verses of Al-Baqarah

**2:285:**
- آمن الرسول → Amānar-Rasūlu
- آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ → Aman ar-rasulu bima unzila ilayhi min rabbihi wal-mu'minun...

**2:286:**
- لا يكلف الله → La yukallifu Allahu...

### Three Quls

**Al-Ikhlas (112:1-4):**
- قُلْ هُوَ اللَّهُ أَحَدٌ → Qul Huwa Allahu Ahad
- اللَّهُ الصَّمَدُ → Allahus-Samad
- لَمْ يَلِدْ وَلَمْ يُولَدْ → Lam yalid wa lam yulad
- وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ → Wa lam yakun lahu kufuwan ahad

**Al-Falaq (113:1-5):** Qul a'udhu bi Rabbi al-Falaq...

**An-Nas (114:1-6):** Qul a'udhu bi Rabbi an-Nas...

## Component Support

| Component | Supports Transliteration? |
|-----------|---------------------------|
| AyatKursiCard | Yes |
| QuranVerseCard | Yes (optional `transliteration` in verse) |
| DuaCard | Yes |
| HadithTooltip | No (arabicText + englishText) |
| ChecklistCard (hadith) | englishText only |

## Implementation Status (Updated)

All Quran verses now have transliteration. QuranVerseCard displays it when present.
