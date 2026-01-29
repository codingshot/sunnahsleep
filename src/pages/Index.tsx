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
import { duas, lastTwoAyahBaqarah, threeQuls } from '@/data/checklistData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListChecks, BookOpen, Circle, Clock, Moon, BookOpenCheck, Bed, Bell, ExternalLink } from 'lucide-react';
import { useEffect } from 'react';

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
  const ishaItem = items.find(i => i.id === 'ayat-kursi'); // Using as proxy for bedtime prayers
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
        <div className="px-6">
          <Tabs defaultValue="checklist" className="w-full">
            <TabsList className="w-full mb-6 bg-secondary/50 border border-border p-1 grid grid-cols-5">
              <TabsTrigger
                value="checklist"
                className="data-[state=active]:bg-gold data-[state=active]:text-midnight text-xs"
              >
                <ListChecks className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger
                value="recitations"
                className="data-[state=active]:bg-gold data-[state=active]:text-midnight text-xs"
              >
                <BookOpenCheck className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger
                value="tasbih"
                className="data-[state=active]:bg-gold data-[state=active]:text-midnight text-xs"
              >
                <Circle className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger
                value="sleep"
                className="data-[state=active]:bg-gold data-[state=active]:text-midnight text-xs"
              >
                <Bed className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger
                value="alarms"
                className="data-[state=active]:bg-gold data-[state=active]:text-midnight text-xs"
              >
                <Bell className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="checklist" className="space-y-6">
              {/* Preparation */}
              <section>
                <h2 className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">
                  Preparation
                </h2>
                <div className="space-y-3">
                  {preparationItems.map((item) => (
                    <ChecklistCard key={item.id} item={item} onToggle={toggleItem} />
                  ))}
                </div>
              </section>

              {/* Position */}
              <section>
                <h2 className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">
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
              <section>
                <h2 className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">
                  Recitation
                </h2>
                <div className="space-y-3">
                  {recitationItems.map((item) => (
                    <ChecklistCard key={item.id} item={item} onToggle={toggleItem} />
                  ))}
                </div>
              </section>

              {/* Dhikr */}
              <section>
                <h2 className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">
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
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gold uppercase tracking-wider">
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
              </div>

              {/* Duas */}
              <div className="space-y-3 mt-6">
                <h3 className="text-sm font-semibold text-gold uppercase tracking-wider">
                  Bedtime Duas
                </h3>
                {duas.map((dua) => (
                  <DuaCard key={dua.id} dua={dua} />
                ))}
              </div>
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
                <p className="text-muted-foreground text-xs mt-2 italic">
                  Bukhari and Muslim
                </p>
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
        </div>

        {/* Quranic verse footer */}
        <footer className="px-6 mt-8 text-center">
          <p className="font-arabic text-gold/60 text-lg mb-2">
            وَهُوَ الَّذِي جَعَلَ لَكُمُ اللَّيْلَ لِبَاسًا وَالنَّوْمَ سُبَاتًا
          </p>
          <p className="text-cream-dim text-sm italic">
            "And it is He who has made the night for you as clothing and sleep [a means for] rest"
          </p>
          <p className="text-muted-foreground text-xs mt-1 mb-4">Surah Al-Furqan 25:47</p>
          
          {/* Footer links */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <Link to="/privacy" className="hover:text-gold transition-colors">Privacy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-gold transition-colors">Terms</Link>
            <span>•</span>
            <Link to="/legal" className="hover:text-gold transition-colors">Legal</Link>
          </div>
          
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
