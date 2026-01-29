import { useState, useEffect, useCallback } from 'react';

export interface SleepRecord {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string | null;
  duration: number | null; // in minutes
  madeIsha: boolean;
  madeFajr: boolean;
  quality: 'poor' | 'fair' | 'good' | 'excellent' | null;
}

const SLEEP_RECORDS_KEY = 'sunnahSleepRecords';
const CURRENT_SLEEP_KEY = 'sunnahCurrentSleep';

export function useSleepTracker() {
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [currentSleep, setCurrentSleep] = useState<Partial<SleepRecord> | null>(null);
  const [isSleeping, setIsSleeping] = useState(false);

  // Load data on mount
  useEffect(() => {
    const savedRecords = localStorage.getItem(SLEEP_RECORDS_KEY);
    const savedCurrent = localStorage.getItem(CURRENT_SLEEP_KEY);
    
    if (savedRecords) {
      setSleepRecords(JSON.parse(savedRecords));
    }
    
    if (savedCurrent) {
      const current = JSON.parse(savedCurrent);
      setCurrentSleep(current);
      setIsSleeping(true);
    }
  }, []);

  // Save records to localStorage
  const saveRecords = useCallback((records: SleepRecord[]) => {
    localStorage.setItem(SLEEP_RECORDS_KEY, JSON.stringify(records));
    setSleepRecords(records);
  }, []);

  // Start sleep tracking
  const startSleep = useCallback((madeIsha: boolean) => {
    const now = new Date();
    const record: Partial<SleepRecord> = {
      id: `sleep-${Date.now()}`,
      date: now.toISOString().split('T')[0],
      bedtime: now.toISOString(),
      madeIsha,
      madeFajr: false,
    };
    
    setCurrentSleep(record);
    setIsSleeping(true);
    localStorage.setItem(CURRENT_SLEEP_KEY, JSON.stringify(record));
  }, []);

  // End sleep tracking
  const endSleep = useCallback((madeFajr: boolean, quality: SleepRecord['quality']) => {
    if (!currentSleep) return null;
    
    const now = new Date();
    const bedtime = new Date(currentSleep.bedtime!);
    const duration = Math.round((now.getTime() - bedtime.getTime()) / 60000); // minutes
    
    const completedRecord: SleepRecord = {
      id: currentSleep.id!,
      date: currentSleep.date!,
      bedtime: currentSleep.bedtime!,
      wakeTime: now.toISOString(),
      duration,
      madeIsha: currentSleep.madeIsha!,
      madeFajr,
      quality,
    };
    
    const updatedRecords = [...sleepRecords, completedRecord];
    saveRecords(updatedRecords);
    
    setCurrentSleep(null);
    setIsSleeping(false);
    localStorage.removeItem(CURRENT_SLEEP_KEY);
    
    return completedRecord;
  }, [currentSleep, sleepRecords, saveRecords]);

  // Cancel current sleep
  const cancelSleep = useCallback(() => {
    setCurrentSleep(null);
    setIsSleeping(false);
    localStorage.removeItem(CURRENT_SLEEP_KEY);
  }, []);

  // Get sleep stats
  const getStats = useCallback(() => {
    if (sleepRecords.length === 0) {
      return {
        averageDuration: 0,
        ishaRate: 0,
        fajrRate: 0,
        totalNights: 0,
        thisWeek: 0,
      };
    }
    
    const validRecords = sleepRecords.filter(r => r.duration);
    const totalDuration = validRecords.reduce((sum, r) => sum + (r.duration || 0), 0);
    const ishaCount = sleepRecords.filter(r => r.madeIsha).length;
    const fajrCount = sleepRecords.filter(r => r.madeFajr).length;
    
    // This week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeekRecords = sleepRecords.filter(r => new Date(r.date) >= weekAgo);
    
    return {
      averageDuration: validRecords.length > 0 ? Math.round(totalDuration / validRecords.length) : 0,
      ishaRate: Math.round((ishaCount / sleepRecords.length) * 100),
      fajrRate: Math.round((fajrCount / sleepRecords.length) * 100),
      totalNights: sleepRecords.length,
      thisWeek: thisWeekRecords.length,
    };
  }, [sleepRecords]);

  // Get recent records
  const getRecentRecords = useCallback((limit: number = 7) => {
    return [...sleepRecords].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, limit);
  }, [sleepRecords]);

  // Format duration
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return {
    sleepRecords,
    currentSleep,
    isSleeping,
    startSleep,
    endSleep,
    cancelSleep,
    getStats,
    getRecentRecords,
    formatDuration,
  };
}
