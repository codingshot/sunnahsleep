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
