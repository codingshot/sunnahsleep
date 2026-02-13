import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { QuranSleepPlayer } from '@/components/QuranSleepPlayer';
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
import { SleepTimeCalculator } from '@/components/SleepTimeCalculator';
import { SleepScheduleInfo } from '@/components/SleepScheduleInfo';
import { AlarmsCard } from '@/components/AlarmsCard';
import { CompletionCelebration } from '@/components/CompletionCelebration';
import { useChecklist } from '@/hooks/useChecklist';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useAlarms } from '@/hooks/useAlarms';
import { duas, lastTwoAyahBaqarah, threeQuls } from '@/data/checklistData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListChecks, BookOpen, Circle, Bed, Bell, ExternalLink, Download, Droplets, Plus, Clock, Moon, Headphones } from 'lucide-react';
import { CountdownTimer } from '@/components/CountdownTimer';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const VALID_TABS = ['checklist', 'recitations', 'tasbih', 'sleep', 'alarms'] as const;
type TabValue = typeof VALID_TABS[number];

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') as TabValue | null;
  const initialTab = tabFromUrl && VALID_TABS.includes(tabFromUrl) ? tabFromUrl : 'checklist';
  const [activeTab, setActiveTab] = useState<TabValue>(initialTab);
  const [showQuranPlayer, setShowQuranPlayer] = useState(false);

  // Sync tab changes to URL
  const handleTabChange = (value: string) => {
    const newTab = value as TabValue;
    setActiveTab(newTab);
    if (newTab === 'checklist') {
      searchParams.delete('tab');
    } else {
      searchParams.set('tab', newTab);
    }
    setSearchParams(searchParams, { replace: true });
  };

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
    previewPrayerTimes,
  } = usePrayerTimes();

  const { 
    alarms, 
    updateAlarm, 
    toggleAlarm, 
    deleteAlarm,
    upcomingAlarms,
    nextAlarm,
    settings,
    requestNotificationPermission,
    createPrayerAlarm,
  } = useAlarms();
  const enabledAlarmsCount = alarms.filter(a => a.enabled).length;

  // Format alarms for location dialog
  const alarmInfoList = alarms.map(a => ({
    id: a.id,
    name: a.name,
    time: a.time,
    type: a.type,
  }));

  // Handle updating alarms when location changes
  const handleUpdateAlarms = (newPrayerTimes: { fajr: string; isha: string }) => {
    alarms.forEach(alarm => {
      if (alarm.type === 'fajr') {
        updateAlarm(alarm.id, { time: newPrayerTimes.fajr });
      } else if (alarm.type === 'isha') {
        updateAlarm(alarm.id, { time: newPrayerTimes.isha });
      } else if (alarm.type === 'fajr-before' && alarm.beforeFajrMinutes) {
        const [h, m] = newPrayerTimes.fajr.split(':').map(Number);
        const fajrDate = new Date();
        fajrDate.setHours(h, m - alarm.beforeFajrMinutes, 0, 0);
        const newTime = `${fajrDate.getHours().toString().padStart(2, '0')}:${fajrDate.getMinutes().toString().padStart(2, '0')}`;
        updateAlarm(alarm.id, { time: newTime });
      }
    });
  };

  // Auto-initialize prayer times on mount
  useEffect(() => {
    if (!prayerTimes) {
      initializePrayerTimes();
    }
  }, [prayerTimes, initializePrayerTimes]);

  // Group items by phase
  const eveningItems = items.filter((i) => i.phase === 'evening');
  const bedtimeItems = items.filter((i) => i.phase === 'bedtime');
  const morningItems = items.filter((i) => i.phase === 'morning');

  // Legacy groupings for other parts
  const preparationItems = items.filter((i) => i.category === 'preparation');
  const recitationItems = items.filter((i) => i.category === 'recitation');
  const dhikrItems = items.filter((i) => i.category === 'dhikr');

  // Check if Isha is completed
  const ishaItem = items.find(i => i.id === 'pray-isha');
  const isIshaCompleted = ishaItem?.completed || false;

  return (
    <div className="min-h-screen bg-gradient-night islamic-pattern">
      <div className="max-w-lg mx-auto pb-8">
        <Header 
          streak={streak}
          alarms={alarms}
          upcomingAlarms={upcomingAlarms}
          nextAlarm={nextAlarm}
          onToggleAlarm={toggleAlarm}
          onDeleteAlarm={deleteAlarm}
          notificationsEnabled={settings.notificationsEnabled}
          onRequestNotifications={requestNotificationPermission}
        />

        {/* Progress Section with Sleep Schedule */}
        <div className="px-6 mb-8">
          <div className="flex items-center gap-4">
            {/* Progress Ring - Left Side */}
            <div className="flex-shrink-0">
              <ProgressRing progress={progressPercentage} />
            </div>
            
            {/* Sleep Schedule Info - Right Side */}
            {prayerTimes && (
              <div className="flex-1 min-w-0">
                <SleepScheduleInfo 
                  prayerTimes={prayerTimes} 
                  location={location}
                  alarms={alarmInfoList}
                  onSearchCity={searchCity}
                  onSetLocation={setManualLocation}
                  onResetLocation={resetToAutoLocation}
                  onUpdateAlarms={handleUpdateAlarms}
                  getNewPrayerTimes={previewPrayerTimes}
                />
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <main className="px-6">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
              {/* Step 1: Pray Isha */}
              <section aria-labelledby="isha-heading">
                <div className="flex items-center justify-between mb-3">
                  <h2 id="isha-heading" className="text-sm font-semibold text-gold uppercase tracking-wider flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gold/20 text-gold text-xs flex items-center justify-center">1</span>
                    Pray Isha
                  </h2>
                  {prayerTimes && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-cream-dim">
                        {prayerTimes.isha}
                      </span>
                      <CountdownTimer targetTime={prayerTimes.isha} />
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {eveningItems.map((item) => (
                    <div key={item.id}>
                      <ChecklistCard item={item} onToggle={toggleItem} />
                      {item.linkedAlarmType && (
                        <button
                          onClick={() => {
                            const alarmsTab = document.querySelector('[value="alarms"]') as HTMLButtonElement;
                            alarmsTab?.click();
                          }}
                          className="mt-2 text-xs text-gold/70 hover:text-gold flex items-center gap-1 transition-colors"
                        >
                          <Bell className="h-3 w-3" />
                          Set Isha alarm reminder
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Step 2: Preparation (Bedtime) */}
              <section aria-labelledby="preparation-heading">
                <div className="flex items-center justify-between mb-3">
                  <h2 id="preparation-heading" className="text-sm font-semibold text-gold uppercase tracking-wider flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gold/20 text-gold text-xs flex items-center justify-center">2</span>
                    <Moon className="h-4 w-4" />
                    Bedtime Preparation
                  </h2>
                  {prayerTimes && (() => {
                    // Calculate bedtime (30 min after Isha)
                    const [h, m] = prayerTimes.isha.split(':').map(Number);
                    const bedtime = new Date();
                    bedtime.setHours(h, m + 30, 0, 0);
                    const bedtimeStr = `${bedtime.getHours().toString().padStart(2, '0')}:${bedtime.getMinutes().toString().padStart(2, '0')}`;
                    return (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-cream-dim">
                          Bed: {bedtime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </span>
                        <CountdownTimer targetTime={bedtimeStr} />
                      </div>
                    );
                  })()}
                </div>
                <div className="space-y-3">
                  {bedtimeItems.filter(i => i.category === 'preparation' || i.category === 'position').map((item) => (
                    <div key={item.id}>
                      <ChecklistCard item={item} onToggle={toggleItem} />
                      {item.id === 'wudu' && (
                        <Link to="/wudu">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-2 text-gold hover:bg-gold/10 w-full justify-start"
                          >
                            <Droplets className="h-4 w-4 mr-2" />
                            Learn How to Perform Wudu →
                          </Button>
                        </Link>
                      )}
                      {item.id === 'right-side' && (
                        <Link to="/prophetic-sleep">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-2 text-gold hover:bg-gold/10 w-full justify-start"
                          >
                            <Moon className="h-4 w-4 mr-2" />
                            Learn How the Prophet ﷺ Slept →
                          </Button>
                        </Link>
                      )}
                    </div>
                  ))}
                  {/* Quick links to related resources */}
                  <div className="pt-2 flex flex-wrap gap-2">
                    <Link to="/prophetic-sleep#miswak">
                      <Button variant="outline" size="sm" className="text-xs border-gold/20 text-cream-dim hover:text-gold hover:border-gold/40">
                        Miswak Guide
                      </Button>
                    </Link>
                    <Link to="/prophetic-sleep#bedding">
                      <Button variant="outline" size="sm" className="text-xs border-gold/20 text-cream-dim hover:text-gold hover:border-gold/40">
                        Prophet's ﷺ Bedding
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowQuranPlayer(true)}
                      className="text-xs border-gold/20 text-cream-dim hover:text-gold hover:border-gold/40 gap-1"
                    >
                      <Headphones className="h-3.5 w-3.5" />
                      Play Quran for Sleep
                    </Button>
                  </div>
                </div>
              </section>

              {/* Step 3: Recitations */}
              <section aria-labelledby="recitation-heading">
                <div className="flex items-center justify-between mb-3">
                  <h2 id="recitation-heading" className="text-sm font-semibold text-gold uppercase tracking-wider flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gold/20 text-gold text-xs flex items-center justify-center">3</span>
                    Recitations
                  </h2>
                </div>
                <div className="space-y-3">
                  {bedtimeItems.filter(i => i.category === 'recitation').map((item) => (
                    <ChecklistCard key={item.id} item={item} onToggle={toggleItem} />
                  ))}
                </div>
              </section>

              {/* Step 4: Remembrance */}
              <section aria-labelledby="dhikr-heading">
                <div className="flex items-center justify-between mb-3">
                  <h2 id="dhikr-heading" className="text-sm font-semibold text-gold uppercase tracking-wider flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gold/20 text-gold text-xs flex items-center justify-center">4</span>
                    Remembrance
                  </h2>
                </div>
                <div className="space-y-3">
                  {bedtimeItems.filter(i => i.category === 'dhikr').map((item) => (
                    <ChecklistCard key={item.id} item={item} onToggle={toggleItem} />
                  ))}
                </div>
              </section>

              {/* Step 5: Wake Up Before Fajr */}
              <section aria-labelledby="morning-heading">
                <div className="flex items-center justify-between mb-3">
                  <h2 id="morning-heading" className="text-sm font-semibold text-gold uppercase tracking-wider flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gold/20 text-gold text-xs flex items-center justify-center">5</span>
                    Wake Up — Before Fajr
                  </h2>
                  {prayerTimes && (
                    <span className="text-xs text-cream-dim">
                      Fajr: {prayerTimes.fajr}
                    </span>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-gold/5 border border-gold/20 mb-3">
                  <p className="text-xs text-cream-dim mb-3">
                    💡 <span className="text-gold font-medium">Sunnah:</span> Wake in the last third of the night for Tahajjud when Allah descends to the lowest heaven and answers prayers.
                  </p>
                  {/* Quick-add Tahajjud alarm button */}
                  {prayerTimes && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const tahajjudTime = getTimeBeforeFajr(30);
                        if (tahajjudTime) {
                          // Check if alarm already exists
                          const existingAlarm = alarms.find(a => a.type === 'tahajjud');
                          if (existingAlarm) {
                            toast.info('Tahajjud alarm already set', {
                              description: `Alarm set for ${tahajjudTime}`,
                            });
                          } else {
                            createPrayerAlarm('tahajjud', tahajjudTime);
                            toast.success('Tahajjud alarm added!', {
                              description: `Alarm set for ${tahajjudTime} (30 min before Fajr)`,
                            });
                          }
                        }
                      }}
                      className="w-full border-gold/30 text-gold hover:bg-gold/10 gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      <Clock className="h-3.5 w-3.5" />
                      Quick Add Tahajjud Alarm
                      {prayerTimes && getTimeBeforeFajr(30) && (
                        <span className="text-xs opacity-70">({getTimeBeforeFajr(30)})</span>
                      )}
                    </Button>
                  )}
                </div>
                <div className="space-y-3">
                  {morningItems.map((item) => (
                    <div key={item.id}>
                      <ChecklistCard item={item} onToggle={toggleItem} />
                      {item.linkedAlarmType && (
                        <button
                          onClick={() => {
                            const alarmsTab = document.querySelector('[value="alarms"]') as HTMLButtonElement;
                            alarmsTab?.click();
                          }}
                          className="mt-2 text-xs text-gold/70 hover:text-gold flex items-center gap-1 transition-colors"
                        >
                          <Bell className="h-3 w-3" />
                          Set {item.linkedAlarmType === 'fajr' ? 'Fajr' : item.linkedAlarmType === 'tahajjud' ? 'Tahajjud' : 'wake'} alarm
                        </button>
                      )}
                    </div>
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
                      transliteration: qul.transliteration,
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
              {/* Sleep Time Calculator - Shows bedtime and wake time */}
              <SleepTimeCalculator
                prayerTimes={prayerTimes}
                location={location}
                alarms={alarmInfoList}
                onSearchCity={searchCity}
                onSetLocation={setManualLocation}
                onResetLocation={resetToAutoLocation}
                onUpdateAlarms={handleUpdateAlarms}
                getNewPrayerTimes={previewPrayerTimes}
              />

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
          <nav className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-4 flex-wrap" aria-label="Footer navigation">
            <Link to="/privacy" className="hover:text-gold transition-colors">Privacy</Link>
            <span aria-hidden="true">•</span>
            <Link to="/terms" className="hover:text-gold transition-colors">Terms</Link>
            <span aria-hidden="true">•</span>
            <Link to="/legal" className="hover:text-gold transition-colors">Legal</Link>
            <span aria-hidden="true">•</span>
            <Link to="/wudu" className="hover:text-gold transition-colors flex items-center gap-1">
              <Droplets className="h-3 w-3" />
              Wudu Guide
            </Link>
            <span aria-hidden="true">•</span>
            <Link to="/install" className="hover:text-gold transition-colors flex items-center gap-1">
              <Download className="h-3 w-3" />
              Install
            </Link>
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
      <QuranSleepPlayer isVisible={showQuranPlayer} onClose={() => setShowQuranPlayer(false)} />
    </div>
  );
};

export default Index;
