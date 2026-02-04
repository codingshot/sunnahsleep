import { useEffect } from 'react';

const BASE_URL = 'https://sunnahsleep.app';
const DEFAULT_TITLE = 'SunnahSleep - Islamic Bedtime Companion';
const DEFAULT_DESC = 'Follow the Sunnah before sleep with SunnahSleep. Track your bedtime checklist, recite Ayat al-Kursi, complete Tasbih, wake for Tahajjud. 100% free, private.';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

export interface PageMeta {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  keywords?: string[];
  noIndex?: boolean;
}

function setMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function usePageMeta(meta: PageMeta | null) {
  useEffect(() => {
    if (!meta) return;

    document.title = meta.title;

    setMeta('description', meta.description);
    setMeta('title', meta.title);

    const canonical = meta.canonical ?? `${BASE_URL}${window.location.pathname}`;
    if (canonical !== undefined) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
    }

    const ogTitle = meta.ogTitle ?? meta.title;
    const ogDesc = meta.ogDescription ?? meta.description;
    const ogImg = meta.ogImage ?? DEFAULT_IMAGE;

    setMeta('og:title', ogTitle, true);
    setMeta('og:description', ogDesc, true);
    setMeta('og:url', meta.canonical ?? `${BASE_URL}${window.location.pathname}`, true);
    setMeta('og:image', ogImg, true);
    setMeta('og:type', 'website', true);

    setMeta('twitter:title', ogTitle);
    setMeta('twitter:description', ogDesc);
    setMeta('twitter:image', ogImg);

    if (meta.keywords?.length) {
      setMeta('keywords', meta.keywords.join(', '));
    }

    if (meta.noIndex) {
      setMeta('robots', 'noindex, nofollow');
    }

    return () => {
      document.title = DEFAULT_TITLE;
      setMeta('description', DEFAULT_DESC);
      setMeta('og:title', 'SunnahSleep - Islamic Bedtime Companion by Ummah.Build', true);
      setMeta('og:description', DEFAULT_DESC, true);
      setMeta('og:url', BASE_URL + '/', true);
      setMeta('twitter:title', 'SunnahSleep - Islamic Bedtime Companion by Ummah.Build');
      setMeta('twitter:description', DEFAULT_DESC);
      setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    };
  }, [meta]);
}
