import { useState } from 'react';
import { Moon, Clock, Bell, BellOff, Info, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { tahajjudInfo } from '@/data/checklistData';
import { TahajjudSettings, PrayerTimes } from '@/types/checklist';
import { HadithTooltip } from '@/components/HadithTooltip';

interface TahajjudCardProps {
  settings: TahajjudSettings;
  prayerTimes: PrayerTimes | null;
  loading: boolean;
  onToggle: (enabled: boolean) => void;
  onFetchPrayerTimes: () => void;
}

export function TahajjudCard({ 
  settings, 
  prayerTimes, 
  loading, 
  onToggle, 
  onFetchPrayerTimes 
}: TahajjudCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="rounded-2xl bg-gradient-card border border-gold/20 overflow-hidden glow-gold">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gold/10">
              <Moon className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h3 className="font-arabic text-lg text-gradient-gold">{tahajjudInfo.titleArabic}</h3>
              <p className="text-sm text-cream-dim">{tahajjudInfo.title} - Night Prayer</p>
            </div>
          </div>
          
          <Switch
            checked={settings.enabled}
            onCheckedChange={onToggle}
            disabled={!settings.calculatedTime}
          />
        </div>

        <p className="text-cream-dim text-sm mb-4">
          {tahajjudInfo.description}
        </p>

        {!prayerTimes ? (
          <Button
            onClick={onFetchPrayerTimes}
            disabled={loading}
            variant="outline"
            className="w-full border-gold/30 text-gold hover:bg-gold/10"
          >
            <MapPin className="h-4 w-4 mr-2" />
            {loading ? 'Getting location...' : 'Set Location for Prayer Times'}
          </Button>
        ) : (
          <div className="space-y-3 p-4 rounded-xl bg-secondary/30 border border-border">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Maghrib</p>
                <p className="text-foreground font-medium">{prayerTimes.maghrib}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Fajr</p>
                <p className="text-foreground font-medium">{prayerTimes.fajr}</p>
              </div>
            </div>
            
            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gold" />
                  <span className="text-cream-dim text-sm">Last Third Starts</span>
                </div>
                <span className="text-gold font-semibold text-lg">
                  {settings.calculatedTime || '--:--'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                This is the blessed time when Allah descends to the lowest heaven
              </p>
            </div>

            {settings.enabled && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gold/10 border border-gold/20">
                <Bell className="h-4 w-4 text-gold" />
                <span className="text-sm text-gold">Alarm set for {settings.calculatedTime}</span>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 mt-4 text-sm text-gold/70 hover:text-gold transition-colors"
        >
          <Info className="h-4 w-4" />
          {showDetails ? 'Hide details' : 'Learn more about Tahajjud'}
        </button>

        {showDetails && (
          <div className="mt-4 p-4 rounded-xl bg-secondary/30 border border-gold/10 space-y-3">
            <p className="text-cream-dim text-sm leading-relaxed">
              {tahajjudInfo.detailedExplanation}
            </p>
            
            {tahajjudInfo.hadithReference.arabicText && (
              <div className="p-3 rounded-lg bg-secondary/50 border border-gold/10">
                <p className="font-arabic text-gold text-right text-lg leading-relaxed" dir="rtl">
                  {tahajjudInfo.hadithReference.arabicText}
                </p>
              </div>
            )}
            
            <p className="text-cream-dim text-sm italic">
              "{tahajjudInfo.hadithReference.englishText}"
            </p>
            
            <HadithTooltip 
              source="Bukhari" 
              hadithReference={tahajjudInfo.hadithReference}
            >
              View Hadith Source
            </HadithTooltip>
          </div>
        )}
      </div>
    </div>
  );
}
