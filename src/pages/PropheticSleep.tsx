import { Link } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import { 
  Moon, Home, ChevronRight, BookOpen, Bed, 
  Heart, CheckCircle2, ArrowRight, ExternalLink,
  Sparkles, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// SEO metadata
const SEO = {
  title: "How the Prophet ﷺ Slept: Bedding, Miswak & Complete Sunnah Guide",
  description: "Learn authentic details of how Prophet Muhammad ﷺ slept including his bedding, use of miswak, sleeping position, and bedtime practices with verified Hadith references.",
  keywords: [
    "how prophet muhammad slept",
    "prophetic bedding sunnah",
    "miswak before sleep",
    "islamic sleep practices",
    "sunnah bedtime routine",
    "prophet sleeping position",
    "muslim sleep guide"
  ]
};

interface HadithProps {
  arabic: string;
  english: string;
  source: string;
  narrator: string;
  link?: string;
}

const HadithCard = ({ arabic, english, source, narrator, link }: HadithProps) => (
  <Card className="border-gold/20 bg-gradient-to-br from-gold/5 to-transparent">
    <CardContent className="p-4 space-y-3">
      <p className="font-arabic text-lg text-gold leading-relaxed text-right" dir="rtl">
        {arabic}
      </p>
      <p className="text-cream-dim text-sm italic">
        "{english}"
      </p>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Narrator: {narrator}</span>
        {link ? (
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gold hover:underline flex items-center gap-1"
          >
            {source} <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-gold">{source}</span>
        )}
      </div>
    </CardContent>
  </Card>
);

interface ChecklistItemProps {
  title: string;
  description: string;
  hadith?: string;
}

const SunnahChecklist = ({ items }: { items: ChecklistItemProps[] }) => (
  <div className="space-y-2">
    {items.map((item, idx) => (
      <div key={idx} className="flex gap-3 p-3 rounded-lg bg-secondary/30 border border-gold/10">
        <CheckCircle2 className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-foreground">{item.title}</h4>
          <p className="text-sm text-cream-dim">{item.description}</p>
          {item.hadith && (
            <p className="text-xs text-gold mt-1 italic">{item.hadith}</p>
          )}
        </div>
      </div>
    ))}
  </div>
);

export default function PropheticSleep() {
  usePageMeta({
    title: SEO.title,
    description: SEO.description,
    canonical: 'https://sunnahsleep.app/prophetic-sleep',
    keywords: SEO.keywords,
  });

  const beddingChecklistItems: ChecklistItemProps[] = [
    {
      title: "Use simple, clean bedding",
      description: "The Prophet ﷺ slept on a straw mat or leather mattress stuffed with palm fiber",
      hadith: "Sahih al-Bukhari 6456"
    },
    {
      title: "Dust the bed three times",
      description: "Shake off your bedding before lying down to remove dust and insects",
      hadith: "Sahih al-Bukhari 6320"
    },
    {
      title: "Avoid sleeping on your stomach",
      description: "The Prophet ﷺ forbade sleeping on the stomach, calling it the way of the people of Hellfire",
      hadith: "Sunan Ibn Majah 3723"
    },
    {
      title: "Sleep on your right side",
      description: "Place your right hand under your right cheek as the Prophet ﷺ did",
      hadith: "Sahih al-Bukhari 6315"
    }
  ];

  const miswakChecklistItems: ChecklistItemProps[] = [
    {
      title: "Use miswak upon waking",
      description: "The Prophet ﷺ would clean his mouth with miswak whenever he woke up at night",
      hadith: "Sahih al-Bukhari 245"
    },
    {
      title: "Use miswak before prayer",
      description: "It is sunnah to use miswak before every prayer and when entering the home",
      hadith: "Sahih Muslim 252"
    },
    {
      title: "Miswak before reciting Quran",
      description: "Clean your mouth before reciting the words of Allah",
      hadith: "Recommended by scholars"
    }
  ];

  const additionalTips: ChecklistItemProps[] = [
    {
      title: "Perform Wudu before sleeping",
      description: "Sleep in a state of ritual purity as the Prophet ﷺ instructed",
      hadith: "Sahih al-Bukhari 247"
    },
    {
      title: "Recite Ayat al-Kursi",
      description: "An angel will guard you and no devil will approach until morning",
      hadith: "Sahih al-Bukhari 5010"
    },
    {
      title: "Recite the Three Quls",
      description: "Blow into your hands and wipe over your body three times",
      hadith: "Sahih al-Bukhari 5017"
    },
    {
      title: "Complete Tasbih Fatimah",
      description: "Say SubhanAllah 33x, Alhamdulillah 33x, Allahu Akbar 34x",
      hadith: "Sahih al-Bukhari 6318"
    },
    {
      title: "Sleep early after Isha",
      description: "The Prophet ﷺ disliked staying up after Isha prayer",
      hadith: "Sahih al-Bukhari 568"
    },
    {
      title: "Wake for Tahajjud",
      description: "The last third of the night is when Allah descends to answer prayers",
      hadith: "Sahih al-Bukhari 1145"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": SEO.title,
          "description": SEO.description,
          "keywords": SEO.keywords.join(", "),
          "author": {
            "@type": "Organization",
            "name": "SunnahSleep"
          },
          "publisher": {
            "@type": "Organization",
            "name": "SunnahSleep",
            "logo": {
              "@type": "ImageObject",
              "url": "https://sunnahsleep.app/icon-512.png"
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://sunnahsleep.app/prophetic-sleep"
          }
        })
      }} />

      {/* HowTo Schema for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "How to Sleep Like the Prophet Muhammad ﷺ",
          "description": "Step-by-step guide to following the Prophetic Sunnah for blessed sleep",
          "step": [
            {
              "@type": "HowToStep",
              "name": "Perform Wudu",
              "text": "Perform ablution before going to bed as instructed by the Prophet ﷺ"
            },
            {
              "@type": "HowToStep",
              "name": "Use Miswak",
              "text": "Clean your teeth with miswak for oral hygiene and spiritual reward"
            },
            {
              "@type": "HowToStep",
              "name": "Dust Your Bed",
              "text": "Shake off your bedding three times before lying down"
            },
            {
              "@type": "HowToStep",
              "name": "Sleep on Right Side",
              "text": "Lie on your right side with your right hand under your cheek"
            },
            {
              "@type": "HowToStep",
              "name": "Recite Protection",
              "text": "Recite Ayat al-Kursi, the Three Quls, and bedtime duas"
            }
          ]
        })
      }} />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gold hover:text-gold/80 transition-colors">
            <Home className="h-5 w-5" />
            <span className="font-semibold hidden sm:inline">Back to App</span>
          </Link>
          <div className="flex items-center gap-2">
            <Moon className="h-6 w-6 text-gold" />
            <span className="font-arabic text-lg sm:text-xl text-gradient-gold">نوم النبي</span>
          </div>
          <Link to="/guides">
            <Button variant="outline" size="sm" className="border-gold/30 hover:border-gold">
              <BookOpen className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Guides</span>
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-gold">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">How the Prophet ﷺ Slept</span>
        </nav>

        {/* Hero Section */}
        <header className="text-center mb-8 sm:mb-12">
          <Badge className="mb-4 bg-gold/10 text-gold border-gold/30">
            <Sparkles className="h-3 w-3 mr-1" />
            Authentic Sunnah Guide
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-gold mb-4 leading-tight">
            How the Prophet ﷺ Slept
          </h1>
          <p className="font-arabic text-xl sm:text-2xl text-gold mb-4">
            كيف نام النبي صلى الله عليه وسلم
          </p>
          <p className="text-base sm:text-lg text-cream-dim max-w-2xl mx-auto">
            Discover the authentic bedtime practices of Prophet Muhammad ﷺ — his bedding, use of miswak, sleeping position, and complete nightly routine with verified Hadith references.
          </p>
        </header>

        {/* Table of Contents */}
        <nav className="mb-8 sm:mb-12">
          <Card className="border-gold/20 bg-secondary/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-gold" />
                Contents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid sm:grid-cols-2 gap-2 text-sm">
                {[
                  { id: 'bedding', title: "The Prophet's ﷺ Bedding" },
                  { id: 'miswak', title: "Miswak (Teeth Cleaning)" },
                  { id: 'sleeping-position', title: "Sleeping Position" },
                  { id: 'bedtime-routine', title: "Complete Bedtime Routine" },
                  { id: 'checklist', title: "Sunnah Sleep Checklist" },
                ].map(item => (
                  <li key={item.id}>
                    <a 
                      href={`#${item.id}`} 
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gold/10 text-cream-dim hover:text-gold transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </nav>

        {/* Main Content */}
        <article className="space-y-10 sm:space-y-12">
          
          {/* Section 1: Bedding */}
          <section id="bedding" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gold/10">
                <Bed className="h-6 w-6 text-gold" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  The Prophet's ﷺ Bedding
                </h2>
                <p className="font-arabic text-gold">فراش النبي</p>
              </div>
            </div>
            
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-cream-dim">
                The Prophet Muhammad ﷺ lived a life of remarkable simplicity, and his bedding reflected this humility. Despite being the leader of the Muslim community, his sleeping arrangements were modest and unassuming.
              </p>
              
              <HadithCard
                arabic="كَانَ فِرَاشُ رَسُولِ اللَّهِ صلى الله عليه وسلم مِنْ أَدَمٍ حَشْوُهُ لِيفٌ"
                english="The mattress of the Messenger of Allah ﷺ was made of leather stuffed with palm fiber."
                source="Sahih al-Bukhari 6456"
                narrator="Aisha رضي الله عنها"
                link="https://sunnah.com/bukhari:6456"
              />
              
              <p className="text-cream-dim">
                Aisha رضي الله عنها also reported that the Prophet ﷺ would sometimes sleep on a simple mat made of palm leaves or straw. When asked about his simple bedding, he said that the world is like a tree under which a traveler takes shade, then moves on.
              </p>
              
              <HadithCard
                arabic="مَا لِي وَلِلدُّنْيَا إِنَّمَا مَثَلِي وَمَثَلُ الدُّنْيَا كَمَثَلِ رَاكِبٍ قَالَ فِي ظِلِّ شَجَرَةٍ ثُمَّ رَاحَ وَتَرَكَهَا"
                english="What have I to do with the world? My example and that of the world is like a rider who rests in the shade of a tree, then moves on and leaves it."
                source="Sunan Ibn Majah 4109"
                narrator="Abdullah ibn Mas'ud رضي الله عنه"
                link="https://sunnah.com/ibnmajah:4109"
              />
              
              <Card className="border-gold/20 bg-gold/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Modern Application</h4>
                      <p className="text-sm text-cream-dim">
                        While we don't need to sleep on straw mats today, this teaches us to avoid excessive luxury in bedding. A firm, clean mattress that supports good sleep is sufficient. The emphasis is on cleanliness and simplicity rather than extravagance.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <SunnahChecklist items={beddingChecklistItems} />
            </div>
          </section>

          {/* Section 2: Miswak */}
          <section id="miswak" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gold/10">
                <Sparkles className="h-6 w-6 text-gold" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  Miswak: The Prophetic Toothbrush
                </h2>
                <p className="font-arabic text-gold">السواك</p>
              </div>
            </div>
            
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-cream-dim">
                The <strong>miswak</strong> (also called siwak) is a teeth-cleaning twig made from the Salvadora persica tree. The Prophet ﷺ emphasized its use regularly, especially upon waking from sleep.
              </p>
              
              <HadithCard
                arabic="كَانَ النَّبِيُّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ إِذَا قَامَ مِنَ اللَّيْلِ يَشُوصُ فَاهُ بِالسِّوَاكِ"
                english="When the Prophet ﷺ got up at night (for Tahajjud), he would clean his mouth with the miswak."
                source="Sahih al-Bukhari 245"
                narrator="Hudhaifa رضي الله عنه"
                link="https://sunnah.com/bukhari:245"
              />
              
              <p className="text-cream-dim">
                The Prophet ﷺ held the miswak in such high regard that he said he would have made it obligatory if it were not too difficult for his Ummah:
              </p>
              
              <HadithCard
                arabic="لَوْلاَ أَنْ أَشُقَّ عَلَى أُمَّتِي لأَمَرْتُهُمْ بِالسِّوَاكِ عِنْدَ كُلِّ صَلاَةٍ"
                english="Were it not that I would cause hardship to my Ummah, I would have commanded them to use the miswak before every prayer."
                source="Sahih al-Bukhari 887, Sahih Muslim 252"
                narrator="Abu Hurairah رضي الله عنه"
                link="https://sunnah.com/bukhari:887"
              />
              
              <Card className="border-gold/20 bg-gold/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Scientific Benefits of Miswak</h4>
                      <ul className="text-sm text-cream-dim space-y-1 list-disc list-inside">
                        <li>Contains natural antibacterial compounds</li>
                        <li>High fluoride content strengthens enamel</li>
                        <li>Contains silica which whitens teeth</li>
                        <li>Stimulates saliva production reducing dry mouth</li>
                        <li>WHO recommends miswak for oral hygiene</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <HadithCard
                arabic="السِّوَاكُ مَطْهَرَةٌ لِلْفَمِ مَرْضَاةٌ لِلرَّبِّ"
                english="The miswak is a means of purifying the mouth and pleasing the Lord."
                source="Sunan an-Nasa'i 5"
                narrator="Aisha رضي الله عنها"
                link="https://sunnah.com/nasai:5"
              />

              <SunnahChecklist items={miswakChecklistItems} />
            </div>
          </section>

          {/* Section 3: Sleeping Position */}
          <section id="sleeping-position" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gold/10">
                <Heart className="h-6 w-6 text-gold" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  The Sunnah Sleeping Position
                </h2>
                <p className="font-arabic text-gold">النوم على الشق الأيمن</p>
              </div>
            </div>
            
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-cream-dim">
                The Prophet ﷺ specifically instructed Muslims to sleep on their <strong>right side</strong>, with the right hand placed under the right cheek. This position has both spiritual significance and health benefits confirmed by modern medicine.
              </p>
              
              <HadithCard
                arabic="إِذَا أَتَيْتَ مَضْجَعَكَ فَتَوَضَّأْ وُضُوءَكَ لِلصَّلاَةِ ثُمَّ اضْطَجِعْ عَلَى شِقِّكَ الأَيْمَنِ"
                english="When you go to your bed, perform ablution like that for the prayer, then lie down on your right side."
                source="Sahih al-Bukhari 247, Sahih Muslim 2710"
                narrator="Al-Bara' bin 'Azib رضي الله عنه"
                link="https://sunnah.com/bukhari:247"
              />
              
              <p className="text-cream-dim">
                The Prophet ﷺ also warned against sleeping on the stomach, as it is disliasing to Allah:
              </p>
              
              <HadithCard
                arabic="إِنَّ هَذِهِ ضِجْعَةٌ يُبْغِضُهَا اللَّهُ"
                english="This is a way of lying down that Allah dislikes."
                source="Sunan Abu Dawud 5040"
                narrator="Abu Dharr رضي الله عنه"
                link="https://sunnah.com/abudawud:5040"
              />
              
              <Card className="border-gold/20 bg-gold/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Health Benefits of Right-Side Sleeping</h4>
                      <ul className="text-sm text-cream-dim space-y-1 list-disc list-inside">
                        <li><strong>Heart health:</strong> Reduces pressure on the heart</li>
                        <li><strong>Digestion:</strong> Stomach empties more efficiently due to its position</li>
                        <li><strong>Acid reflux:</strong> Reduces symptoms by positioning stomach below esophagus</li>
                        <li><strong>Breathing:</strong> Airways remain clearer, reducing snoring</li>
                        <li><strong>Lymphatic drainage:</strong> Aids the body's detoxification process</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section 4: Complete Bedtime Routine */}
          <section id="bedtime-routine" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gold/10">
                <Moon className="h-6 w-6 text-gold" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  Complete Bedtime Routine
                </h2>
                <p className="font-arabic text-gold">الروتين الكامل قبل النوم</p>
              </div>
            </div>
            
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-cream-dim">
                Beyond the physical aspects, the Prophet ﷺ established a comprehensive spiritual bedtime routine that includes purification, recitations, and supplications.
              </p>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="step1" className="border-gold/20">
                  <AccordionTrigger className="text-foreground hover:text-gold">
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-gold/20 text-gold text-xs flex items-center justify-center">1</span>
                      Pray Isha & Sleep Early
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-cream-dim">
                    <p className="mb-2">
                      The Prophet ﷺ disliked conversation after Isha prayer and would go to bed early. This allows for waking up refreshed for Tahajjud and Fajr.
                    </p>
                    <HadithCard
                      arabic="كَانَ يَكْرَهُ النَّوْمَ قَبْلَهَا وَالْحَدِيثَ بَعْدَهَا"
                      english="He (the Prophet ﷺ) used to dislike sleeping before Isha and talking after it."
                      source="Sahih al-Bukhari 568"
                      narrator="Abu Barza رضي الله عنه"
                      link="https://sunnah.com/bukhari:568"
                    />
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="step2" className="border-gold/20">
                  <AccordionTrigger className="text-foreground hover:text-gold">
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-gold/20 text-gold text-xs flex items-center justify-center">2</span>
                      Perform Wudu Before Bed
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-cream-dim">
                    <p className="mb-2">
                      Sleeping in a state of ritual purity is highly recommended. It ensures that if one dies in their sleep, they meet Allah in a purified state.
                    </p>
                    <Link to="/wudu">
                      <Button variant="outline" size="sm" className="mt-2 border-gold/30 text-gold hover:bg-gold/10">
                        Learn How to Perform Wudu →
                      </Button>
                    </Link>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="step3" className="border-gold/20">
                  <AccordionTrigger className="text-foreground hover:text-gold">
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-gold/20 text-gold text-xs flex items-center justify-center">3</span>
                      Dust the Bed & Lie on Right Side
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-cream-dim">
                    <p>
                      Shake off your bed covering three times with the edge of your garment to remove any dust or insects. Then lie down on your right side with your right hand under your cheek.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="step4" className="border-gold/20">
                  <AccordionTrigger className="text-foreground hover:text-gold">
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-gold/20 text-gold text-xs flex items-center justify-center">4</span>
                      Recite Quranic Verses
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-cream-dim">
                    <ul className="space-y-2">
                      <li>• <strong>Ayat al-Kursi</strong> (2:255) - An angel guards you until morning</li>
                      <li>• <strong>Last two verses of Al-Baqarah</strong> (2:285-286) - They will suffice you</li>
                      <li>• <strong>Three Quls</strong> - Al-Ikhlas, Al-Falaq, An-Nas (3 times each, blow into hands and wipe over body)</li>
                    </ul>
                    <Link to="/?tab=recitations">
                      <Button variant="outline" size="sm" className="mt-3 border-gold/30 text-gold hover:bg-gold/10">
                        Listen to Recitations →
                      </Button>
                    </Link>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="step5" className="border-gold/20">
                  <AccordionTrigger className="text-foreground hover:text-gold">
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-gold/20 text-gold text-xs flex items-center justify-center">5</span>
                      Complete Tasbih & Duas
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-cream-dim">
                    <p className="mb-2">
                      Complete the Tasbih of Fatimah (SubhanAllah 33x, Alhamdulillah 33x, Allahu Akbar 34x) and say the bedtime dua: "Bismika Allahumma amutu wa ahya."
                    </p>
                    <Link to="/?tab=tasbih">
                      <Button variant="outline" size="sm" className="mt-2 border-gold/30 text-gold hover:bg-gold/10">
                        Use Tasbih Counter →
                      </Button>
                    </Link>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </section>

          {/* Section 5: Complete Checklist */}
          <section id="checklist" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gold/10">
                <CheckCircle2 className="h-6 w-6 text-gold" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  Complete Sunnah Sleep Checklist
                </h2>
                <p className="font-arabic text-gold">قائمة النوم السني</p>
              </div>
            </div>
            
            <SunnahChecklist items={additionalTips} />
            
            <div className="mt-6">
              <Link to="/?tab=checklist">
                <Button className="w-full bg-gold text-background hover:bg-gold/90">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Open Interactive Checklist
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </section>
        </article>

        {/* Related Resources */}
        <section className="mt-12 sm:mt-16">
          <h2 className="text-xl font-bold text-foreground mb-4">Related Resources</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/wudu" className="block">
              <Card className="border-gold/10 hover:border-gold/30 transition-colors h-full">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gold/10 text-gold">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">Wudu Guide</h3>
                    <p className="text-xs text-cream-dim">Complete ablution instructions</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/blog/tahajjud-prayer-last-third-night" className="block">
              <Card className="border-gold/10 hover:border-gold/30 transition-colors h-full">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gold/10 text-gold">
                    <Moon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">Tahajjud Prayer</h3>
                    <p className="text-xs text-cream-dim">Night prayer guide</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/blog/prophetic-sleep-routine-complete-guide" className="block">
              <Card className="border-gold/10 hover:border-gold/30 transition-colors h-full">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gold/10 text-gold">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">Sleep Routine Guide</h3>
                    <p className="text-xs text-cream-dim">Complete prophetic routine</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/guides" className="block">
              <Card className="border-gold/10 hover:border-gold/30 transition-colors h-full">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gold/10 text-gold">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">App User Guides</h3>
                    <p className="text-xs text-cream-dim">Learn all app features</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 text-center py-10 sm:py-12 px-4 sm:px-6 rounded-2xl bg-gradient-to-br from-gold/10 to-primary/10 border border-gold/20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gradient-gold mb-4 font-arabic">
            Start Your Sunnah Sleep Journey
          </h2>
          <p className="text-cream-dim mb-6 sm:mb-8 max-w-lg mx-auto text-sm sm:text-base">
            Follow the blessed example of Prophet Muhammad ﷺ tonight with our interactive checklist
          </p>
          
          <Link to="/?tab=checklist">
            <Button size="lg" className="bg-gold text-background hover:bg-gold/90">
              <Moon className="h-5 w-5 mr-2" />
              Open SunnahSleep
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </section>

        {/* Footer */}
        <footer className="text-center mt-12 py-6 border-t border-border">
          <p className="font-arabic text-lg text-muted-foreground">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            All hadith references verified from Sunnah.com and authentic collections
          </p>
        </footer>
      </main>
    </div>
  );
}
