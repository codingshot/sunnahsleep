import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ProductCard } from '@/components/products/ProductCard';
import { getFeaturedProducts } from '@/lib/ummahProducts';

export function ProductsCarousel() {
  const products = getFeaturedProducts();

  if (products.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 sm:py-20" aria-labelledby="ummah-products-heading">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-gold mb-2">Ummah.Build</p>
          <h2 id="ummah-products-heading" className="text-2xl sm:text-3xl font-arabic text-foreground">
            More <span className="text-gradient-gold">Muslim Apps</span> & Tools
          </h2>
          <p className="text-cream-dim text-sm mt-2 max-w-xl">
            Faith-first products for worship, wellness, and daily life — built by Ummah.Build for the Ummah.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1 text-sm text-gold hover:text-gold/80 transition-colors shrink-0"
        >
          View all products
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <Carousel
        opts={{ align: 'start', dragFree: true }}
        className="w-full"
        aria-label="Ummah.Build products carousel"
      >
        <CarouselContent className="-ml-3 md:-ml-4">
          {products.map((product) => (
            <CarouselItem
              key={product.slug}
              className="pl-3 md:pl-4 basis-[88%] sm:basis-[58%] md:basis-[42%] lg:basis-[32%] xl:basis-[28%]"
            >
              <ProductCard product={product} compact />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex -left-3 border-gold/30 text-gold hover:bg-gold/10" />
        <CarouselNext className="hidden sm:flex -right-3 border-gold/30 text-gold hover:bg-gold/10" />
      </Carousel>
    </section>
  );
}
