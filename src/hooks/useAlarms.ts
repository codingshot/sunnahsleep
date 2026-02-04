import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { toast } from 'sonner';
import { getStorageJson, setStorageJson } from '@/lib/storage';

export interface Alarm {
  id: string;
  name: string;
  time: string; // HH:MM format
  enabled: boolean;
  type: 'fajr' | 'isha' | 'tahajjud' | 'custom' | 'fajr-before';
  sound: 'adhan-makkah' | 'adhan-madinah' | 'beep' | 'gentle' | 'nature';
  repeatDays: number[]; // 0-6 for Sunday-Saturday, empty for one-time
  snoozeMinutes: number;
  beforeFajrMinutes?: number; // For fajr-before type
  dynamicPrayerType?: 'fajr' | 'isha' | 'maghrib' | 'dhuhr' | 'asr'; // For dynamic prayer-based alarms
}

export interface AlarmSettings {
  defaultSnooze: number;
  defaultSound: Alarm['sound'];
  notificationsEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface UpcomingAlarm {
  alarm: Alarm;
  date: Date;
  timeString: string;
  dayName: string;
}

const ALARMS_KEY = 'sunnahSleepAlarms';
const ALARM_SETTINGS_KEY = 'sunnahSleepAlarmSettings';
const SNOOZED_ALARMS_KEY = 'sunnahSleepSnoozed';

// Adhan audio URLs (free sources)
const ALARM_SOUNDS: Record<Alarm['sound'], string> = {
  'adhan-makkah': 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3',
  'adhan-madinah': 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3',
  'beep': 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleRwKXp+42sVxHAU8hLTax3QYADWI0dyobhYALHnC0L1yCgAhhLrMqXcPAB6Cs8ixdRMAG4K0xbZ0EgAZgbTGt3QQABeBtce3dBEAFYG1yLhzEQAUgbbIuHMQABOBtsm4cxAAEoG3yblzDwARgbfJuXMPABCBt8m5cw4AD4G3yblzDgAOgbfJuXMOAA2Bt8m5cw0ADIG3yblzDQALgbfJuXMMAApBt8m5cwsACIG3yblzCwAHgbfJuXMKAAaBt8m5cwoABYG3yblzCQAEgbfJuXMJAAOBt8m5cwgAAoG3yblzCAABgbfJuXMH',
  'gentle': 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleRwKXp+42sVxHAU8hLTax3QYADWI0dyobhYALHnC0L1yCgAhhLrMqXcPAB6Cs8ixdRMAG4K0xbZ0EgAZgbTGt3QQABeBtce3dBEAFYG1yLhzEQAUgbbIuHMQABOBtsm4cxAAEoG3yblzDwARgbfJuXMPABCBt8m5cw4AD4G3yblzDgAOgbfJuXMOAA2Bt8m5cw0ADIG3yblzDQALgbfJuXMMAApBt8m5cwsACIG3yblzCwAHgbfJuXMKAAaBt8m5cwoABYG3yblzCQAEgbfJuXMJAAOBt8m5cwgAAoG3yblzCAABgbfJuXMH',
  'nature': 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleRwKXp+42sVxHAU8hLTax3QYADWI0dyobhYALHnC0L1yCgAhhLrMqXcPAB6Cs8ixdRMAG4K0xbZ0EgAZgbTGt3QQABeBtce3dBEAFYG1yLhzEQAUgbbIuHMQABOBtsm4cxAAEoG3yblzDwARgbfJuXMPABCBt8m5cw4AD4G3yblzDgAOgbfJuXMOAA2Bt8m5cw0ADIG3yblzDQALgbfJuXMMAApBt8m5cwsACIG3yblzCwAHgbfJuXMKAAaBt8m5cwoABYG3yblzCQAEgbfJuXMJAAOBt8m5cwgAAoG3yblzCAABgbfJuXMH',
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SHORT_DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function useAlarms() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [settings, setSettings] = useState<AlarmSettings>({
    defaultSnooze: 5,
    defaultSound: 'adhan-makkah',
    notificationsEnabled: false,
    vibrationEnabled: true,
  });
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);
  const [snoozedAlarms, setSnoozedAlarms] = useState<Record<string, number>>({});
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load data
  useEffect(() => {
    const savedAlarms = getStorageJson<Alarm[]>(ALARMS_KEY);
    const savedSettings = getStorageJson<AlarmSettings>(ALARM_SETTINGS_KEY);
    const savedSnoozed = getStorageJson<Record<string, number>>(SNOOZED_ALARMS_KEY);
    if (Array.isArray(savedAlarms)) setAlarms(savedAlarms);
    if (savedSettings) setSettings(savedSettings);
    if (savedSnoozed) setSnoozedAlarms(savedSnoozed);
  }, []);

  // Save alarms
  const saveAlarms = useCallback((newAlarms: Alarm[]) => {
    setStorageJson(ALARMS_KEY, newAlarms);
    setAlarms(newAlarms);
  }, []);

  // Save settings
  const saveSettings = useCallback((newSettings: AlarmSettings) => {
    setStorageJson(ALARM_SETTINGS_KEY, newSettings);
    setSettings(newSettings);
  }, []);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        saveSettings({ ...settings, notificationsEnabled: true });
        return true;
      }
    }
    return false;
  }, [settings, saveSettings]);

  // Add alarm
  const addAlarm = useCallback((alarm: Omit<Alarm, 'id'>) => {
    const newAlarm: Alarm = {
      ...alarm,
      id: `alarm-${Date.now()}`,
    };
    saveAlarms([...alarms, newAlarm]);
    return newAlarm;
  }, [alarms, saveAlarms]);

  // Update alarm
  const updateAlarm = useCallback((id: string, updates: Partial<Alarm>) => {
    const updated = alarms.map(a => a.id === id ? { ...a, ...updates } : a);
    saveAlarms(updated);
  }, [alarms, saveAlarms]);

  // Delete alarm
  const deleteAlarm = useCallback((id: string) => {
    saveAlarms(alarms.filter(a => a.id !== id));
  }, [alarms, saveAlarms]);

  // Toggle alarm
  const toggleAlarm = useCallback((id: string) => {
    const updated = alarms.map(a => 
      a.id === id ? { ...a, enabled: !a.enabled } : a
    );
    saveAlarms(updated);
  }, [alarms, saveAlarms]);

  // Play alarm sound
  const playAlarmSound = useCallback((sound: Alarm['sound']) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    audioRef.current = new Audio(ALARM_SOUNDS[sound]);
    audioRef.current.loop = true;
    audioRef.current.play().catch(console.error);
    
    // Vibrate if supported
    if (settings.vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate([500, 200, 500, 200, 500]);
    }
  }, [settings.vibrationEnabled]);

  // Stop alarm sound
  const stopAlarmSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if ('vibrate' in navigator) {
      navigator.vibrate(0);
    }
  }, []);

  // Trigger alarm
  const triggerAlarm = useCallback((alarm: Alarm) => {
    setActiveAlarm(alarm);
    playAlarmSound(alarm.sound);
    
    // Show notification
    if (settings.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(`⏰ ${alarm.name}`, {
        body: `It's time for ${alarm.type === 'fajr' ? 'Fajr prayer' : alarm.type === 'tahajjud' ? 'Tahajjud' : alarm.name}`,
        icon: '/icon-512.png',
        tag: alarm.id,
        requireInteraction: true,
      });
    }
    
    toast.info(`⏰ ${alarm.name}`, {
      description: 'Alarm is ringing!',
      duration: Infinity,
    });
  }, [playAlarmSound, settings.notificationsEnabled]);

  // Dismiss alarm
  const dismissAlarm = useCallback(() => {
    stopAlarmSound();
    setActiveAlarm(null);
    toast.dismiss();
  }, [stopAlarmSound]);

  // Snooze alarm
  const snoozeAlarm = useCallback((minutes?: number) => {
    if (!activeAlarm) return;
    
    const snoozeTime = minutes || activeAlarm.snoozeMinutes || settings.defaultSnooze;
    const snoozeUntil = Date.now() + snoozeTime * 60 * 1000;
    
    const newSnoozed = { ...snoozedAlarms, [activeAlarm.id]: snoozeUntil };
    setStorageJson(SNOOZED_ALARMS_KEY, newSnoozed);
    setSnoozedAlarms(newSnoozed);
    
    stopAlarmSound();
    setActiveAlarm(null);
    toast.dismiss();
    toast.info(`Snoozed for ${snoozeTime} minutes`);
  }, [activeAlarm, snoozedAlarms, settings.defaultSnooze, stopAlarmSound]);

  // Check alarms
  const checkAlarms = useCallback(() => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentDay = now.getDay();
    
    for (const alarm of alarms) {
      if (!alarm.enabled) continue;
      
      // Check if snoozed
      if (snoozedAlarms[alarm.id] && snoozedAlarms[alarm.id] > Date.now()) {
        continue;
      }
      
      // Check if snoozed alarm should trigger
      if (snoozedAlarms[alarm.id] && snoozedAlarms[alarm.id] <= Date.now()) {
        const newSnoozed = { ...snoozedAlarms };
        delete newSnoozed[alarm.id];
        setStorageJson(SNOOZED_ALARMS_KEY, newSnoozed);
        setSnoozedAlarms(newSnoozed);
        triggerAlarm(alarm);
        return;
      }
      
      // Check time match
      if (alarm.time === currentTime) {
        // Check day match
        if (alarm.repeatDays.length === 0 || alarm.repeatDays.includes(currentDay)) {
          if (!activeAlarm || activeAlarm.id !== alarm.id) {
            triggerAlarm(alarm);
          }
        }
      }
    }
  }, [alarms, snoozedAlarms, activeAlarm, triggerAlarm]);

  // Start alarm checker
  useEffect(() => {
    checkIntervalRef.current = setInterval(checkAlarms, 1000);
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [checkAlarms]);

  // Calculate upcoming alarms for the week
  const upcomingAlarms = useMemo((): UpcomingAlarm[] => {
    const upcoming: UpcomingAlarm[] = [];
    const now = new Date();
    
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const checkDate = new Date(now);
      checkDate.setDate(now.getDate() + dayOffset);
      const dayOfWeek = checkDate.getDay();
      const dateStr = checkDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      
      for (const alarm of alarms) {
        if (!alarm.enabled) continue;
        
        // Check if alarm repeats on this day
        if (alarm.repeatDays.length > 0 && !alarm.repeatDays.includes(dayOfWeek)) {
          continue;
        }
        
        // For today, only show future alarms
        if (dayOffset === 0) {
          const [hours, mins] = alarm.time.split(':').map(Number);
          const alarmTime = new Date(now);
          alarmTime.setHours(hours, mins, 0, 0);
          if (alarmTime <= now) continue;
        }
        
        upcoming.push({
          alarm,
          date: checkDate,
          timeString: alarm.time,
          dayName: dayOffset === 0 ? 'Today' : dayOffset === 1 ? 'Tomorrow' : dateStr,
        });
      }
    }
    
    // Sort by date and time
    return upcoming.sort((a, b) => {
      const aTime = new Date(a.date);
      const [aH, aM] = a.timeString.split(':').map(Number);
      aTime.setHours(aH, aM);
      
      const bTime = new Date(b.date);
      const [bH, bM] = b.timeString.split(':').map(Number);
      bTime.setHours(bH, bM);
      
      return aTime.getTime() - bTime.getTime();
    }).slice(0, 10); // Limit to next 10 alarms
  }, [alarms]);

  // Create prayer-based alarms
  const createPrayerAlarm = useCallback((
    type: 'fajr' | 'isha' | 'tahajjud' | 'fajr-before',
    time: string,
    beforeMinutes?: number
  ) => {
    const names: Record<string, string> = {
      'fajr': 'Fajr Prayer',
      'isha': 'Isha Prayer',
      'tahajjud': 'Tahajjud Prayer',
      'fajr-before': `${beforeMinutes} min before Fajr`,
    };
    
    return addAlarm({
      name: names[type],
      time,
      enabled: true,
      type,
      sound: type === 'fajr' || type === 'isha' ? 'adhan-makkah' : 'gentle',
      repeatDays: [0, 1, 2, 3, 4, 5, 6], // Every day
      snoozeMinutes: settings.defaultSnooze,
      beforeFajrMinutes: beforeMinutes,
    });
  }, [addAlarm, settings.defaultSnooze]);

  // Get next alarm
  const nextAlarm = useMemo(() => {
    return upcomingAlarms[0] || null;
  }, [upcomingAlarms]);

  return {
    alarms,
    settings,
    activeAlarm,
    upcomingAlarms,
    nextAlarm,
    addAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarm,
    dismissAlarm,
    snoozeAlarm,
    saveSettings,
    requestNotificationPermission,
    createPrayerAlarm,
  };
}
