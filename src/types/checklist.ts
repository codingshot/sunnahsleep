export interface ChecklistItem {
  id: string;
  title: string;
  titleArabic?: string;
  description: string;
  hadithSource?: string;
  completed: boolean;
  category: 'preparation' | 'recitation' | 'position' | 'dhikr';
}

export interface DuaItem {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  source?: string;
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
