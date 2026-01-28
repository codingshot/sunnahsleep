import { DuaItem } from '@/types/checklist';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DuaCardProps {
  dua: DuaItem;
}

export function DuaCard({ dua }: DuaCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-2xl bg-gradient-card border border-border overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center justify-between text-left hover:bg-midnight-light transition-colors"
      >
        <h3 className="font-semibold text-foreground">{dua.title}</h3>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-gold transition-transform duration-300',
            isExpanded && 'rotate-180'
          )}
        />
      </button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-5 pb-5 space-y-4">
          {/* Arabic text */}
          <div className="p-4 rounded-xl bg-secondary/50 border border-gold/10">
            <p className="font-arabic text-2xl text-gold leading-loose text-right" dir="rtl">
              {dua.arabic}
            </p>
          </div>

          {/* Transliteration */}
          <div>
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Transliteration</p>
            <p className="text-cream-dim italic">{dua.transliteration}</p>
          </div>

          {/* Translation */}
          <div>
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Translation</p>
            <p className="text-foreground">{dua.translation}</p>
          </div>

          {/* Source */}
          {dua.source && (
            <p className="text-xs text-muted-foreground italic">Source: {dua.source}</p>
          )}
        </div>
      </div>
    </div>
  );
}
