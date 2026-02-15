import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { SleepRecord } from '@/hooks/useSleepTracker';

interface ManualLogDialogProps {
  isOpen: boolean;
  onClose: () => void;
  /** When existingId is provided, parent should call updateRecord; otherwise addManualRecord */
  onSave: (record: Omit<SleepRecord, 'id'>, existingId?: string) => void;
  /** Pre-fill for edit mode */
  existing?: SleepRecord | null;
}

const QUALITY_OPTIONS: { value: SleepRecord['quality']; label: string; emoji: string }[] = [
  { value: 'poor', label: 'Poor', emoji: '😴' },
  { value: 'fair', label: 'Fair', emoji: '😐' },
  { value: 'good', label: 'Good', emoji: '🙂' },
  { value: 'excellent', label: 'Excellent', emoji: '😊' },
];

function toTimeString(d: Date): string {
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

function parseTime(dateStr: string, timeStr: string): Date {
  const [h, m] = timeStr.split(':').map(Number);
  const d = new Date(dateStr + 'T00:00:00');
  d.setHours(h, m, 0, 0);
  return d;
}

export function ManualLogDialog({
  isOpen,
  onClose,
  onSave,
  existing,
}: ManualLogDialogProps) {
  const isEdit = !!existing;
  const fixedDate = existing?.date;

  const [date, setDate] = useState('');
  const [bedTime, setBedTime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('06:00');
  const [madeIsha, setMadeIsha] = useState(true);
  const [madeFajr, setMadeFajr] = useState(true);
  const [quality, setQuality] = useState<SleepRecord['quality']>('good');

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      if (existing) {
        setDate(existing.date);
        const bed = new Date(existing.bedtime);
        const wake = existing.wakeTime ? new Date(existing.wakeTime) : null;
        setBedTime(toTimeString(bed));
        setWakeTime(wake ? toTimeString(wake) : '06:00');
        setMadeIsha(existing.madeIsha);
        setMadeFajr(existing.madeFajr);
        setQuality(existing.quality ?? 'good');
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        setDate(yesterday.toISOString().split('T')[0]);
        setBedTime('23:00');
        setWakeTime('06:00');
        setMadeIsha(true);
        setMadeFajr(true);
        setQuality('good');
      }
    }
  }, [isOpen, existing]);

  const handleSubmit = () => {
    const today = new Date().toISOString().split('T')[0];
    if (date > today) return;

    const bedDate = parseTime(date, bedTime);
    let wakeDate = parseTime(date, wakeTime);
    if (wakeDate <= bedDate) {
      wakeDate.setDate(wakeDate.getDate() + 1);
    }
    const duration = Math.round((wakeDate.getTime() - bedDate.getTime()) / 60000);

    const record: Omit<SleepRecord, 'id'> = {
      date,
      bedtime: bedDate.toISOString(),
      wakeTime: wakeDate.toISOString(),
      duration,
      madeIsha,
      madeFajr,
      quality,
    };
    onSave(record, existing?.id);
    onClose();
  };

  const today = new Date().toISOString().split('T')[0];
  const canSave = date && date <= today && bedTime && wakeTime;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-midnight border border-border rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              {isEdit ? 'Edit Sleep Record' : 'Log Past Night'}
            </h3>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div>
            <label className="text-sm text-muted-foreground block mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={today}
              disabled={!!fixedDate}
              className="w-full p-3 rounded-xl bg-secondary/30 border border-border text-foreground disabled:opacity-70"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Bedtime</label>
              <input
                type="time"
                value={bedTime}
                onChange={(e) => setBedTime(e.target.value)}
                className="w-full p-3 rounded-xl bg-secondary/30 border border-border text-foreground"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Wake time</label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full p-3 rounded-xl bg-secondary/30 border border-border text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setMadeIsha(!madeIsha)}
              className={cn(
                'w-full p-3 rounded-xl border flex items-center gap-3',
                madeIsha ? 'bg-gold/10 border-gold/40' : 'bg-secondary/30 border-border'
              )}
              aria-pressed={madeIsha}
              aria-label={madeIsha ? 'Prayed Isha (click to uncheck)' : 'Mark as prayed Isha'}
            >
              <span className={madeIsha ? 'text-gold' : 'text-muted-foreground'}>
                {madeIsha ? '✓' : '○'} Prayed Isha
              </span>
            </button>
            <button
              onClick={() => setMadeFajr(!madeFajr)}
              className={cn(
                'w-full p-3 rounded-xl border flex items-center gap-3',
                madeFajr ? 'bg-gold/10 border-gold/40' : 'bg-secondary/30 border-border'
              )}
              aria-pressed={madeFajr}
              aria-label={madeFajr ? 'Prayed Fajr (click to uncheck)' : 'Mark as prayed Fajr'}
            >
              <span className={madeFajr ? 'text-gold' : 'text-muted-foreground'}>
                {madeFajr ? '✓' : '○'} Prayed Fajr
              </span>
            </button>
          </div>

          <div>
            <label className="text-sm text-muted-foreground block mb-2">Sleep quality</label>
            <div className="grid grid-cols-4 gap-2">
              {QUALITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setQuality(opt.value)}
                  className={cn(
                    'p-2 rounded-lg border text-center transition-all',
                    quality === opt.value ? 'bg-gold/10 border-gold/40' : 'bg-secondary/30 border-border'
                  )}
                  aria-pressed={quality === opt.value}
                  aria-label={`Sleep quality: ${opt.label}`}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <p className="text-[10px] text-cream-dim mt-1">{opt.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!canSave} className="flex-1 bg-gold text-midnight hover:bg-gold/90">
              <Save className="h-4 w-4 mr-2" />
              {isEdit ? 'Save' : 'Add Record'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
