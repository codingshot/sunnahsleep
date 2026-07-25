import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { BackLink } from '@/components/BackLink';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/products/ProductCard';
import { cn } from '@/lib/utils';
import { usePageMeta } from '@/hooks/usePageMeta';
import {
  getProductBySlug,
  getProductCanonical,
  getProductLinks,
  getProductsIndexCanonical,
  getRelatedProducts,
  isValidProductLink,
  UMMAH_PRODUCTS,
} from '@/lib/ummahProducts';

const BASE_URL = 'https://sunnahsleep.app';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : undefined;
  const related = product ? getRelatedProducts(product) : [];
  const links = product ? getProductLinks(product) : [];

  const canonical = product ? getProductCanonical(product.slug) : undefined;
  const ogImage = product && isValidProductLink(product.bannerUrl)
    ? `${BASE_URL}${product.bannerUrl}`
    : product
      ? `${BASE_URL}${product.image}`
      : undefined;

  const pageMeta = useMemo(
    () =>
      product
        ? {
            title: `${product.name} — ${product.tagline} | Ummah.Build Product`,
            description: `${product.description} Learn more about ${product.name} on ${product.domain}.`,
            canonical,
            ogTitle: `${product.name} — ${product.tagline}`,
            ogDescription: product.longDescription,
            ogImage,
            keywords: [product.name, product.domain, ...product.tags, 'Ummah.Build', product.category],
            jsonLd: [
              {
                '@context': 'https://schema.org',
                '@type': 'SoftwareApplication',
                name: product.name,
                description: product.longDescription,
                url: product.slug === 'sunnahsleep' ? BASE_URL : product.url,
                applicationCategory: product.category,
                operatingSystem: product.appType,
                image: ogImage,
                offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
                author: { '@type': 'Organization', name: 'Ummah.Build', url: 'https://ummah.build' },
                publisher: { '@type': 'Organization', name: 'Ummah.Build', url: 'https://ummah.build' },
              },
              {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'SunnahSleep', item: `${BASE_URL}/` },
                  { '@type': 'ListItem', position: 2, name: 'Products', item: getProductsIndexCanonical() },
                  { '@type': 'ListItem', position: 3, name: product.name, item: canonical },
                ],
              },
            ],
          }
        : {
            title: 'Product Not Found | SunnahSleep',
            description: 'This Ummah.Build product could not be found.',
            noIndex: true,
          },
    [product, canonical, ogImage],
  );

  usePageMeta(pageMeta);

  if (!slug || !product) {
    return (
      <div className="min-h-screen bg-gradient-night islamic-pattern flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-3">Product Not Found</h1>
          <p className="text-cream-dim text-sm mb-6">
            {slug
              ? `No product matches “${decodeURIComponent(slug)}”.`
              : 'Missing product in the URL.'}
            {' '}Browse all Ummah.Build products instead.
          </p>
          <BackLink fallbackTo="/products" label="Back to Products" />
          {UMMAH_PRODUCTS.length > 0 && (
            <p className="mt-8 text-xs text-muted-foreground">
              Try{' '}
              <Link to={`/product/${UMMAH_PRODUCTS[0].slug}`} className="text-gold hover:underline">
                {UMMAH_PRODUCTS[0].name}
              </Link>
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-night islamic-pattern">
      <article className="max-w-4xl mx-auto px-6 py-10 pb-4">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <BackLink fallbackTo="/products" label="Back" />
        </nav>

        {isValidProductLink(product.bannerUrl) && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-border">
            <img
              src={product.bannerUrl}
              alt={`${product.name} banner`}
              className="w-full h-40 sm:h-56 object-cover"
              loading="eager"
            />
          </div>
        )}

        <header className="mb-8">
          <div className={cn('rounded-2xl border border-border bg-gradient-to-br p-6 sm:p-8', product.accent)}>
            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--midnight))]/80 border border-border/50">
                <img src={product.image} alt="" className="h-14 w-14 object-contain" width={56} height={56} />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-widest text-gold mb-2">
                  {product.category} · {product.appType} · {product.status}
                </p>
                <h1 className="text-3xl sm:text-4xl font-arabic text-foreground flex items-center gap-3">
                  {product.name}
                  <span aria-hidden>{product.emoji}</span>
                </h1>
                <p className="text-lg text-gold mt-2">{product.tagline}</p>
                <p className="text-cream-dim mt-4 leading-relaxed">{product.description}</p>
              </div>
            </div>
          </div>
        </header>

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-3">About {product.name}</h2>
          <p className="text-cream-dim leading-relaxed">{product.longDescription}</p>
        </section>

        {product.highlights.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-foreground mb-4">Highlights</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {product.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="rounded-xl border border-border/60 bg-secondary/20 px-4 py-3 text-sm text-cream-dim"
                >
                  {highlight}
                </li>
              ))}
            </ul>
          </section>
        )}

        {links.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-foreground mb-4">Links</h2>
            <div className="flex flex-wrap gap-3">
              {links.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-gold hover:bg-gold/20 transition-colors"
                  >
                    {link.label}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="inline-flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-gold hover:bg-gold/20 transition-colors"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          </section>
        )}

        {product.tags.length > 0 && (
          <section className="mb-10">
            <h2 className="sr-only">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground capitalize"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-foreground mb-4">Related products</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map((item) => (
                <ProductCard key={item.slug} product={item} compact />
              ))}
            </div>
          </section>
        )}

        <p className="text-sm text-muted-foreground">
          Built by{' '}
          <a href="https://ummah.build" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
            Ummah.Build
          </a>
          {' '}— technology for the Muslim community.
        </p>
      </article>

      <Footer />
    </div>
  );
}
