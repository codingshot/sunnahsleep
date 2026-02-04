import { useState } from 'react';
import { Moon, Sun, Clock, Check, X, Bed, Activity, BookOpen, Sparkles, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSleepTracker, SleepRecord } from '@/hooks/useSleepTracker';
import { useSleepDiary } from '@/hooks/useSleepDiary';
import { SleepDiaryDialog, DiaryEntry } from '@/components/SleepDiaryDialog';
import { SleepHistoryView } from '@/components/SleepHistoryView';

interface SleepTrackerCardProps {
  onIshaChecked?: boolean;
}

export function SleepTrackerCard({ onIshaChecked }: SleepTrackerCardProps) {
  const {
    isSleeping,
    currentSleep,
    startSleep,
    endSleep,
    cancelSleep,
    getStats,
    getRecentRecords,
    formatDuration,
  } = useSleepTracker();

  const { saveEntry, getRecentEntries, getEntryByDate } = useSleepDiary();

  const [showWakeDialog, setShowWakeDialog] = useState(false);
  const [showDiaryDialog, setShowDiaryDialog] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedDiaryDate, setSelectedDiaryDate] = useState<string>('');
  const [madeFajr, setMadeFajr] = useState(false);
  const [quality, setQuality] = useState<SleepRecord['quality']>(null);

  const stats = getStats();
  const recentRecords = getRecentRecords(5);
  const recentDiaryEntries = getRecentEntries(3);

  const handleStartSleep = () => {
    startSleep(onIshaChecked || false);
  };

  const handleWakeUp = () => {
    setShowWakeDialog(true);
  };

  const handleConfirmWake = () => {
    endSleep(madeFajr, quality);
    setShowWakeDialog(false);
    setMadeFajr(false);
    setQuality(null);
    
    // Prompt to add diary entry
    setSelectedDiaryDate(new Date().toISOString().split('T')[0]);
    setShowDiaryDialog(true);
  };

  const handleOpenDiary = (date?: string) => {
    setSelectedDiaryDate(date || new Date().toISOString().split('T')[0]);
    setShowDiaryDialog(true);
  };

  const handleSaveDiary = (entry: Omit<DiaryEntry, 'id' | 'createdAt'>) => {
    saveEntry(entry);
  };

  const qualityOptions: { value: SleepRecord['quality']; label: string; emoji: string }[] = [
    { value: 'poor', label: 'Poor', emoji: '😴' },
    { value: 'fair', label: 'Fair', emoji: '😐' },
    { value: 'good', label: 'Good', emoji: '🙂' },
    { value: 'excellent', label: 'Excellent', emoji: '😊' },
  ];

  if (showHistory) {
    return (
      <div className="rounded-2xl bg-gradient-card border border-border overflow-hidden">
        <div className="p-5">
          <SleepHistoryView
            onBack={() => setShowHistory(false)}
            onOpenDiary={(date) => {
              setSelectedDiaryDate(date);
              setShowHistory(false);
              setShowDiaryDialog(true);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-card border border-border overflow-hidden">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gold/10">
            <Bed className="h-5 w-5 text-gold" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">Sleep Tracker</h3>
            <p className="text-sm text-cream-dim">Track your sleep and prayer adherence</p>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(true)}
              className="text-gold hover:bg-gold/10"
              title="View history"
            >
              <History className="h-4 w-4 mr-1" />
              History
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenDiary()}
              className="text-gold hover:bg-gold/10"
            >
              <BookOpen className="h-4 w-4 mr-1" />
              Diary
            </Button>
          </div>
        </div>

        {/* Current Sleep Status */}
        {isSleeping ? (
          <div className="p-4 rounded-xl bg-gold/10 border border-gold/30 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-gold animate-pulse" />
                <span className="text-gold font-medium">Currently Sleeping</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={cancelSleep}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-cream-dim mb-3">
              Started at {currentSleep?.bedtime ? new Date(currentSleep.bedtime).toLocaleTimeString() : '--:--'}
            </p>
            <Button
              onClick={handleWakeUp}
              className="w-full bg-gold text-midnight hover:bg-gold/90"
            >
              <Sun className="h-4 w-4 mr-2" />
              Wake Up
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleStartSleep}
            className="w-full mb-4 bg-secondary/50 border border-gold/30 text-gold hover:bg-gold/10"
          >
            <Moon className="h-4 w-4 mr-2" />
            Start Sleep Tracking
          </Button>
        )}

        {/* Wake Up Dialog */}
        {showWakeDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-midnight border border-border rounded-2xl p-6 max-w-sm w-full space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Good Morning! ☀️</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => setMadeFajr(!madeFajr)}
                  className={cn(
                    'w-full p-3 rounded-xl border flex items-center gap-3 transition-all',
                    madeFajr 
                      ? 'bg-gold/10 border-gold/40' 
                      : 'bg-secondary/30 border-border hover:border-gold/30'
                  )}
                >
                  <div className={cn(
                    'w-6 h-6 rounded-lg border-2 flex items-center justify-center',
                    madeFajr ? 'bg-gold border-gold' : 'border-gold/40'
                  )}>
                    {madeFajr && <Check className="h-4 w-4 text-midnight" />}
                  </div>
                  <span className={madeFajr ? 'text-gold' : 'text-foreground'}>
                    I prayed Fajr
                  </span>
                </button>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Sleep Quality</p>
                  <div className="grid grid-cols-4 gap-2">
                    {qualityOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setQuality(option.value)}
                        className={cn(
                          'p-2 rounded-lg border text-center transition-all',
                          quality === option.value
                            ? 'bg-gold/10 border-gold/40'
                            : 'bg-secondary/30 border-border hover:border-gold/30'
                        )}
                      >
                        <span className="text-xl">{option.emoji}</span>
                        <p className="text-xs text-cream-dim mt-1">{option.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowWakeDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmWake}
                  className="flex-1 bg-gold text-midnight hover:bg-gold/90"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-xl bg-secondary/30 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-gold" />
              <span className="text-xs text-muted-foreground">Avg Sleep</span>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {stats.averageDuration > 0 ? formatDuration(stats.averageDuration) : '--'}
            </p>
          </div>
          
          <div className="p-3 rounded-xl bg-secondary/30 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-gold" />
              <span className="text-xs text-muted-foreground">This Week</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{stats.thisWeek} nights</p>
          </div>
          
          <div className="p-3 rounded-xl bg-secondary/30 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Moon className="h-4 w-4 text-gold" />
              <span className="text-xs text-muted-foreground">Isha Rate</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{stats.ishaRate}%</p>
          </div>
          
          <div className="p-3 rounded-xl bg-secondary/30 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Sun className="h-4 w-4 text-gold" />
              <span className="text-xs text-muted-foreground">Fajr Rate</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{stats.fajrRate}%</p>
          </div>
        </div>

        {/* Recent Diary Entries */}
        {recentDiaryEntries.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Recent Diary Entries
            </p>
            <div className="space-y-2">
              {recentDiaryEntries.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => handleOpenDiary(entry.date)}
                  className="w-full p-3 rounded-lg bg-secondary/20 border border-border flex items-center justify-between hover:border-gold/30 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-cream-dim">
                      {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    {entry.mood && (
                      <span className="text-sm">
                        {entry.mood === 'great' ? '😊' : entry.mood === 'good' ? '🙂' : entry.mood === 'okay' ? '😐' : entry.mood === 'tired' ? '😴' : '😫'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {entry.dreamType && entry.dreamType !== 'none' && (
                      <span className="text-xs text-gold/70">
                        {entry.dreamType === 'good' ? '✨ Good dream' : entry.dreamType === 'bad' ? '😰' : '💭'}
                      </span>
                    )}
                    <BookOpen className="h-3 w-3 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent Records */}
        {recentRecords.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Recent Nights</p>
            {recentRecords.slice(0, 3).map((record) => (
              <div
                key={record.id}
                className="p-3 rounded-lg bg-secondary/20 border border-border flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-cream-dim">
                    {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {record.duration && (
                    <span className="text-sm text-foreground">{formatDuration(record.duration)}</span>
                  )}
                  <div className="flex gap-1">
                    <span className={record.madeIsha ? 'text-gold' : 'text-muted-foreground'} title="Isha">
                      <Moon className="h-4 w-4" />
                    </span>
                    <span className={record.madeFajr ? 'text-gold' : 'text-muted-foreground'} title="Fajr">
                      <Sun className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sleep Diary Dialog */}
        <SleepDiaryDialog
          isOpen={showDiaryDialog}
          onClose={() => setShowDiaryDialog(false)}
          onSave={handleSaveDiary}
          existingEntry={getEntryByDate(selectedDiaryDate) || undefined}
          date={selectedDiaryDate}
        />
      </div>
    </div>
  );
}
