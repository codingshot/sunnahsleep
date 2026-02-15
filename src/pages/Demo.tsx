import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import { 
  Moon, Sun, Bell, BookOpen, Clock, CheckCircle2, 
  Heart, Sparkles, MapPin, Play, Pause, ArrowRight,
  ChevronLeft, ChevronRight, Home, Download, Share2, Twitter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Import phone mockup images
import mockupChecklist from '@/assets/mockup-checklist.png';
import mockupTasbih from '@/assets/mockup-tasbih.png';
import mockupQuran from '@/assets/mockup-quran.png';
import mockupSleep from '@/assets/mockup-sleep.png';
import mockupAlarms from '@/assets/mockup-alarms.png';

interface FeatureSlide {
  id: string;
  title: string;
  titleArabic: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  image: string;
}

const featureSlides: FeatureSlide[] = [
  {
    id: 'checklist',
    title: 'Sunnah Checklist',
    titleArabic: 'قائمة السنة',
    description: 'Follow the complete Prophetic ﷺ bedtime routine with our 5-phase guided checklist',
    icon: <CheckCircle2 className="h-8 w-8" />,
    color: 'from-gold/20 to-gold/5',
    features: [
      'Pray Isha with congregation tracking',
      'Bedtime preparation (Wudu, dusting bed)',
      'Quranic recitations (Ayat al-Kursi, Three Quls)',
      'Dhikr and bedtime duas',
      'Wake up routine before Fajr'
    ],
    image: mockupChecklist
  },
  {
    id: 'recitations',
    title: 'Quranic Recitations',
    titleArabic: 'التلاوة',
    description: 'Listen to beautiful recitations of bedtime Surahs with translations',
    icon: <BookOpen className="h-8 w-8" />,
    color: 'from-emerald-500/20 to-emerald-500/5',
    features: [
      'Ayat al-Kursi (The Throne Verse)',
      'Last 2 Ayat of Al-Baqarah',
      'Surah Al-Mulk',
      'Three Quls (Ikhlas, Falaq, Nas)',
      'Audio playback with text'
    ],
    image: mockupQuran
  },
  {
    id: 'tasbih',
    title: 'Bedtime Tasbih',
    titleArabic: 'تسبيح',
    description: 'Complete the 33-33-34 dhikr of Fatimah رضي الله عنها before sleep',
    icon: <Heart className="h-8 w-8" />,
    color: 'from-rose-500/20 to-rose-500/5',
    features: [
      'SubhanAllah × 33',
      'Alhamdulillah × 33',
      'Allahu Akbar × 34',
      'Visual progress tracking',
      'Completion celebration'
    ],
    image: mockupTasbih
  },
  {
    id: 'sleep-tracker',
    title: 'Sleep & Dream Diary',
    titleArabic: 'يوميات النوم',
    description: 'Track your sleep quality and record dreams with Islamic guidance',
    icon: <Moon className="h-8 w-8" />,
    color: 'from-indigo-500/20 to-indigo-500/5',
    features: [
      'Sleep duration tracking',
      'Quality rating (1-5)',
      'Dream journal entries',
      'Good vs bad dream guidance',
      'Weekly statistics'
    ],
    image: mockupSleep
  },
  {
    id: 'alarms',
    title: 'Prayer Alarms',
    titleArabic: 'منبه الصلاة',
    description: 'Never miss Fajr or Tahajjud with smart prayer-synced alarms',
    icon: <Bell className="h-8 w-8" />,
    color: 'from-amber-500/20 to-amber-500/5',
    features: [
      'Fajr & Isha prayer alarms',
      'Tahajjud wake-up (last third)',
      'Custom snooze settings',
      'Auto-updates with location',
      'Beautiful Adhan sounds'
    ],
    image: mockupAlarms
  }
];

export default function Demo() {
  usePageMeta({
    title: 'SunnahSleep Demo: See the App in Action | Islamic Sleep Companion',
    description: 'Watch the SunnahSleep app demo. See the Sunnah checklist, Quran recitations, Tasbih counter, sleep tracker, and prayer alarms in action.',
    canonical: 'https://sunnahsleep.app/demo',
    keywords: ['SunnahSleep demo', 'Islamic sleep app demo', 'Prophetic bedtime app'],
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % featureSlides.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featureSlides.length) % featureSlides.length);
  };

  // Auto-play slideshow
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlay, nextSlide]);

  const currentFeature = featureSlides[currentSlide];

  // Share functionality
  const shareOnTwitter = () => {
    const text = "🌙 Just discovered SunnahSleep - an Islamic bedtime companion that helps follow the Prophetic ﷺ routine for blessed sleep!\n\n✨ Sunnah Checklist\n📖 Quran Recitations\n📿 Tasbih Counter\n⏰ Prayer Alarms\n\n100% Free & Private";
    const url = window.location.origin;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
  };

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
            <span className="font-arabic text-xl text-gradient-gold">SunnahSleep</span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={shareOnTwitter}
              className="text-gold hover:bg-gold/10"
            >
              <Twitter className="h-4 w-4" />
            </Button>
            <Link to="/install">
              <Button variant="outline" size="sm" className="border-gold/30 hover:border-gold">
                <Download className="h-4 w-4 mr-2" />
                Install
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content" className="container mx-auto px-4 py-8 max-w-4xl" tabIndex={-1}>
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-gold mb-4 font-arabic">
            SunnahSleep Demo
          </h1>
          <p className="text-lg text-cream-dim max-w-2xl mx-auto mb-6">
            Your Islamic sleep companion following the blessed Sunnah of Prophet Muhammad ﷺ
          </p>
          
          {/* Share Buttons */}
          <div className="flex justify-center gap-3 mb-8">
            <Button 
              onClick={shareOnTwitter}
              className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
            >
              <Twitter className="h-4 w-4 mr-2" />
              Share on X
            </Button>
            <Button 
              variant="outline" 
              onClick={copyLink}
              className="border-gold/30 hover:border-gold"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </section>

        {/* Video Section */}
        <section className="mb-16">
          <Card className="overflow-hidden border-gold/20 bg-gradient-to-b from-secondary/50 to-background">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-black/50">
                <video
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster="/og-image.png"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src="/demo-video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Play overlay (shows when not playing) */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                    <div className="p-6 rounded-full bg-gold/90 text-background">
                      <Play className="h-12 w-12 ml-1" />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6 text-center border-t border-border">
                <p className="text-cream-dim text-sm">
                  🌙 Experience the blessed routine of Prophet Muhammad ﷺ for peaceful sleep
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Feature Carousel */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              Explore Features
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={cn(
                "text-sm",
                isAutoPlay ? "text-gold" : "text-muted-foreground"
              )}
            >
              {isAutoPlay ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isAutoPlay ? "Pause" : "Auto-play"}
            </Button>
          </div>
          
          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mb-6">
            {featureSlides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => {
                  setCurrentSlide(index);
                  setIsAutoPlay(false);
                }}
                className={cn(
                  'w-3 h-3 rounded-full transition-all duration-300',
                  index === currentSlide 
                    ? 'bg-gold w-8' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                )}
                aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                aria-current={index === currentSlide ? 'true' : undefined}
              />
            ))}
          </div>

          {/* Current Feature Card */}
          <Card className={cn(
            'overflow-hidden border-gold/20 transition-all duration-500',
            `bg-gradient-to-br ${currentFeature.color}`
          )}>
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Phone Mockup Image */}
                <div className="flex-shrink-0 relative">
                  <div className="w-48 md:w-56 lg:w-72 mx-auto transition-all duration-500 hover:scale-105">
                    <img 
                      src={currentFeature.image} 
                      alt={`${currentFeature.title} screenshot`}
                      className="w-full h-auto drop-shadow-2xl"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                  {/* Icon & Title */}
                  <div className="flex items-center gap-4 mb-4 justify-center lg:justify-start">
                    <div className="p-3 rounded-2xl bg-gold/10 text-gold">
                      {currentFeature.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">
                        {currentFeature.title}
                      </h3>
                      <p className="font-arabic text-lg text-gold">
                        {currentFeature.titleArabic}
                      </p>
                    </div>
                  </div>

                  <p className="text-cream-dim mb-6 text-lg">
                    {currentFeature.description}
                  </p>
                  
                  <ul className="space-y-2 text-left">
                    {currentFeature.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <Sparkles className="h-4 w-4 text-gold flex-shrink-0" />
                        <span className="text-foreground text-sm md:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                prevSlide();
                setIsAutoPlay(false);
              }}
              className="border-gold/30 hover:border-gold"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Previous
            </Button>
            <Button
              size="lg"
              onClick={() => {
                nextSlide();
                setIsAutoPlay(false);
              }}
              className="bg-gold text-background hover:bg-gold/90"
            >
              Next
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </section>

        {/* Key Highlights */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
            Why SunnahSleep?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-gold/20 bg-gradient-to-b from-secondary/30 to-background">
              <CardContent className="p-6 text-center">
                <div className="p-3 rounded-full bg-gold/10 w-fit mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-gold" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Authentic Sources</h3>
                <p className="text-sm text-cream-dim">
                  Every practice backed by Sahih Hadith with full references
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-gold/20 bg-gradient-to-b from-secondary/30 to-background">
              <CardContent className="p-6 text-center">
                <div className="p-3 rounded-full bg-gold/10 w-fit mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-gold" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Location-Aware</h3>
                <p className="text-sm text-cream-dim">
                  Accurate prayer times anywhere in the world
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-gold/20 bg-gradient-to-b from-secondary/30 to-background">
              <CardContent className="p-6 text-center">
                <div className="p-3 rounded-full bg-gold/10 w-fit mx-auto mb-4">
                  <Sun className="h-6 w-6 text-gold" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Better Sleep</h3>
                <p className="text-sm text-cream-dim">
                  Science-backed routine for restorative rest
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-12 px-6 rounded-2xl bg-gradient-to-br from-gold/10 to-primary/10 border border-gold/20">
          <h2 className="text-3xl font-bold text-gradient-gold mb-4 font-arabic">
            Start Your Journey Tonight
          </h2>
          <p className="text-cream-dim mb-8 max-w-lg mx-auto">
            Join thousands of Muslims worldwide following the blessed Sunnah for peaceful, 
            restorative sleep and never missing Fajr again.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" className="bg-gold text-background hover:bg-gold/90 w-full sm:w-auto">
                <Moon className="h-5 w-5 mr-2" />
                Open App
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link to="/install">
              <Button variant="outline" size="lg" className="border-gold/30 hover:border-gold w-full sm:w-auto">
                <Download className="h-5 w-5 mr-2" />
                Install PWA
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer Note */}
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
