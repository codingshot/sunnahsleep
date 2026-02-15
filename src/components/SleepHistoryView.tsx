import { useState } from 'react';
import { ChevronLeft, History, Plus, Moon, Sun, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSleepHistory, type DaySummary, type HistoryRange } from '@/hooks/useSleepHistory';
import { SleepDayDetail } from './SleepDayDetail';
import { ManualLogDialog } from './ManualLogDialog';
import type { SleepRecord } from '@/hooks/useSleepTracker';

const RANGE_OPTIONS: { value: HistoryRange; label: string }[] = [
  { value: 7, label: 'Last 7 days' },
  { value: 30, label: 'Last 30 days' },
  { value: 90, label: 'Last 90 days' },
  { value: 0, label: 'All' },
];

const qualityEmoji: Record<NonNullable<SleepRecord['quality']>, string> = {
  poor: '😴',
  fair: '😐',
  good: '🙂',
  excellent: '😊',
};

interface SleepHistoryViewProps {
  onBack: () => void;
  onOpenDiary: (date: string) => void;
}

export function SleepHistoryView({ onBack, onOpenDiary }: SleepHistoryViewProps) {
  const { getDaySummaries, addManualRecord, updateRecord, deleteRecord, formatDuration } =
    useSleepHistory();

  const [range, setRange] = useState<HistoryRange>(7);
  const [selectedDay, setSelectedDay] = useState<DaySummary | null>(null);
  const [showDayDetail, setShowDayDetail] = useState(false);
  const [showManualLog, setShowManualLog] = useState(false);
  const [editRecord, setEditRecord] = useState<SleepRecord | null>(null);

  const summaries = getDaySummaries(range);

  const handleSaveManual = (record: Omit<SleepRecord, 'id'>, existingId?: string) => {
    if (existingId) {
      updateRecord(existingId, record);
      setEditRecord(null);
    } else {
      addManualRecord(record);
    }
    setShowManualLog(false);
  };

  const handleEdit = (record: SleepRecord) => {
    setEditRecord(record);
    setShowDayDetail(false);
    setShowManualLog(true);
  };

  const handleDelete = (recordId: string) => {
    if (confirm('Delete this sleep record? Diary entry (if any) will be kept.')) {
      deleteRecord(recordId);
      setShowDayDetail(false);
      setSelectedDay(null);
    }
  };

  const handleOpenLog = () => {
    setEditRecord(null);
    setShowManualLog(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-gold hover:bg-gold/10">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-gold" />
          <span className="font-semibold text-foreground">Sleep History</span>
        </div>
        <div className="w-16" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={range}
          onChange={(e) => setRange(Number(e.target.value) as HistoryRange)}
          className="p-2 rounded-lg bg-secondary/30 border border-border text-foreground text-sm"
        >
          {RANGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <Button
          size="sm"
          onClick={handleOpenLog}
          className="bg-gold/20 text-gold hover:bg-gold/30 border border-gold/40"
        >
          <Plus className="h-4 w-4 mr-1" />
          Log Past Night
        </Button>
      </div>

      {summaries.length === 0 ? (
        <div className="p-8 rounded-xl bg-secondary/20 border border-dashed border-border text-center">
          <p className="text-cream-dim mb-2">No sleep records yet.</p>
          <p className="text-sm text-muted-foreground mb-4">
            Start tracking your sleep or log a past night.
          </p>
          <Button onClick={handleOpenLog} className="bg-gold text-midnight hover:bg-gold/90">
            <Plus className="h-4 w-4 mr-2" />
            Log Past Night
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {summaries.map((day) => (
            <button
              key={day.date}
              onClick={() => {
                setSelectedDay(day);
                setShowDayDetail(true);
              }}
              className={cn(
                'w-full p-4 rounded-xl border text-left flex items-center justify-between',
                'bg-secondary/20 border-border hover:border-gold/30 transition-colors'
              )}
              aria-label={`View sleep details for ${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}${day.sleepRecord?.duration != null ? `, ${formatDuration(day.sleepRecord.duration)} sleep` : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <p className="font-medium text-foreground">
                    {new Date(day.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    {day.sleepRecord?.duration != null && (
                      <span className="text-sm text-cream-dim">
                        {formatDuration(day.sleepRecord.duration)}
                      </span>
                    )}
                    {day.sleepRecord && (
                      <div className="flex gap-1">
                        <span
                          className={day.sleepRecord.madeIsha ? 'text-gold' : 'text-muted-foreground'}
                          title="Isha"
                        >
                          <Moon className="h-3.5 w-3.5 inline" />
                        </span>
                        <span
                          className={day.sleepRecord.madeFajr ? 'text-gold' : 'text-muted-foreground'}
                          title="Fajr"
                        >
                          <Sun className="h-3.5 w-3.5 inline" />
                        </span>
                      </div>
                    )}
                    {day.sleepRecord?.quality && (
                      <span>{qualityEmoji[day.sleepRecord.quality]}</span>
                    )}
                    {day.diaryEntry && (
                      <BookOpen className="h-3.5 w-3.5 text-gold/70" aria-label="Has diary" />
                    )}
                  </div>
                </div>
              </div>
              <span className="text-muted-foreground text-sm">View</span>
            </button>
          ))}
        </div>
      )}

      <SleepDayDetail
        day={selectedDay}
        isOpen={showDayDetail}
        onClose={() => setShowDayDetail(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onOpenDiary={(d) => {
          setShowDayDetail(false);
          onOpenDiary(d);
        }}
        formatDuration={formatDuration}
      />

      <ManualLogDialog
        isOpen={showManualLog}
        onClose={() => {
          setShowManualLog(false);
          setEditRecord(null);
        }}
        onSave={handleSaveManual}
        existing={editRecord}
      />
    </div>
  );
}
