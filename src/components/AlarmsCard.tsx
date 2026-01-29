import { useState } from 'react';
import { 
  Bell, Plus, Trash2, 
  Sun, Moon, MapPin, Search, X, Settings, Edit2, Info, Calendar, Clock, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAlarms, Alarm, UpcomingAlarm } from '@/hooks/useAlarms';
import { PrayerTimes } from '@/types/checklist';
import { sleepAfterIshaInfo } from '@/data/checklistData';

interface LocationSettings {
  mode: 'auto' | 'manual';
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  country: string | null;
  timezone: string | null;
}

interface LocationSearchResult {
  name: string;
  displayName?: string;
  country: string;
  latitude: number;
  longitude: number;
  type?: string;
}

interface AlarmsCardProps {
  prayerTimes: PrayerTimes | null;
  location: LocationSettings;
  onSearchCity: (query: string) => Promise<LocationSearchResult[]>;
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
    upcomingAlarms,
    nextAlarm,
    addAlarm,
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
  const [showIshaReminder, setShowIshaReminder] = useState(false);
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [newAlarm, setNewAlarm] = useState<Partial<Alarm>>({
    name: '',
    time: '05:00',
    type: 'custom',
    sound: 'adhan-makkah',
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    snoozeMinutes: 5,
  });
  const [beforeFajrMinutes, setBeforeFajrMinutes] = useState(30);

  const enabledAlarmsCount = alarms.filter(a => a.enabled).length;
  const today = new Date();

  const handleSearch = async () => {
    if (citySearch.length < 2) return;
    setIsSearching(true);
    try {
      const results = await onSearchCity(citySearch);
      setSearchResults(results);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectCity = (city: LocationSearchResult) => {
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
        {/* Header with location display */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gold/10 relative">
              <Bell className="h-5 w-5 text-gold" />
              {enabledAlarmsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-midnight text-xs font-bold rounded-full flex items-center justify-center">
                  {enabledAlarmsCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Prayer Alarms</h3>
              <button 
                onClick={() => setShowLocationSearch(true)}
                className="text-sm text-cream-dim hover:text-gold transition-colors flex items-center gap-1"
              >
                <MapPin className="h-3 w-3" />
                {location.city ? `${location.city}, ${location.country}` : 'Set location'}
                <Edit2 className="h-3 w-3" />
              </button>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(true)}
            className="text-muted-foreground hover:text-gold"
            aria-label="Alarm settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Location & Calculation info */}
        {location.latitude && location.longitude && (
          <div className="p-3 rounded-xl bg-secondary/20 border border-border mb-4 text-xs text-muted-foreground space-y-1">
            <p className="flex items-center gap-1">
              <Info className="h-3 w-3 flex-shrink-0" />
              <span>
                Prayer times calculated using <strong className="text-foreground">ISNA method</strong> for {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </p>
            <p className="text-[10px] pl-4">
              Coordinates: {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}° 
              {location.mode === 'auto' ? ' (auto-detected via IP)' : ' (manually set)'}
            </p>
            <p className="text-[10px] pl-4 text-gold/70">
              Times update daily based on sun position
            </p>
          </div>
        )}

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

        {/* Next Alarm Preview */}
        {nextAlarm && !activeAlarm && (
          <div className="p-3 rounded-xl bg-gold/10 border border-gold/20 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold" />
                <span className="text-sm text-cream-dim">Next alarm:</span>
              </div>
              <div className="text-right">
                <p className="text-gold font-semibold">{nextAlarm.timeString}</p>
                <p className="text-xs text-muted-foreground">{nextAlarm.dayName} • {nextAlarm.alarm.name}</p>
              </div>
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

        {/* Isha Bedtime Reminder Section */}
        <div className="mb-4">
          <button
            onClick={() => setShowIshaReminder(!showIshaReminder)}
            className="flex items-center gap-2 text-sm text-gold/70 hover:text-gold transition-colors"
          >
            <Moon className="h-4 w-4" />
            <span>Sunnah: Sleep early after Isha</span>
            <ChevronDown className={cn("h-3 w-3 transition-transform", showIshaReminder && "rotate-180")} />
          </button>
          
          {showIshaReminder && (
            <div className="mt-3 p-4 rounded-xl bg-gold/5 border border-gold/20 space-y-2">
              <p className="text-sm text-cream-dim">{sleepAfterIshaInfo.description}</p>
              <div className="p-3 rounded-lg bg-secondary/30 border border-gold/10">
                <p className="font-arabic text-gold text-right text-sm" dir="rtl">
                  {sleepAfterIshaInfo.hadithReference.arabicText}
                </p>
                <p className="text-sm text-cream-dim italic mt-2">
                  "{sleepAfterIshaInfo.hadithReference.englishText}"
                </p>
                <a 
                  href={`https://sunnah.com/bukhari:${sleepAfterIshaInfo.hadithReference.hadithNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gold hover:underline mt-1 inline-block"
                >
                  View on Sunnah.com →
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Quick Add Prayer Alarms */}
        {prayerTimes && (
          <div className="space-y-2 mb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Quick Add Alarms</p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleQuickAddFajr}
                className="border-gold/30 text-gold hover:bg-gold/10"
                aria-label="Add Fajr alarm"
              >
                <Sun className="h-4 w-4 mr-1" />
                Fajr
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleQuickAddIsha}
                className="border-gold/30 text-gold hover:bg-gold/10"
                aria-label="Add Isha alarm"
              >
                <Moon className="h-4 w-4 mr-1" />
                Isha
              </Button>
              <div className="flex items-center gap-1">
                <select
                  value={beforeFajrMinutes}
                  onChange={(e) => setBeforeFajrMinutes(Number(e.target.value))}
                  className="bg-secondary border border-border rounded px-2 py-1 text-xs text-foreground"
                  aria-label="Minutes before Fajr"
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
                  aria-label="Add alarm before Fajr"
                >
                  Before Fajr
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Alarms for the Week */}
        {upcomingAlarms.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setShowUpcoming(!showUpcoming)}
              className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide hover:text-gold transition-colors w-full"
            >
              <Calendar className="h-3 w-3" />
              <span>Upcoming Alarms ({upcomingAlarms.length})</span>
              <ChevronDown className={cn("h-3 w-3 ml-auto transition-transform", showUpcoming && "rotate-180")} />
            </button>
            
            {showUpcoming && (
              <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                {upcomingAlarms.map((upcoming, i) => (
                  <div
                    key={`${upcoming.alarm.id}-${i}`}
                    className="p-2 rounded-lg bg-secondary/20 border border-border flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gold font-mono font-semibold">{upcoming.timeString}</span>
                      <span className="text-xs text-muted-foreground">{upcoming.dayName}</span>
                    </div>
                    <span className="text-xs text-cream-dim">{upcoming.alarm.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Alarms List */}
        {alarms.length > 0 && (
          <div className="space-y-2 mb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Your Alarms ({alarms.length})
            </p>
            {alarms.map((alarm) => (
              <div
                key={alarm.id}
                className={cn(
                  'p-3 rounded-xl border flex items-center justify-between',
                  alarm.enabled 
                    ? 'bg-secondary/30 border-gold/20' 
                    : 'bg-secondary/10 border-border opacity-60'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <p className={cn(
                      'text-xl font-bold',
                      alarm.enabled ? 'text-foreground' : 'text-muted-foreground'
                    )}>{alarm.time}</p>
                    <p className="text-xs text-cream-dim">{alarm.name}</p>
                    {alarm.repeatDays.length > 0 && alarm.repeatDays.length < 7 && (
                      <p className="text-[10px] text-muted-foreground">
                        {alarm.repeatDays.map(d => ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][d]).join(', ')}
                      </p>
                    )}
                    {alarm.repeatDays.length === 7 && (
                      <p className="text-[10px] text-muted-foreground">Every day</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={alarm.enabled}
                    onCheckedChange={() => toggleAlarm(alarm.id)}
                    aria-label={`Toggle ${alarm.name} alarm`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteAlarm(alarm.id)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label={`Delete ${alarm.name} alarm`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
            <div className="bg-midnight border border-border rounded-2xl p-6 max-w-sm w-full space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Set Your Location</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowLocationSearch(false);
                    setCitySearch('');
                    setSearchResults([]);
                  }}
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Current location display */}
              {location.city && (
                <div className="p-3 rounded-lg bg-gold/10 border border-gold/20">
                  <p className="text-sm text-muted-foreground">Current location:</p>
                  <p className="text-foreground font-medium">{location.city}, {location.country}</p>
                  <p className="text-xs text-muted-foreground">
                    {location.mode === 'auto' ? '(Auto-detected via IP)' : '(Manually set)'}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Lat: {location.latitude?.toFixed(4)}°, Lng: {location.longitude?.toFixed(4)}°
                  </p>
                </div>
              )}
              
              {/* Search input */}
              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  Search by city, zip code, address, or landmark:
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. London, 10001, Masjid Al-Haram"
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1"
                    aria-label="Search location"
                  />
                  <Button onClick={handleSearch} disabled={isSearching} aria-label="Search">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Powered by OpenStreetMap Nominatim
                </p>
              </div>

              {/* Search results */}
              {searchResults.length > 0 && (
                <div className="max-h-48 overflow-y-auto space-y-1">
                  <p className="text-xs text-muted-foreground">Select a location:</p>
                  {searchResults.map((city, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectCity(city)}
                      className="w-full p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 text-left transition-colors"
                    >
                      <p className="text-foreground font-medium">{city.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {city.displayName || city.country}
                      </p>
                      <p className="text-[10px] text-gold/70">
                        {city.latitude.toFixed(4)}°, {city.longitude.toFixed(4)}°
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {isSearching && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <div className="animate-spin h-4 w-4 border-2 border-gold border-t-transparent rounded-full" />
                  Searching...
                </div>
              )}

              <div className="border-t border-border pt-4 space-y-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    onResetLocation();
                    setShowLocationSearch(false);
                  }}
                  className="w-full"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Use Auto-Detect (IP-based)
                </Button>
                <p className="text-[10px] text-center text-muted-foreground">
                  Auto-detection uses your IP address - no GPS permission needed
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Add Alarm Modal */}
        {showAddAlarm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
            <div className="bg-midnight border border-border rounded-2xl p-6 max-w-sm w-full space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Add Custom Alarm</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAddAlarm(false)}
                  aria-label="Close"
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
                    aria-label="Alarm time"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Name</label>
                  <Input
                    placeholder="e.g. Wake up for Tahajjud"
                    value={newAlarm.name}
                    onChange={(e) => setNewAlarm({ ...newAlarm, name: e.target.value })}
                    aria-label="Alarm name"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Sound</label>
                  <select
                    value={newAlarm.sound}
                    onChange={(e) => setNewAlarm({ ...newAlarm, sound: e.target.value as Alarm['sound'] })}
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground"
                    aria-label="Alarm sound"
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
                        aria-label={`Toggle ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i]}`}
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
                    aria-label="Snooze duration"
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
                  disabled={!newAlarm.name || !newAlarm.time}
                >
                  Add Alarm
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
            <div className="bg-midnight border border-border rounded-2xl p-6 max-w-sm w-full space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Alarm Settings</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSettings(false)}
                  aria-label="Close"
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
                    aria-label="Toggle browser notifications"
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
                    aria-label="Toggle vibration"
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
                    aria-label="Default alarm sound"
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

// Export alarm count for parent components
export function useAlarmCount() {
  const { alarms } = useAlarms();
  return alarms.filter(a => a.enabled).length;
}
