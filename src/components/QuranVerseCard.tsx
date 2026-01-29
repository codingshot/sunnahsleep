import { useState } from 'react';
import { ChevronDown, Volume2, VolumeX, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudio } from '@/hooks/useAudio';
import { Button } from '@/components/ui/button';

interface QuranVerse {
  ayah: number;
  arabic: string;
  translation: string;
  audioUrl?: string;
}

interface QuranVerseCardProps {
  title: string;
  titleArabic: string;
  reference: string;
  verses: QuranVerse[];
  surah: number;
  icon?: React.ReactNode;
}

export function QuranVerseCard({ 
  title, 
  titleArabic, 
  reference, 
  verses,
  surah,
  icon 
}: QuranVerseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isPlaying, currentAudioId, playAudio, stopAudio } = useAudio();

  const handlePlayAll = () => {
    // Play first verse
    if (verses[0]?.audioUrl) {
      playAudio(verses[0].audioUrl, `verse-${verses[0].ayah}`);
    }
  };

  const getQuranComUrl = (): string => {
    const firstAyah = verses[0]?.ayah || 1;
    return `https://quran.com/${surah}/${firstAyah}`;
  };

  return (
    <div className="rounded-2xl bg-gradient-card border border-gold/20 overflow-hidden glow-gold">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center justify-between text-left hover:bg-midnight-light transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2 rounded-lg bg-gold/10">
              {icon}
            </div>
          )}
          <div>
            <h3 className="font-arabic text-xl text-gradient-gold">{titleArabic}</h3>
            <p className="text-sm text-cream-dim">{title}</p>
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
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-5 pb-5 space-y-4">
          {/* Audio controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePlayAll}
              className="border-gold/30 text-gold hover:bg-gold/10"
            >
              {isPlaying ? (
                <>
                  <VolumeX className="h-4 w-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4 mr-2" />
                  Play Recitation
                </>
              )}
            </Button>
            
            <a
              href={getQuranComUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-gold/70 hover:text-gold transition-colors ml-auto"
            >
              View on Quran.com
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Verses */}
          {verses.map((verse, index) => (
            <div key={verse.ayah} className="space-y-3">
              {verses.length > 1 && (
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Verse {verse.ayah}
                </p>
              )}
              
              {/* Arabic text */}
              <div className="p-4 rounded-xl bg-secondary/50 border border-gold/10 relative">
                <p className="font-arabic text-xl text-gold leading-[2.5] text-right" dir="rtl">
                  {verse.arabic}
                </p>
                
                {verse.audioUrl && (
                  <button
                    onClick={() => playAudio(verse.audioUrl!, `verse-${verse.ayah}`)}
                    className="absolute top-2 left-2 p-2 rounded-lg bg-gold/10 hover:bg-gold/20 transition-colors"
                  >
                    {currentAudioId === `verse-${verse.ayah}` && isPlaying ? (
                      <VolumeX className="h-4 w-4 text-gold" />
                    ) : (
                      <Volume2 className="h-4 w-4 text-gold" />
                    )}
                  </button>
                )}
              </div>
              
              {/* Translation */}
              <p className="text-foreground leading-relaxed text-sm">
                {verse.translation}
              </p>
              
              {index < verses.length - 1 && (
                <div className="border-t border-gold/10 pt-4 mt-4" />
              )}
            </div>
          ))}

          {/* Reference */}
          <p className="text-xs text-muted-foreground italic">{reference}</p>
        </div>
      </div>
    </div>
  );
}
