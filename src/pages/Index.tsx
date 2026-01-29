import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ProgressRing } from '@/components/ProgressRing';
import { ChecklistCard } from '@/components/ChecklistCard';
import { TasbihCounter } from '@/components/TasbihCounter';
import { DuaCard } from '@/components/DuaCard';
import { AyatKursiCard } from '@/components/AyatKursiCard';
import { QuranVerseCard } from '@/components/QuranVerseCard';
import { QailulahCard } from '@/components/QailulahCard';
import { TahajjudCard } from '@/components/TahajjudCard';
import { SleepTrackerCard } from '@/components/SleepTrackerCard';
import { AlarmsCard } from '@/components/AlarmsCard';
import { CompletionCelebration } from '@/components/CompletionCelebration';
import { useChecklist } from '@/hooks/useChecklist';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useAlarms } from '@/hooks/useAlarms';
import { duas, lastTwoAyahBaqarah, threeQuls } from '@/data/checklistData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListChecks, BookOpen, Circle, Bed, Bell, ExternalLink, Download } from 'lucide-react';

const Index = () => {
  const {
    items,
    tasbih,
    streak,
    toggleItem,
    incrementTasbih,
    resetTasbih,
    progressPercentage,
    isFullyComplete,
  } = useChecklist();

  const {
    prayerTimes,
    tahajjudSettings,
    qailulahSettings,
    location,
    loading,
    initializePrayerTimes,
    toggleTahajjud,
    updateQailulah,
    getRecommendedQailulahTime,
    getTimeBeforeFajr,
    setManualLocation,
    resetToAutoLocation,
    searchCity,
  } = usePrayerTimes();

  const { alarms } = useAlarms();
  const enabledAlarmsCount = alarms.filter(a => a.enabled).length;

  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      setIsMobile(/iphone|ipad|ipod|android/.test(userAgent));
    };
    checkMobile();
  }, []);

  // Auto-initialize prayer times on mount
  useEffect(() => {
    if (!prayerTimes) {
      initializePrayerTimes();
    }
  }, [prayerTimes, initializePrayerTimes]);

  // Group items by category
  const preparationItems = items.filter((i) => i.category === 'preparation');
  const recitationItems = items.filter((i) => i.category === 'recitation');
  const dhikrItems = items.filter((i) => i.category === 'dhikr');

  // Check if Isha is completed
  const ishaItem = items.find(i => i.id === 'ayat-kursi');
  const isIshaCompleted = ishaItem?.completed || false;

  return (
    <div className="min-h-screen bg-gradient-night islamic-pattern">
      <div className="max-w-lg mx-auto pb-8">
        <Header streak={streak} />

        {/* Progress Section */}
        <div className="px-6 mb-8">
          <div className="flex items-center justify-center">
            <ProgressRing progress={progressPercentage} />
          </div>
        </div>

        {/* Main Content */}
        <main className="px-6">
          <Tabs defaultValue="checklist" className="w-full">
            <TabsList className="w-full mb-6 bg-secondary/50 border border-border p-1 grid grid-cols-5" aria-label="App sections">
              <TabsTrigger
                value="checklist"
                className="data-[state=active]:bg-gold data-[state=active]:text-midnight text-xs"
                aria-label="Checklist"
              >
                <ListChecks className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger
                value="recitations"
                className="data-[state=active]:bg-gold data-[state=active]:text-midnight text-xs"
                aria-label="Recitations"
              >
                <BookOpen className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger
                value="tasbih"
                className="data-[state=active]:bg-gold data-[state=active]:text-midnight text-xs"
                aria-label="Tasbih counter"
              >
                <Circle className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger
                value="sleep"
                className="data-[state=active]:bg-gold data-[state=active]:text-midnight text-xs"
                aria-label="Sleep tracker"
              >
                <Bed className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger
                value="alarms"
                className="data-[state=active]:bg-gold data-[state=active]:text-midnight text-xs relative"
                aria-label={`Alarms${enabledAlarmsCount > 0 ? ` (${enabledAlarmsCount} active)` : ''}`}
              >
                <Bell className="h-4 w-4" />
                {enabledAlarmsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-midnight text-[10px] font-bold rounded-full flex items-center justify-center">
                    {enabledAlarmsCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="checklist" className="space-y-6">
              {/* Preparation */}
              <section aria-labelledby="preparation-heading">
                <h2 id="preparation-heading" className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">
                  Preparation
                </h2>
                <div className="space-y-3">
                  {preparationItems.map((item) => (
                    <ChecklistCard key={item.id} item={item} onToggle={toggleItem} />
                  ))}
                </div>
              </section>

              {/* Position */}
              <section aria-labelledby="position-heading">
                <h2 id="position-heading" className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">
                  Sleeping Position
                </h2>
                <div className="space-y-3">
                  {items
                    .filter((i) => i.category === 'position')
                    .map((item) => (
                      <ChecklistCard key={item.id} item={item} onToggle={toggleItem} />
                    ))}
                </div>
              </section>

              {/* Recitation */}
              <section aria-labelledby="recitation-heading">
                <h2 id="recitation-heading" className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">
                  Recitation
                </h2>
                <div className="space-y-3">
                  {recitationItems.map((item) => (
                    <ChecklistCard key={item.id} item={item} onToggle={toggleItem} />
                  ))}
                </div>
              </section>

              {/* Dhikr */}
              <section aria-labelledby="dhikr-heading">
                <h2 id="dhikr-heading" className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">
                  Remembrance
                </h2>
                <div className="space-y-3">
                  {dhikrItems.map((item) => (
                    <ChecklistCard key={item.id} item={item} onToggle={toggleItem} />
                  ))}
                </div>
              </section>
            </TabsContent>

            <TabsContent value="recitations" className="space-y-4">
              <AyatKursiCard />
              
              <QuranVerseCard
                title="Last Two Verses of Al-Baqarah"
                titleArabic="آخر آيتين من سورة البقرة"
                reference={lastTwoAyahBaqarah.reference}
                verses={lastTwoAyahBaqarah.verses}
                surah={2}
                icon={<BookOpen className="h-5 w-5 text-gold" />}
              />

              {/* Three Quls */}
              <section aria-labelledby="three-quls-heading">
                <h3 id="three-quls-heading" className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">
                  The Three Quls (Al-Mu'awwidhaat)
                </h3>
                {threeQuls.map((qul) => (
                  <QuranVerseCard
                    key={qul.id}
                    title={qul.name}
                    titleArabic={qul.nameArabic}
                    reference={`Surah ${qul.name} (${qul.surah})`}
                    verses={[{
                      ayah: 1,
                      arabic: qul.arabic,
                      translation: qul.translation,
                      audioUrl: qul.audioUrl
                    }]}
                    surah={qul.surah}
                  />
                ))}
              </section>

              {/* Duas */}
              <section aria-labelledby="duas-heading" className="mt-6">
                <h3 id="duas-heading" className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">
                  Bedtime Duas
                </h3>
                {duas.map((dua) => (
                  <DuaCard key={dua.id} dua={dua} />
                ))}
              </section>
            </TabsContent>

            <TabsContent value="tasbih">
              <TasbihCounter
                tasbih={tasbih}
                onIncrement={incrementTasbih}
                onReset={resetTasbih}
              />

              {/* Hadith about bedtime dhikr */}
              <div className="mt-6 p-5 rounded-2xl bg-secondary/30 border border-border">
                <p className="text-cream-dim text-sm leading-relaxed">
                  <span className="text-gold font-semibold">The Prophet ﷺ said:</span> "Whoever says
                  SubhanAllah 33 times, Alhamdulillah 33 times, and Allahu Akbar 34 times before
                  sleeping, that will be better for him than having a servant."
                </p>
                <a 
                  href="https://sunnah.com/bukhari:6318"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold text-xs mt-2 hover:underline inline-block"
                >
                  Bukhari and Muslim - View on Sunnah.com →
                </a>
              </div>
            </TabsContent>

            <TabsContent value="sleep" className="space-y-4">
              <SleepTrackerCard onIshaChecked={isIshaCompleted} />

              <TahajjudCard
                settings={tahajjudSettings}
                prayerTimes={prayerTimes}
                loading={loading}
                onToggle={toggleTahajjud}
                onFetchPrayerTimes={initializePrayerTimes}
              />

              <QailulahCard
                settings={qailulahSettings}
                recommendedTime={getRecommendedQailulahTime()}
                onUpdateSettings={updateQailulah}
              />
            </TabsContent>

            <TabsContent value="alarms" className="space-y-4">
              <AlarmsCard
                prayerTimes={prayerTimes}
                location={location}
                onSearchCity={searchCity}
                onSetLocation={setManualLocation}
                onResetLocation={resetToAutoLocation}
                getTimeBeforeFajr={getTimeBeforeFajr}
              />
            </TabsContent>
          </Tabs>
        </main>

        {/* Quranic verse footer */}
        <footer className="px-6 mt-8 text-center">
          <p className="font-arabic text-gold/60 text-lg mb-2">
            وَهُوَ الَّذِي جَعَلَ لَكُمُ اللَّيْلَ لِبَاسًا وَالنَّوْمَ سُبَاتًا
          </p>
          <p className="text-cream-dim text-sm italic">
            "And it is He who has made the night for you as clothing and sleep [a means for] rest"
          </p>
          <a 
            href="https://quran.com/25/47"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground text-xs mt-1 mb-4 hover:text-gold transition-colors inline-block"
          >
            Surah Al-Furqan 25:47 →
          </a>
          
          {/* Footer links */}
          <nav className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-4" aria-label="Footer navigation">
            <Link to="/privacy" className="hover:text-gold transition-colors">Privacy</Link>
            <span aria-hidden="true">•</span>
            <Link to="/terms" className="hover:text-gold transition-colors">Terms</Link>
            <span aria-hidden="true">•</span>
            <Link to="/legal" className="hover:text-gold transition-colors">Legal</Link>
            {isMobile && (
              <>
                <span aria-hidden="true">•</span>
                <Link to="/install" className="hover:text-gold transition-colors flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  Install
                </Link>
              </>
            )}
          </nav>
          
          <p className="text-muted-foreground text-xs mt-3">
            Made with ❤️ by{' '}
            <a 
              href="https://ummah.build" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gold hover:underline inline-flex items-center gap-1"
            >
              Ummah.Build <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </footer>
      </div>

      <CompletionCelebration isComplete={isFullyComplete} />
    </div>
  );
};

export default Index;
