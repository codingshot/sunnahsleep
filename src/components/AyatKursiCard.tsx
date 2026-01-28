import { ayatKursi } from '@/data/checklistData';
import { useState } from 'react';
import { ChevronDown, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AyatKursiCard() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-2xl bg-gradient-card border border-gold/20 overflow-hidden glow-gold">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center justify-between text-left hover:bg-midnight-light transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gold/10">
            <Shield className="h-5 w-5 text-gold" />
          </div>
          <div>
            <h3 className="font-arabic text-xl text-gradient-gold">آية الكرسي</h3>
            <p className="text-sm text-cream-dim">Ayat al-Kursi - The Throne Verse</p>
          </div>
        </div>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-gold transition-transform duration-300',
            isExpanded && 'rotate-180'
          )}
        />
      </button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-500',
          isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-5 pb-5 space-y-4">
          {/* Arabic text */}
          <div className="p-6 rounded-xl bg-secondary/50 border border-gold/10">
            <p className="font-arabic text-2xl text-gold leading-[2.5] text-right" dir="rtl">
              {ayatKursi.arabic}
            </p>
          </div>

          {/* Transliteration */}
          <div>
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Transliteration</p>
            <p className="text-cream-dim italic leading-relaxed">{ayatKursi.transliteration}</p>
          </div>

          {/* Translation */}
          <div>
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Translation</p>
            <p className="text-foreground leading-relaxed">{ayatKursi.translation}</p>
          </div>

          {/* Reference */}
          <p className="text-xs text-muted-foreground italic">{ayatKursi.reference}</p>
        </div>
      </div>
    </div>
  );
}
