import { Moon, Sun, Clock, MapPin, Edit2 } from 'lucide-react';
import { PrayerTimes } from '@/types/checklist';
import { cn } from '@/lib/utils';

interface LocationSettings {
  mode: 'auto' | 'manual';
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  country: string | null;
  timezone: string | null;
}

interface SleepTimeCalculatorProps {
  prayerTimes: PrayerTimes | null;
  location: LocationSettings;
  onLocationClick: () => void;
}

export function SleepTimeCalculator({ 
  prayerTimes, 
  location, 
  onLocationClick 
}: SleepTimeCalculatorProps) {
  if (!prayerTimes) return null;

  // Calculate recommended bedtime (30 min after Isha)
  const parseTime = (timeStr: string): Date => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const isha = parseTime(prayerTimes.isha);
  const fajr = parseTime(prayerTimes.fajr);
  
  // If fajr is before isha, it's next day
  if (fajr < isha) {
    fajr.setDate(fajr.getDate() + 1);
  }

  // Recommended bedtime: 30 minutes after Isha
  const bedtime = new Date(isha.getTime() + 30 * 60 * 1000);
  
  // Recommended wake time: 30 minutes before Fajr (for Tahajjud/Sunnah)
  const wakeTime = new Date(fajr.getTime() - 30 * 60 * 1000);
  
  // Calculate total sleep duration
  const sleepDurationMs = wakeTime.getTime() - bedtime.getTime();
  const sleepHours = Math.floor(sleepDurationMs / (1000 * 60 * 60));
  const sleepMinutes = Math.floor((sleepDurationMs % (1000 * 60 * 60)) / (1000 * 60));

  // Determine sleep quality indicator
  const getSleepQuality = () => {
    const totalMinutes = sleepHours * 60 + sleepMinutes;
    if (totalMinutes >= 420) return { label: 'Optimal', color: 'text-green-400', bg: 'bg-green-400/10' };
    if (totalMinutes >= 360) return { label: 'Good', color: 'text-gold', bg: 'bg-gold/10' };
    if (totalMinutes >= 300) return { label: 'Fair', color: 'text-orange-400', bg: 'bg-orange-400/10' };
    return { label: 'Short', color: 'text-red-400', bg: 'bg-red-400/10' };
  };

  const quality = getSleepQuality();

  return (
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
          onClick={onLocationClick}
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
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Moon className="h-4 w-4 text-indigo-400" />
              <span className="text-xs text-indigo-300 uppercase tracking-wide">Bedtime</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatTime(bedtime)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              30 min after Isha ({prayerTimes.isha})
            </p>
          </div>

          {/* Wake Time */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="h-4 w-4 text-amber-400" />
              <span className="text-xs text-amber-300 uppercase tracking-wide">Wake Up</span>
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
  );
}
