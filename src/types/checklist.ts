export interface ChecklistItem {
  id: string;
  title: string;
  titleArabic?: string;
  description: string;
  detailedExplanation?: string;
  hadithSource?: string;
  hadithReference?: HadithReference;
  quranReference?: QuranReference;
  audioUrl?: string;
  completed: boolean;
  category: 'preparation' | 'recitation' | 'position' | 'dhikr';
}

export interface HadithReference {
  collection: string;
  bookNumber?: number;
  hadithNumber?: number;
  narrator?: string;
  arabicText?: string;
  englishText?: string;
}

export interface QuranReference {
  surah: number;
  ayahStart: number;
  ayahEnd?: number;
  surahName: string;
  surahNameArabic: string;
}

export interface DuaItem {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  source?: string;
  hadithReference?: HadithReference;
  audioUrl?: string;
}

export interface TasbihCount {
  subhanAllah: number;
  alhamdulillah: number;
  allahuAkbar: number;
}

export interface DailyProgress {
  date: string;
  completedItems: string[];
  tasbihCompleted: boolean;
  streak: number;
}

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface QailulahSettings {
  enabled: boolean;
  reminderTime: string;
  duration: number; // in minutes
}

export interface TahajjudSettings {
  enabled: boolean;
  alarmTime: string | null;
  calculatedTime: string | null;
}
