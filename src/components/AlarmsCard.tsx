import { useState } from 'react';
import { 
  Bell, BellOff, Plus, Trash2, Clock, Volume2, 
  Sun, Moon, MapPin, Search, X, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAlarms, Alarm } from '@/hooks/useAlarms';
import { PrayerTimes } from '@/types/checklist';

interface LocationSettings {
  mode: 'auto' | 'manual';
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  country: string | null;
  timezone: string | null;
}

interface AlarmsCardProps {
  prayerTimes: PrayerTimes | null;
  location: LocationSettings;
  onSearchCity: (query: string) => Promise<Array<{
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  }>>;
  onSetLocation: (lat: number, lng: number, city: string, country: string) => void;
  onResetLocation: () => void;
  getTimeBeforeFajr: (minutes: number) => string | null;
}

export function AlarmsCard({
  prayerTimes,
  location,
  onSearchCity,
  onSetLocation,
  onResetLocation,
  getTimeBeforeFajr,
}: AlarmsCardProps) {
  const {
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
  } = useAlarms();

  const [showAddAlarm, setShowAddAlarm] = useState(false);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  }>>([]);
  const [newAlarm, setNewAlarm] = useState<Partial<Alarm>>({
    name: '',
    time: '05:00',
    type: 'custom',
    sound: 'adhan-makkah',
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    snoozeMinutes: 5,
  });
  const [beforeFajrMinutes, setBeforeFajrMinutes] = useState(30);

  const handleSearch = async () => {
    if (citySearch.length < 2) return;
    const results = await onSearchCity(citySearch);
    setSearchResults(results);
  };

  const handleSelectCity = (city: typeof searchResults[0]) => {
    onSetLocation(city.latitude, city.longitude, city.name, city.country);
    setShowLocationSearch(false);
    setCitySearch('');
    setSearchResults([]);
  };

  const handleAddAlarm = () => {
    if (!newAlarm.name || !newAlarm.time) return;
    
    addAlarm({
      name: newAlarm.name,
      time: newAlarm.time,
      enabled: true,
      type: newAlarm.type as Alarm['type'],
      sound: newAlarm.sound as Alarm['sound'],
      repeatDays: newAlarm.repeatDays || [],
      snoozeMinutes: newAlarm.snoozeMinutes || 5,
    });
    
    setShowAddAlarm(false);
    setNewAlarm({
      name: '',
      time: '05:00',
      type: 'custom',
      sound: 'adhan-makkah',
      repeatDays: [0, 1, 2, 3, 4, 5, 6],
      snoozeMinutes: 5,
    });
  };

  const handleQuickAddFajr = () => {
    if (!prayerTimes) return;
    createPrayerAlarm('fajr', prayerTimes.fajr);
  };

  const handleQuickAddIsha = () => {
    if (!prayerTimes) return;
    createPrayerAlarm('isha', prayerTimes.isha);
  };

  const handleQuickAddBeforeFajr = () => {
    const time = getTimeBeforeFajr(beforeFajrMinutes);
    if (time) {
      createPrayerAlarm('fajr-before', time, beforeFajrMinutes);
    }
  };

  const soundOptions: { value: Alarm['sound']; label: string }[] = [
    { value: 'adhan-makkah', label: 'Adhan (Makkah)' },
    { value: 'adhan-madinah', label: 'Adhan (Madinah)' },
    { value: 'beep', label: 'Beep' },
    { value: 'gentle', label: 'Gentle' },
    { value: 'nature', label: 'Nature' },
  ];

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="rounded-2xl bg-gradient-card border border-border overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gold/10">
              <Bell className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Prayer Alarms</h3>
              <p className="text-sm text-cream-dim">
                {location.city ? `${location.city}, ${location.country}` : 'Set your location'}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowLocationSearch(true)}
              className="text-muted-foreground hover:text-gold"
            >
              <MapPin className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(true)}
              className="text-muted-foreground hover:text-gold"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Active Alarm */}
        {activeAlarm && (
          <div className="p-4 rounded-xl bg-gold/20 border border-gold/40 mb-4 animate-pulse">
            <h4 className="text-gold font-semibold mb-2">⏰ {activeAlarm.name}</h4>
            <div className="flex gap-2">
              <Button
                onClick={dismissAlarm}
                className="flex-1 bg-gold text-midnight hover:bg-gold/90"
              >
                Dismiss
              </Button>
              <Button
                onClick={() => snoozeAlarm()}
                variant="outline"
                className="flex-1 border-gold/30 text-gold"
              >
                Snooze {activeAlarm.snoozeMinutes}m
              </Button>
            </div>
          </div>
        )}

        {/* Prayer Times Display */}
        {prayerTimes && (
          <div className="grid grid-cols-3 gap-2 mb-4 p-3 rounded-xl bg-secondary/30 border border-border">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Fajr</p>
              <p className="text-sm font-semibold text-foreground">{prayerTimes.fajr}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Maghrib</p>
              <p className="text-sm font-semibold text-foreground">{prayerTimes.maghrib}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Isha</p>
              <p className="text-sm font-semibold text-foreground">{prayerTimes.isha}</p>
            </div>
          </div>
        )}

        {/* Quick Add Prayer Alarms */}
        {prayerTimes && (
          <div className="space-y-2 mb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Quick Add</p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleQuickAddFajr}
                className="border-gold/30 text-gold hover:bg-gold/10"
              >
                <Sun className="h-4 w-4 mr-1" />
                Fajr
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleQuickAddIsha}
                className="border-gold/30 text-gold hover:bg-gold/10"
              >
                <Moon className="h-4 w-4 mr-1" />
                Isha
              </Button>
              <div className="flex items-center gap-1">
                <select
                  value={beforeFajrMinutes}
                  onChange={(e) => setBeforeFajrMinutes(Number(e.target.value))}
                  className="bg-secondary border border-border rounded px-2 py-1 text-xs text-foreground"
                >
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                  <option value={60}>60 min</option>
                </select>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleQuickAddBeforeFajr}
                  className="border-gold/30 text-gold hover:bg-gold/10"
                >
                  Before Fajr
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Alarms List */}
        <div className="space-y-2 mb-4">
          {alarms.map((alarm) => (
            <div
              key={alarm.id}
              className={cn(
                'p-3 rounded-xl border flex items-center justify-between',
                alarm.enabled 
                  ? 'bg-secondary/30 border-gold/20' 
                  : 'bg-secondary/10 border-border'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-xl font-bold text-foreground">{alarm.time}</p>
                  <p className="text-xs text-cream-dim">{alarm.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={alarm.enabled}
                  onCheckedChange={() => toggleAlarm(alarm.id)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteAlarm(alarm.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Alarm Button */}
        <Button
          onClick={() => setShowAddAlarm(true)}
          variant="outline"
          className="w-full border-dashed border-gold/30 text-gold hover:bg-gold/10"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Alarm
        </Button>

        {/* Location Search Modal */}
        {showLocationSearch && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-midnight border border-border rounded-2xl p-6 max-w-sm w-full space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Set Location</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowLocationSearch(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Search city..."
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {searchResults.map((city, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectCity(city)}
                      className="w-full p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 text-left transition-colors"
                    >
                      <p className="text-foreground">{city.name}</p>
                      <p className="text-xs text-muted-foreground">{city.country}</p>
                    </button>
                  ))}
                </div>
              )}

              <Button
                variant="outline"
                onClick={() => {
                  onResetLocation();
                  setShowLocationSearch(false);
                }}
                className="w-full"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Use Auto-Detect
              </Button>
            </div>
          </div>
        )}

        {/* Add Alarm Modal */}
        {showAddAlarm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-midnight border border-border rounded-2xl p-6 max-w-sm w-full space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Add Alarm</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAddAlarm(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Time</label>
                  <Input
                    type="time"
                    value={newAlarm.time}
                    onChange={(e) => setNewAlarm({ ...newAlarm, time: e.target.value })}
                    className="text-2xl font-bold text-center"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Name</label>
                  <Input
                    placeholder="Alarm name"
                    value={newAlarm.name}
                    onChange={(e) => setNewAlarm({ ...newAlarm, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Sound</label>
                  <select
                    value={newAlarm.sound}
                    onChange={(e) => setNewAlarm({ ...newAlarm, sound: e.target.value as Alarm['sound'] })}
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground"
                  >
                    {soundOptions.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Repeat</label>
                  <div className="flex gap-1 mt-1">
                    {dayLabels.map((day, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          const days = newAlarm.repeatDays || [];
                          const newDays = days.includes(i)
                            ? days.filter(d => d !== i)
                            : [...days, i];
                          setNewAlarm({ ...newAlarm, repeatDays: newDays });
                        }}
                        className={cn(
                          'w-8 h-8 rounded-full text-xs font-medium transition-colors',
                          (newAlarm.repeatDays || []).includes(i)
                            ? 'bg-gold text-midnight'
                            : 'bg-secondary/50 text-muted-foreground'
                        )}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Snooze (minutes)</label>
                  <select
                    value={newAlarm.snoozeMinutes}
                    onChange={(e) => setNewAlarm({ ...newAlarm, snoozeMinutes: Number(e.target.value) })}
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground"
                  >
                    <option value={5}>5 minutes</option>
                    <option value={10}>10 minutes</option>
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAddAlarm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddAlarm}
                  className="flex-1 bg-gold text-midnight hover:bg-gold/90"
                >
                  Add Alarm
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-midnight border border-border rounded-2xl p-6 max-w-sm w-full space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Alarm Settings</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSettings(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground">Browser Notifications</p>
                    <p className="text-xs text-muted-foreground">Get notified when alarms ring</p>
                  </div>
                  <Switch
                    checked={settings.notificationsEnabled}
                    onCheckedChange={async (enabled) => {
                      if (enabled) {
                        await requestNotificationPermission();
                      } else {
                        saveSettings({ ...settings, notificationsEnabled: false });
                      }
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground">Vibration</p>
                    <p className="text-xs text-muted-foreground">Vibrate when alarm rings</p>
                  </div>
                  <Switch
                    checked={settings.vibrationEnabled}
                    onCheckedChange={(enabled) => 
                      saveSettings({ ...settings, vibrationEnabled: enabled })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Default Sound</label>
                  <select
                    value={settings.defaultSound}
                    onChange={(e) => saveSettings({ 
                      ...settings, 
                      defaultSound: e.target.value as Alarm['sound'] 
                    })}
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground mt-1"
                  >
                    {soundOptions.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Button
                onClick={() => setShowSettings(false)}
                className="w-full bg-gold text-midnight hover:bg-gold/90"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
