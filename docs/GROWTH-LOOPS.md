# SunnahSleep Growth Loops — No Accounts, No Social Graph

10 growth loops that work within a pure PWA stack: client-side only, no backend, no user accounts.

---

## 1. Shareable "Tonight's Sunnah" Image

**Concept:** Generate a card image with today's bedtime checklist snippet (e.g., "Dust the bed 3x — Bukhari 6320") and a CTA to the app. User shares to WhatsApp, Instagram, Stories.

**Technical feasibility:**
- **Canvas API** or **html2canvas** — Render a styled div to canvas, export as PNG. 100% client-side.
- **Web Share API** — `navigator.share({ title, text, url, files: [blob] })` on supported mobile browsers. Fallback: download + "Share this image" prompt.
- **Privacy:** No server. Image generated in-browser. Optional: add `?ref=tonight` to URL for analytics if you add a lightweight ping later (not required).

**Implementation:** New route `/share/tonight` or component that renders card, converts to blob, triggers share. Store no user data.

---

## 2. Reminder Links (Time-Triggered URLs)

**Concept:** "Set a reminder" creates a link like `sunnahsleep.app/remind?t=20:30&msg=fajr` — user pastes into Google Calendar, Apple Reminders, or a reminder app. At 8:30 PM, they get a notification (from that app) and tap through to SunnahSleep.

**Technical feasibility:**
- **URL structure:** `sunnahsleep.app/remind?time=20:30&msg=bedtime` — Query params only. No backend.
- **Landing:** Route `/remind` reads params, shows a friendly page: "Time for your Sunnah reminder! 🌙" with CTA to checklist. Optional: pre-select tab via `?tab=checklist`.
- **Calendar integration:** User manually adds event with URL. No OAuth. Works with any calendar/reminder app that supports URLs.
- **PWA:** If installed, link opens in app. If not, opens in browser.

**Implementation:** Add `/remind` route. Page displays `msg` and time from query. Copyable "Add to calendar" link with `webcal:` or `https://calendar.google.com/calendar/render?action=TEMPLATE&text=...&details=...`.

---

## 3. Ramadan Mode Deep Links

**Concept:** `sunnahsleep.app/ramadan` or `sunnahsleep.app?mode=ramadan` — Special UI: Tahajjud focus, Qiyam reminders, Laylat al-Qadr countdown. Shareable so communities can link directly.

**Technical feasibility:**
- **Client-side mode:** `?mode=ramadan` or `/ramadan` stored in URL. React reads `useSearchParams()` or route param. No backend.
- **Date logic:** Ramadan dates computed client-side (e.g., lunar calendar lib or static list for next few years). No API required.
- **Deep link:** Any URL works. `sunnahsleep.app/ramadan` or `sunnahsleep.app?tab=recitations&mode=ramadan`. PWA handles routing.

**Implementation:** Add `/ramadan` route or mode flag. Conditional UI (banner, adjusted quick-actions, countdown). Shareable URL.

---

## 4. "Isha in 30" Shareable Countdown Link

**Concept:** Link like `sunnahsleep.app/countdown?city=London` — Opens a page showing "Isha in 30 min" (or actual countdown to local Isha). User shares with family: "Jummah Isha at 6:45 — set your reminder."

**Technical feasibility:**
- **Geolocation:** `city` in query OR IP geolocation (existing `ipwho.is`). Fetch prayer times via Aladhan (existing).
- **Countdown:** Client-side `setInterval` to update "X min until Isha". No backend.
- **Share:** Copy link or Web Share with `url` + `text`. Link encodes city for recipient.

**Implementation:** New route `/countdown?city=London` or `?lat=51.5&lng=-0.1`. Page fetches prayer times, shows countdown. Share button copies `window.location.href`.

---

## 5. Wudu Quick-Reference Share Card

**Concept:** Generate an image of the Wudu steps (1–10) as a shareable card. User shares with a new Muslim or posts in a group.

**Technical feasibility:**
- Same as #1: Canvas or html2canvas. Render steps from existing `wuduSteps` data. Export PNG, Web Share.
- **Content:** All from `src/pages/Wudu.tsx` — steps, Arabic, transliteration. No new data source.
- **Privacy:** Fully client-side. No tracking.

**Implementation:** `/share/wudu` or "Share Wudu card" button on Wudu page. Generate image, share or download.

---

## 6. "Streak Saver" Reminder Link

**Concept:** User has a 5-day streak. App offers: "Get a reminder tonight" — generates `sunnahsleep.app/remind?msg=streak&day=6`. User adds to their reminder app. Tapping link brings them back to preserve streak.

**Technical feasibility:**
- **URL only:** `?msg=streak` — No user ID. Recipient sees "Don't break your streak! Complete tonight's checklist."
- **Streak in URL:** Optional `&day=6` for copy ("You're on day 6 — one more!"). Cosmetic only; no server.
- **Landing:** `/remind` or `/` with `?msg=streak` — Show motivational copy. Streak lives in recipient's localStorage; no cross-device sync.

**Implementation:** "Remind me tonight" button in Header (when streak > 0). Copies or shares URL. Same `/remind` page handles it.

---

## 7. Ayat al-Kursi / Three Quls Share Images

**Concept:** Generate a beautifully styled image of Ayat al-Kursi or a Qul — Arabic + translation. User shares on social or saves as wallpaper.

**Technical feasibility:**
- **Canvas/html2canvas:** Render verse with existing Arabic font (Amiri). Design as card with gradient, frame.
- **Content:** From `checklistData.ts` — verses already in app. No new API.
- **Offline:** Works if Quran text cached. Audio optional.
- **Web Share:** `files: [imageBlob]` for native share sheet on mobile.

**Implementation:** "Share this verse" on AyatKursiCard and QuranVerseCard. Generate image, share.

---

## 8. Install Prompt Deep Link

**Concept:** `sunnahsleep.app/install` exists. Add `?ref=friend` or `?from=link` — Shows install CTA with copy: "A friend shared SunnahSleep with you. Install to get started."

**Technical feasibility:**
- **URL param:** `?ref=friend` — Read in Install page, adjust headline. No backend. No tracking unless you add (you don't need to).
- **PWA:** Install flow is standard. `beforeinstallprompt` if supported. No server.
- **Shareability:** Users share `sunnahsleep.app/install` in groups. Params optional for A/B messaging.

**Implementation:** Install page reads `searchParams.get('ref')`. Conditional headline/copy.

---

## 9. "Tonight's Checklist" Printable / PDF

**Concept:** One-tap export of tonight's Sunnah checklist as PDF or printable HTML. User prints for elderly parent or shares PDF in family group.

**Technical feasibility:**
- **Print CSS:** `window.print()` with `@media print` styles. No lib needed. Browser handles PDF export (e.g., "Save as PDF").
- **Printable HTML:** Page with checklist items, hadith refs, CTA. Route `/print` or print-only view.
- **No backend:** Entirely client-side. Content from checklistData.

**Implementation:** "Print checklist" button. Opens `window.open('/print', '_blank')` or navigates to `/print`. Print-optimized layout. User uses browser's Print → Save as PDF.

---

## 10. Referral-Less "Send to a Friend" Copy-Paste

**Concept:** No referral codes. Instead: pre-filled message + link for WhatsApp/Telegram/SMS. "Salam! Found this app for the Prophetic bedtime routine — no account, works offline. sunnahsleep.app"

**Technical feasibility:**
- **Web Share API:** `navigator.share({ title, text, url })` — Opens native share sheet. Text includes link.
- **Fallback:** "Copy link" + "Copy message" buttons. `navigator.clipboard.writeText()`. User pastes manually.
- **No tracking:** Link is static. No UTM or user ID. Pure PWA.
- **Variants:** Different messages for different contexts — "For Ramadan," "For Tahajjud," "For new Muslims." User picks.

**Implementation:** "Share with a friend" in header or Install page. Dropdown: "WhatsApp style," "Short," "For new Muslims." Copies `text + url` to clipboard. Optional Web Share.

---

## Summary: Technical Feasibility Matrix

| Loop | Backend | New Deps | Complexity | PWA Native |
|------|---------|----------|------------|------------|
| Tonight's Sunnah image | ❌ | html2canvas (optional) | Medium | ✅ |
| Reminder links | ❌ | ❌ | Low | ✅ |
| Ramadan deep links | ❌ | ❌ | Low | ✅ |
| Isha countdown link | ❌ | ❌ (uses existing) | Low | ✅ |
| Wudu share card | ❌ | html2canvas (optional) | Medium | ✅ |
| Streak saver link | ❌ | ❌ | Low | ✅ |
| Verse share images | ❌ | html2canvas (optional) | Medium | ✅ |
| Install deep link | ❌ | ❌ | Low | ✅ |
| Printable checklist | ❌ | ❌ | Low | ✅ |
| Send to friend copy | ❌ | ❌ | Low | ✅ |

**Note on html2canvas:** Can be replaced with **Canvas API** + manual drawing for zero deps, or **SVG foreignObject** + `toDataURL` in some browsers. Canvas gives full control and no bundle cost if you draw manually.

---

## Suggested Implementation Order

1. **Reminder links** (#2) — Highest utility, lowest effort  
2. **Ramadan deep links** (#3) — Seasonal impact  
3. **Send to friend** (#10) — Simple, viral potential  
4. **Install deep link** (#8) — Already have /install  
5. **Printable checklist** (#9) — Quick win  
6. **Isha countdown** (#4) — Useful for groups  
7. **Tonight's Sunnah image** (#1) — Higher effort, high shareability  
8. **Verse share images** (#7) — Similar to #1  
9. **Wudu card** (#5) — Niche but valuable  
10. **Streak saver** (#6) — Retention-focused  
