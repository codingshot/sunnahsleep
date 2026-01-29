import { ChecklistItem } from '@/types/checklist';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, Info } from 'lucide-react';
import { useState } from 'react';
import { HadithTooltip } from '@/components/HadithTooltip';

interface ChecklistCardProps {
  item: ChecklistItem;
  onToggle: (id: string) => void;
}

export function ChecklistCard({ item, onToggle }: ChecklistCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      className={cn(
        'rounded-2xl border transition-all duration-300 overflow-hidden',
        item.completed
          ? 'bg-gold/10 border-gold/40 shadow-[0_0_15px_rgba(212,175,55,0.1)]'
          : 'bg-gradient-card border-border hover:border-gold/30'
      )}
    >
      <button
        onClick={() => onToggle(item.id)}
        className="w-full p-4 flex items-center gap-4 text-left"
      >
        <div
          className={cn(
            'flex-shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-300',
            item.completed
              ? 'bg-gold border-gold'
              : 'border-gold/40 hover:border-gold'
          )}
        >
          {item.completed && <Check className="h-4 w-4 text-midnight" strokeWidth={3} />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={cn(
              'font-medium transition-colors',
              item.completed ? 'text-gold' : 'text-foreground'
            )}>
              {item.title}
            </h3>
            {item.titleArabic && (
              <span className="font-arabic text-gold/60 text-sm">{item.titleArabic}</span>
            )}
          </div>
          <p className="text-sm text-cream-dim mt-0.5">{item.description}</p>
        </div>
      </button>

      {/* Expandable details section */}
      <div className="px-4 pb-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDetails(!showDetails);
          }}
          className="flex items-center gap-1 text-xs text-gold/60 hover:text-gold transition-colors"
        >
          <Info className="h-3 w-3" />
          <span>{showDetails ? 'Hide details' : 'Show details'}</span>
          <ChevronDown className={cn(
            'h-3 w-3 transition-transform',
            showDetails && 'rotate-180'
          )} />
        </button>
      </div>

      <div className={cn(
        'overflow-hidden transition-all duration-300',
        showDetails ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      )}>
        <div className="px-4 pb-4 space-y-3">
          {item.detailedExplanation && (
            <p className="text-sm text-cream-dim leading-relaxed">
              {item.detailedExplanation}
            </p>
          )}
          
          {item.hadithReference?.arabicText && (
            <div className="p-3 rounded-lg bg-secondary/50 border border-gold/10">
              <p className="font-arabic text-gold text-right text-sm leading-relaxed" dir="rtl">
                {item.hadithReference.arabicText}
              </p>
            </div>
          )}

          {item.hadithReference?.englishText && (
            <p className="text-sm text-cream-dim italic">
              "{item.hadithReference.englishText}"
            </p>
          )}

          {item.hadithSource && (
            <div className="flex items-center gap-2">
              <HadithTooltip 
                source={item.hadithSource} 
                hadithReference={item.hadithReference}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
