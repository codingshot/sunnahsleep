import { Moon, Sun, Clock, MapPin } from 'lucide-react';
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

interface SleepScheduleInfoProps {
  prayerTimes: PrayerTimes;
  location: LocationSettings;
  onLocationClick: () => void;
}

export function SleepScheduleInfo({ 
  prayerTimes, 
  location, 
  onLocationClick 
}: SleepScheduleInfoProps) {
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
    if (totalMinutes >= 420) return { color: 'text-green-400' };
    if (totalMinutes >= 360) return { color: 'text-gold' };
    if (totalMinutes >= 300) return { color: 'text-orange-400' };
    return { color: 'text-red-400' };
  };

  const quality = getSleepQuality();

  return (
    <div className="space-y-2">
      {/* Bedtime */}
      <div className="flex items-center gap-2">
        <Moon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
        <span className="text-xs text-muted-foreground">Bed:</span>
        <span className="text-sm font-medium text-foreground">{formatTime(bedtime)}</span>
      </div>
      
      {/* Wake Time */}
      <div className="flex items-center gap-2">
        <Sun className="h-3.5 w-3.5 text-gold flex-shrink-0" />
        <span className="text-xs text-muted-foreground">Wake:</span>
        <span className="text-sm font-medium text-foreground">{formatTime(wakeTime)}</span>
      </div>
      
      {/* Estimated Sleep */}
      <div className="flex items-center gap-2">
        <Clock className="h-3.5 w-3.5 text-gold flex-shrink-0" />
        <span className="text-xs text-muted-foreground">Sleep:</span>
        <span className={cn("text-sm font-semibold", quality.color)}>
          {sleepHours}h {sleepMinutes}m
        </span>
      </div>
      
      {/* Location */}
      <button 
        onClick={onLocationClick}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-gold transition-colors group"
      >
        <MapPin className="h-3 w-3 group-hover:text-gold" />
        <span className="truncate max-w-[120px]">
          {location.city || 'Set location'}
        </span>
      </button>
    </div>
  );
}
