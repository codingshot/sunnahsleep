import { useState, useEffect, useCallback } from 'react';
import { DiaryEntry } from '@/components/SleepDiaryDialog';

const DIARY_KEY = 'sunnahSleepDiary';

export function useSleepDiary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  // Load entries on mount
  useEffect(() => {
    const saved = localStorage.getItem(DIARY_KEY);
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  // Save entry
  const saveEntry = useCallback((entry: Omit<DiaryEntry, 'id' | 'createdAt'>) => {
    const newEntry: DiaryEntry = {
      ...entry,
      id: `diary-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setEntries(prev => {
      // Check if entry for this date already exists
      const existingIndex = prev.findIndex(e => e.date === entry.date);
      let updated: DiaryEntry[];
      
      if (existingIndex >= 0) {
        // Update existing entry
        updated = [...prev];
        updated[existingIndex] = { ...newEntry, id: prev[existingIndex].id };
      } else {
        // Add new entry
        updated = [...prev, newEntry];
      }
      
      localStorage.setItem(DIARY_KEY, JSON.stringify(updated));
      return updated;
    });

    return newEntry;
  }, []);

  // Get entry by date
  const getEntryByDate = useCallback((date: string) => {
    return entries.find(e => e.date === date) || null;
  }, [entries]);

  // Get recent entries
  const getRecentEntries = useCallback((limit: number = 7) => {
    return [...entries]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }, [entries]);

  // Delete entry
  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => {
      const updated = prev.filter(e => e.id !== id);
      localStorage.setItem(DIARY_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    entries,
    saveEntry,
    getEntryByDate,
    getRecentEntries,
    deleteEntry,
  };
}
