import { useState } from 'react';
import { Sun, Clock, Bell, BellOff, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { qailulahInfo } from '@/data/checklistData';
import { QailulahSettings } from '@/types/checklist';
import { HadithTooltip } from '@/components/HadithTooltip';

interface QailulahCardProps {
  settings: QailulahSettings;
  recommendedTime: string;
  onUpdateSettings: (settings: Partial<QailulahSettings>) => void;
}

export function QailulahCard({ settings, recommendedTime, onUpdateSettings }: QailulahCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="rounded-2xl bg-gradient-card border border-border overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gold/10">
              <Sun className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h3 className="font-arabic text-lg text-gradient-gold">{qailulahInfo.titleArabic}</h3>
              <p className="text-sm text-cream-dim">{qailulahInfo.title} - Midday Rest</p>
            </div>
          </div>
          
          <Switch
            checked={settings.enabled}
            onCheckedChange={(enabled) => onUpdateSettings({ enabled })}
          />
        </div>

        <p className="text-cream-dim text-sm mb-4">
          {qailulahInfo.description}
        </p>

        {settings.enabled && (
          <div className="space-y-4 p-4 rounded-xl bg-secondary/30 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-cream-dim">Reminder Time</span>
              </div>
              <input
                type="time"
                value={settings.reminderTime}
                onChange={(e) => onUpdateSettings({ reminderTime: e.target.value })}
                className="bg-secondary border border-border rounded-lg px-3 py-1 text-sm text-foreground"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-cream-dim">Duration (minutes)</span>
              </div>
              <select
                value={settings.duration}
                onChange={(e) => onUpdateSettings({ duration: Number(e.target.value) })}
                className="bg-secondary border border-border rounded-lg px-3 py-1 text-sm text-foreground"
              >
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={45}>45</option>
              </select>
            </div>

            <p className="text-xs text-muted-foreground">
              Recommended time based on Dhuhr: <span className="text-gold">{recommendedTime}</span>
            </p>
          </div>
        )}

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 mt-4 text-sm text-gold/70 hover:text-gold transition-colors"
        >
          <Info className="h-4 w-4" />
          {showDetails ? 'Hide details' : 'Learn more about Qailulah'}
        </button>

        {showDetails && (
          <div className="mt-4 p-4 rounded-xl bg-secondary/30 border border-gold/10 space-y-3">
            <p className="text-cream-dim text-sm leading-relaxed">
              {qailulahInfo.detailedExplanation}
            </p>
            
            {qailulahInfo.hadithReference.arabicText && (
              <div className="p-3 rounded-lg bg-secondary/50 border border-gold/10">
                <p className="font-arabic text-gold text-right text-lg leading-relaxed" dir="rtl">
                  {qailulahInfo.hadithReference.arabicText}
                </p>
              </div>
            )}
            
            <p className="text-cream-dim text-sm italic">
              "{qailulahInfo.hadithReference.englishText}"
            </p>
            
            <HadithTooltip 
              source="Tabarani" 
              hadithReference={qailulahInfo.hadithReference}
            >
              View Hadith Source
            </HadithTooltip>
          </div>
        )}
      </div>
    </div>
  );
}
