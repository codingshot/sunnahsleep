import { useState, useEffect, useCallback } from 'react';
import { PrayerTimes, TahajjudSettings, QailulahSettings } from '@/types/checklist';

const PRAYER_TIMES_KEY = 'sunnahSleepPrayerTimes';
const TAHAJJUD_KEY = 'sunnahSleepTahajjud';
const QAILULAH_KEY = 'sunnahSleepQailulah';
const LOCATION_KEY = 'sunnahSleepLocation';

export interface LocationSettings {
  mode: 'auto' | 'manual';
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  country: string | null;
  timezone: string | null;
}

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
  const [location, setLocation] = useState<LocationSettings>({
    mode: 'auto',
    latitude: null,
    longitude: null,
    city: null,
    country: null,
    timezone: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved settings
  useEffect(() => {
    const savedTahajjud = localStorage.getItem(TAHAJJUD_KEY);
    const savedQailulah = localStorage.getItem(QAILULAH_KEY);
    const savedPrayerTimes = localStorage.getItem(PRAYER_TIMES_KEY);
    const savedLocation = localStorage.getItem(LOCATION_KEY);

    if (savedTahajjud) {
      setTahajjudSettings(JSON.parse(savedTahajjud));
    }
    if (savedQailulah) {
      setQailulahSettings(JSON.parse(savedQailulah));
    }
    if (savedLocation) {
      setLocation(JSON.parse(savedLocation));
    }
    if (savedPrayerTimes) {
      const { times, date } = JSON.parse(savedPrayerTimes);
      const today = new Date().toISOString().split('T')[0];
      if (date === today) {
        setPrayerTimes(times);
      }
    }
  }, []);

  // Auto-detect location using IP
  const detectLocationByIP = useCallback(async () => {
    try {
      // Use ipwho.is for free HTTPS IP geolocation (CORS-enabled)
      const response = await fetch('https://ipwho.is/');
      if (!response.ok) throw new Error('Failed to detect location');
      
      const data = await response.json();
      if (!data.success) throw new Error('IP lookup failed');
      
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        country: data.country,
        timezone: data.timezone?.id || null,
      };
    } catch (err) {
      // Fallback to worldtimeapi for timezone detection, then use browser geolocation
      try {
        // Try browser geolocation as fallback
        if (navigator.geolocation) {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          return {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            city: null,
            country: null,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          };
        }
      } catch {
        // Ultimate fallback to Mecca
      }
      return {
        latitude: 21.4225,
        longitude: 39.8262,
        city: 'Mecca',
        country: 'Saudi Arabia',
        timezone: 'Asia/Riyadh',
      };
    }
  }, []);

  // Search for city
  const searchCity = useCallback(async (query: string): Promise<Array<{
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  }>> => {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`
      );
      if (!response.ok) return [];
      
      const data = await response.json();
      return (data.results || []).map((r: any) => ({
        name: r.name,
        country: r.country,
        latitude: r.latitude,
        longitude: r.longitude,
      }));
    } catch {
      return [];
    }
  }, []);

  // Fetch prayer times based on coordinates
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
      
      return times;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prayer times');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize prayer times (auto-detect or use saved location)
  const initializePrayerTimes = useCallback(async () => {
    setLoading(true);
    
    try {
      let coords: { latitude: number; longitude: number; city?: string; country?: string; timezone?: string };
      
      if (location.mode === 'manual' && location.latitude && location.longitude) {
        coords = { latitude: location.latitude, longitude: location.longitude };
      } else {
        // Try browser geolocation first
        if (navigator.geolocation) {
          try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
            });
            coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
          } catch {
            // Fall back to IP detection
            coords = await detectLocationByIP();
          }
        } else {
          coords = await detectLocationByIP();
        }
        
        // Save detected location
        const newLocation: LocationSettings = {
          mode: 'auto',
          latitude: coords.latitude,
          longitude: coords.longitude,
          city: coords.city || null,
          country: coords.country || null,
          timezone: coords.timezone || null,
        };
        setLocation(newLocation);
        localStorage.setItem(LOCATION_KEY, JSON.stringify(newLocation));
      }
      
      await fetchPrayerTimes(coords.latitude, coords.longitude);
    } catch (err) {
      setError('Failed to initialize prayer times');
    } finally {
      setLoading(false);
    }
  }, [location, detectLocationByIP, fetchPrayerTimes]);

  // Set manual location
  const setManualLocation = useCallback(async (
    latitude: number, 
    longitude: number, 
    city: string, 
    country: string
  ) => {
    const newLocation: LocationSettings = {
      mode: 'manual',
      latitude,
      longitude,
      city,
      country,
      timezone: null,
    };
    setLocation(newLocation);
    localStorage.setItem(LOCATION_KEY, JSON.stringify(newLocation));
    
    await fetchPrayerTimes(latitude, longitude);
  }, [fetchPrayerTimes]);

  // Reset to auto location
  const resetToAutoLocation = useCallback(async () => {
    const coords = await detectLocationByIP();
    const newLocation: LocationSettings = {
      mode: 'auto',
      ...coords,
    };
    setLocation(newLocation);
    localStorage.setItem(LOCATION_KEY, JSON.stringify(newLocation));
    
    await fetchPrayerTimes(coords.latitude, coords.longitude);
  }, [detectLocationByIP, fetchPrayerTimes]);

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

  // Calculate time before Fajr
  const getTimeBeforeFajr = (minutes: number): string | null => {
    if (!prayerTimes) return null;
    
    const [hours, mins] = prayerTimes.fajr.split(':').map(Number);
    const fajrDate = new Date();
    fajrDate.setHours(hours, mins - minutes, 0, 0);
    
    return `${fajrDate.getHours().toString().padStart(2, '0')}:${fajrDate.getMinutes().toString().padStart(2, '0')}`;
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
    location,
    loading,
    error,
    initializePrayerTimes,
    toggleTahajjud,
    updateQailulah,
    getRecommendedQailulahTime,
    getTimeBeforeFajr,
    setManualLocation,
    resetToAutoLocation,
    searchCity,
  };
}
