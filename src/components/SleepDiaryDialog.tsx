import { useState } from 'react';
import { X, BookOpen, Moon, Sparkles, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export interface DiaryEntry {
  id: string;
  date: string;
  sleepNotes: string;
  dreamNotes: string;
  mood: 'great' | 'good' | 'okay' | 'tired' | 'poor' | null;
  dreamType: 'good' | 'neutral' | 'bad' | 'none' | null;
  createdAt: string;
}

interface SleepDiaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<DiaryEntry, 'id' | 'createdAt'>) => void;
  existingEntry?: DiaryEntry;
  date: string;
}

const moodOptions: { value: DiaryEntry['mood']; label: string; emoji: string }[] = [
  { value: 'great', label: 'Great', emoji: '😊' },
  { value: 'good', label: 'Good', emoji: '🙂' },
  { value: 'okay', label: 'Okay', emoji: '😐' },
  { value: 'tired', label: 'Tired', emoji: '😴' },
  { value: 'poor', label: 'Poor', emoji: '😫' },
];

const dreamTypeOptions: { value: DiaryEntry['dreamType']; label: string; emoji: string; description: string }[] = [
  { value: 'good', label: 'Good Dream', emoji: '✨', description: 'Ruya (from Allah)' },
  { value: 'neutral', label: 'Neutral', emoji: '💭', description: 'Hulum (from self)' },
  { value: 'bad', label: 'Bad Dream', emoji: '😰', description: 'From Shaytan - seek refuge' },
  { value: 'none', label: 'No Dream', emoji: '😶', description: 'Didn\'t remember' },
];

export function SleepDiaryDialog({
  isOpen,
  onClose,
  onSave,
  existingEntry,
  date,
}: SleepDiaryDialogProps) {
  const [sleepNotes, setSleepNotes] = useState(existingEntry?.sleepNotes || '');
  const [dreamNotes, setDreamNotes] = useState(existingEntry?.dreamNotes || '');
  const [mood, setMood] = useState<DiaryEntry['mood']>(existingEntry?.mood || null);
  const [dreamType, setDreamType] = useState<DiaryEntry['dreamType']>(existingEntry?.dreamType || null);

  const handleSave = () => {
    onSave({
      date,
      sleepNotes,
      dreamNotes,
      mood,
      dreamType,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
      <div className="bg-midnight border border-border rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gold/10">
                <BookOpen className="h-5 w-5 text-gold" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Sleep & Dream Diary</h3>
                <p className="text-xs text-muted-foreground">
                  {new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Morning Mood */}
          <div>
            <label className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
              <Moon className="h-4 w-4" />
              How did you feel when waking up?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {moodOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setMood(option.value)}
                  className={cn(
                    'p-2 rounded-xl border text-center transition-all',
                    mood === option.value
                      ? 'bg-gold/10 border-gold/40'
                      : 'bg-secondary/30 border-border hover:border-gold/30'
                  )}
                >
                  <span className="text-xl">{option.emoji}</span>
                  <p className="text-[10px] text-cream-dim mt-1">{option.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Sleep Notes */}
          <div>
            <label className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
              <Moon className="h-4 w-4" />
              Sleep Notes (optional)
            </label>
            <Textarea
              placeholder="How was your sleep? Did you wake up during the night? Any thoughts..."
              value={sleepNotes}
              onChange={(e) => setSleepNotes(e.target.value)}
              className="bg-secondary/30 border-border resize-none"
              rows={3}
            />
          </div>

          {/* Dream Type */}
          <div>
            <label className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4" />
              Did you have any dreams?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {dreamTypeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDreamType(option.value)}
                  className={cn(
                    'p-3 rounded-xl border text-left transition-all',
                    dreamType === option.value
                      ? 'bg-gold/10 border-gold/40'
                      : 'bg-secondary/30 border-border hover:border-gold/30'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{option.emoji}</span>
                    <span className="text-sm text-foreground">{option.label}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Dream Notes */}
          {dreamType && dreamType !== 'none' && (
            <div>
              <label className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4" />
                Dream Journal (optional)
              </label>
              <Textarea
                placeholder={
                  dreamType === 'good' 
                    ? "Describe your good dream. Good dreams are from Allah and can be shared..."
                    : dreamType === 'bad'
                    ? "You don't need to describe bad dreams. Seek refuge in Allah and spit lightly to your left 3 times."
                    : "Describe what you remember from your dream..."
                }
                value={dreamNotes}
                onChange={(e) => setDreamNotes(e.target.value)}
                className="bg-secondary/30 border-border resize-none"
                rows={4}
              />
              
              {dreamType === 'good' && (
                <p className="text-xs text-gold/70 mt-2">
                  💡 The Prophet ﷺ said: "A good dream is from Allah, so if anyone sees something which pleases him, he should only share it with one whom he loves." (Bukhari)
                </p>
              )}
              
              {dreamType === 'bad' && (
                <p className="text-xs text-gold/70 mt-2">
                  💡 The Prophet ﷺ said: "If anyone sees a bad dream, let him seek refuge with Allah from its evil, and let him spit lightly to his left three times, and not tell anyone about it." (Bukhari & Muslim)
                </p>
              )}
            </div>
          )}

          {/* Save Button */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              className="flex-1 bg-gold text-midnight hover:bg-gold/90"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Entry
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
