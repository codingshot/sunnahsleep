import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Droplets, CheckCircle2, Volume2, VolumeX, Keyboard } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WuduStep {
  id: number;
  name: string;
  nameArabic: string;
  description: string;
  transliteration: string;
  arabic: string;
  translation?: string;
  duaToRecite?: {
    arabic: string;
    transliteration: string;
    translation: string;
    audioUrl?: string;
  };
  hadithSource?: string;
  keyboardShortcut: string;
}

const wuduSteps: WuduStep[] = [
  {
    id: 1,
    name: 'Intention (Niyyah)',
    nameArabic: 'النية',
    description: 'Make the intention in your heart to perform wudu for the sake of Allah. The intention does not need to be spoken aloud - it is a matter of the heart.',
    transliteration: 'Nawaytu al-wudu',
    arabic: 'نَوَيْتُ الوُضُوءَ',
    keyboardShortcut: '1',
  },
  {
    id: 2,
    name: 'Say Bismillah',
    nameArabic: 'البسملة',
    description: 'Begin by saying "Bismillah" (In the name of Allah). This is a Sunnah that the Prophet ﷺ never left.',
    transliteration: 'Bismillah',
    arabic: 'بِسْمِ اللهِ',
    duaToRecite: {
      arabic: 'بِسْمِ اللهِ',
      transliteration: 'Bismillah',
      translation: 'In the name of Allah',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3',
    },
    keyboardShortcut: '2',
  },
  {
    id: 3,
    name: 'Wash Hands',
    nameArabic: 'غسل اليدين',
    description: 'Wash both hands up to the wrists three times, starting with the right hand. Make sure water reaches between all fingers.',
    transliteration: 'Ghasl al-Yadayn',
    arabic: 'غَسْلُ الْيَدَيْنِ',
    keyboardShortcut: '3',
  },
  {
    id: 4,
    name: 'Rinse Mouth',
    nameArabic: 'المضمضة',
    description: 'Take water into your mouth with the right hand and rinse it thoroughly three times. Swish the water around and then spit it out.',
    transliteration: 'Madmadah',
    arabic: 'الْمَضْمَضَةُ',
    keyboardShortcut: '4',
  },
  {
    id: 5,
    name: 'Clean Nose',
    nameArabic: 'الاستنشاق والاستنثار',
    description: 'Sniff water into the nostrils with the right hand and blow it out with the left hand, three times. This cleans the nasal passages thoroughly.',
    transliteration: 'Istinshaq wa Istinthar',
    arabic: 'الِاسْتِنْشَاقُ وَالِاسْتِنْثَارُ',
    keyboardShortcut: '5',
  },
  {
    id: 6,
    name: 'Wash Face',
    nameArabic: 'غسل الوجه',
    description: 'Wash the entire face three times, from the hairline to the chin and from ear to ear. Ensure water covers all areas including the forehead and beard if you have one.',
    transliteration: 'Ghasl al-Wajh',
    arabic: 'غَسْلُ الْوَجْهِ',
    keyboardShortcut: '6',
  },
  {
    id: 7,
    name: 'Wash Arms',
    nameArabic: 'غسل اليدين إلى المرفقين',
    description: 'Wash the right arm from fingertips to and including the elbow three times, then the left arm. Make sure water covers all areas.',
    transliteration: 'Ghasl al-Yadayn ila al-Mirfaqayn',
    arabic: 'غَسْلُ الْيَدَيْنِ إِلَى الْمِرْفَقَيْنِ',
    keyboardShortcut: '7',
  },
  {
    id: 8,
    name: 'Wipe Head',
    nameArabic: 'مسح الرأس',
    description: 'With wet hands, wipe over the entire head once. Start from the forehead going back to the nape of the neck, then return to the forehead.',
    transliteration: "Mash ar-Ra's",
    arabic: 'مَسْحُ الرَّأْسِ',
    keyboardShortcut: '8',
  },
  {
    id: 9,
    name: 'Wipe Ears',
    nameArabic: 'مسح الأذنين',
    description: 'Wipe the inside of the ears with the index fingers and the outside with the thumbs. Use the remaining wetness from wiping the head.',
    transliteration: 'Mash al-Udhnayn',
    arabic: 'مَسْحُ الْأُذُنَيْنِ',
    keyboardShortcut: '9',
  },
  {
    id: 10,
    name: 'Wash Feet',
    nameArabic: 'غسل الرجلين',
    description: 'Wash the right foot up to and including the ankles three times, then the left foot. Ensure water reaches between all toes.',
    transliteration: 'Ghasl ar-Rijlayn',
    arabic: 'غَسْلُ الرِّجْلَيْنِ',
    keyboardShortcut: '0',
  },
  {
    id: 11,
    name: 'Dua After Wudu',
    nameArabic: 'الدعاء بعد الوضوء',
    description: 'After completing wudu, recite the shahada and the dua for wudu. Raise your index finger towards the sky while reciting.',
    transliteration: 'Ash-hadu an la ilaha ill-Allah wahdahu la sharika lah, wa ash-hadu anna Muhammadan abduhu wa rasuluh. Allahumma-j\'alni min at-tawwabin, wa-j\'alni min al-mutatahhirin.',
    arabic: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ. اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ، وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
    translation: 'I bear witness that there is no god but Allah alone, with no partner, and I bear witness that Muhammad is His slave and Messenger. O Allah, make me among those who repent and make me among those who purify themselves.',
    duaToRecite: {
      arabic: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ. اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ، وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
      transliteration: 'Ash-hadu an la ilaha ill-Allah wahdahu la sharika lah, wa ash-hadu anna Muhammadan abduhu wa rasuluh. Allahumma-j\'alni min at-tawwabin, wa-j\'alni min al-mutatahhirin.',
      translation: 'I bear witness that there is no god but Allah alone, with no partner, and I bear witness that Muhammad is His slave and Messenger. O Allah, make me among those who repent and make me among those who purify themselves.',
    },
    hadithSource: 'Muslim 234, Tirmidhi 55',
    keyboardShortcut: '-',
  },
];

// Step icons as SVG components for accurate visual representation
const StepIcon = ({ stepId, className }: { stepId: number; className?: string }) => {
  const iconClass = cn("w-full h-full", className);
  
  switch(stepId) {
    case 1: // Intention - Heart
      return (
        <svg viewBox="0 0 100 100" className={iconClass}>
          <path d="M50 85 L20 55 Q5 40 20 25 Q35 10 50 30 Q65 10 80 25 Q95 40 80 55 Z" 
                fill="currentColor" opacity="0.8"/>
          <circle cx="50" cy="45" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    case 2: // Bismillah - Lips/Speech
      return (
        <svg viewBox="0 0 100 100" className={iconClass}>
          <ellipse cx="50" cy="50" rx="35" ry="20" fill="currentColor" opacity="0.3"/>
          <path d="M25 50 Q50 35 75 50 Q50 65 25 50" fill="currentColor"/>
          <text x="50" y="80" textAnchor="middle" fontSize="12" fill="currentColor">بسم الله</text>
        </svg>
      );
    case 3: // Wash Hands
      return (
        <svg viewBox="0 0 100 100" className={iconClass}>
          <path d="M30 80 L30 40 Q30 30 40 30 L45 30 L45 20 L50 20 L50 30 L55 30 L55 15 L60 15 L60 30 L65 30 L65 18 L70 18 L70 30 L75 30 L75 22 L80 22 L80 35 Q80 45 70 50 L70 80 Z" 
                fill="currentColor" opacity="0.8"/>
          <path d="M25 60 Q20 55 25 50 M85 55 Q90 50 85 45" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      );
    case 4: // Rinse Mouth
      return (
        <svg viewBox="0 0 100 100" className={iconClass}>
          <circle cx="50" cy="45" r="30" fill="currentColor" opacity="0.3"/>
          <ellipse cx="50" cy="55" rx="15" ry="8" fill="currentColor"/>
          <path d="M40 50 Q50 45 60 50" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="45" cy="35" r="3" fill="currentColor"/>
          <circle cx="55" cy="35" r="3" fill="currentColor"/>
        </svg>
      );
    case 5: // Clean Nose
      return (
        <svg viewBox="0 0 100 100" className={iconClass}>
          <path d="M50 25 L50 55 Q45 70 40 65 L40 75 Q50 85 60 75 L60 65 Q55 70 50 55" 
                fill="currentColor" opacity="0.8"/>
          <circle cx="45" cy="60" r="3" fill="currentColor"/>
          <circle cx="55" cy="60" r="3" fill="currentColor"/>
        </svg>
      );
    case 6: // Wash Face
      return (
        <svg viewBox="0 0 100 100" className={iconClass}>
          <ellipse cx="50" cy="50" rx="28" ry="35" fill="currentColor" opacity="0.3"/>
          <circle cx="40" cy="40" r="4" fill="currentColor"/>
          <circle cx="60" cy="40" r="4" fill="currentColor"/>
          <path d="M45 60 Q50 65 55 60" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M20 30 Q15 40 20 50 M80 30 Q85 40 80 50" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5"/>
        </svg>
      );
    case 7: // Wash Arms
      return (
        <svg viewBox="0 0 100 100" className={iconClass}>
          <path d="M20 50 L60 50 Q70 50 75 40 L80 30 Q85 25 90 30 L85 45 Q80 55 70 55 L20 55 Z" 
                fill="currentColor" opacity="0.8"/>
          <path d="M30 45 Q25 40 30 35 M50 45 Q45 40 50 35" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6"/>
        </svg>
      );
    case 8: // Wipe Head
      return (
        <svg viewBox="0 0 100 100" className={iconClass}>
          <ellipse cx="50" cy="55" rx="25" ry="30" fill="currentColor" opacity="0.3"/>
          <path d="M25 45 Q50 20 75 45" stroke="currentColor" strokeWidth="4" fill="none"/>
          <path d="M30 35 L70 35" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="5,3"/>
        </svg>
      );
    case 9: // Wipe Ears
      return (
        <svg viewBox="0 0 100 100" className={iconClass}>
          <path d="M30 35 Q20 50 30 65 L35 60 Q28 50 35 40 Z" fill="currentColor" opacity="0.8"/>
          <path d="M70 35 Q80 50 70 65 L65 60 Q72 50 65 40 Z" fill="currentColor" opacity="0.8"/>
          <circle cx="50" cy="50" r="15" fill="currentColor" opacity="0.3"/>
        </svg>
      );
    case 10: // Wash Feet
      return (
        <svg viewBox="0 0 100 100" className={iconClass}>
          <path d="M25 70 L25 50 Q30 30 50 35 L55 35 L60 30 L65 35 L70 32 L72 38 L68 42 L25 70" 
                fill="currentColor" opacity="0.8"/>
          <path d="M30 65 Q25 60 30 55 M50 55 Q45 50 50 45" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6"/>
        </svg>
      );
    case 11: // Dua After
      return (
        <svg viewBox="0 0 100 100" className={iconClass}>
          <path d="M30 80 L30 50 Q30 45 35 45 L40 45 L40 40 L45 45 L50 40 L55 45 L60 40 L65 45 Q70 45 70 50 L70 80 Z" 
                fill="currentColor" opacity="0.8"/>
          <path d="M40 30 L45 20 M50 25 L50 15 M60 30 L55 20" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      );
    default:
      return <Droplets className={iconClass} />;
  }
};

export default function Wudu() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState(1);
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleStep = (stepId: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const goToStep = useCallback((stepId: number) => {
    if (stepId >= 1 && stepId <= wuduSteps.length) {
      setActiveStep(stepId);
      // Scroll to the step
      const element = document.getElementById(`wudu-step-${stepId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          goToStep(parseInt(e.key));
          break;
        case '0':
          goToStep(10);
          break;
        case '-':
          goToStep(11);
          break;
        case 'ArrowDown':
        case 'j':
          e.preventDefault();
          goToStep(Math.min(activeStep + 1, wuduSteps.length));
          break;
        case 'ArrowUp':
        case 'k':
          e.preventDefault();
          goToStep(Math.max(activeStep - 1, 1));
          break;
        case ' ':
        case 'Enter':
          e.preventDefault();
          toggleStep(activeStep);
          break;
        case '?':
          setShowKeyboardHelp(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStep, goToStep]);

  const playAudio = (stepId: number, audioUrl?: string) => {
    if (!audioUrl) return;
    
    if (playingAudio === stepId) {
      audioRef.current?.pause();
      setPlayingAudio(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.play();
    setPlayingAudio(stepId);
    
    audio.onended = () => setPlayingAudio(null);
  };

  const progress = (completedSteps.length / wuduSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-night islamic-pattern">
      <div className="max-w-lg mx-auto pb-8">
        {/* Header */}
        <header className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <button
              onClick={() => setShowKeyboardHelp(prev => !prev)}
              className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-gold transition-colors"
              title="Keyboard shortcuts (?)"
            >
              <Keyboard className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gold/10">
              <Droplets className="h-8 w-8 text-gold" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">How to Perform Wudu</h1>
              <p className="text-lg font-arabic text-gold">كيفية الوضوء</p>
            </div>
          </div>
        </header>

        {/* Keyboard Shortcuts Help */}
        {showKeyboardHelp && (
          <div className="px-6 mb-4">
            <div className="p-4 rounded-xl bg-secondary/50 border border-border">
              <h3 className="text-sm font-semibold text-gold mb-3">⌨️ Keyboard Shortcuts</h3>
              <div className="space-y-3">
                {/* Navigation - Most Important */}
                <div className="p-2 rounded-lg bg-gold/10 border border-gold/20">
                  <p className="text-xs font-medium text-gold mb-2">Navigation (hands-free)</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-cream-dim">
                    <div><kbd className="px-1.5 py-0.5 rounded bg-secondary text-gold font-bold">↑</kbd> Previous step</div>
                    <div><kbd className="px-1.5 py-0.5 rounded bg-secondary text-gold font-bold">↓</kbd> Next step</div>
                    <div><kbd className="px-1.5 py-0.5 rounded bg-secondary text-gold">k</kbd> Previous (vim)</div>
                    <div><kbd className="px-1.5 py-0.5 rounded bg-secondary text-gold">j</kbd> Next (vim)</div>
                  </div>
                </div>
                {/* Other shortcuts */}
                <div className="grid grid-cols-2 gap-2 text-xs text-cream-dim">
                  <div><kbd className="px-1 py-0.5 rounded bg-secondary text-gold">1-9</kbd> Jump to step 1-9</div>
                  <div><kbd className="px-1 py-0.5 rounded bg-secondary text-gold">0</kbd> Step 10 (Feet)</div>
                  <div><kbd className="px-1 py-0.5 rounded bg-secondary text-gold">-</kbd> Step 11 (Dua)</div>
                  <div><kbd className="px-1 py-0.5 rounded bg-secondary text-gold">Space</kbd> Mark complete</div>
                  <div><kbd className="px-1 py-0.5 rounded bg-secondary text-gold">Enter</kbd> Mark complete</div>
                  <div><kbd className="px-1 py-0.5 rounded bg-secondary text-gold">?</kbd> Toggle help</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>{completedSteps.length} of {wuduSteps.length} steps</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gold transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Video Tutorial */}
        <div className="px-6 mb-6">
          <div className="rounded-2xl overflow-hidden border border-border bg-secondary/30">
            <div className="aspect-video">
              <iframe
                src="https://www.youtube.com/embed/exQM0mSfC5I?rel=0"
                title="How to Perform Wudu - Step by Step Guide"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="p-4">
              <p className="text-sm text-cream-dim">
                📹 Watch this comprehensive video tutorial for a visual demonstration of all wudu steps
              </p>
            </div>
          </div>
        </div>

        {/* Steps Navigation */}
        <div className="px-6 mb-4">
          <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
            {wuduSteps.map((step) => (
              <button
                key={step.id}
                onClick={() => goToStep(step.id)}
                className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-full text-xs font-semibold transition-all',
                  activeStep === step.id
                    ? 'bg-gold text-midnight'
                    : completedSteps.includes(step.id)
                    ? 'bg-gold/30 text-gold'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                )}
                title={`${step.name} (${step.keyboardShortcut})`}
              >
                {completedSteps.includes(step.id) ? '✓' : step.id}
              </button>
            ))}
          </div>
        </div>

        {/* Steps List */}
        <div className="px-6 space-y-4">
          {wuduSteps.map((step) => (
            <div
              key={step.id}
              id={`wudu-step-${step.id}`}
              className={cn(
                'rounded-2xl border overflow-hidden transition-all',
                activeStep === step.id
                  ? 'bg-gradient-card border-gold/30'
                  : 'bg-secondary/20 border-border'
              )}
            >
              <button
                onClick={() => goToStep(step.id)}
                className="w-full text-left"
              >
                <div className="p-4 flex items-start gap-3">
                  <div className={cn(
                    'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                    completedSteps.includes(step.id)
                      ? 'bg-gold text-midnight'
                      : 'bg-secondary text-gold'
                  )}>
                    {completedSteps.includes(step.id) ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <StepIcon stepId={step.id} className="p-1" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">{step.name}</h3>
                      <span className="text-gold font-arabic text-sm">{step.nameArabic}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Press <kbd className="px-1 py-0.5 rounded bg-secondary/50 text-gold text-[10px]">{step.keyboardShortcut}</kbd>
                    </p>
                  </div>
                </div>
              </button>

              {activeStep === step.id && (
                <div className="px-4 pb-4 space-y-4">
                  {/* Step Icon Large */}
                  <div className="rounded-xl overflow-hidden bg-secondary/50 p-8 flex items-center justify-center">
                    <div className="w-32 h-32 text-gold">
                      <StepIcon stepId={step.id} />
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-cream-dim text-sm leading-relaxed">
                    {step.description}
                  </p>

                  {/* Arabic & Transliteration */}
                  <div className="p-3 rounded-xl bg-gold/10 border border-gold/20 space-y-2">
                    <p className="font-arabic text-gold text-xl text-center" dir="rtl">
                      {step.arabic}
                    </p>
                    <p className="text-cream-dim text-sm text-center italic">
                      {step.transliteration}
                    </p>
                    {step.translation && (
                      <p className="text-muted-foreground text-xs text-center border-t border-gold/10 pt-2 mt-2">
                        {step.translation}
                      </p>
                    )}
                  </div>

                  {/* Dua to Recite with Audio */}
                  {step.duaToRecite && (
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-foreground">📿 Recite During This Step</h4>
                        {step.duaToRecite.audioUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => playAudio(step.id, step.duaToRecite?.audioUrl)}
                            className="text-gold hover:bg-gold/10"
                          >
                            {playingAudio === step.id ? (
                              <><VolumeX className="h-4 w-4 mr-1" /> Stop</>
                            ) : (
                              <><Volume2 className="h-4 w-4 mr-1" /> Play</>
                            )}
                          </Button>
                        )}
                      </div>
                      <p className="font-arabic text-gold text-lg text-center" dir="rtl">
                        {step.duaToRecite.arabic}
                      </p>
                      <p className="text-cream-dim text-sm text-center italic">
                        {step.duaToRecite.transliteration}
                      </p>
                      <p className="text-muted-foreground text-xs text-center">
                        {step.duaToRecite.translation}
                      </p>
                    </div>
                  )}

                  {step.hadithSource && (
                    <p className="text-xs text-muted-foreground">
                      📖 Source: {step.hadithSource}
                    </p>
                  )}

                  {/* Mark Complete Button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStep(step.id);
                      if (!completedSteps.includes(step.id) && step.id < wuduSteps.length) {
                        goToStep(step.id + 1);
                      }
                    }}
                    className={cn(
                      'w-full',
                      completedSteps.includes(step.id)
                        ? 'bg-gold/20 text-gold hover:bg-gold/30'
                        : 'bg-gold text-midnight hover:bg-gold/90'
                    )}
                  >
                    {completedSteps.includes(step.id) ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Completed - Tap to Undo
                      </>
                    ) : (
                      'Mark as Done'
                    )}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Hadith about Wudu */}
        <div className="px-6 mt-8">
          <div className="p-5 rounded-2xl bg-secondary/30 border border-border">
            <p className="text-cream-dim text-sm leading-relaxed">
              <span className="text-gold font-semibold">The Prophet ﷺ said:</span> "When a Muslim or believer washes his face (in the course of wudu), every sin which he has looked at with his eyes will be washed away from his face with water, or with the last drop of water; when he washes his hands, every sin which is committed by his hands will be washed away from his hands with the water, or with the last drop of water; and when he washes his feet, every sin his feet committed will be washed away with the water, or with the last drop of water; until he finally emerges cleansed of all his sins."
            </p>
            <a 
              href="https://sunnah.com/muslim:244"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold text-xs mt-3 hover:underline inline-block"
            >
              Sahih Muslim 244 - View on Sunnah.com →
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 mt-8 text-center">
          <Link to="/" className="text-gold hover:underline text-sm">
            ← Return to Bedtime Checklist
          </Link>
        </footer>
      </div>
    </div>
  );
}
