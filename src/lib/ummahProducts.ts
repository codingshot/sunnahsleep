import productsData from '@/data/ummah-products.json';

export interface UmmahProductStores {
  pwa: string;
  appStore: string;
  googlePlay: string;
  apk: string;
}

export interface UmmahProductSocials {
  linkedin: string;
}

export interface UmmahProduct {
  slug: string;
  name: string;
  domain: string;
  url: string;
  tagline: string;
  description: string;
  longDescription: string;
  emoji: string;
  appType: string;
  category: string;
  status: string;
  image: string;
  accent: string;
  tags: string[];
  highlights: string[];
  relatedSlugs: string[];
  featured: boolean;
  socials: UmmahProductSocials;
  stores: UmmahProductStores;
  bannerUrl: string;
}

export interface ProductLink {
  label: string;
  href: string;
  external: boolean;
}

const BASE_URL = 'https://sunnahsleep.app';

/** Canonical product list — bundled so client navigations never hang on fetch. */
export const UMMAH_PRODUCTS: UmmahProduct[] = productsData as UmmahProduct[];

export function isValidProductLink(url: string | undefined): url is string {
  return Boolean(url && url !== 'na');
}

/** @deprecated Prefer UMMAH_PRODUCTS — kept for callers that expect a Promise. */
export async function loadUmmahProducts(): Promise<UmmahProduct[]> {
  return UMMAH_PRODUCTS;
}

export function getAllUmmahProducts(): UmmahProduct[] {
  return UMMAH_PRODUCTS;
}

export function getProductBySlug(slug: string, products: UmmahProduct[] = UMMAH_PRODUCTS): UmmahProduct | undefined {
  const normalized = decodeURIComponent(slug).trim().toLowerCase();
  return products.find((product) => product.slug.toLowerCase() === normalized);
}

export function getFeaturedProducts(products: UmmahProduct[] = UMMAH_PRODUCTS): UmmahProduct[] {
  return products.filter((product) => product.featured);
}

export function getRelatedProducts(product: UmmahProduct, products: UmmahProduct[] = UMMAH_PRODUCTS): UmmahProduct[] {
  return product.relatedSlugs
    .map((slug) => getProductBySlug(slug, products))
    .filter((item): item is UmmahProduct => Boolean(item));
}

export function getProductCanonical(slug: string): string {
  return `${BASE_URL}/product/${slug}`;
}

export function getProductsIndexCanonical(): string {
  return `${BASE_URL}/products`;
}

export function getProductLinks(product: UmmahProduct): ProductLink[] {
  const links: ProductLink[] = [];

  if (product.slug === 'sunnahsleep') {
    links.push({ label: 'Open app', href: '/app', external: false });
    links.push({ label: 'Install', href: '/install', external: false });
  } else if (isValidProductLink(product.url)) {
    links.push({ label: product.domain, href: product.url, external: true });
  }

  if (isValidProductLink(product.stores.pwa) && product.slug !== 'sunnahsleep') {
    links.push({ label: 'Web app', href: product.stores.pwa, external: true });
  }
  if (isValidProductLink(product.stores.appStore)) {
    links.push({ label: 'App Store', href: product.stores.appStore, external: true });
  }
  if (isValidProductLink(product.stores.googlePlay)) {
    links.push({ label: 'Google Play', href: product.stores.googlePlay, external: true });
  }
  if (isValidProductLink(product.stores.apk)) {
    links.push({ label: 'APK', href: product.stores.apk, external: product.stores.apk.startsWith('http') });
  }
  if (isValidProductLink(product.socials.linkedin)) {
    links.push({ label: 'LinkedIn', href: product.socials.linkedin, external: true });
  }

  return links;
}
