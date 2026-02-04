import { Link } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import { 
  Moon, Bell, BookOpen, Clock, CheckCircle2, 
  Heart, MapPin, ArrowRight, Home, ChevronRight,
  Bed, Circle, ListChecks, Play, Volume2, RotateCcw,
  Plus, Settings, AlertCircle, Sparkles, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Import mockup images
import mockupChecklist from '@/assets/mockup-checklist.png';
import mockupTasbih from '@/assets/mockup-tasbih.png';
import mockupQuran from '@/assets/mockup-quran.png';
import mockupSleep from '@/assets/mockup-sleep.png';
import mockupAlarms from '@/assets/mockup-alarms.png';

interface GuideSection {
  id: string;
  title: string;
  titleArabic: string;
  icon: React.ReactNode;
  description: string;
  image: string;
  tabParam: string;
  steps: {
    title: string;
    description: string;
    tip?: string;
  }[];
}

const guideSections: GuideSection[] = [
  {
    id: 'checklist',
    title: 'Sunnah Checklist',
    titleArabic: 'قائمة السنة',
    icon: <ListChecks className="h-6 w-6" />,
    description: 'Follow the complete 5-phase Prophetic ﷺ bedtime routine with our guided checklist.',
    image: mockupChecklist,
    tabParam: 'checklist',
    steps: [
      {
        title: '1. Pray Isha',
        description: 'Start your evening by completing Isha prayer. The checklist shows the prayer time and a countdown timer.',
        tip: 'Tap the bell icon to set an Isha prayer alarm reminder.'
      },
      {
        title: '2. Bedtime Preparation',
        description: 'Perform Wudu (ablution) before bed - this is a Sunnah of the Prophet ﷺ. Dust your bed three times as he did.',
        tip: 'Tap "Learn How to Perform Wudu" for a complete step-by-step guide.'
      },
      {
        title: '3. Quranic Recitations',
        description: 'Recite Ayat al-Kursi, the last two verses of Al-Baqarah, and the Three Quls. Check off each as you complete them.',
        tip: 'Expand each item to see the full Arabic text, transliteration, and English translation.'
      },
      {
        title: '4. Dhikr & Duas',
        description: 'Complete your bedtime remembrance with the prescribed duas. Each item shows the Hadith reference.',
        tip: 'Tap the Hadith source to read the full reference on Sunnah.com.'
      },
      {
        title: '5. Wake Before Fajr',
        description: 'The final phase tracks waking for Tahajjud and Fajr prayer. Use the quick-add button to set a Tahajjud alarm.',
        tip: 'The app calculates the last third of the night automatically based on your location.'
      }
    ]
  },
  {
    id: 'recitations',
    title: 'Quran Recitations',
    titleArabic: 'التلاوة',
    icon: <BookOpen className="h-6 w-6" />,
    description: 'Listen to beautiful audio recitations of bedtime Surahs with Arabic text and translations.',
    image: mockupQuran,
    tabParam: 'recitations',
    steps: [
      {
        title: 'Ayat al-Kursi',
        description: 'The Throne Verse (2:255) - the greatest verse in the Quran. Reciting it before sleep provides protection.',
        tip: 'Tap the play button to hear the recitation by a renowned Qari.'
      },
      {
        title: 'Last Two Verses of Al-Baqarah',
        description: 'Verses 285-286 of Surah Al-Baqarah. The Prophet ﷺ said they are sufficient for whoever recites them at night.',
        tip: 'Each verse is shown separately with transliteration for learning.'
      },
      {
        title: 'The Three Quls',
        description: 'Surah Al-Ikhlas, Al-Falaq, and An-Nas. Blow into your hands and wipe over your body three times.',
        tip: 'Expand each Surah to see the full Arabic, transliteration, and meaning.'
      },
      {
        title: 'Bedtime Duas',
        description: 'Additional authentic duas from the Sunnah for peaceful sleep and protection.',
        tip: 'Each dua includes the original Arabic, pronunciation guide, and translation.'
      }
    ]
  },
  {
    id: 'tasbih',
    title: 'Tasbih Counter',
    titleArabic: 'تسبيح',
    icon: <Circle className="h-6 w-6" />,
    description: 'Complete the 33-33-34 dhikr of Fatimah رضي الله عنها before sleep with our digital counter.',
    image: mockupTasbih,
    tabParam: 'tasbih',
    steps: [
      {
        title: 'SubhanAllah × 33',
        description: 'Tap the counter 33 times while saying "SubhanAllah" (Glory be to Allah). The progress ring fills as you count.',
        tip: 'The counter vibrates on each tap for tactile feedback.'
      },
      {
        title: 'Alhamdulillah × 33',
        description: 'After completing SubhanAllah, the counter automatically switches to Alhamdulillah (All praise is due to Allah).',
        tip: 'Watch the color change to indicate the new phase.'
      },
      {
        title: 'Allahu Akbar × 34',
        description: 'The final phase is 34 counts of Allahu Akbar (Allah is the Greatest), completing the 100 total.',
        tip: 'A celebration animation plays when you complete all 100!'
      },
      {
        title: 'Reset & Track',
        description: 'Use the reset button to start over. Your completion is tracked in the overall progress ring.',
        tip: 'The Tasbih auto-resets each day for your nightly routine.'
      }
    ]
  },
  {
    id: 'sleep',
    title: 'Sleep Tracker',
    titleArabic: 'يوميات النوم',
    icon: <Bed className="h-6 w-6" />,
    description: 'Track your sleep patterns, quality, and dreams with Islamic guidance.',
    image: mockupSleep,
    tabParam: 'sleep',
    steps: [
      {
        title: 'Sleep Schedule',
        description: 'View your calculated bedtime (30 min after Isha) and wake time (30 min before Fajr) based on prayer times.',
        tip: 'The schedule automatically adjusts when you change your location.'
      },
      {
        title: 'Start Sleep Tracking',
        description: 'Tap "Start Sleep" when you go to bed. The app records your sleep start time.',
        tip: 'You can edit the time if you forgot to tap it right away.'
      },
      {
        title: 'Wake Up & Rate',
        description: 'When you wake, tap "End Sleep" and rate your sleep quality from 1-5 stars.',
        tip: 'Rate honestly - this helps you identify patterns over time.'
      },
      {
        title: 'Dream Journal',
        description: 'Record your dreams and categorize them: Good Dream (Ruya), Neutral, or Bad Dream (from Shaytan).',
        tip: 'For bad dreams, the app shows the Sunnah guidance: spit to your left, seek refuge, and don\'t share it.'
      },
      {
        title: 'Weekly Statistics',
        description: 'View your weekly sleep trends, average duration, and Isha/Fajr prayer adherence rates.',
        tip: 'Aim for 7-9 hours of sleep to follow the Sunnah of rest.'
      }
    ]
  },
  {
    id: 'alarms',
    title: 'Prayer Alarms',
    titleArabic: 'منبه الصلاة',
    icon: <Bell className="h-6 w-6" />,
    description: 'Never miss Fajr or Tahajjud with smart prayer-synced alarms.',
    image: mockupAlarms,
    tabParam: 'alarms',
    steps: [
      {
        title: 'Enable Notifications',
        description: 'First, grant notification permission when prompted. This allows alarms to sound even when the app is in the background.',
        tip: 'On iOS, add the app to your home screen (PWA) for best notification support.'
      },
      {
        title: 'Create Fajr Alarm',
        description: 'Tap "Add Fajr Alarm" to create an alarm synced to your local Fajr time. It updates automatically with your location.',
        tip: 'The alarm time adjusts as Fajr time changes throughout the year.'
      },
      {
        title: 'Tahajjud Wake-Up',
        description: 'Set a Tahajjud alarm for the last third of the night - the blessed time when Allah descends to answer prayers.',
        tip: 'Use the quick-add button on the checklist for one-tap Tahajjud alarm creation.'
      },
      {
        title: 'Custom Alarms',
        description: 'Create custom alarms with your choice of sound: Makkah Adhan, Madinah Adhan, or gentle tones.',
        tip: 'Set "X minutes before Fajr" alarms to give yourself time to prepare.'
      },
      {
        title: 'Snooze & Manage',
        description: 'When an alarm fires, you can snooze it. Manage all your alarms with toggle switches and delete options.',
        tip: 'Disabled alarms are saved but won\'t fire until re-enabled.'
      }
    ]
  }
];

export default function Guides() {
  usePageMeta({
    title: 'SunnahSleep Guides: How to Use the App | Sunnah Sleep Companion',
    description: 'Learn how to use SunnahSleep: Sunnah checklist, Quran recitations, Tasbih counter, sleep tracker, and prayer alarms. Step-by-step guides for the Prophetic bedtime routine.',
    canonical: 'https://sunnahsleep.app/guides',
    keywords: ['SunnahSleep guide', 'how to use SunnahSleep', 'Islamic sleep app', 'Prophetic bedtime routine'],
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gold hover:text-gold/80 transition-colors">
            <Home className="h-5 w-5" />
            <span className="font-semibold">Back to App</span>
          </Link>
          <div className="flex items-center gap-2">
            <Moon className="h-6 w-6 text-gold" />
            <span className="font-arabic text-xl text-gradient-gold">User Guides</span>
          </div>
          <Link to="/demo">
            <Button variant="outline" size="sm" className="border-gold/30 hover:border-gold">
              <Play className="h-4 w-4 mr-2" />
              Demo
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-gold mb-4">
            User Guides
          </h1>
          <p className="text-lg text-cream-dim max-w-2xl mx-auto">
            Learn how to use every feature of SunnahSleep to establish the blessed Prophetic ﷺ bedtime routine
          </p>
        </section>

        {/* Quick Navigation */}
        <nav className="mb-12">
          <Card className="border-gold/20 bg-gradient-to-b from-secondary/30 to-background">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gold" />
                Quick Navigation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {guideSections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-secondary/50 hover:bg-gold/10 border border-transparent hover:border-gold/30 transition-all group"
                  >
                    <div className="p-2 rounded-lg bg-gold/10 text-gold group-hover:bg-gold group-hover:text-background transition-colors">
                      {section.icon}
                    </div>
                    <span className="text-xs text-center text-foreground font-medium">
                      {section.title}
                    </span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </nav>

        {/* Guide Sections */}
        <div className="space-y-16">
          {guideSections.map((section, sectionIndex) => (
            <section 
              key={section.id} 
              id={section.id}
              className="scroll-mt-24"
            >
              {/* Section Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                {/* Phone Mockup */}
                <div className="flex-shrink-0 w-32 md:w-40 mx-auto md:mx-0">
                  <img 
                    src={section.image} 
                    alt={`${section.title} screenshot`}
                    className="w-full h-auto drop-shadow-xl"
                  />
                </div>
                
                {/* Title & Description */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                    <div className="p-2 rounded-xl bg-gold/10 text-gold">
                      {section.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">
                        {section.title}
                      </h2>
                      <p className="font-arabic text-gold">
                        {section.titleArabic}
                      </p>
                    </div>
                  </div>
                  <p className="text-cream-dim mb-4">
                    {section.description}
                  </p>
                  <Link to={`/?tab=${section.tabParam}`}>
                    <Button size="sm" className="bg-gold text-background hover:bg-gold/90">
                      Open in App
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {section.steps.map((step, stepIndex) => (
                  <Card 
                    key={stepIndex}
                    className="border-gold/10 bg-gradient-to-r from-secondary/30 to-background hover:border-gold/30 transition-colors"
                  >
                    <CardContent className="p-4 md:p-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center text-sm font-bold">
                            {stepIndex + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {step.title}
                          </h3>
                          <p className="text-cream-dim text-sm mb-2">
                            {step.description}
                          </p>
                          {step.tip && (
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-gold/5 border border-gold/20">
                              <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-gold">
                                <span className="font-semibold">Tip:</span> {step.tip}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Divider */}
              {sectionIndex < guideSections.length - 1 && (
                <div className="mt-12 flex items-center justify-center">
                  <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                  <Moon className="h-4 w-4 text-gold/30 mx-4" />
                  <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Additional Resources */}
        <section className="mt-16">
          <Card className="border-gold/20 bg-gradient-to-br from-gold/10 to-primary/10">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">
                Additional Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Link to="/wudu" className="block">
                  <div className="p-4 rounded-xl bg-secondary/50 hover:bg-gold/10 border border-transparent hover:border-gold/30 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gold/10 text-gold">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-gold transition-colors">
                          Wudu Guide
                        </h3>
                        <p className="text-xs text-cream-dim">
                          Step-by-step ablution instructions
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
                    </div>
                  </div>
                </Link>
                
                <Link to="/blog" className="block">
                  <div className="p-4 rounded-xl bg-secondary/50 hover:bg-gold/10 border border-transparent hover:border-gold/30 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gold/10 text-gold">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-gold transition-colors">
                          Blog Articles
                        </h3>
                        <p className="text-xs text-cream-dim">
                          Islamic sleep science & Sunnah
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
                    </div>
                  </div>
                </Link>
                
                <Link to="/demo" className="block">
                  <div className="p-4 rounded-xl bg-secondary/50 hover:bg-gold/10 border border-transparent hover:border-gold/30 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gold/10 text-gold">
                        <Play className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-gold transition-colors">
                          Demo Video
                        </h3>
                        <p className="text-xs text-cream-dim">
                          Watch app walkthrough
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
                    </div>
                  </div>
                </Link>
                
                <Link to="/install" className="block">
                  <div className="p-4 rounded-xl bg-secondary/50 hover:bg-gold/10 border border-transparent hover:border-gold/30 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gold/10 text-gold">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-gold transition-colors">
                          Install App
                        </h3>
                        <p className="text-xs text-cream-dim">
                          Add to your home screen
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
                    </div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="mt-12 text-center py-12 px-6 rounded-2xl bg-gradient-to-br from-gold/10 to-primary/10 border border-gold/20">
          <h2 className="text-3xl font-bold text-gradient-gold mb-4 font-arabic">
            Ready to Start?
          </h2>
          <p className="text-cream-dim mb-8 max-w-lg mx-auto">
            Begin your journey to blessed sleep following the Sunnah of Prophet Muhammad ﷺ
          </p>
          
          <Link to="/">
            <Button size="lg" className="bg-gold text-background hover:bg-gold/90">
              <Moon className="h-5 w-5 mr-2" />
              Open SunnahSleep
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </section>

        {/* Footer */}
        <footer className="text-center mt-12 py-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Made with ❤️ for the Ummah
          </p>
        </footer>
      </main>
    </div>
  );
}
