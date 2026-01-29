import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, Moon, Heart, Sparkles, ChevronRight } from 'lucide-react';
import { blogArticles, getFeaturedArticles, BlogArticle } from '@/data/blogData';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

export default function Blog() {
  // Update document title for SEO
  useEffect(() => {
    document.title = 'Islamic Sleep Guide: Sunnah Sleep Articles & Prophetic Practices | SunnahSleep';
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Learn about Islamic sleep practices, Sunnah bedtime routines, and prophetic guidance for blessed rest. Articles on Tahajjud, Ayat al-Kursi, bedtime duas, and more.');
    }
    
    return () => {
      document.title = 'SunnahSleep - Islamic Bedtime Companion';
    };
  }, []);

  const featuredArticles = getFeaturedArticles();
  const regularArticles = blogArticles.filter(a => !a.featured);

  const categoryIcons: Record<BlogArticle['category'], React.ReactNode> = {
    sunnah: <Moon className="h-4 w-4" />,
    health: <Heart className="h-4 w-4" />,
    worship: <Sparkles className="h-4 w-4" />,
    guidance: <BookOpen className="h-4 w-4" />,
  };

  const categoryColors: Record<BlogArticle['category'], string> = {
    sunnah: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    health: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    worship: 'bg-gold/10 text-gold border-gold/20',
    guidance: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  const categoryLabels: Record<BlogArticle['category'], string> = {
    sunnah: 'Sunnah',
    health: 'Health',
    worship: 'Worship',
    guidance: 'Guidance',
  };

  return (
    <div className="min-h-screen bg-gradient-night islamic-pattern">
      <div className="max-w-4xl mx-auto pb-12">
        {/* Header */}
        <header className="px-4 sm:px-6 pt-6 pb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors mb-6 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to App
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gold/10">
              <BookOpen className="h-8 w-8 text-gold" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Islamic Sleep Guide</h1>
              <p className="text-sm text-cream-dim">Prophetic wisdom for blessed rest</p>
            </div>
          </div>

          <p className="text-cream-dim leading-relaxed max-w-2xl">
            Learn about the Sunnah sleep practices taught by Prophet Muhammad ﷺ. These articles 
            cover authentic bedtime duas, Quranic recitations, and Islamic guidance for restful, 
            blessed sleep backed by Hadith references.
          </p>
        </header>

        {/* Featured Articles */}
        <section className="px-4 sm:px-6 mb-10">
          <h2 className="text-sm font-semibold text-gold uppercase tracking-wider mb-4">
            Featured Articles
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {featuredArticles.map((article) => (
              <Link
                key={article.slug}
                to={`/blog/${article.slug}`}
                className="group block p-5 rounded-2xl bg-gradient-card border border-border hover:border-gold/30 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className={cn(
                    'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border',
                    categoryColors[article.category]
                  )}>
                    {categoryIcons[article.category]}
                    {categoryLabels[article.category]}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.readingTime} min
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-gold transition-colors line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-sm text-cream-dim line-clamp-3 mb-3">
                  {article.excerpt}
                </p>

                <span className="inline-flex items-center gap-1 text-sm text-gold">
                  Read article
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* All Articles */}
        <section className="px-4 sm:px-6">
          <h2 className="text-sm font-semibold text-gold uppercase tracking-wider mb-4">
            All Articles
          </h2>
          <div className="space-y-3">
            {regularArticles.map((article) => (
              <Link
                key={article.slug}
                to={`/blog/${article.slug}`}
                className="group flex items-start gap-4 p-4 rounded-xl bg-secondary/30 border border-border hover:border-gold/30 transition-all"
              >
                <div className={cn(
                  'flex-shrink-0 p-2 rounded-lg',
                  categoryColors[article.category].replace('text-', 'bg-').split(' ')[0]
                )}>
                  {categoryIcons[article.category]}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground group-hover:text-gold transition-colors line-clamp-1">
                    {article.title}
                  </h3>
                  <p className="text-sm text-cream-dim line-clamp-2 mt-1">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={cn(
                      'text-xs font-medium px-2 py-0.5 rounded-full border',
                      categoryColors[article.category]
                    )}>
                      {categoryLabels[article.category]}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readingTime} min read
                    </span>
                  </div>
                </div>

                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all flex-shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* SEO Footer Text */}
        <section className="px-4 sm:px-6 mt-12">
          <div className="p-6 rounded-2xl bg-secondary/20 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-3">About This Guide</h2>
            <p className="text-sm text-cream-dim leading-relaxed mb-4">
              The Islamic sleep guide provides authentic information about the Sunnah practices 
              of Prophet Muhammad ﷺ for bedtime. All articles include references to Sahih Hadith 
              collections including Bukhari, Muslim, and Tirmidhi. Topics covered include:
            </p>
            <ul className="text-sm text-cream-dim space-y-1 mb-4">
              <li>• Prophetic bedtime routine and wudu before sleep</li>
              <li>• Ayat al-Kursi and Quran recitation for protection</li>
              <li>• Tahajjud prayer and the last third of the night</li>
              <li>• Bedtime duas with Arabic text and translation</li>
              <li>• Qailulah (midday nap) and its benefits</li>
              <li>• Scientific validation of Sunnah sleep practices</li>
            </ul>
            <p className="text-xs text-muted-foreground">
              Part of SunnahSleep by Ummah.Build - helping Muslims follow the prophetic sleep routine.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-4 sm:px-6 mt-8 text-center">
          <Link to="/" className="text-gold hover:underline text-sm">
            ← Return to SunnahSleep App
          </Link>
        </footer>
      </div>
    </div>
  );
}
