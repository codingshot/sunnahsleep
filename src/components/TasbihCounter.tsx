import { TasbihCount } from '@/types/checklist';
import { cn } from '@/lib/utils';
import { RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TasbihCounterProps {
  tasbih: TasbihCount;
  onIncrement: (type: keyof TasbihCount) => void;
  onReset: () => void;
}

const tasbihItems: { key: keyof TasbihCount; arabic: string; label: string; target: number }[] = [
  { key: 'subhanAllah', arabic: 'سُبْحَانَ اللَّهِ', label: 'SubhanAllah', target: 33 },
  { key: 'alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', label: 'Alhamdulillah', target: 33 },
  { key: 'allahuAkbar', arabic: 'اللَّهُ أَكْبَرُ', label: 'Allahu Akbar', target: 34 },
];

export function TasbihCounter({ tasbih, onIncrement, onReset }: TasbihCounterProps) {
  const totalCount = tasbih.subhanAllah + tasbih.alhamdulillah + tasbih.allahuAkbar;
  const totalTarget = 33 + 33 + 34;
  const isComplete = totalCount >= totalTarget;

  return (
    <div className="p-6 rounded-2xl bg-gradient-card border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-arabic text-gradient-gold">Bedtime Tasbih</h2>
          <p className="text-sm text-cream-dim">33-33-34 Dhikr before sleep</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          className="text-muted-foreground hover:text-gold"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid gap-4">
        {tasbihItems.map(({ key, arabic, label, target }) => {
          const count = tasbih[key];
          const progress = (count / target) * 100;
          const isDone = count >= target;

          return (
            <button
              key={key}
              onClick={() => !isDone && onIncrement(key)}
              disabled={isDone}
              className={cn(
                'relative p-4 rounded-xl border transition-all duration-300',
                'flex items-center justify-between overflow-hidden',
                isDone
                  ? 'bg-gold/10 border-gold/40'
                  : 'bg-secondary/30 border-border hover:border-gold/30 active:scale-[0.98]'
              )}
            >
              {/* Progress bar background */}
              <div
                className="absolute inset-0 bg-gold/10 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />

              <div className="relative flex items-center gap-4">
                <span className="font-arabic text-2xl text-gold">{arabic}</span>
                <span className="text-cream-dim text-sm">{label}</span>
              </div>

              <div className="relative flex items-center gap-2">
                <span
                  className={cn(
                    'text-2xl font-bold tabular-nums',
                    isDone ? 'text-gold' : 'text-foreground'
                  )}
                >
                  {count}
                </span>
                <span className="text-muted-foreground">/ {target}</span>
                {isDone && <Check className="h-5 w-5 text-gold ml-2" />}
              </div>
            </button>
          );
        })}
      </div>

      {isComplete && (
        <div className="mt-4 p-4 rounded-xl bg-gold/10 border border-gold/30 text-center">
          <p className="text-gold font-semibold">✨ Tasbih Complete! ✨</p>
        </div>
      )}
    </div>
  );
}
