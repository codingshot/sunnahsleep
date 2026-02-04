import { useState } from 'react';
import { Moon, Sun, Clock, MapPin, Edit2 } from 'lucide-react';
import { PrayerTimes } from '@/types/checklist';
import { cn } from '@/lib/utils';
import { LocationUpdateDialog } from './LocationUpdateDialog';
import { LocationSearchResult } from '@/hooks/usePrayerTimes';

interface LocationSettings {
  mode: 'auto' | 'manual';
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  country: string | null;
  timezone: string | null;
}

interface AlarmInfo {
  id: string;
  name: string;
  time: string;
  type: string;
}

interface SleepTimeCalculatorProps {
  prayerTimes: PrayerTimes | null;
  location: LocationSettings;
  alarms?: AlarmInfo[];
  onSearchCity: (query: string) => Promise<LocationSearchResult[]>;
  onSetLocation: (lat: number, lng: number, city: string, country: string) => Promise<void>;
  onResetLocation: () => Promise<void>;
  onUpdateAlarms?: (newPrayerTimes: PrayerTimes) => void;
  getNewPrayerTimes?: (lat: number, lng: number) => Promise<PrayerTimes | null>;
}

export function SleepTimeCalculator({ 
  prayerTimes, 
  location,
  alarms = [],
  onSearchCity,
  onSetLocation,
  onResetLocation,
  onUpdateAlarms,
  getNewPrayerTimes,
}: SleepTimeCalculatorProps) {
  const [showLocationDialog, setShowLocationDialog] = useState(false);

  if (!prayerTimes?.isha || !prayerTimes?.fajr) return null;

  const parseTime = (timeStr: string): Date | null => {
    const parsed = /^(\d{1,2}):(\d{2})$/.exec(timeStr?.trim() || '');
    if (!parsed) return null;
    const hours = parseInt(parsed[1], 10);
    const minutes = parseInt(parsed[2], 10);
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const ishaDate = parseTime(prayerTimes.isha);
  const fajrDate = parseTime(prayerTimes.fajr);
  if (!ishaDate || !fajrDate) return null;

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const isha = ishaDate;
  const fajr = new Date(fajrDate);
  if (fajr < isha) fajr.setDate(fajr.getDate() + 1);

  // Recommended bedtime: 30 minutes after Isha
  const bedtime = new Date(isha.getTime() + 30 * 60 * 1000);
  
  // Recommended wake time: 30 minutes before Fajr (for Tahajjud/Sunnah)
  const wakeTime = new Date(fajr.getTime() - 30 * 60 * 1000);
  
  // Calculate total sleep duration (clamp negative for edge cases e.g. polar regions)
  const sleepDurationMs = Math.max(0, wakeTime.getTime() - bedtime.getTime());
  const sleepHours = Math.floor(sleepDurationMs / (1000 * 60 * 60));
  const sleepMinutes = Math.floor((sleepDurationMs % (1000 * 60 * 60)) / (1000 * 60));

  // Determine sleep quality indicator
  const getSleepQuality = () => {
    const totalMinutes = sleepHours * 60 + sleepMinutes;
    if (totalMinutes >= 420) return { label: 'Optimal', color: 'text-green-500', bg: 'bg-green-500/10' };
    if (totalMinutes >= 360) return { label: 'Good', color: 'text-gold', bg: 'bg-gold/10' };
    if (totalMinutes >= 300) return { label: 'Fair', color: 'text-amber-500', bg: 'bg-amber-500/10' };
    return { label: 'Short', color: 'text-destructive', bg: 'bg-destructive/10' };
  };

  const quality = getSleepQuality();

  return (
    <>
      <div className="rounded-2xl bg-gradient-card border border-border overflow-hidden">
        <div className="p-5">
          {/* Header with Location */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gold/10">
                <Clock className="h-5 w-5 text-gold" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Sleep Schedule</h3>
                <p className="text-sm text-cream-dim">Based on prayer times</p>
              </div>
            </div>
          </div>

          {/* Location Display */}
          <button 
            onClick={() => setShowLocationDialog(true)}
            className="w-full p-3 rounded-xl bg-secondary/30 border border-border mb-4 flex items-center justify-between hover:border-gold/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" />
              <div className="text-left">
                <p className="text-sm text-foreground">
                  {location.city ? `${location.city}, ${location.country}` : 'Location not set'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {location.mode === 'auto' ? 'Auto-detected' : 'Manually set'}
                </p>
              </div>
            </div>
            <Edit2 className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Sleep Time Cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Bedtime */}
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Moon className="h-4 w-4 text-primary" />
                <span className="text-xs text-primary uppercase tracking-wide">Bedtime</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{formatTime(bedtime)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                30 min after Isha ({prayerTimes.isha})
              </p>
            </div>

            {/* Wake Time */}
            <div className="p-4 rounded-xl bg-gold/10 border border-gold/20">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="h-4 w-4 text-gold" />
                <span className="text-xs text-gold uppercase tracking-wide">Wake Up</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{formatTime(wakeTime)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                30 min before Fajr ({prayerTimes.fajr})
              </p>
            </div>
          </div>

          {/* Total Sleep Duration */}
          <div className={cn('p-4 rounded-xl border', quality.bg, 'border-border')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Estimated Sleep</p>
                <p className="text-3xl font-bold text-foreground">
                  {sleepHours}h {sleepMinutes}m
                </p>
              </div>
              <div className="text-right">
                <span className={cn('text-sm font-medium px-3 py-1 rounded-full', quality.bg, quality.color)}>
                  {quality.label}
                </span>
                <p className="text-xs text-muted-foreground mt-2">
                  {sleepHours >= 7 ? 'Meets recommended 7-9 hours' : 'Below recommended 7-9 hours'}
                </p>
              </div>
            </div>
          </div>

          {/* Sunnah Note */}
          <div className="mt-4 p-3 rounded-xl bg-gold/5 border border-gold/10">
            <p className="text-xs text-cream-dim leading-relaxed">
              <span className="text-gold font-medium">💡 Sunnah Tip:</span> The Prophet ﷺ recommended 
              sleeping early after Isha and waking before Fajr for Tahajjud prayer. This schedule 
              follows that blessed practice.
            </p>
          </div>
        </div>
      </div>

      {/* Location Update Dialog */}
      <LocationUpdateDialog
        isOpen={showLocationDialog}
        onClose={() => setShowLocationDialog(false)}
        currentLocation={location}
        currentPrayerTimes={prayerTimes}
        alarms={alarms}
        onSearchCity={onSearchCity}
        onSetLocation={onSetLocation}
        onResetLocation={onResetLocation}
        onUpdateAlarms={onUpdateAlarms}
        getNewPrayerTimes={getNewPrayerTimes}
      />
    </>
  );
}
