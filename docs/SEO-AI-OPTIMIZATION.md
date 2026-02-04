# SEO & AI Engine Optimization

## Overview

SunnahSleep is optimized for traditional search engines (Google, Bing) and AI-powered search/citation engines (ChatGPT, Perplexity, Claude, Gemini).

## AI-Specific Meta Tags (`index.html`)

- **ai-content-type** — Identifies the page as a web application
- **ai-purpose** — Rich description for AI comprehension (features, free, private)
- **ai-topics** — Keywords for AI topic classification
- **ai-format** — PWA, offline capability

## Structured Data (Schema.org)

### Homepage
- **WebApplication** — App name, features, free offer, creator
- **Organization** — Ummah.Build
- **BreadcrumbList** — Navigation context
- **FAQPage** — 6 common questions (Sunnah sleep, duas, Tahajjud, Qailulah, wudu, right-side sleeping)
- **HowTo** — 8-step Prophetic sleep routine

### Blog Articles
- **Article** — headline, description, datePublished, author, publisher, mainEntityOfPage
- Injected per-article via `BlogArticle` component

## Per-Route SEO (`usePageMeta` hook)

| Route | Title / Focus |
|-------|----------------|
| `/` | Default from index.html |
| `/wudu` | Wudu step-by-step guide |
| `/blog` | Islamic sleep articles index |
| `/blog/:slug` | Article-specific (meta + Article JSON-LD) |
| `/guides` | SunnahSleep user guides |
| `/prophetic-sleep` | Prophet's sleeping practices |
| `/install` | PWA install instructions |
| `/demo` | App demo |
| `*` (404) | noindex, nofollow |

## robots.txt

- **Allow all** for major search engines (Googlebot, Bingbot)
- **Allow all** for AI crawlers: GPTBot, ChatGPT-User, Claude-Web, ClaudeBot, Anthropic-AI, Google-Extended, PerplexityBot, Cohere-ai, CCBot, meta-externalagent, meta-externalfetcher, Bytespider

## Sitemap

- `public/sitemap.xml` — All public URLs with lastmod, changefreq, priority
- Updated `lastmod` to 2026-02-04

## Best Practices Applied

1. **E-E-A-T** — Hadith references, Sunnah.com links, authoritative content
2. **Conversational queries** — FAQ schema targets "What is...", "How do I...", "When is..."
3. **Structured data** — Article, FAQ, HowTo improve AI interpretation
4. **Unique meta per page** — Reduces duplicate content signals
5. **Canonical URLs** — Explicit canonicals on all key pages
