import { Moon, Sun, Clock, BookOpen, Edit2, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DaySummary } from '@/hooks/useSleepHistory';
import type { SleepRecord } from '@/hooks/useSleepTracker';

interface SleepDayDetailProps {
  day: DaySummary | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (record: SleepRecord) => void;
  onDelete: (recordId: string) => void;
  onOpenDiary: (date: string) => void;
  formatDuration: (minutes: number) => string;
}

const qualityEmoji: Record<NonNullable<SleepRecord['quality']>, string> = {
  poor: '😴',
  fair: '😐',
  good: '🙂',
  excellent: '😊',
};

export function SleepDayDetail({
  day,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onOpenDiary,
  formatDuration,
}: SleepDayDetailProps) {
  if (!isOpen) return null;

  const hasSleep = day?.sleepRecord;
  const hasDiary = day?.diaryEntry;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end sm:items-center sm:justify-center z-50 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-midnight border border-border rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom sm:slide-in-from-bottom-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between sticky top-0 bg-midnight pb-2 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">
              {day?.date
                ? new Date(day.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Day Detail'}
            </h3>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {!day?.hasData ? (
            <p className="text-cream-dim text-center py-8">No data for this day.</p>
          ) : (
            <>
              {/* Sleep record */}
              {hasSleep && (
                <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gold">Sleep Record</span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => day.sleepRecord && onEdit(day.sleepRecord)}
                        className="text-gold hover:bg-gold/10"
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => day.sleepRecord && onDelete(day.sleepRecord.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4 text-gold" />
                      <span className="text-cream-dim">
                        Bed: {new Date(day.sleepRecord.bedtime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4 text-gold" />
                      <span className="text-cream-dim">
                        Wake: {day.sleepRecord.wakeTime
                          ? new Date(day.sleepRecord.wakeTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
                          : '--'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <Clock className="h-4 w-4 text-gold" />
                      <span className="text-foreground font-medium">
                        {day.sleepRecord.duration ? formatDuration(day.sleepRecord.duration) : '--'}
                      </span>
                    </div>
                    <div className="flex gap-2 col-span-2">
                      <span className={day.sleepRecord.madeIsha ? 'text-gold' : 'text-muted-foreground'} title="Isha">
                        <Moon className="h-4 w-4" />
                      </span>
                      <span className={day.sleepRecord.madeFajr ? 'text-gold' : 'text-muted-foreground'} title="Fajr">
                        <Sun className="h-4 w-4" />
                      </span>
                      {day.sleepRecord.quality && (
                        <span className="text-foreground">
                          {qualityEmoji[day.sleepRecord.quality]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Diary */}
              {hasDiary ? (
                <button
                  onClick={() => onOpenDiary(day!.date)}
                  className="w-full p-4 rounded-xl bg-secondary/30 border border-border hover:border-gold/30 text-left flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-gold" />
                    <div>
                      <p className="font-medium text-foreground">Diary Entry</p>
                      <p className="text-xs text-cream-dim">
                        {day!.diaryEntry!.mood
                          ? `Mood: ${day!.diaryEntry!.mood}`
                          : 'Tap to view'}
                      </p>
                    </div>
                  </div>
                  <span className="text-gold text-sm">View</span>
                </button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full border-gold/30 text-gold hover:bg-gold/10"
                  onClick={() => onOpenDiary(day!.date)}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Add Diary Entry
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
