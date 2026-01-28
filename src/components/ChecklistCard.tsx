import { ChecklistItem } from '@/types/checklist';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface ChecklistCardProps {
  item: ChecklistItem;
  onToggle: (id: string) => void;
}

export function ChecklistCard({ item, onToggle }: ChecklistCardProps) {
  return (
    <button
      onClick={() => onToggle(item.id)}
      className={cn(
        'w-full text-left p-5 rounded-2xl border transition-all duration-300',
        'bg-gradient-card hover:bg-midnight-light',
        item.completed
          ? 'border-gold/40 shadow-lg'
          : 'border-border hover:border-gold/20',
        'group'
      )}
    >
      <div className="flex items-start gap-4">
        <Checkbox
          variant="sunnah"
          checked={item.completed}
          onCheckedChange={() => onToggle(item.id)}
          className="mt-0.5"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3
              className={cn(
                'font-semibold text-lg transition-colors',
                item.completed ? 'text-gold' : 'text-foreground'
              )}
            >
              {item.title}
            </h3>
            {item.titleArabic && (
              <span className="font-arabic text-gold/60 text-lg">{item.titleArabic}</span>
            )}
          </div>
          
          <p className="text-cream-dim text-sm leading-relaxed">{item.description}</p>
          
          {item.hadithSource && (
            <p className="text-muted-foreground text-xs mt-2 italic">
              Source: {item.hadithSource}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
