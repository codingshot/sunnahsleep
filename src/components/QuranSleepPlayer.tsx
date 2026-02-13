import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, X, Volume2, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { registerAudio, unregisterAudio } from '@/lib/audioManager';

interface SurahTrack {
  id: string;
  name: string;
  nameArabic: string;
  surahNumber: number;
  description: string;
  audioUrl: string;
}

const SLEEP_SURAHS: SurahTrack[] = [
  {
    id: 'mulk',
    name: 'Surah Al-Mulk',
    nameArabic: 'سورة الملك',
    surahNumber: 67,
    description: 'Protection from punishment of the grave',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5538.mp3',
  },
  {
    id: 'sajdah',
    name: 'Surah As-Sajdah',
    nameArabic: 'سورة السجدة',
    surahNumber: 32,
    description: 'The Prophet ﷺ would not sleep until he recited it',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/3385.mp3',
  },
  {
    id: 'waqiah',
    name: "Surah Al-Waqi'ah",
    nameArabic: 'سورة الواقعة',
    surahNumber: 56,
    description: 'Protection from poverty',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5010.mp3',
  },
  {
    id: 'yaseen',
    name: 'Surah Yaseen',
    nameArabic: 'سورة يس',
    surahNumber: 36,
    description: 'The heart of the Quran',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/3705.mp3',
  },
  {
    id: 'rahman',
    name: 'Surah Ar-Rahman',
    nameArabic: 'سورة الرحمن',
    surahNumber: 55,
    description: 'The Most Merciful',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4932.mp3',
  },
  {
    id: 'kahf',
    name: 'Surah Al-Kahf',
    nameArabic: 'سورة الكهف',
    surahNumber: 18,
    description: 'Light between two Fridays',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2087.mp3',
  },
];

interface QuranSleepPlayerProps {
  isVisible: boolean;
  onClose: () => void;
}

export function QuranSleepPlayer({ isVisible, onClose }: QuranSleepPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentTrack = SLEEP_SURAHS[currentTrackIndex];

  const clearProgressInterval = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const startProgressTracking = useCallback(() => {
    clearProgressInterval();
    progressIntervalRef.current = setInterval(() => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime);
        setDuration(audioRef.current.duration || 0);
      }
    }, 500);
  }, [clearProgressInterval]);

  const loadAndPlay = useCallback((index: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
      unregisterAudio(audioRef.current);
    }
    clearProgressInterval();

    const track = SLEEP_SURAHS[index];
    const audio = new Audio(track.audioUrl);
    audio.volume = volume / 100;
    audioRef.current = audio;

    // Register with global audio manager (stops other audio)
    registerAudio(audio, () => {
      setIsPlaying(false);
      clearProgressInterval();
    });

    audio.onloadedmetadata = () => setDuration(audio.duration);
    audio.onended = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play();
      } else {
        const nextIndex = (index + 1) % SLEEP_SURAHS.length;
        setCurrentTrackIndex(nextIndex);
        loadAndPlay(nextIndex);
      }
    };
    audio.onerror = () => {
      console.error('Error loading surah audio');
      setIsPlaying(false);
    };

    audio.play().then(() => {
      setIsPlaying(true);
      startProgressTracking();
    }).catch(() => setIsPlaying(false));
  }, [volume, isLooping, clearProgressInterval, startProgressTracking]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) {
      loadAndPlay(currentTrackIndex);
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      clearProgressInterval();
      setIsPlaying(false);
    } else {
      // Re-register since we're resuming
      registerAudio(audioRef.current, () => {
        setIsPlaying(false);
        clearProgressInterval();
      });
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        startProgressTracking();
      });
    }
  }, [isPlaying, currentTrackIndex, loadAndPlay, clearProgressInterval, startProgressTracking]);

  const nextTrack = useCallback(() => {
    const nextIndex = (currentTrackIndex + 1) % SLEEP_SURAHS.length;
    setCurrentTrackIndex(nextIndex);
    setProgress(0);
    if (isPlaying) loadAndPlay(nextIndex);
  }, [currentTrackIndex, isPlaying, loadAndPlay]);

  const prevTrack = useCallback(() => {
    const prevIndex = (currentTrackIndex - 1 + SLEEP_SURAHS.length) % SLEEP_SURAHS.length;
    setCurrentTrackIndex(prevIndex);
    setProgress(0);
    if (isPlaying) loadAndPlay(prevIndex);
  }, [currentTrackIndex, isPlaying, loadAndPlay]);

  const handleSeek = useCallback((value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setProgress(value[0]);
    }
  }, []);

  const handleVolumeChange = useCallback((value: number[]) => {
    setVolume(value[0]);
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
    }
  }, []);

  const handleClose = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      unregisterAudio(audioRef.current);
      audioRef.current = null;
    }
    clearProgressInterval();
    setIsPlaying(false);
    setProgress(0);
    onClose();
  }, [clearProgressInterval, onClose]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        unregisterAudio(audioRef.current);
        audioRef.current = null;
      }
      clearProgressInterval();
    };
  }, [clearProgressInterval]);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  // Mini-player mode (sticky bottom)
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-full duration-300">
      <div className="max-w-lg mx-auto">
        <div className={cn(
          "bg-gradient-to-t from-[hsl(var(--midnight))] to-[hsl(var(--midnight-light))] border-t border-gold/30 backdrop-blur-xl shadow-2xl transition-all duration-300",
          isExpanded ? "rounded-t-2xl" : ""
        )}>
          {/* Expanded track list */}
          {isExpanded && (
            <div className="px-4 pt-4 pb-2 max-h-60 overflow-y-auto space-y-1">
              <h4 className="text-xs text-gold uppercase tracking-wider font-semibold mb-2">
                Sleep Surahs Playlist
              </h4>
              {SLEEP_SURAHS.map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(index);
                    setProgress(0);
                    loadAndPlay(index);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors",
                    index === currentTrackIndex
                      ? "bg-gold/15 border border-gold/20"
                      : "hover:bg-secondary/50"
                  )}
                >
                  <span className="w-6 h-6 rounded-full bg-gold/10 text-gold text-xs flex items-center justify-center flex-shrink-0">
                    {index === currentTrackIndex && isPlaying ? '♪' : index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={cn(
                      "text-sm truncate",
                      index === currentTrackIndex ? "text-gold font-medium" : "text-foreground"
                    )}>
                      {track.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{track.description}</p>
                  </div>
                  <span className="font-arabic text-sm text-gold/60 flex-shrink-0">{track.nameArabic}</span>
                </button>
              ))}
            </div>
          )}

          {/* Progress bar */}
          <div className="px-4 pt-3">
            <Slider
              value={[progress]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="h-1"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-muted-foreground">{formatTime(progress)}</span>
              <span className="text-[10px] text-muted-foreground">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Player controls */}
          <div className="px-4 pb-4 flex items-center gap-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-1 min-w-0 text-left flex items-center gap-2"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{currentTrack.name}</p>
                <p className="text-xs text-muted-foreground truncate">{currentTrack.nameArabic} • {currentTrack.description}</p>
              </div>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
            </button>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => setIsLooping(!isLooping)}
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  isLooping ? "text-gold bg-gold/10" : "text-muted-foreground hover:text-foreground"
                )}
                aria-label={isLooping ? "Disable loop" : "Enable loop"}
              >
                <Repeat className="h-3.5 w-3.5" />
              </button>
              <button onClick={prevTrack} className="p-1.5 rounded-lg text-foreground hover:bg-secondary/50 transition-colors" aria-label="Previous surah">
                <SkipBack className="h-4 w-4" />
              </button>
              <button
                onClick={togglePlay}
                className="p-2.5 rounded-full bg-gold text-[hsl(var(--midnight))] hover:bg-gold/90 transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </button>
              <button onClick={nextTrack} className="p-1.5 rounded-lg text-foreground hover:bg-secondary/50 transition-colors" aria-label="Next surah">
                <SkipForward className="h-4 w-4" />
              </button>
              <button onClick={handleClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive transition-colors" aria-label="Close player">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
