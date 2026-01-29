import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Droplets, CheckCircle2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const wuduSteps = [
  {
    id: 1,
    name: 'Intention (Niyyah)',
    nameArabic: 'النية',
    description: 'Make the intention in your heart to perform wudu for the sake of Allah. The intention does not need to be spoken aloud.',
    transliteration: 'Nawaytu al-wudu',
    arabic: 'نَوَيْتُ الوُضُوءَ',
    imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=400&h=300&fit=crop',
    imageAlt: 'Person with hands on heart making intention',
  },
  {
    id: 2,
    name: 'Say Bismillah',
    nameArabic: 'البسملة',
    description: 'Begin by saying "Bismillah" (In the name of Allah). This is recommended before starting wudu.',
    transliteration: 'Bismillah',
    arabic: 'بِسْمِ اللهِ',
    imageUrl: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=400&h=300&fit=crop',
    imageAlt: 'Serene mosque setting',
  },
  {
    id: 3,
    name: 'Wash Hands',
    nameArabic: 'غسل اليدين',
    description: 'Wash both hands up to the wrists three times, starting with the right hand. Make sure water reaches between the fingers.',
    transliteration: 'Yadayn (hands)',
    arabic: 'غَسْلُ الْيَدَيْنِ',
    imageUrl: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=400&h=300&fit=crop',
    imageAlt: 'Hands being washed with water',
  },
  {
    id: 4,
    name: 'Rinse Mouth',
    nameArabic: 'المضمضة',
    description: 'Take water into your mouth with the right hand and rinse it thoroughly three times. Swish the water around and then spit it out.',
    transliteration: 'Madmadah',
    arabic: 'الْمَضْمَضَةُ',
    imageUrl: 'https://images.unsplash.com/photo-1559599189-fe84dea4eb79?w=400&h=300&fit=crop',
    imageAlt: 'Person rinsing mouth',
  },
  {
    id: 5,
    name: 'Clean Nose',
    nameArabic: 'الاستنشاق والاستنثار',
    description: 'Sniff water into the nostrils with the right hand and blow it out with the left hand, three times. This cleans the nasal passages.',
    transliteration: 'Istinshaq wa Istinthar',
    arabic: 'الِاسْتِنْشَاقُ وَالِاسْتِنْثَارُ',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
    imageAlt: 'Person cleaning nose',
  },
  {
    id: 6,
    name: 'Wash Face',
    nameArabic: 'غسل الوجه',
    description: 'Wash the entire face three times, from the hairline to the chin and from ear to ear. Ensure water covers all areas including the forehead.',
    transliteration: 'Ghasl al-Wajh',
    arabic: 'غَسْلُ الْوَجْهِ',
    imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=300&fit=crop',
    imageAlt: 'Person washing face with water',
  },
  {
    id: 7,
    name: 'Wash Arms',
    nameArabic: 'غسل اليدين إلى المرفقين',
    description: 'Wash the right arm from fingertips to elbow three times, then the left arm. Make sure water covers all areas including between the fingers.',
    transliteration: 'Ghasl al-Yadayn ila al-Mirfaqayn',
    arabic: 'غَسْلُ الْيَدَيْنِ إِلَى الْمِرْفَقَيْنِ',
    imageUrl: 'https://images.unsplash.com/photo-1528476513691-07e3e3dd0be1?w=400&h=300&fit=crop',
    imageAlt: 'Arm being washed with water',
  },
  {
    id: 8,
    name: 'Wipe Head',
    nameArabic: 'مسح الرأس',
    description: 'With wet hands, wipe over the entire head once. Start from the forehead going back to the nape of the neck, then return to the forehead.',
    transliteration: "Mash ar-Ra's",
    arabic: 'مَسْحُ الرَّأْسِ',
    imageUrl: 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=400&h=300&fit=crop',
    imageAlt: 'Person wiping head during wudu',
  },
  {
    id: 9,
    name: 'Wipe Ears',
    nameArabic: 'مسح الأذنين',
    description: 'Wipe the inside of the ears with the index fingers and the outside with the thumbs, using the same water from wiping the head.',
    transliteration: 'Mash al-Udhnayn',
    arabic: 'مَسْحُ الْأُذُنَيْنِ',
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop',
    imageAlt: 'Person wiping ears',
  },
  {
    id: 10,
    name: 'Wash Feet',
    nameArabic: 'غسل الرجلين',
    description: 'Wash the right foot up to and including the ankles three times, then the left foot. Ensure water reaches between the toes.',
    transliteration: 'Ghasl ar-Rijlayn',
    arabic: 'غَسْلُ الرِّجْلَيْنِ',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    imageAlt: 'Feet being washed with water',
  },
  {
    id: 11,
    name: 'Dua After Wudu',
    nameArabic: 'الدعاء بعد الوضوء',
    description: 'After completing wudu, recite the shahada and the dua for wudu. Point the index finger to the sky while reciting.',
    transliteration: 'Ash-hadu an la ilaha ill-Allah wahdahu la sharika lah, wa ash-hadu anna Muhammadan abduhu wa rasuluh. Allahumma-j\'alni min at-tawwabin, wa-j\'alni min al-mutatahhirin.',
    arabic: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ. اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ، وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
    translation: 'I bear witness that there is no god but Allah alone, with no partner, and I bear witness that Muhammad is His slave and Messenger. O Allah, make me among those who repent and make me among those who purify themselves.',
    imageUrl: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=300&fit=crop',
    imageAlt: 'Person in dua position after wudu',
    hadithSource: 'Tirmidhi 55',
  },
];

export default function Wudu() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);

  const toggleStep = (stepId: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const progress = (completedSteps.length / wuduSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-night islamic-pattern">
      <div className="max-w-lg mx-auto pb-8">
        {/* Header */}
        <header className="p-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Checklist
          </Link>
          
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
                ref={videoRef}
                src="https://www.youtube.com/embed/m0NKMdMpY7A"
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
                onClick={() => setActiveStep(step.id)}
                className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-full text-xs font-semibold transition-all',
                  activeStep === step.id
                    ? 'bg-gold text-midnight'
                    : completedSteps.includes(step.id)
                    ? 'bg-gold/30 text-gold'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                )}
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
              className={cn(
                'rounded-2xl border overflow-hidden transition-all',
                activeStep === step.id
                  ? 'bg-gradient-card border-gold/30'
                  : 'bg-secondary/20 border-border'
              )}
            >
              <button
                onClick={() => setActiveStep(step.id)}
                className="w-full text-left"
              >
                <div className="p-4 flex items-start gap-3">
                  <div className={cn(
                    'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                    completedSteps.includes(step.id)
                      ? 'bg-gold text-midnight'
                      : 'bg-secondary text-foreground'
                  )}>
                    {completedSteps.includes(step.id) ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">{step.name}</h3>
                      <span className="text-gold font-arabic text-sm">{step.nameArabic}</span>
                    </div>
                  </div>
                </div>
              </button>

              {activeStep === step.id && (
                <div className="px-4 pb-4 space-y-4">
                  {/* Step Image */}
                  <div className="rounded-xl overflow-hidden bg-secondary/50">
                    <img
                      src={step.imageUrl}
                      alt={step.imageAlt}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
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
                        setActiveStep(step.id + 1);
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
