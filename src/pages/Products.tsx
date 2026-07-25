import { useMemo } from 'react';
import { Package } from 'lucide-react';
import { BackLink } from '@/components/BackLink';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/products/ProductCard';
import { usePageMeta } from '@/hooks/usePageMeta';
import {
  getAllUmmahProducts,
  getProductsIndexCanonical,
} from '@/lib/ummahProducts';

export default function Products() {
  const products = getAllUmmahProducts();

  const pageMeta = useMemo(
    () => ({
      title: 'Ummah.Build Products — Islamic Apps & Tools for Muslims | SunnahSleep',
      description:
        'Explore Muslim apps and tools by Ummah.Build — SunnahSleep, HabibiChill, PRAYSAP, TryRamadan, MosqueSteps, MosqueList, ShariaCheck, MuslimName, and more. Faith-first technology for the Ummah.',
      canonical: getProductsIndexCanonical(),
      keywords: [
        'Ummah.Build products',
        'Islamic apps',
        'Muslim apps',
        'halal technology',
        'SunnahSleep',
        'HabibiChill',
        'PRAYSAP',
        'TryRamadan',
        'MosqueSteps',
      ],
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Ummah.Build Products',
          description:
            'Faith-first Muslim apps and tools built by Ummah.Build — worship, wellness, discovery, and daily life.',
          url: getProductsIndexCanonical(),
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: products.map((product, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: `https://sunnahsleep.app/product/${product.slug}`,
              name: product.name,
            })),
          },
          publisher: { '@type': 'Organization', name: 'Ummah.Build', url: 'https://ummah.build' },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'SunnahSleep', item: 'https://sunnahsleep.app/' },
            { '@type': 'ListItem', position: 2, name: 'Products', item: getProductsIndexCanonical() },
          ],
        },
      ],
    }),
    [products],
  );

  usePageMeta(pageMeta);

  return (
    <div className="min-h-screen bg-gradient-night islamic-pattern">
      <div className="max-w-6xl mx-auto px-6 py-10 pb-4">
        <BackLink fallbackTo="/" label="Back to Home" className="mb-8" />

        <header className="mb-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gold/10">
              <Package className="h-7 w-7 text-gold" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gold">Ummah.Build</p>
              <h1 className="text-2xl sm:text-4xl font-arabic text-foreground">Products for the Ummah</h1>
            </div>
          </div>
          <p className="text-cream-dim leading-relaxed">
            Discover faith-first apps and tools from Ummah.Build — built to help Muslims worship, grow, and live with purpose.
            Each product is designed with privacy, authenticity, and the needs of the Ummah in mind.
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
