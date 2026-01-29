import { DuaItem } from '@/types/checklist';
import { ChevronDown, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { HadithTooltip } from '@/components/HadithTooltip';
import { useAudio } from '@/hooks/useAudio';
import { Button } from '@/components/ui/button';

interface DuaCardProps {
  dua: DuaItem;
}

export function DuaCard({ dua }: DuaCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isPlaying, currentAudioId, playAudio } = useAudio();

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
          isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-5 pb-5 space-y-4">
          {/* Audio button if available */}
          {dua.audioUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => playAudio(dua.audioUrl!, `dua-${dua.id}`)}
              className="border-gold/30 text-gold hover:bg-gold/10"
            >
              {currentAudioId === `dua-${dua.id}` && isPlaying ? (
                <>
                  <VolumeX className="h-4 w-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4 mr-2" />
                  Play Audio
                </>
              )}
            </Button>
          )}

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

          {/* Source with tooltip */}
          {dua.source && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Source:</span>
              <HadithTooltip 
                source={dua.source} 
                hadithReference={dua.hadithReference}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
