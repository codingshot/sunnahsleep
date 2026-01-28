import { useState, useEffect, useCallback } from 'react';
import { ChecklistItem, TasbihCount } from '@/types/checklist';
import { checklistItems as initialItems } from '@/data/checklistData';

const STORAGE_KEY = 'islamicSleep';
const STREAK_KEY = 'islamicSleepStreak';

interface StoredData {
  date: string;
  items: Record<string, boolean>;
  tasbih: TasbihCount;
}

export function useChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);
  const [tasbih, setTasbih] = useState<TasbihCount>({
    subhanAllah: 0,
    alhamdulillah: 0,
    allahuAkbar: 0,
  });
  const [streak, setStreak] = useState(0);

  const today = new Date().toISOString().split('T')[0];

  // Load data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    const storedStreak = localStorage.getItem(STREAK_KEY);

    if (storedStreak) {
      const { count, lastDate } = JSON.parse(storedStreak);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastDate === today || lastDate === yesterdayStr) {
        setStreak(count);
      } else {
        setStreak(0);
      }
    }

    if (storedData) {
      const data: StoredData = JSON.parse(storedData);
      if (data.date === today) {
        setItems((prev) =>
          prev.map((item) => ({
            ...item,
            completed: data.items[item.id] || false,
          }))
        );
        setTasbih(data.tasbih || { subhanAllah: 0, alhamdulillah: 0, allahuAkbar: 0 });
      }
    }
  }, [today]);

  // Save data to localStorage
  const saveData = useCallback(
    (newItems: ChecklistItem[], newTasbih: TasbihCount) => {
      const data: StoredData = {
        date: today,
        items: newItems.reduce((acc, item) => ({ ...acc, [item.id]: item.completed }), {}),
        tasbih: newTasbih,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },
    [today]
  );

  const toggleItem = useCallback(
    (id: string) => {
      setItems((prev) => {
        const newItems = prev.map((item) =>
          item.id === id ? { ...item, completed: !item.completed } : item
        );
        saveData(newItems, tasbih);
        return newItems;
      });
    },
    [saveData, tasbih]
  );

  const incrementTasbih = useCallback(
    (type: keyof TasbihCount) => {
      setTasbih((prev) => {
        const maxCount = type === 'allahuAkbar' ? 34 : 33;
        const newTasbih = {
          ...prev,
          [type]: Math.min(prev[type] + 1, maxCount),
        };
        saveData(items, newTasbih);
        return newTasbih;
      });
    },
    [items, saveData]
  );

  const resetTasbih = useCallback(() => {
    const newTasbih = { subhanAllah: 0, alhamdulillah: 0, allahuAkbar: 0 };
    setTasbih(newTasbih);
    saveData(items, newTasbih);
  }, [items, saveData]);

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  const isTasbihComplete =
    tasbih.subhanAllah >= 33 && tasbih.alhamdulillah >= 33 && tasbih.allahuAkbar >= 34;

  const isFullyComplete = completedCount === totalCount && isTasbihComplete;

  // Update streak when fully complete
  useEffect(() => {
    if (isFullyComplete) {
      const storedStreak = localStorage.getItem(STREAK_KEY);
      let newStreak = 1;

      if (storedStreak) {
        const { count, lastDate } = JSON.parse(storedStreak);
        if (lastDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          newStreak = lastDate === yesterdayStr ? count + 1 : 1;
        } else {
          newStreak = count;
        }
      }

      setStreak(newStreak);
      localStorage.setItem(STREAK_KEY, JSON.stringify({ count: newStreak, lastDate: today }));
    }
  }, [isFullyComplete, today]);

  return {
    items,
    tasbih,
    streak,
    toggleItem,
    incrementTasbih,
    resetTasbih,
    completedCount,
    totalCount,
    progressPercentage,
    isTasbihComplete,
    isFullyComplete,
  };
}
