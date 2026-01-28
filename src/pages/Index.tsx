import { Header } from '@/components/Header';
import { ProgressRing } from '@/components/ProgressRing';
import { ChecklistCard } from '@/components/ChecklistCard';
import { TasbihCounter } from '@/components/TasbihCounter';
import { DuaCard } from '@/components/DuaCard';
import { AyatKursiCard } from '@/components/AyatKursiCard';
import { CompletionCelebration } from '@/components/CompletionCelebration';
import { useChecklist } from '@/hooks/useChecklist';
import { duas } from '@/data/checklistData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListChecks, BookOpen, Circle } from 'lucide-react';

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

  // Group items by category
  const preparationItems = items.filter((i) => i.category === 'preparation');
  const recitationItems = items.filter((i) => i.category === 'recitation');
  const dhikrItems = items.filter((i) => i.category === 'dhikr');

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
            <TabsList className="w-full mb-6 bg-secondary/50 border border-border p-1">
              <TabsTrigger
                value="checklist"
                className="flex-1 data-[state=active]:bg-gold data-[state=active]:text-midnight"
              >
                <ListChecks className="h-4 w-4 mr-2" />
                Checklist
              </TabsTrigger>
              <TabsTrigger
                value="duas"
                className="flex-1 data-[state=active]:bg-gold data-[state=active]:text-midnight"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Duas
              </TabsTrigger>
              <TabsTrigger
                value="tasbih"
                className="flex-1 data-[state=active]:bg-gold data-[state=active]:text-midnight"
              >
                <Circle className="h-4 w-4 mr-2" />
                Tasbih
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

            <TabsContent value="duas" className="space-y-4">
              <AyatKursiCard />
              {duas.map((dua) => (
                <DuaCard key={dua.id} dua={dua} />
              ))}
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
          </Tabs>
        </div>

        {/* Quranic verse footer */}
        <div className="px-6 mt-8 text-center">
          <p className="font-arabic text-gold/60 text-lg mb-2">
            وَهُوَ الَّذِي جَعَلَ لَكُمُ اللَّيْلَ لِبَاسًا وَالنَّوْمَ سُبَاتًا
          </p>
          <p className="text-cream-dim text-sm italic">
            "And it is He who has made the night for you as clothing and sleep [a means for] rest"
          </p>
          <p className="text-muted-foreground text-xs mt-1">Surah Al-Furqan 25:47</p>
        </div>
      </div>

      <CompletionCelebration isComplete={isFullyComplete} />
    </div>
  );
};

export default Index;
