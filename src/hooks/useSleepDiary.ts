import { useState, useEffect, useCallback } from 'react';
import { DiaryEntry } from '@/components/SleepDiaryDialog';
import { getStorageJson, setStorageJson } from '@/lib/storage';

const DIARY_KEY = 'sunnahSleepDiary';

export function useSleepDiary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  // Load entries on mount
  useEffect(() => {
    const saved = getStorageJson<DiaryEntry[]>(DIARY_KEY);
    if (Array.isArray(saved)) setEntries(saved);
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
      
      setStorageJson(DIARY_KEY, updated);
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
      setStorageJson(DIARY_KEY, updated);
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
