# 🌙 SunnahSleep - Islamic Bedtime Companion

<p align="center">
  <img src="public/icon-512.png" alt="SunnahSleep Logo" width="128" height="128">
</p>

<p align="center">
  <strong>Follow the Prophetic Sunnah for Blessed Sleep</strong>
</p>

<p align="center">
  <a href="https://sunnahsleep.app">Live App</a> •
  <a href="https://ummah.build">Built by Ummah.Build</a>
</p>

---

## 🔄 User Flows

### Primary: Complete Sunnah Bedtime Routine

<presentation-mermaid>
graph TD
    A[🌙 Open App] --> B{Evening Time?}
    B -->|Yes| C[1️⃣ Pray Isha]
    C --> D[2️⃣ Bedtime Preparation]
    D --> E[Perform Wudu]
    E --> F[Dust Bed]
    F --> G[3️⃣ Recitations]
    G --> H[Ayat Al-Kursi]
    H --> I[Last 2 Ayat Al-Baqarah]
    I --> J[Three Quls]
    J --> K[4️⃣ Dhikr & Duas]
    K --> L[📿 Tasbih 33-33-34]
    L --> M[Bedtime Duas]
    M --> N[😴 Sleep Right Side]
    N --> O{Wake Last Third?}
    O -->|Yes| P[🌙 Tahajjud Prayer]
    P --> Q[5️⃣ Fajr Prayer]
    O -->|No| Q
    Q --> R[✅ Complete Routine]
    
    style A fill:#1a1a2e,stroke:#d4af37,color:#fff
    style C fill:#1a1a2e,stroke:#d4af37,color:#fff
    style L fill:#1a1a2e,stroke:#d4af37,color:#fff
    style P fill:#1a1a2e,stroke:#d4af37,color:#fff
    style R fill:#1a1a2e,stroke:#d4af37,color:#fff
</presentation-mermaid>

### Flow 1: First-Time User
1. Opens app → Location auto-detected, prayer times load
2. Sees checklist with phases (Evening → Bedtime → Morning)
3. Taps **Recitations** → Expands Ayat al-Kursi, learns with transliteration
4. Taps **Wudu Guide** (header) → Step-by-step wudu instructions
5. Returns to checklist → Completes items, builds streak

### Flow 2: Tahajjud-Focused User
1. Opens app → Goes to **Sleep** tab
2. Enables Tahajjud alarm → App calculates last third of night
3. Sets "30 min before Fajr" wake alarm
4. Completes bedtime checklist, sleeps early
5. Wakes at alarm → Prayers Tahajjud → Fajr

### Flow 3: Sleep Tracker User
1. Prays Isha → Taps "Start Sleep" in Sleep tab
2. Records "Made Isha" ✓
3. Wakes → Taps "I'm Awake" → Records Fajr + sleep quality
4. Views weekly stats (Isha rate, Fajr rate, avg duration)
5. Adds diary entry for dreams/notes

### Flow 4: Quick Reference User
1. Opens app for quick lookup (no account)
2. **Recitations** tab → Ayat al-Kursi, Three Quls with audio
3. **Wudu** page → Brush up on steps before prayer
4. **Prophetic Sleep** (Guides) → Read hadith about sleeping position
5. Closes app — no data left on server

---

## 👤 Customer Personas

### Fatima — The Revert Building Habits
- **Background:** New Muslim, wants to follow Sunnah but unsure where to start
- **Goals:** Learn the bedtime routine, understand the *why* behind each step
- **Pain points:** Overwhelmed by long articles; needs simple, trustworthy sources
- **SunnahSleep fit:** Checklist with Hadith tooltips, Wudu guide, transliteration for recitations

### Ahmed — The Busy Professional
- **Background:** Works late, struggles to pray Isha on time and wake for Fajr
- **Goals:** Build consistency, track progress, get reliable alarms
- **Pain points:** Forgets steps, no accountability, generic apps lack Islamic context
- **SunnahSleep fit:** Prayer alarms, sleep tracker with Isha/Fajr adherence, streak counter

### Aisha — The Tahajjud Seeker
- **Background:** Wants to wake in the last third of the night for night prayer
- **Goals:** Calculate Tahajjud time accurately, get a gentle wake-up
- **Pain points:** Manual calculation is tedious; needs location-based times
- **SunnahSleep fit:** Tahajjud alarm (last third), Fajr-before alarms, Qailulah reminder

### Yusuf — The Privacy-Conscious User
- **Background:** Cautious about apps collecting data, prefers local-only tools
- **Goals:** Islamic content without accounts, tracking, or ads
- **Pain points:** Many apps require login or share data
- **SunnahSleep fit:** 100% local storage, no account, no tracking, PWA offline

### Maryam — The Parent & Educator
- **Background:** Teaches children Islamic practices, wants accurate references
- **Goals:** Show kids the Prophetic routine, verify hadith sources
- **Pain points:** Unverified content online; needs Sunnah.com links
- **SunnahSleep fit:** Every hadith linked to Sunnah.com, Quran verses with translations

---

## 📖 About

SunnahSleep is a privacy-focused Islamic sleep companion app that helps Muslims follow the Prophetic Sunnah before sleep. Based on authentic Hadith from Bukhari, Muslim, and other reliable sources, this app guides users through the complete bedtime routine as practiced by the Prophet Muhammad ﷺ.

**100% Free • 100% Private • No Account Required**

All data is stored locally on your device. We don't collect, track, or transmit any personal information.

---

## ✨ Features

### 📋 Sunnah Sleep Checklist
- **Preparation**: Wudu reminder, bed dusting, Isha prayer check
- **Position**: Right-side sleeping guidance
- **Recitation**: Ayat al-Kursi, bedtime duas
- **Dhikr**: Bedtime remembrance practices
- Each item includes detailed Hadith references with links to Sunnah.com

### 📖 Quran Recitations
- **Ayat al-Kursi** (2:255) with audio recitation
- **Last Two Verses of Surah Al-Baqarah** (2:285-286)
- **Three Quls** (Al-Ikhlas, Al-Falaq, An-Nas)
- Arabic text, transliteration, and English translation
- Audio recitation from renowned reciters

### 📿 Tasbih Counter
- SubhanAllah: 33 times
- Alhamdulillah: 33 times  
- Allahu Akbar: 34 times
- Visual progress tracking with haptic feedback
- Auto-reset for daily practice

### 🛏️ Sleep Tracker
- Track sleep start/end times
- Record Isha and Fajr prayer adherence
- Sleep quality self-assessment
- Weekly statistics and trends
- Isha/Fajr prayer completion rates

### ⏰ Prayer Alarms
- **Auto-detect location** via IP geolocation
- **Manual city search** for precise timing
- **Fajr/Isha prayer alarms** with Adhan sounds
- **"X minutes before Fajr"** wake-up alarms
- **Tahajjud alarm** (last third of night calculation)
- **Qailulah reminder** (midday nap)
- Multiple sound options: Makkah Adhan, Madinah Adhan, gentle tones
- Snooze functionality with customizable duration
- Browser notifications with sound

### 🌐 Progressive Web App (PWA)
- Install to home screen on iOS/Android
- Works offline
- Quran audio cached for offline use
- Fast, native-like experience

---

## 🗂️ Folder Structure

```
sunnahsleep/
├── public/
│   ├── icon-512.png          # App icon
│   ├── og-image.png          # Social sharing image
│   ├── manifest.webmanifest  # PWA manifest
│   ├── robots.txt            # Search engine directives
│   └── sitemap.xml           # SEO sitemap
│
├── src/
│   ├── components/           # React components
│   │   ├── ui/               # shadcn/ui base components
│   │   ├── AlarmsCard.tsx    # Prayer alarms management
│   │   ├── AyatKursiCard.tsx # Ayat al-Kursi display
│   │   ├── ChecklistCard.tsx # Checklist item component
│   │   ├── CompletionCelebration.tsx
│   │   ├── DuaCard.tsx       # Dua display with audio
│   │   ├── HadithTooltip.tsx # Hadith source tooltip
│   │   ├── Header.tsx        # App header with streak
│   │   ├── ProgressRing.tsx  # Circular progress
│   │   ├── QailulahCard.tsx  # Midday nap reminder
│   │   ├── QuranVerseCard.tsx # Quran verse display
│   │   ├── SleepTrackerCard.tsx
│   │   ├── TahajjudCard.tsx  # Night prayer alarm
│   │   └── TasbihCounter.tsx # 33-33-34 counter
│   │
│   ├── data/
│   │   └── checklistData.ts  # All Islamic content/references
│   │
│   ├── hooks/
│   │   ├── useAlarms.ts      # Alarm management & notifications
│   │   ├── useAudio.ts       # Audio playback control
│   │   ├── useChecklist.ts   # Checklist state & persistence
│   │   ├── usePrayerTimes.ts # Prayer times API & calculations
│   │   └── useSleepTracker.ts # Sleep tracking logic
│   │
│   ├── pages/
│   │   ├── Index.tsx         # Main app page
│   │   ├── Legal.tsx         # Legal information
│   │   ├── Privacy.tsx       # Privacy policy
│   │   ├── Terms.tsx         # Terms of service
│   │   └── NotFound.tsx      # 404 page
│   │
│   ├── types/
│   │   └── checklist.ts      # TypeScript type definitions
│   │
│   ├── lib/
│   │   └── utils.ts          # Utility functions
│   │
│   ├── App.tsx               # Root component with routing
│   ├── index.css             # Global styles & design tokens
│   └── main.tsx              # Entry point
│
├── docs/
│   └── EDGE-CASES.md         # Documented edge cases & handling
├── marketing/                # Social media content & workflows
│   ├── README.md             # Content types, platforms, workflows
│   ├── WORKFLOW-FACT-CHECK.md
│   ├── WORKFLOW-CROSS-PLATFORM.md
│   ├── content-types/        # islamic-education, product-features, etc.
│   └── social/               # Platform-ready copy (instagram, twitter, etc.)
├── index.html                # HTML template with SEO
├── tailwind.config.ts        # Tailwind configuration
├── vite.config.ts            # Vite + PWA configuration
└── README.md                 # This file
```

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router DOM
- **State**: React hooks + localStorage
- **PWA**: vite-plugin-pwa
- **APIs**: 
  - [Aladhan API](https://aladhan.com/prayer-times-api) - Prayer times
  - [Islamic Network](https://islamic.network/) - Quran audio
  - [Open-Meteo Geocoding](https://open-meteo.com/) - City search

---

## 💡 Ideas & Future Features

### High Priority
- [ ] **Push Notifications** - Service worker-based notifications for alarms even when app is closed
- [ ] **Real Adhan Audio** - Add authentic Makkah/Madinah adhan recordings
- [ ] **Install Prompt Page** - Dedicated /install page with platform-specific instructions
- [ ] **Dream Journal** - Record and reflect on dreams with Islamic interpretation guidance
- [ ] **Multi-language Support** - Arabic, Urdu, Turkish, Malay, French, Indonesian

### Medium Priority
- [ ] **Weekly/Monthly Reports** - Detailed analytics on sleep patterns and prayer adherence
- [ ] **Widget Support** - Home screen widgets for quick access (PWA limitation)
- [ ] **Guided Audio** - Voice-guided bedtime routine with recitations
- [ ] **Dark/Light Theme Toggle** - Currently dark-only
- [ ] **Customizable Checklist** - Allow users to add/remove items
- [ ] **Quran Reciter Selection** - Multiple reciter options

### Nice to Have
- [ ] **Family Sharing** - Share progress with family (requires backend)
- [ ] **Ramadan Mode** - Special features for Ramadan nights
- [ ] **Integration with Prayer Apps** - Import prayer times from other apps
- [ ] **Apple Watch / Wear OS** - Wearable companion app
- [ ] **Bedtime Stories** - Islamic stories for children's bedtime
- [ ] **Sleep Sounds** - Nature sounds, Quran background recitation

---

## ✅ To-Do Checklist

### Completed ✓
- [x] Core checklist functionality
- [x] Tasbih counter (33-33-34)
- [x] Ayat al-Kursi with audio
- [x] Last two verses of Al-Baqarah
- [x] Three Quls recitation cards
- [x] Bedtime duas with translations
- [x] Hadith source tooltips with Sunnah.com links
- [x] Progress tracking with streaks
- [x] Sleep tracker with Isha/Fajr adherence
- [x] Prayer times API integration
- [x] Tahajjud time calculation
- [x] Qailulah reminder
- [x] Location auto-detection
- [x] Manual city search
- [x] Custom alarms with sounds
- [x] Browser notifications
- [x] Snooze functionality
- [x] PWA support with offline caching
- [x] Privacy/Terms/Legal pages
- [x] SEO optimization
- [x] Structured data for AI search engines
- [x] Mobile responsive design
- [x] Accessibility improvements

### In Progress
- [ ] Sound preview in alarm settings
- [ ] Comprehensive test coverage

### Planned
- [ ] Real adhan audio files
- [ ] Push notification service worker
- [ ] Multi-language i18n setup
- [ ] Performance optimization
- [ ] End-to-end testing with Playwright

---

## 📣 Marketing

The `/marketing` folder contains:

- **Content types:** Islamic education, product features, thought leadership, statistics
- **Fact-check workflow:** Verify hadith/Quran before posting ([WORKFLOW-FACT-CHECK.md](marketing/WORKFLOW-FACT-CHECK.md))
- **Cross-platform workflow:** One content → reformatted for Instagram, Twitter, Facebook, LinkedIn, TikTok ([WORKFLOW-CROSS-PLATFORM.md](marketing/WORKFLOW-CROSS-PLATFORM.md))
- **Platform-ready copy:** Example posts in `marketing/social/`

---

## 🔒 Privacy

SunnahSleep is designed with privacy as a core principle:

- **No account required** - Use immediately without registration
- **Local storage only** - All data stays on your device
- **No tracking** - Zero analytics or usage tracking
- **No ads** - Clean, distraction-free experience
- **Open about data use** - See our [Privacy Policy](/privacy)

---

## 🤝 Contributing

This is an open project by [Ummah.Build](https://ummah.build). Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📜 Islamic Sources

All content is based on authentic sources:

- **Quran**: Verses from Quran.com
- **Hadith**: References from Sunnah.com
- **Prayer Times**: Calculated using ISNA method via Aladhan API
- **Audio**: Recitations from Islamic Network (Al-Afasy, Abdul Basit, etc.)

---

## 📄 License

This project is open source. Feel free to use, modify, and distribute.

---

<p align="center">
  Made with ❤️ by <a href="https://ummah.build">Ummah.Build</a>
</p>

<p align="center">
  <em>"And it is He who has made the night for you as clothing and sleep [a means for] rest"</em><br>
  — Surah Al-Furqan 25:47
</p>
