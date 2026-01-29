import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, ChevronRight } from 'lucide-react';
import { getBlogArticleBySlug, blogArticles, BlogArticle } from '@/data/blogData';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getBlogArticleBySlug(slug) : undefined;

  // Update document title and meta for SEO
  useEffect(() => {
    if (article) {
      document.title = article.metaTitle;
      
      // Update meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', article.metaDescription);
      }
    }
    
    return () => {
      document.title = 'SunnahSleep - Islamic Bedtime Companion';
    };
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-night islamic-pattern flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
          <Link to="/blog" className="text-gold hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const categoryColors: Record<BlogArticle['category'], string> = {
    sunnah: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    health: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    worship: 'bg-gold/10 text-gold border-gold/20',
    guidance: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  const categoryLabels: Record<BlogArticle['category'], string> = {
    sunnah: 'Sunnah Practices',
    health: 'Health & Science',
    worship: 'Worship & Prayer',
    guidance: 'Islamic Guidance',
  };

  // Get related articles
  const relatedArticles = blogArticles
    .filter(a => a.slug !== article.slug && a.category === article.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-night islamic-pattern">
      <article className="max-w-3xl mx-auto pb-12" itemScope itemType="https://schema.org/Article">
        {/* Header */}
        <header className="px-4 sm:px-6 pt-6 pb-8">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors mb-6 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Articles
          </Link>

          {/* Category Badge */}
          <div className="mb-4">
            <span className={cn('text-xs font-medium px-3 py-1 rounded-full border', categoryColors[article.category])}>
              {categoryLabels[article.category]}
            </span>
          </div>

          {/* Title */}
          <h1 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-4"
            itemProp="headline"
          >
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {article.readingTime} min read
            </span>
          </div>

          {/* Hidden SEO data */}
          <meta itemProp="description" content={article.metaDescription} />
          <span itemProp="author" itemScope itemType="https://schema.org/Organization" className="hidden">
            <meta itemProp="name" content="Ummah.Build" />
          </span>
        </header>

        {/* Table of Contents */}
        {article.tableOfContents.length > 0 && (
          <nav className="px-4 sm:px-6 mb-8" aria-label="Table of contents">
            <div className="p-4 rounded-xl bg-secondary/30 border border-border">
              <h2 className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">
                In This Article
              </h2>
              <ul className="space-y-2">
                {article.tableOfContents.map((item) => (
                  <li key={item.id}>
                    <a 
                      href={`#${item.id}`}
                      className="text-sm text-cream-dim hover:text-gold transition-colors flex items-center gap-2"
                    >
                      <ChevronRight className="h-3 w-3" />
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        )}

        {/* Content */}
        <div 
          className="px-4 sm:px-6 prose prose-invert prose-gold max-w-none"
          itemProp="articleBody"
        >
          <div 
            className="
              [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:scroll-mt-20
              [&_h3]:text-lg [&_h3]:sm:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-3
              [&_p]:text-cream-dim [&_p]:leading-relaxed [&_p]:mb-4 [&_p]:text-base [&_p]:sm:text-lg
              [&_strong]:text-gold [&_strong]:font-semibold
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-2
              [&_li]:text-cream-dim [&_li]:text-base [&_li]:sm:text-lg
              [&_blockquote]:border-l-4 [&_blockquote]:border-gold/50 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-cream-dim
              [&_a]:text-gold [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-gold/80
              [&_hr]:border-border [&_hr]:my-8
            "
            dangerouslySetInnerHTML={{ 
              __html: article.content
                .replace(/\{#([^}]+)\}/g, 'id="$1"')
                .replace(/\n/g, '<br />')
                .replace(/<br \/><br \/>/g, '</p><p>')
                .replace(/## ([^<]+)/g, '<h2>$1</h2>')
                .replace(/### ([^<]+)/g, '<h3>$1</h3>')
                .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                .replace(/\*([^*]+)\*/g, '<em>$1</em>')
                .replace(/- \*\*([^*]+)\*\*([^<]*)/g, '<li><strong>$1</strong>$2</li>')
                .replace(/- ([^<]+)/g, '<li>$1</li>')
                .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
            }}
          />
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <aside className="px-4 sm:px-6 mt-12">
            <h2 className="text-lg font-semibold text-foreground mb-4">Related Articles</h2>
            <div className="space-y-3">
              {relatedArticles.map((related) => (
                <Link
                  key={related.slug}
                  to={`/blog/${related.slug}`}
                  className="block p-4 rounded-xl bg-secondary/30 border border-border hover:border-gold/30 transition-colors"
                >
                  <h3 className="font-medium text-foreground mb-1">{related.title}</h3>
                  <p className="text-sm text-cream-dim line-clamp-2">{related.excerpt}</p>
                </Link>
              ))}
            </div>
          </aside>
        )}

        {/* Footer CTA */}
        <div className="px-4 sm:px-6 mt-12">
          <div className="p-6 rounded-2xl bg-gold/10 border border-gold/20 text-center">
            <BookOpen className="h-8 w-8 text-gold mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Start Your Sunnah Sleep Routine
            </h2>
            <p className="text-sm text-cream-dim mb-4">
              Use our free app to track your bedtime Sunnah checklist, set prayer alarms, and follow the prophetic sleep routine.
            </p>
            <Link 
              to="/"
              className="inline-flex items-center gap-2 px-6 py-2 bg-gold text-midnight font-medium rounded-lg hover:bg-gold/90 transition-colors"
            >
              Try SunnahSleep Free
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-4 sm:px-6 mt-8 text-center">
          <Link to="/" className="text-gold hover:underline text-sm">
            ← Return to SunnahSleep App
          </Link>
        </footer>
      </article>
    </div>
  );
}
