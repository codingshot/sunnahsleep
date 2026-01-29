import { HadithReference } from '@/types/checklist';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { ExternalLink, BookOpen } from 'lucide-react';

interface HadithTooltipProps {
  source: string;
  hadithReference?: HadithReference;
  children?: React.ReactNode;
}

export function HadithTooltip({ source, hadithReference, children }: HadithTooltipProps) {
  const getSunnahUrl = (ref: HadithReference): string => {
    const collectionMap: Record<string, string> = {
      'bukhari': 'bukhari',
      'muslim': 'muslim',
      'abudawud': 'abudawud',
      'tirmidhi': 'tirmidhi',
      'nasai': 'nasai',
      'ibnmajah': 'ibnmajah',
    };
    
    const collection = collectionMap[ref.collection.toLowerCase()] || 'bukhari';
    if (ref.hadithNumber) {
      return `https://sunnah.com/${collection}:${ref.hadithNumber}`;
    }
    return `https://sunnah.com/${collection}`;
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="inline-flex items-center gap-1 text-xs text-gold/70 hover:text-gold transition-colors cursor-pointer underline decoration-dotted underline-offset-2">
          <BookOpen className="h-3 w-3" />
          {children || source}
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-midnight border-gold/20" align="start">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-gold" />
            <h4 className="text-sm font-semibold text-gold">Hadith Source</h4>
          </div>
          
          <div className="space-y-2 text-sm">
            <p className="text-cream-dim">
              <span className="text-muted-foreground">Collection:</span>{' '}
              {hadithReference?.collection || source}
            </p>
            
            {hadithReference?.hadithNumber && (
              <p className="text-cream-dim">
                <span className="text-muted-foreground">Hadith #:</span>{' '}
                {hadithReference.hadithNumber}
              </p>
            )}
            
            {hadithReference?.narrator && (
              <p className="text-cream-dim">
                <span className="text-muted-foreground">Narrator:</span>{' '}
                {hadithReference.narrator}
              </p>
            )}
            
            {hadithReference?.arabicText && (
              <div className="p-2 rounded bg-secondary/50 border border-gold/10">
                <p className="font-arabic text-gold text-right text-sm leading-relaxed" dir="rtl">
                  {hadithReference.arabicText}
                </p>
              </div>
            )}
            
            {hadithReference?.englishText && (
              <p className="text-cream-dim italic text-xs leading-relaxed">
                "{hadithReference.englishText}"
              </p>
            )}
          </div>
          
          {hadithReference && (
            <a
              href={getSunnahUrl(hadithReference)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-gold hover:text-gold/80 transition-colors"
            >
              View on Sunnah.com
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
