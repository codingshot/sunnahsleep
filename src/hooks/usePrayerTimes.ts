import { useState, useEffect, useCallback } from 'react';
import { PrayerTimes, TahajjudSettings, QailulahSettings } from '@/types/checklist';
import { getStorageJson, setStorageJson } from '@/lib/storage';
import { fetchWithTimeout } from '@/lib/fetch';

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

export interface LocationSearchResult {
  name: string;
  displayName: string;
  country: string;
  latitude: number;
  longitude: number;
  type: string;
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
    const savedTahajjud = getStorageJson<TahajjudSettings>(TAHAJJUD_KEY);
    const savedQailulah = getStorageJson<QailulahSettings>(QAILULAH_KEY);
    const savedPrayerTimes = getStorageJson<{ times: PrayerTimes; date: string }>(PRAYER_TIMES_KEY);
    const savedLocation = getStorageJson<LocationSettings>(LOCATION_KEY);

    if (savedTahajjud) setTahajjudSettings(savedTahajjud);
    if (savedQailulah) setQailulahSettings(savedQailulah);
    if (savedLocation) setLocation(savedLocation);
    if (savedPrayerTimes) {
      const today = new Date().toISOString().split('T')[0];
      if (savedPrayerTimes.date === today) setPrayerTimes(savedPrayerTimes.times);
    }
  }, []);

  // Auto-detect location using IP (no user prompt)
  const detectLocationByIP = useCallback(async () => {
    try {
      const response = await fetchWithTimeout('https://ipwho.is/');
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
      // Fallback to Mecca
      return {
        latitude: 21.4225,
        longitude: 39.8262,
        city: 'Mecca',
        country: 'Saudi Arabia',
        timezone: 'Asia/Riyadh',
      };
    }
  }, []);

  // Search for city using OpenStreetMap Nominatim API
  const searchCity = useCallback(async (query: string): Promise<LocationSearchResult[]> => {
    if (query.length < 2) return [];
    
    try {
      const response = await fetchWithTimeout(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)}` +
        `&format=json` +
        `&addressdetails=1` +
        `&limit=10` +
        `&accept-language=en`,
        {
          headers: { 'User-Agent': 'SunnahSleep/1.0 (https://sunnahsleep.app)' },
        },
        8000
      );
      
      if (!response.ok) {
        // Fallback to Open-Meteo geocoding
        return await searchCityFallback(query);
      }
      
      const data = await response.json();
      
      return data.map((r: any) => ({
        name: r.address?.city || r.address?.town || r.address?.village || r.name || query,
        displayName: r.display_name,
        country: r.address?.country || '',
        latitude: parseFloat(r.lat),
        longitude: parseFloat(r.lon),
        type: r.type || 'place',
      }));
    } catch (err) {
      // Fallback to Open-Meteo geocoding
      return await searchCityFallback(query);
    }
  }, []);

  // Fallback search using Open-Meteo geocoding
  const searchCityFallback = async (query: string): Promise<LocationSearchResult[]> => {
    try {
      const response = await fetchWithTimeout(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`
      );
      if (!response.ok) return [];
      
      const data = await response.json();
      return (data.results || []).map((r: any) => ({
        name: r.name,
        displayName: `${r.name}, ${r.admin1 || ''} ${r.country}`.trim(),
        country: r.country,
        latitude: r.latitude,
        longitude: r.longitude,
        type: 'city',
      }));
    } catch {
      return [];
    }
  };

  // Fetch prayer times based on coordinates for a specific date
  const fetchPrayerTimesForDate = useCallback(async (latitude: number, longitude: number, date: Date) => {
    try {
      const dateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
      const response = await fetchWithTimeout(
        `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=2`,
        {},
        10000
      );
      
      if (!response.ok) throw new Error('Failed to fetch prayer times');
      
      const data = await response.json();
      const timings = data?.data?.timings;
      if (!timings || !timings.Fajr || !timings.Isha) return null;
      
      return {
        fajr: timings.Fajr,
        sunrise: timings.Sunrise ?? timings.Fajr,
        dhuhr: timings.Dhuhr ?? '12:00',
        asr: timings.Asr ?? '15:00',
        maghrib: timings.Maghrib,
        isha: timings.Isha,
      };
    } catch (err) {
      return null;
    }
  }, []);

  // Fetch prayer times based on coordinates (today)
  const fetchPrayerTimes = useCallback(async (latitude: number, longitude: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const today = new Date();
      const times = await fetchPrayerTimesForDate(latitude, longitude, today);
      
      if (!times) throw new Error('Failed to fetch prayer times');
      
      setPrayerTimes(times);
      setStorageJson(PRAYER_TIMES_KEY, { times, date: today.toISOString().split('T')[0] });
      
      // Calculate Tahajjud time
      calculateTahajjudTime(times);
      
      return times;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prayer times');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchPrayerTimesForDate]);

  // Initialize prayer times using IP-based detection (no user prompt)
  const initializePrayerTimes = useCallback(async () => {
    // If already have location, just fetch prayer times
    if (location.latitude && location.longitude) {
      await fetchPrayerTimes(location.latitude, location.longitude);
      return;
    }
    
    setLoading(true);
    
    try {
      // Use IP-based detection only - no browser geolocation prompt
      const coords = await detectLocationByIP();
      
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
      setStorageJson(LOCATION_KEY, newLocation);
      
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
    setStorageJson(LOCATION_KEY, newLocation);
    
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
    setStorageJson(LOCATION_KEY, newLocation);
    
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
      setStorageJson(TAHAJJUD_KEY, updated);
      return updated;
    });
  };

  // Calculate time before Fajr
  const getTimeBeforeFajr = (minutes: number): string | null => {
    if (!prayerTimes?.fajr) return null;
    const match = /^(\d{1,2}):(\d{2})$/.exec(prayerTimes.fajr.trim());
    if (!match) return null;
    const hours = parseInt(match[1], 10);
    const mins = parseInt(match[2], 10);
    if (isNaN(hours) || isNaN(mins)) return null;
    const fajrDate = new Date();
    fajrDate.setHours(hours, mins - minutes, 0, 0);
    return `${fajrDate.getHours().toString().padStart(2, '0')}:${fajrDate.getMinutes().toString().padStart(2, '0')}`;
  };

  // Get prayer times for a specific date (for weekly view)
  const getPrayerTimesForDate = useCallback(async (date: Date) => {
    if (!location.latitude || !location.longitude) return null;
    return await fetchPrayerTimesForDate(location.latitude, location.longitude, date);
  }, [location, fetchPrayerTimesForDate]);

  // Preview prayer times for a location (without saving)
  const previewPrayerTimes = useCallback(async (latitude: number, longitude: number) => {
    try {
      const today = new Date();
      return await fetchPrayerTimesForDate(latitude, longitude, today);
    } catch {
      return null;
    }
  }, [fetchPrayerTimesForDate]);

  // Toggle Tahajjud alarm
  const toggleTahajjud = (enabled: boolean) => {
    setTahajjudSettings(prev => {
      const updated = {
        ...prev,
        enabled,
        alarmTime: enabled ? prev.calculatedTime : null,
      };
      setStorageJson(TAHAJJUD_KEY, updated);
      return updated;
    });
  };

  // Update Qailulah settings
  const updateQailulah = (settings: Partial<QailulahSettings>) => {
    setQailulahSettings(prev => {
      const updated = { ...prev, ...settings };
      setStorageJson(QAILULAH_KEY, updated);
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
    getPrayerTimesForDate,
    previewPrayerTimes,
    setManualLocation,
    resetToAutoLocation,
    searchCity,
  };
}
