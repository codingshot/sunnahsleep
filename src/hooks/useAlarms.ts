import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

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
}

export interface AlarmSettings {
  defaultSnooze: number;
  defaultSound: Alarm['sound'];
  notificationsEnabled: boolean;
  vibrationEnabled: boolean;
}

const ALARMS_KEY = 'sunnahSleepAlarms';
const ALARM_SETTINGS_KEY = 'sunnahSleepAlarmSettings';
const SNOOZED_ALARMS_KEY = 'sunnahSleepSnoozed';

// Adhan audio URLs (free sources)
const ALARM_SOUNDS: Record<Alarm['sound'], string> = {
  'adhan-makkah': 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3', // Placeholder - would use actual adhan
  'adhan-madinah': 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3',
  'beep': 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleRwKXp+42sVxHAU8hLTax3QYADWI0dyobhYALHnC0L1yCgAhhLrMqXcPAB6Cs8ixdRMAG4K0xbZ0EgAZgbTGt3QQABeBtce3dBEAFYG1yLhzEQAUgbbIuHMQABOBtsm4cxAAEoG3yblzDwARgbfJuXMPABCBt8m5cw4AD4G3yblzDgAOgbfJuXMOAA2Bt8m5cw0ADIG3yblzDQALgbfJuXMMAApBt8m5cwsACIG3yblzCwAHgbfJuXMKAAaBt8m5cwoABYG3yblzCQAEgbfJuXMJAAOBt8m5cwgAAoG3yblzCAABgbfJuXMH',
  'gentle': 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleRwKXp+42sVxHAU8hLTax3QYADWI0dyobhYALHnC0L1yCgAhhLrMqXcPAB6Cs8ixdRMAG4K0xbZ0EgAZgbTGt3QQABeBtce3dBEAFYG1yLhzEQAUgbbIuHMQABOBtsm4cxAAEoG3yblzDwARgbfJuXMPABCBt8m5cw4AD4G3yblzDgAOgbfJuXMOAA2Bt8m5cw0ADIG3yblzDQALgbfJuXMMAApBt8m5cwsACIG3yblzCwAHgbfJuXMKAAaBt8m5cwoABYG3yblzCQAEgbfJuXMJAAOBt8m5cwgAAoG3yblzCAABgbfJuXMH',
  'nature': 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleRwKXp+42sVxHAU8hLTax3QYADWI0dyobhYALHnC0L1yCgAhhLrMqXcPAB6Cs8ixdRMAG4K0xbZ0EgAZgbTGt3QQABeBtce3dBEAFYG1yLhzEQAUgbbIuHMQABOBtsm4cxAAEoG3yblzDwARgbfJuXMPABCBt8m5cw4AD4G3yblzDgAOgbfJuXMOAA2Bt8m5cw0ADIG3yblzDQALgbfJuXMMAApBt8m5cwsACIG3yblzCwAHgbfJuXMKAAaBt8m5cwoABYG3yblzCQAEgbfJuXMJAAOBt8m5cwgAAoG3yblzCAABgbfJuXMH',
};

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
    const savedAlarms = localStorage.getItem(ALARMS_KEY);
    const savedSettings = localStorage.getItem(ALARM_SETTINGS_KEY);
    const savedSnoozed = localStorage.getItem(SNOOZED_ALARMS_KEY);
    
    if (savedAlarms) setAlarms(JSON.parse(savedAlarms));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedSnoozed) setSnoozedAlarms(JSON.parse(savedSnoozed));
  }, []);

  // Save alarms
  const saveAlarms = useCallback((newAlarms: Alarm[]) => {
    localStorage.setItem(ALARMS_KEY, JSON.stringify(newAlarms));
    setAlarms(newAlarms);
  }, []);

  // Save settings
  const saveSettings = useCallback((newSettings: AlarmSettings) => {
    localStorage.setItem(ALARM_SETTINGS_KEY, JSON.stringify(newSettings));
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
    localStorage.setItem(SNOOZED_ALARMS_KEY, JSON.stringify(newSnoozed));
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
        localStorage.setItem(SNOOZED_ALARMS_KEY, JSON.stringify(newSnoozed));
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

  return {
    alarms,
    settings,
    activeAlarm,
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
