import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, X, Volume2, VolumeX, ChevronUp, ChevronDown, ListMusic, Trash2, Timer, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { registerAudio, unregisterAudio } from '@/lib/audioManager';

export interface SurahTrack {
  id: string;
  name: string;
  nameArabic: string;
  surahNumber: number;
  description: string;
  audioUrl: string;
}

export const SLEEP_SURAHS: SurahTrack[] = [
  {
    id: 'mulk',
    name: 'Surah Al-Mulk',
    nameArabic: 'سورة الملك',
    surahNumber: 67,
    description: 'Protection from punishment of the grave',
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/67.mp3',
  },
  {
    id: 'sajdah',
    name: 'Surah As-Sajdah',
    nameArabic: 'سورة السجدة',
    surahNumber: 32,
    description: 'The Prophet ﷺ would not sleep until he recited it',
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/32.mp3',
  },
  {
    id: 'waqiah',
    name: "Surah Al-Waqi'ah",
    nameArabic: 'سورة الواقعة',
    surahNumber: 56,
    description: 'Protection from poverty',
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/56.mp3',
  },
  {
    id: 'yaseen',
    name: 'Surah Yaseen',
    nameArabic: 'سورة يس',
    surahNumber: 36,
    description: 'The heart of the Quran',
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/36.mp3',
  },
  {
    id: 'rahman',
    name: 'Surah Ar-Rahman',
    nameArabic: 'سورة الرحمن',
    surahNumber: 55,
    description: 'The Most Merciful',
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/55.mp3',
  },
  {
    id: 'kahf',
    name: 'Surah Al-Kahf',
    nameArabic: 'سورة الكهف',
    surahNumber: 18,
    description: 'Light between two Fridays',
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/18.mp3',
  },
];

const SLEEP_TIMER_OPTIONS = [
  { label: 'Off', value: 0 },
  { label: '15m', value: 15 },
  { label: '30m', value: 30 },
  { label: '60m', value: 60 },
  { label: '90m', value: 90 },
];

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5];

type TransitionState = {
  active: boolean;
  fromTrack: SurahTrack | null;
  toTrack: SurahTrack | null;
  countdown: number;
};

export interface PlayerCommand {
  type: 'play' | 'queue';
  trackIndex: number;
  looping?: boolean;
}

interface QuranSleepPlayerProps {
  isVisible: boolean;
  onClose: () => void;
  command?: PlayerCommand | null;
  onCommandHandled?: () => void;
}

export function QuranSleepPlayer({ isVisible, onClose, command, onCommandHandled }: QuranSleepPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(80);
  const [showQueue, setShowQueue] = useState(false);
  const [queue, setQueue] = useState<number[]>([]);
  const [transition, setTransition] = useState<TransitionState>({ active: false, fromTrack: null, toTrack: null, countdown: 5 });
  const [sleepTimer, setSleepTimer] = useState(0); // minutes, 0 = off
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState(0); // seconds remaining
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sleepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentTrack = SLEEP_SURAHS[currentTrackIndex];

  // Sleep timer logic
  useEffect(() => {
    if (sleepTimerRef.current) {
      clearInterval(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }
    if (sleepTimer > 0 && isPlaying) {
      setSleepTimerRemaining(sleepTimer * 60);
      sleepTimerRef.current = setInterval(() => {
        setSleepTimerRemaining(prev => {
          if (prev <= 1) {
            // Time's up - stop playback
            if (audioRef.current) {
              audioRef.current.pause();
            }
            setIsPlaying(false);
            setSleepTimer(0);
            if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
            sleepTimerRef.current = null;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (sleepTimerRef.current) {
        clearInterval(sleepTimerRef.current);
        sleepTimerRef.current = null;
      }
    };
  }, [sleepTimer, isPlaying]);

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
    setIsLoading(true);

    const track = SLEEP_SURAHS[index];
    const audio = new Audio(track.audioUrl);
    audio.volume = volume / 100;
    audio.playbackRate = playbackSpeed;
    audioRef.current = audio;

    registerAudio(audio, () => {
      setIsPlaying(false);
      clearProgressInterval();
    });

    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    audio.onended = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play();
        return;
      }
      let nextIdx: number;
      if (queue.length > 0) {
        nextIdx = queue[0];
        setQueue(prev => prev.slice(1));
      } else {
        nextIdx = (index + 1) % SLEEP_SURAHS.length;
      }
      const fromTrack = SLEEP_SURAHS[index];
      const toTrack = SLEEP_SURAHS[nextIdx];
      setIsPlaying(false);
      clearProgressInterval();
      setTransition({ active: true, fromTrack, toTrack, countdown: 5 });
      setCurrentTrackIndex(nextIdx);
      setProgress(0);

      if (transitionTimerRef.current) clearInterval(transitionTimerRef.current);
      let count = 5;
      transitionTimerRef.current = setInterval(() => {
        count--;
        setTransition(prev => ({ ...prev, countdown: count }));
        if (count <= 0) {
          if (transitionTimerRef.current) clearInterval(transitionTimerRef.current);
          transitionTimerRef.current = null;
          setTransition({ active: false, fromTrack: null, toTrack: null, countdown: 5 });
          loadAndPlay(nextIdx);
        }
      }, 1000);
    };
    audio.onerror = () => {
      console.error('Error loading surah audio');
      setIsPlaying(false);
      setIsLoading(false);
    };

    audio.play().then(() => {
      setIsPlaying(true);
      startProgressTracking();
    }).catch(() => {
      setIsPlaying(false);
      setIsLoading(false);
    });
  }, [volume, isLooping, queue, playbackSpeed, clearProgressInterval, startProgressTracking]);

  // Handle external commands
  useEffect(() => {
    if (!command || !isVisible) return;
    if (command.type === 'play') {
      setCurrentTrackIndex(command.trackIndex);
      setProgress(0);
      if (command.looping !== undefined) setIsLooping(command.looping);
      loadAndPlay(command.trackIndex);
    } else if (command.type === 'queue') {
      setQueue(prev => [...prev, command.trackIndex]);
      if (!isPlaying && !audioRef.current) {
        setCurrentTrackIndex(command.trackIndex);
        if (command.looping !== undefined) setIsLooping(command.looping);
        loadAndPlay(command.trackIndex);
        setQueue(prev => prev.slice(0, -1));
      }
    }
    onCommandHandled?.();
  }, [command, isVisible]);

  // Sync playback speed to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

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
    if (queue.length > 0) {
      const nextInQueue = queue[0];
      setQueue(prev => prev.slice(1));
      setCurrentTrackIndex(nextInQueue);
      setProgress(0);
      if (isPlaying) loadAndPlay(nextInQueue);
    } else {
      const nextIndex = (currentTrackIndex + 1) % SLEEP_SURAHS.length;
      setCurrentTrackIndex(nextIndex);
      setProgress(0);
      if (isPlaying) loadAndPlay(nextIndex);
    }
  }, [currentTrackIndex, isPlaying, queue, loadAndPlay]);

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
    if (audioRef.current) audioRef.current.volume = value[0] / 100;
  }, []);

  const removeFromQueue = useCallback((queueIndex: number) => {
    setQueue(prev => prev.filter((_, i) => i !== queueIndex));
  }, []);

  const moveInQueue = useCallback((from: number, to: number) => {
    setQueue(prev => {
      const newQueue = [...prev];
      const [removed] = newQueue.splice(from, 1);
      newQueue.splice(to, 0, removed);
      return newQueue;
    });
  }, []);

  const skipTransition = useCallback(() => {
    if (transitionTimerRef.current) {
      clearInterval(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    setTransition({ active: false, fromTrack: null, toTrack: null, countdown: 5 });
    loadAndPlay(currentTrackIndex);
  }, [currentTrackIndex, loadAndPlay]);

  const pauseTransition = useCallback(() => {
    if (transitionTimerRef.current) {
      clearInterval(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
  }, []);

  const resumeTransition = useCallback(() => {
    if (!transition.active || transition.countdown <= 0) return;
    let count = transition.countdown;
    transitionTimerRef.current = setInterval(() => {
      count--;
      setTransition(prev => ({ ...prev, countdown: count }));
      if (count <= 0) {
        if (transitionTimerRef.current) clearInterval(transitionTimerRef.current);
        transitionTimerRef.current = null;
        setTransition({ active: false, fromTrack: null, toTrack: null, countdown: 5 });
        loadAndPlay(currentTrackIndex);
      }
    }, 1000);
  }, [transition.active, transition.countdown, currentTrackIndex, loadAndPlay]);

  const handleClose = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      unregisterAudio(audioRef.current);
      audioRef.current = null;
    }
    if (transitionTimerRef.current) {
      clearInterval(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    if (sleepTimerRef.current) {
      clearInterval(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }
    clearProgressInterval();
    setIsPlaying(false);
    setProgress(0);
    setQueue([]);
    setSleepTimer(0);
    setSleepTimerRemaining(0);
    setTransition({ active: false, fromTrack: null, toTrack: null, countdown: 5 });
    onClose();
  }, [clearProgressInterval, onClose]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        unregisterAudio(audioRef.current);
        audioRef.current = null;
      }
      if (transitionTimerRef.current) {
        clearInterval(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
      if (sleepTimerRef.current) {
        clearInterval(sleepTimerRef.current);
        sleepTimerRef.current = null;
      }
      clearProgressInterval();
    };
  }, [clearProgressInterval]);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatTimerRemaining = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-full duration-300">
      <div className="max-w-lg mx-auto">
        <div className={cn(
          "bg-gradient-to-t from-[hsl(var(--midnight))] to-[hsl(var(--midnight-light))] border-t border-gold/30 backdrop-blur-xl shadow-2xl transition-all duration-300",
          isExpanded ? "rounded-t-2xl" : ""
        )}>
          {/* Expanded view */}
          {isExpanded && (
            <div className="px-4 pt-2 pb-2">
              {/* Minimize handle */}
              <button
                onClick={() => setIsExpanded(false)}
                className="w-full flex flex-col items-center gap-1 pb-2 mb-2 border-b border-gold/10 group"
              >
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30 group-hover:bg-gold/50 transition-colors" />
                <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">Tap to minimize</span>
              </button>

              {/* Tab toggles */}
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setShowQueue(false)}
                  className={cn(
                    "text-xs px-3 py-1 rounded-full transition-colors",
                    !showQueue ? "bg-gold/20 text-gold" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Playlist
                </button>
                <button
                  onClick={() => setShowQueue(true)}
                  className={cn(
                    "text-xs px-3 py-1 rounded-full transition-colors flex items-center gap-1",
                    showQueue ? "bg-gold/20 text-gold" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <ListMusic className="h-3 w-3" />
                  Queue {queue.length > 0 && `(${queue.length})`}
                </button>
              </div>

              {!showQueue ? (
                <div className="max-h-60 overflow-y-auto space-y-1 scrollbar-thin">
                  {SLEEP_SURAHS.map((track, index) => (
                    <button
                      key={track.id}
                      onClick={() => {
                        setCurrentTrackIndex(index);
                        setProgress(0);
                        loadAndPlay(index);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all",
                        index === currentTrackIndex
                          ? "bg-gold/15 border border-gold/20 shadow-sm shadow-gold/5"
                          : "hover:bg-secondary/50"
                      )}
                    >
                      <span className={cn(
                        "w-7 h-7 rounded-full text-xs flex items-center justify-center flex-shrink-0 transition-all",
                        index === currentTrackIndex && isPlaying
                          ? "bg-gold text-[hsl(var(--midnight))] animate-pulse"
                          : "bg-gold/10 text-gold"
                      )}>
                        {index === currentTrackIndex && isPlaying ? '♪' : track.surahNumber}
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
              ) : (
                <div className="max-h-60 overflow-y-auto space-y-1">
                  <div className="p-2.5 rounded-xl bg-gold/10 border border-gold/20 mb-2">
                    <p className="text-[10px] text-gold uppercase tracking-wider mb-1">Now Playing</p>
                    <p className="text-sm text-foreground">{currentTrack.name}</p>
                  </div>
                  {queue.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      Queue is empty. Use the Quran tab to add surahs.
                    </p>
                  ) : (
                    queue.map((trackIndex, queueIdx) => (
                      <div
                        key={`q-${queueIdx}`}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/50 group"
                      >
                        <span className="text-xs text-muted-foreground w-4">{queueIdx + 1}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-foreground truncate">{SLEEP_SURAHS[trackIndex].name}</p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {queueIdx > 0 && (
                            <button onClick={() => moveInQueue(queueIdx, queueIdx - 1)} className="p-1 rounded text-muted-foreground hover:text-foreground" aria-label="Move up">
                              <ChevronUp className="h-3 w-3" />
                            </button>
                          )}
                          {queueIdx < queue.length - 1 && (
                            <button onClick={() => moveInQueue(queueIdx, queueIdx + 1)} className="p-1 rounded text-muted-foreground hover:text-foreground" aria-label="Move down">
                              <ChevronDown className="h-3 w-3" />
                            </button>
                          )}
                          <button onClick={() => removeFromQueue(queueIdx)} className="p-1 rounded text-muted-foreground hover:text-destructive" aria-label="Remove from queue">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Controls row: Volume + Speed + Sleep Timer */}
              <div className="mt-3 pt-3 border-t border-gold/10 space-y-3">
                {/* Volume */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVolumeChange([volume === 0 ? 80 : 0])}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {volume === 0 ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                  </button>
                  <Slider value={[volume]} max={100} step={1} onValueChange={handleVolumeChange} className="flex-1" />
                  <span className="text-[10px] text-muted-foreground w-8 text-right tabular-nums">{volume}%</span>
                </div>

                {/* Speed + Sleep Timer row */}
                <div className="flex items-center gap-3">
                  {/* Playback speed */}
                  <div className="flex items-center gap-1.5">
                    <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
                    <div className="flex gap-1">
                      {SPEED_OPTIONS.map(speed => (
                        <button
                          key={speed}
                          onClick={() => setPlaybackSpeed(speed)}
                          className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full transition-colors tabular-nums",
                            playbackSpeed === speed
                              ? "bg-gold/20 text-gold font-medium"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="w-px h-4 bg-gold/10" />

                  {/* Sleep timer */}
                  <div className="flex items-center gap-1.5">
                    <Timer className={cn("h-3.5 w-3.5", sleepTimer > 0 ? "text-gold" : "text-muted-foreground")} />
                    <div className="flex gap-1">
                      {SLEEP_TIMER_OPTIONS.map(option => (
                        <button
                          key={option.value}
                          onClick={() => setSleepTimer(option.value)}
                          className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full transition-colors",
                            sleepTimer === option.value
                              ? "bg-gold/20 text-gold font-medium"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sleep timer remaining display */}
                {sleepTimer > 0 && sleepTimerRemaining > 0 && (
                  <div className="flex items-center justify-center gap-2">
                    <Timer className="h-3 w-3 text-gold" />
                    <span className="text-xs text-gold tabular-nums">
                      Sleep in {formatTimerRemaining(sleepTimerRemaining)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Transition overlay between surahs */}
          {transition.active && (
            <div className="px-4 py-4 border-b border-gold/10">
              <div className="text-center space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Up Next</p>
                <p className="text-sm font-medium text-gold">{transition.toTrack?.name}</p>
                <p className="font-arabic text-base text-gold/70">{transition.toTrack?.nameArabic}</p>
                <p className="text-xs text-muted-foreground">{transition.toTrack?.description}</p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={pauseTransition}
                    className="text-xs px-3 py-1.5 rounded-full border border-gold/20 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Pause className="h-3 w-3 inline mr-1" />
                    Pause
                  </button>
                  <span className="text-lg font-medium text-gold tabular-nums">{transition.countdown}s</span>
                  <button
                    onClick={skipTransition}
                    className="text-xs px-3 py-1.5 rounded-full bg-gold/10 text-gold hover:bg-gold/20 transition-colors"
                  >
                    <Play className="h-3 w-3 inline mr-1" />
                    Play Now
                  </button>
                </div>
                {!transitionTimerRef.current && transition.countdown > 0 && (
                  <button
                    onClick={resumeTransition}
                    className="text-xs text-gold/60 hover:text-gold transition-colors"
                  >
                    Resume countdown
                  </button>
                )}
              </div>
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
              <span className="text-[10px] text-muted-foreground tabular-nums">{formatTime(progress)}</span>
              <div className="flex items-center gap-2">
                {sleepTimer > 0 && sleepTimerRemaining > 0 && !isExpanded && (
                  <span className="text-[10px] text-gold tabular-nums flex items-center gap-0.5">
                    <Timer className="h-2.5 w-2.5" />
                    {formatTimerRemaining(sleepTimerRemaining)}
                  </span>
                )}
                {playbackSpeed !== 1 && !isExpanded && (
                  <span className="text-[10px] text-gold tabular-nums">{playbackSpeed}x</span>
                )}
                <span className="text-[10px] text-muted-foreground tabular-nums">{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* Player controls */}
          <div className="px-4 pb-4 flex items-center gap-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-1 min-w-0 text-left flex items-center gap-2"
            >
              <span className={cn(
                "w-9 h-9 rounded-xl text-xs font-semibold flex items-center justify-center flex-shrink-0 transition-all",
                isPlaying
                  ? "bg-gradient-to-br from-gold/20 to-gold/5 text-gold border border-gold/20 shadow-sm shadow-gold/10"
                  : "bg-gold/10 text-gold"
              )}>
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                ) : (
                  currentTrack.surahNumber
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{currentTrack.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentTrack.nameArabic} • Ch. {currentTrack.surahNumber}
                  {queue.length > 0 && ` • ${queue.length} in queue`}
                </p>
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
                className={cn(
                  "p-2.5 rounded-full transition-all",
                  isPlaying
                    ? "bg-gold text-[hsl(var(--midnight))] hover:bg-gold/90 shadow-md shadow-gold/20"
                    : "bg-gold text-[hsl(var(--midnight))] hover:bg-gold/90"
                )}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-[hsl(var(--midnight))]/30 border-t-[hsl(var(--midnight))] rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 ml-0.5" />
                )}
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
