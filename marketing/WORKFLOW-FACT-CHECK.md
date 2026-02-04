# Fact-Check Workflow for Marketing Content

Before posting any Islamic content, validate accuracy using this workflow.

## Checklist

- [ ] **Hadith** — Verify on Sunnah.com: `https://sunnah.com/{collection}:{number}`
- [ ] **Quran** — Verify on Quran.com: `https://quran.com/{surah}/{ayah}`
- [ ] **Translation** — Cross-check with Saheeh International or reputable source
- [ ] **Statistics** — Cite source (study, report, or "scholars say")
- [ ] **Attribution** — Never attribute to the Prophet ﷺ without verified hadith

## Quick Reference

### Sunnah.com Collections
- Bukhari: bukhari
- Muslim: muslim
- Abu Dawud: abudawud
- Tirmidhi: tirmidhi
- Nasa'i: nasai
- Ibn Majah: ibnmajah

### Common SunnahSleep Hadiths
| Topic | Reference | URL |
|-------|-----------|-----|
| Dust bed 3x | Bukhari 6320 | sunnah.com/bukhari:6320 |
| Sleep right side | Bukhari 6315 | sunnah.com/bukhari:6315 |
| Ayat al-Kursi before sleep | Bukhari 3275/5010 | sunnah.com/bukhari:5010 |
| Last 2 verses Baqarah | Bukhari 5009 | sunnah.com/bukhari:5009 |
| Tasbih 33-33-34 | Bukhari 6318 | sunnah.com/bukhari:6318 |
| Wudu before bed | Bukhari 247 | sunnah.com/bukhari:247 |
| Tahajjud / Allah descends | Bukhari 1145 | sunnah.com/bukhari:1145 |
| Sleep after Isha | Bukhari 568 | sunnah.com/bukhari:568 |
| Qailulah | Bukhari 6279 | sunnah.com/bukhari:6279 |

### Red Flags
- Unverified "The Prophet said" — must have collection + number
- Statistics without source — add "studies show" + link or remove
- Paraphrased hadith that changes meaning — use exact or clearly mark as paraphrase
- Weak (Da'if) hadith for critical practice — prefer Sahih or note grade

## Integration with Codebase

Use the project's fact-check skill:
- `.cursor/skills/fact-check-sunnah-quran/SKILL.md`
- `.cursor/skills/fact-check-sunnah-quran/FACT-CHECK-REPORT.md`

## Approval

| Content Type | Approver |
|--------------|----------|
| Islamic education | Fact-check against fact-check-sunnah-quran skill |
| Statistics | Verify source exists |
| Product features | Internal review for accuracy |
