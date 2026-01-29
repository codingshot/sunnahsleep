import { useState, useEffect, useCallback } from 'react';
import { MapPin, Search, Loader2, AlertTriangle, Clock, Bell, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PrayerTimes } from '@/types/checklist';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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
  displayName: string;
  country: string;
  latitude: number;
  longitude: number;
  type: string;
}

interface AlarmInfo {
  id: string;
  name: string;
  time: string;
  type: string;
}

interface LocationUpdateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationSettings;
  currentPrayerTimes: PrayerTimes | null;
  alarms: AlarmInfo[];
  onSearchCity: (query: string) => Promise<LocationSearchResult[]>;
  onSetLocation: (lat: number, lng: number, city: string, country: string) => Promise<void>;
  onResetLocation: () => Promise<void>;
  onUpdateAlarms?: (newPrayerTimes: PrayerTimes) => void;
  getNewPrayerTimes?: (lat: number, lng: number) => Promise<PrayerTimes | null>;
}

export function LocationUpdateDialog({
  isOpen,
  onClose,
  currentLocation,
  currentPrayerTimes,
  alarms,
  onSearchCity,
  onSetLocation,
  onResetLocation,
  onUpdateAlarms,
  getNewPrayerTimes,
}: LocationUpdateDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationSearchResult | null>(null);
  const [newPrayerTimes, setNewPrayerTimes] = useState<PrayerTimes | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateAlarms, setUpdateAlarms] = useState(true);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSearchResults([]);
      setSelectedLocation(null);
      setNewPrayerTimes(null);
      setShowConfirmation(false);
      setUpdateAlarms(true);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await onSearchCity(searchQuery);
        setSearchResults(results.slice(0, 8));
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearchCity]);

  // Handle location selection
  const handleSelectLocation = useCallback(async (location: LocationSearchResult) => {
    setSelectedLocation(location);
    setSearchResults([]);
    setSearchQuery('');

    // Fetch new prayer times for preview
    if (getNewPrayerTimes) {
      try {
        const times = await getNewPrayerTimes(location.latitude, location.longitude);
        setNewPrayerTimes(times);
      } catch (error) {
        console.error('Failed to fetch prayer times:', error);
      }
    }

    // Check if there are prayer-based alarms
    const prayerAlarms = alarms.filter(a => 
      ['fajr', 'isha', 'tahajjud', 'fajr-before'].includes(a.type)
    );

    if (prayerAlarms.length > 0) {
      setShowConfirmation(true);
    } else {
      // No alarms to update, proceed directly
      await confirmLocationUpdate(location, false);
    }
  }, [alarms, getNewPrayerTimes]);

  // Confirm and apply location update
  const confirmLocationUpdate = async (location: LocationSearchResult, shouldUpdateAlarms: boolean) => {
    setIsUpdating(true);
    
    try {
      await onSetLocation(location.latitude, location.longitude, location.name, location.country);
      
      // Show time change notification
      if (currentPrayerTimes && newPrayerTimes) {
        const changes = getTimeChanges(currentPrayerTimes, newPrayerTimes);
        
        toast.success(`Location updated to ${location.name}`, {
          description: (
            <div className="mt-2 space-y-1 text-sm">
              <div className="font-medium">Prayer time changes:</div>
              {changes.map((change, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span>{change.name}:</span>
                  <span className="text-muted-foreground">{change.oldTime}</span>
                  <span>→</span>
                  <span className={cn(
                    change.diff > 0 ? 'text-amber-500' : 'text-green-500'
                  )}>
                    {change.newTime} ({change.diff > 0 ? '+' : ''}{change.diff}m)
                  </span>
                </div>
              ))}
            </div>
          ),
          duration: 8000,
        });

        if (shouldUpdateAlarms && onUpdateAlarms) {
          onUpdateAlarms(newPrayerTimes);
          toast.info('Prayer-based alarms updated to new times');
        }
      } else {
        toast.success(`Location updated to ${location.name}`);
      }
      
      onClose();
    } catch (error) {
      toast.error('Failed to update location');
    } finally {
      setIsUpdating(false);
    }
  };

  // Calculate time changes
  const getTimeChanges = (oldTimes: PrayerTimes, newTimes: PrayerTimes) => {
    const prayers: { key: keyof PrayerTimes; name: string }[] = [
      { key: 'fajr', name: 'Fajr' },
      { key: 'isha', name: 'Isha' },
      { key: 'dhuhr', name: 'Dhuhr' },
      { key: 'maghrib', name: 'Maghrib' },
    ];

    return prayers.map(({ key, name }) => {
      const [oldH, oldM] = oldTimes[key].split(':').map(Number);
      const [newH, newM] = newTimes[key].split(':').map(Number);
      const oldMinutes = oldH * 60 + oldM;
      const newMinutes = newH * 60 + newM;
      const diff = newMinutes - oldMinutes;

      return {
        name,
        oldTime: oldTimes[key],
        newTime: newTimes[key],
        diff,
      };
    });
  };

  // Format time for display
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  // Calculate bedtime/wake changes
  const getScheduleChanges = () => {
    if (!currentPrayerTimes || !newPrayerTimes) return null;

    const calcTimes = (times: PrayerTimes) => {
      const [ishaH, ishaM] = times.isha.split(':').map(Number);
      const [fajrH, fajrM] = times.fajr.split(':').map(Number);
      
      const isha = new Date();
      isha.setHours(ishaH, ishaM + 30, 0, 0);
      
      const fajr = new Date();
      fajr.setHours(fajrH, fajrM - 30, 0, 0);
      if (fajr < isha) fajr.setDate(fajr.getDate() + 1);
      
      return { bedtime: isha, wakeTime: fajr };
    };

    const oldSchedule = calcTimes(currentPrayerTimes);
    const newSchedule = calcTimes(newPrayerTimes);

    return {
      oldBedtime: oldSchedule.bedtime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      newBedtime: newSchedule.bedtime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      oldWake: oldSchedule.wakeTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      newWake: newSchedule.wakeTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    };
  };

  const prayerAlarms = alarms.filter(a => 
    ['fajr', 'isha', 'tahajjud', 'fajr-before'].includes(a.type)
  );

  const scheduleChanges = getScheduleChanges();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-midnight border-border max-w-sm max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <MapPin className="h-5 w-5 text-gold" />
            Update Location
          </DialogTitle>
          <DialogDescription>
            Search for your city to update prayer times
          </DialogDescription>
        </DialogHeader>

        {!showConfirmation ? (
          <div className="space-y-4">
            {/* Current Location */}
            <div className="p-3 rounded-lg bg-secondary/30 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Current Location</p>
              <p className="text-sm font-medium text-foreground">
                {currentLocation.city ? `${currentLocation.city}, ${currentLocation.country}` : 'Not set'}
              </p>
              {currentPrayerTimes && (
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-cream-dim">
                  <span>Fajr: {formatTime(currentPrayerTimes.fajr)}</span>
                  <span>Isha: {formatTime(currentPrayerTimes.isha)}</span>
                </div>
              )}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city..."
                className="pl-9 bg-secondary/50 border-border"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold animate-spin" />
              )}
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="rounded-lg border border-border bg-secondary/50 overflow-hidden max-h-48 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <button
                    key={`${result.latitude}-${result.longitude}-${index}`}
                    onClick={() => handleSelectLocation(result)}
                    className="w-full px-3 py-2 text-left hover:bg-gold/10 transition-colors border-b border-border last:border-b-0"
                  >
                    <p className="text-sm font-medium text-foreground">{result.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{result.displayName}</p>
                  </button>
                ))}
              </div>
            )}

            {/* Auto-detect button */}
            <Button
              variant="outline"
              onClick={async () => {
                setIsUpdating(true);
                try {
                  await onResetLocation();
                  toast.success('Location auto-detected');
                  onClose();
                } catch (error) {
                  toast.error('Failed to detect location');
                } finally {
                  setIsUpdating(false);
                }
              }}
              disabled={isUpdating}
              className="w-full border-gold/30 text-gold hover:bg-gold/10"
            >
              {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <MapPin className="h-4 w-4 mr-2" />}
              Auto-detect Location
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Selected Location Preview */}
            <div className="p-3 rounded-lg bg-gold/10 border border-gold/30">
              <p className="text-xs text-gold mb-1">New Location</p>
              <p className="text-sm font-medium text-foreground">
                {selectedLocation?.name}, {selectedLocation?.country}
              </p>
            </div>

            {/* Schedule Changes Preview */}
            {scheduleChanges && (
              <div className="p-3 rounded-lg bg-secondary/30 border border-border space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gold" />
                  <span className="font-medium">Schedule Changes</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Bedtime</p>
                    <p className="text-foreground">
                      {scheduleChanges.oldBedtime} → <span className="text-gold">{scheduleChanges.newBedtime}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Wake Time</p>
                    <p className="text-foreground">
                      {scheduleChanges.oldWake} → <span className="text-gold">{scheduleChanges.newWake}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Prayer Time Changes */}
            {newPrayerTimes && currentPrayerTimes && (
              <div className="p-3 rounded-lg bg-secondary/30 border border-border space-y-2">
                <p className="text-xs font-medium text-foreground">Prayer Time Changes</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {getTimeChanges(currentPrayerTimes, newPrayerTimes).map((change) => (
                    <div key={change.name}>
                      <span className="text-muted-foreground">{change.name}: </span>
                      <span className={cn(
                        change.diff > 0 ? 'text-amber-500' : change.diff < 0 ? 'text-green-500' : 'text-foreground'
                      )}>
                        {change.newTime} ({change.diff > 0 ? '+' : ''}{change.diff}m)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alarm Update Warning */}
            {prayerAlarms.length > 0 && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Update Prayer Alarms?</p>
                    <p className="text-xs text-cream-dim mt-1">
                      You have {prayerAlarms.length} prayer-based alarm{prayerAlarms.length > 1 ? 's' : ''} that will be affected:
                    </p>
                  </div>
                </div>
                
                <div className="space-y-1 ml-6">
                  {prayerAlarms.map((alarm) => (
                    <div key={alarm.id} className="flex items-center gap-2 text-xs">
                      <Bell className="h-3 w-3 text-gold" />
                      <span className="text-foreground">{alarm.name}</span>
                      <span className="text-muted-foreground">{alarm.time}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 ml-6">
                  <button
                    onClick={() => setUpdateAlarms(!updateAlarms)}
                    className={cn(
                      'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                      updateAlarms 
                        ? 'bg-gold border-gold' 
                        : 'border-muted-foreground hover:border-gold'
                    )}
                  >
                    {updateAlarms && <Check className="h-3 w-3 text-midnight" />}
                  </button>
                  <span className="text-sm text-foreground">Update alarms to new times</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowConfirmation(false);
                  setSelectedLocation(null);
                  setNewPrayerTimes(null);
                }}
                className="flex-1"
                disabled={isUpdating}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button
                onClick={() => selectedLocation && confirmLocationUpdate(selectedLocation, updateAlarms)}
                className="flex-1 bg-gold text-midnight hover:bg-gold/90"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Check className="h-4 w-4 mr-1" />
                )}
                Confirm
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
