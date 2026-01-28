import { useEffect, useState } from 'react';
import { Star, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompletionCelebrationProps {
  isComplete: boolean;
}

export function CompletionCelebration({ isComplete }: CompletionCelebrationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isComplete) {
      setShow(true);
    }
  }, [isComplete]);

  if (!show || !isComplete) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {/* Stars animation */}
      {[...Array(12)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            'absolute text-gold animate-ping',
            'opacity-0'
          )}
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: '2s',
          }}
          size={16 + Math.random() * 16}
        />
      ))}

      {/* Central celebration */}
      <div className="bg-midnight-light/95 backdrop-blur-lg border border-gold/40 rounded-3xl p-8 text-center glow-gold-strong animate-in zoom-in-50 duration-500 pointer-events-auto">
        <div className="flex justify-center mb-4">
          <Moon className="h-16 w-16 text-gold animate-pulse" />
        </div>
        <h2 className="font-arabic text-3xl text-gradient-gold mb-2">ما شاء الله</h2>
        <p className="text-xl text-foreground mb-1">Masha'Allah!</p>
        <p className="text-cream-dim">Your bedtime routine is complete</p>
        <p className="text-sm text-muted-foreground mt-4">
          May Allah grant you peaceful sleep and protection
        </p>
        <button
          onClick={() => setShow(false)}
          className="mt-6 px-6 py-2 rounded-full bg-gold text-midnight font-semibold hover:bg-gold-glow transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
