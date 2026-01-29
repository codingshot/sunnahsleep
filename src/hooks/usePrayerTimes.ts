import { useState, useEffect, useCallback } from 'react';
import { PrayerTimes, TahajjudSettings, QailulahSettings } from '@/types/checklist';

const PRAYER_TIMES_KEY = 'sunnahSleepPrayerTimes';
const TAHAJJUD_KEY = 'sunnahSleepTahajjud';
const QAILULAH_KEY = 'sunnahSleepQailulah';

export function usePrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [tahajjudSettings, setTahajjudSettings] = useState<TahajjudSettings>({
    enabled: false,
    alarmTime: null,
    calculatedTime: null,
  });
  const [qailulahSettings, setQailulahSettings] = useState<QailulahSettings>({
    enabled: false,
    reminderTime: '13:00',
    duration: 30,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved settings
  useEffect(() => {
    const savedTahajjud = localStorage.getItem(TAHAJJUD_KEY);
    const savedQailulah = localStorage.getItem(QAILULAH_KEY);
    const savedPrayerTimes = localStorage.getItem(PRAYER_TIMES_KEY);

    if (savedTahajjud) {
      setTahajjudSettings(JSON.parse(savedTahajjud));
    }
    if (savedQailulah) {
      setQailulahSettings(JSON.parse(savedQailulah));
    }
    if (savedPrayerTimes) {
      const { times, date } = JSON.parse(savedPrayerTimes);
      const today = new Date().toISOString().split('T')[0];
      if (date === today) {
        setPrayerTimes(times);
      }
    }
  }, []);

  // Fetch prayer times based on location
  const fetchPrayerTimes = useCallback(async (latitude: number, longitude: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const today = new Date();
      const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
      
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=2`
      );
      
      if (!response.ok) throw new Error('Failed to fetch prayer times');
      
      const data = await response.json();
      const timings = data.data.timings;
      
      const times: PrayerTimes = {
        fajr: timings.Fajr,
        sunrise: timings.Sunrise,
        dhuhr: timings.Dhuhr,
        asr: timings.Asr,
        maghrib: timings.Maghrib,
        isha: timings.Isha,
      };
      
      setPrayerTimes(times);
      localStorage.setItem(PRAYER_TIMES_KEY, JSON.stringify({
        times,
        date: today.toISOString().split('T')[0]
      }));
      
      // Calculate Tahajjud time
      calculateTahajjudTime(times);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prayer times');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user location and fetch prayer times
  const initializePrayerTimes = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchPrayerTimes(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          // Default to Mecca coordinates
          fetchPrayerTimes(21.4225, 39.8262);
          console.warn('Location access denied, using default location');
        }
      );
    } else {
      fetchPrayerTimes(21.4225, 39.8262);
    }
  }, [fetchPrayerTimes]);

  // Calculate last third of the night for Tahajjud
  const calculateTahajjudTime = (times: PrayerTimes) => {
    const parseTime = (timeStr: string): Date => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    };

    const maghrib = parseTime(times.maghrib);
    const fajr = parseTime(times.fajr);
    
    // If fajr is before maghrib, it's the next day
    if (fajr < maghrib) {
      fajr.setDate(fajr.getDate() + 1);
    }
    
    const nightDuration = fajr.getTime() - maghrib.getTime();
    const lastThirdStart = new Date(maghrib.getTime() + (nightDuration * 2 / 3));
    
    const tahajjudTime = `${lastThirdStart.getHours().toString().padStart(2, '0')}:${lastThirdStart.getMinutes().toString().padStart(2, '0')}`;
    
    setTahajjudSettings(prev => {
      const updated = { ...prev, calculatedTime: tahajjudTime };
      localStorage.setItem(TAHAJJUD_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Toggle Tahajjud alarm
  const toggleTahajjud = (enabled: boolean) => {
    setTahajjudSettings(prev => {
      const updated = {
        ...prev,
        enabled,
        alarmTime: enabled ? prev.calculatedTime : null,
      };
      localStorage.setItem(TAHAJJUD_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Update Qailulah settings
  const updateQailulah = (settings: Partial<QailulahSettings>) => {
    setQailulahSettings(prev => {
      const updated = { ...prev, ...settings };
      localStorage.setItem(QAILULAH_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Calculate recommended Qailulah time based on Dhuhr
  const getRecommendedQailulahTime = (): string => {
    if (prayerTimes) {
      const [hours, minutes] = prayerTimes.dhuhr.split(':').map(Number);
      // Recommended 30 minutes after Dhuhr
      const qTime = new Date();
      qTime.setHours(hours, minutes + 30, 0, 0);
      return `${qTime.getHours().toString().padStart(2, '0')}:${qTime.getMinutes().toString().padStart(2, '0')}`;
    }
    return '13:00';
  };

  return {
    prayerTimes,
    tahajjudSettings,
    qailulahSettings,
    loading,
    error,
    initializePrayerTimes,
    toggleTahajjud,
    updateQailulah,
    getRecommendedQailulahTime,
  };
}
