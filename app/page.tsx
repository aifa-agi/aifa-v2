// app/page.tsx
// Notes:
// - Keep the current hero unchanged.
// - In-depth architecture: desktop alternation (image/text ↔ text/image), mobile fixed order (image → text) per block.
// - Use md breakpoint for alternation; add larger vertical spacing between items.
// - FAQ JSON-LD is kept in sync with UI (generateFAQSchema).
// - All internal links point to root "/" to avoid 404s on landing-only starter.
// - Comments in English.

import Link from 'next/link';
import { Metadata } from 'next';
import Script from 'next/script';
import { ClientTabs } from '@/components/client/tabs';
import Image from 'next/image';
import { constructMetadata } from '@/lib/construct-metadata';
import { generateWebSiteSchema, generateFAQSchema } from '@/lib/seo-generators';
import { appConfig, getHomePageIllustration } from '@/config/app-config';

// SEO: Generate metadata for homepage
export const metadata: Metadata = constructMetadata({
title: 'SEO-First PWA Starter Kit with PWA — Next.js 15 + React 19',
description:
  'Production-ready Next.js starter with battle-tested SEO infrastructure, Progressive Web App core, and env-driven configuration. Ship search-optimized, installable apps instantly.',
  pathname: '/',
  contentType: 'website',
});

// Performance: Revalidate every 1 hour
export const revalidate = 3600;

// Prevent duplicate metadata
export const generateStaticParams = async () => {
  return [];
};

// Current year constant for footer
const CURRENT_YEAR = new Date().getFullYear();

// JSON-LD schema for homepage
const websiteSchema = generateWebSiteSchema(true);

function Pill({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
      {text}
    </span>
  );
}

function Feature({ title, desc, href }: { title: string; desc: string; href?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition hover:shadow-sm">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
      {href && (
        <Link
          href={href}
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
        >
          Learn more →
        </Link>
      )}
    </div>
  );
}

function Hint({ title, lines }: { title: string; lines: string[] }) {
  return (
    <details className="group rounded-xl border border-border bg-muted/40 px-5 py-4">
      <summary className="cursor-pointer list-none text-sm font-medium text-foreground">
        {title}
      </summary>
      <ul className="mt-3 space-y-1">
        {lines.map((l, i) => (
          <li key={i} className="text-xs text-muted-foreground">
            {l}
          </li>
        ))}
      </ul>
    </details>
  );
}

function LoadingIllustrationSSR() {
  const src = getHomePageIllustration('light');
  return (
    <div className="relative h-full w-full">
      <Image
        src={src}
        alt="SEO-First PWA Starter Kit with PWA — Next.js 15 + React 19"
        width={800}
        height={600}
        className="h-full w-full object-contain"
        priority
        unoptimized
      />
    </div>
  );
}



// Shared illustration + blur placeholder for long-form sections
const SECTION_IMAGE = '/images/pic1.png';
const BLUR_PLACEHOLDER =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAIklEQVQoU2NkYGD4z0AEYBxVq1YxQACmGQwGQwEwEw0GgYEAAMzvA4W8Dq9dAAAAAElFTkSuQmCC';

// Long-form topics for alternating sections (all href -> "/")
const LONG_SECTIONS: Array<{
  id: string;
  title: string;
  href: string;
  paragraphs: string[];
}> = [
  {
    id: 'seo-kernel',
    title: 'SEO Kernel',
    href: '/',
    paragraphs: [
      'Search engines reward sites that combine clear structure with rich semantics: canonical URLs, hreflang alternates, robust robots rules, and consistent title templates.',
      'This starter unifies those pieces behind a single metadata pipeline, so every route ships with correct Open Graph, Twitter cards, and optional verification tokens.',
    ],
  },
  {
    id: 'pwa-core',
    title: 'PWA Core',
    href: '/',
    paragraphs: [
      'A web app manifest, install prompts, and a service worker transform a site into an installable, resilient experience that users can trust.',
      'Offline fallbacks and well-scoped caching policies keep pages usable under flaky networks without risking stale, unbounded caches.',
    ],
  },
  {
    id: 'metadata-system',
    title: 'Metadata System',
    href: '/',
    paragraphs: [
      'Centralized helpers compose titles, descriptions, icons, and canonical URLs from env-driven branding and defaults.',
      'By constraining variations and exposing safe knobs, teams avoid "meta drift" and keep signals consistent across the entire domain.',
    ],
  },
  {
    id: 'json-ld',
    title: 'JSON‑LD Schemas',
    href: '/',
    paragraphs: [
      'Schema.org JSON‑LD elevates meaning: WebSite, Organization, Article, Product, FAQ, and Breadcrumbs map your content to entities search engines understand.',
      'Builders ensure valid structure and URLs, while keeping room for per-page overrides and future schema growth.',
    ],
  },
  {
    id: 'sitemap',
    title: 'Sitemap',
    href: '/',
    paragraphs: [
      'A living sitemap lists static and dynamic routes with lastModified, priority, and localized alternates.',
      'It scales with content sources, respects 50k URL limits, and guards against broken alternates across locales.',
    ],
  },
  {
    id: 'robots',
    title: 'Robots',
    href: '/',
    paragraphs: [
      'Granular agents policies let you tune access for traditional crawlers and modern AI bots.',
      'Toggle index/follow and disallow sensitive paths while keeping discovery open for marketing-facing routes.',
    ],
  },
  {
    id: 'manifest',
    title: 'Web App Manifest',
    href: '/',
    paragraphs: [
      'Provide icons in multiple sizes, including maskable variants, plus theme and background colors for a crisp install experience.',
      'Shortcuts and screenshots improve UX on add-to-home-screen and align the app with brand guidelines.',
    ],
  },
  {
    id: 'service-worker',
    title: 'Service Worker',
    href: '/',
    paragraphs: [
      'Lifecycle hooks (install/activate) wire up caches and cleanup, while fetch handlers select per-asset strategies.',
      'Messaging hooks, background sync, and notification clicks enable progressive enhancements without breaking core delivery.',
    ],
  },
  {
    id: 'caching',
    title: 'Caching',
    href: '/',
    paragraphs: [
      'Pair HTTP cache headers with runtime strategies: Cache‑First for static assets, Network‑First for pages and APIs.',
      'Explicit fallbacks prevent opaque failures and let you manage staleness, entry limits, and expiration windows.',
    ],
  },
  {
    id: 'images-og',
    title: 'Images & Open Graph',
    href: '/',
    paragraphs: [
      'Ship AVIF/WebP, tune sizes, and use blurDataURL placeholders for fast, stable layouts.',
      'Open Graph images match 1200×630 conventions with text‑safe padding, while icons include Apple touch and maskable variants.',
    ],
  },
  {
    id: 'i18n',
    title: 'Internationalization',
    href: '/',
    paragraphs: [
      'Alternates per locale and a single canonical base avoid duplicate content and regional cannibalization.',
      'Language defaults, explicit URL building, and sitemap alternates keep bots and users aligned.',
    ],
  },
  {
    id: 'security',
    title: 'Security Headers',
    href: '/',
    paragraphs: [
      'Harden pages with CSP, HSTS, X‑Frame‑Options, Referrer‑Policy, and a sensible Permissions‑Policy.',
      'Strict defaults reduce attack surface while allowing the assets and endpoints your app needs.',
    ],
  },
  {
    id: 'performance',
    title: 'Performance',
    href: '/',
    paragraphs: [
      'Minification, compression, image formats, and static generation baselines deliver consistently snappy pages.',
      'Target perfect Lighthouse while keeping SSR-first HTML meaningful when JavaScript is disabled.',
    ],
  },
  {
    id: 'accessibility',
    title: 'Accessibility',
    href: '/',
    paragraphs: [
      'Core content remains available with JavaScript disabled via semantic HTML and <noscript> fallbacks.',
      'Color‑scheme and focus states follow WCAG‑aligned patterns to keep UX inclusive by default.',
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics & Verification',
    href: '/',
    paragraphs: [
      'Verification tokens live in metadata only when provided, keeping noise out of production builds.',
      'Hook points exist to integrate analytics without leaking PII or breaking CSP rules.',
    ],
  },
  {
    id: 'content-architecture',
    title: 'Content Architecture',
    href: '/',
    paragraphs: [
      'Structure beats volume: internal linking, templates, and consistent types outperform raw content generation.',
      'Treat documentation as product—indexable, scannable, and kept fresh by design.',
    ],
  },
];

const CORE_FEATURES_FAQS = [
  // Sitemap Feature
  {
    question: 'How does the Sitemap generation work?',
    answer:
      'The starter generates a dynamic sitemap.xml using app/sitemap.ts. It supports static routes, dynamic routes from databases, i18n alternates, and priority/lastModified timestamps. Maximum 50,000 URLs per sitemap with automatic pagination.',
  },
  {
    question: 'Can I customize sitemap priorities and update frequency?',
    answer:
      'Yes. The sitemap.ts file exposes lastModified, changeFrequency, and priority fields for each route. Update these values based on your content strategy to signal freshness to search engines.',
  },
  {
    question: 'Does the sitemap include hreflang alternates for multi-language sites?',
    answer:
      'Yes. The sitemap automatically includes hreflang alternates when configured with locales. This helps search engines understand language variations and canonical relationships.',
  },
  {
    question: 'Where can I find the generated sitemap?',
    answer:
      'Access it at /sitemap.xml. The starter provides cache headers: public, max-age=3600, ensuring crawlers always get a reasonably fresh copy without overwhelming your server.',
  },

  // Robots Feature
  {
    question: 'How can I control which bots can access my site?',
    answer:
      'Edit app/robots.ts to set allowlist/disallowlist for crawlers. By default, search engines and AI bots (GPTBot, PerplexityBot) are allowed. Disallow sensitive paths like /admin, /api, /auth.',
  },
  {
    question: 'Can I block AI bots while allowing Google?',
    answer:
      'Absolutely. In app/robots.ts, create separate rules: Allow Googlebot, disallow GPTBot, PerplexityBot, etc. Use userAgent arrays for granular control over each bot type.',
  },
  {
    question: 'What do noindex and nofollow directives do?',
    answer:
      'noindex tells crawlers "do not include this page in search results." nofollow tells crawlers "do not follow links on this page." Both can be set per-route or globally in app/robots.ts.',
  },
  {
    question: 'Do I need to keep robots.txt and app/robots.ts in sync?',
    answer:
      'No. In Next.js 15+, app/robots.ts generates robots.txt automatically during build. Just maintain one source of truth in app/robots.ts and the generated file serves as the public endpoint.',
  },

  // Manifest Feature
  {
    question: 'What is a Web App Manifest and why is it important?',
    answer:
      'A manifest.webmanifest file tells browsers how to install your PWA on user devices. It includes app name, icons, colors, start URL, and display mode. Without it, your app cannot be installed.',
  },
  {
    question: 'How do I provide multiple icon sizes?',
    answer:
      'The starter includes 192x192, 512x512, and maskable variants. Define them in manifest.webmanifest with purpose: "any" for standard icons and purpose: "maskable" for adaptive icons that adapt to device shape.',
  },
  {
    question: 'What is a maskable icon?',
    answer:
      'A maskable icon is a circular icon with transparent padding. Devices cut it into different shapes (square, circle) depending on OS. Provide both standard and maskable variants for maximum compatibility.',
  },
  {
    question: 'Can I customize the app display mode?',
    answer:
      'Yes. Set display: "standalone" (full screen, hides browser chrome), "minimal-ui" (minimal browser UI), or "browser" (standard browser). The starter defaults to "standalone" for better UX.',
  },

  // App Config Feature
  {
    question: 'What goes into App Config?',
    answer:
      'App Config centralizes branding, SEO, PWA, and feature flags. It reads from environment variables (NEXT_PUBLIC_APP_NAME, NEXT_PUBLIC_TWITTER_HANDLE, etc.) and provides type-safe access throughout your app.',
  },
  {
    question: 'How do I change the site branding without code changes?',
    answer:
      'Update .env.local: NEXT_PUBLIC_APP_NAME, NEXT_PUBLIC_APP_DESCRIPTION, NEXT_PUBLIC_APP_SHORT_NAME, NEXT_PUBLIC_PWA_THEME_COLOR. Rebuild and all pages automatically reflect the new branding.',
  },
  {
    question: 'Can I use App Config for feature toggles?',
    answer:
      'Yes. Add custom flags to appConfig object. For example, NEXT_PUBLIC_ENABLE_ANALYTICS, NEXT_PUBLIC_MAINTENANCE_MODE. Access them conditionally in components: if (appConfig.enableAnalytics) { ... }',
  },
  {
    question: 'Is App Config safe to expose to the client?',
    answer:
      'Only use NEXT_PUBLIC_ prefix for client-side variables. Private env vars (without NEXT_PUBLIC_) stay on the server. The starter respects this boundary automatically.',
  },

  // Next Config Feature
  {
    question: 'What optimizations does Next Config provide?',
    answer:
      'Next Config enables SWC minification, image optimization (WebP/AVIF), security headers (CSP, HSTS), cache strategies for static assets, fonts, and APIs. All reduce page size and improve Core Web Vitals.',
  },
  {
    question: 'How are images optimized automatically?',
    answer:
      'next/image component resizes images for each device size (640px to 3840px), converts to modern formats (WebP/AVIF), lazy-loads off-screen images, and generates blurred placeholders for instant perception of load.',
  },
  {
    question: 'What security headers does the config include?',
    answer:
      'CSP (Content Security Policy) restricts resource loading, HSTS forces HTTPS, X-Frame-Options prevents clickjacking, Referrer-Policy controls link referrer info, Permissions-Policy restricts camera/microphone access.',
  },
  {
    question: 'How do cache headers improve performance?',
    answer:
      'Static assets (public/) are cached 1 year (immutable), images 1 year, fonts 1 year. API responses use no-cache/no-store to stay fresh. Browsers skip network requests for cached assets, reducing latency 90%+.',
  },

  // PWA Install Prompt Feature
  {
    question: 'What is a PWA install prompt?',
    answer:
      'An install prompt is a browser dialog offering to add your app to the home screen. The starter detects when users are likely to install and shows a custom prompt, dramatically increasing installation rates.',
  },
  {
  question: 'Does the install prompt work on all browsers?',
  answer:
    'Install prompts are native on Android Chrome and desktop Edge/Chrome. On iOS Safari, the component shows step-by-step instructions via alert, as iOS does not support the native beforeinstallprompt API. Unsupported browsers gracefully degrade.',
},
  {
    question: 'Can I customize the install prompt appearance?',
    answer:
      'Yes. The PWAInstallPrompt component accepts custom text, icons, and colors. You can match it to your brand and adjust timing via deferPrompt logic.',
  },
  {
    question: 'How do users uninstall after installing?',
    answer:
      'Users uninstall like any app: long-press app icon → remove (mobile) or Settings → Apps → Uninstall (desktop). No special code needed; the browser handles all lifecycle management.',
  },

  // Service Worker Feature
  {
  question: 'What caching strategies does the Service Worker use?',
  answer:
    'Cache-First for static assets (images, fonts, CSS, JS) — serve from cache, fallback to network. Network-First for pages and APIs — try network first, fallback to cache. Custom strategies implemented in public/sw.js without external dependencies.',
},
{
  question: 'Does the Service Worker support push notifications?',
  answer:
    'Yes. The Service Worker includes handlers for push events and notification clicks. Configure push subscriptions via Web Push API. The starter provides boilerplate code in public/sw.js, but server-side push integration requires additional setup.',
},

  {
    question: 'How does the Service Worker handle offline?',
    answer:
      'If the network fails, the SW checks the cache. If found, serves cached version. If not found, shows an offline fallback page. Users stay productive even without internet, reconnecting automatically when possible.',
  },
  {
    question: 'Can I clear caches and force a fresh install?',
    answer:
      'Yes. The Service Worker activation hook cleans old cache versions. Users see an update prompt, click "skip waiting" to activate new version. register-sw.js checks for updates hourly.',
  },
  {
    question: 'Does the Service Worker break SEO?',
    answer:
      'No. The SW only handles runtime caching. SEO relies on HTML delivered server-side (SSR/SSG). Crawlers see full HTML before JS runs. The SW improves performance, which improves SEO rankings.',
  },

  // Construct Metadata Feature
  {
    question: 'What does constructMetadata() do?',
    answer:
      'It generates all metadata for a page: title template, meta description, OpenGraph tags, Twitter Cards, canonical URL, icons, robots directives, and verification codes. One function call replaces 20+ lines of boilerplate.',
  },
  {
    question: 'How does constructMetadata prevent duplicate content?',
    answer:
      'It automatically sets canonical URL to the current route, preventing search engines from indexing duplicates. For multi-locale sites, it adds hreflang alternates.',
  },
  {
    question: 'Can I override defaults for a specific page?',
    answer:
      'Yes. Pass parameters: constructMetadata({ title: "Custom Title", description: "...", pathname: "/custom", contentType: "article" }). Unspecified fields use app-config defaults.',
  },
  {
    question: 'Does constructMetadata handle social media previews?',
    answer:
      'Yes. It generates OpenGraph (Facebook, LinkedIn) and Twitter Card metadata. When users share links, platforms show rich previews: image, title, description. Vastly improves click-through rates.',
  },

  // SEO Generators Feature
  {
    question: 'What JSON-LD schemas are available?',
    answer:
      'WebSite, Organization, Person, Article, BlogPosting, Product, FAQPage, BreadcrumbList, CollectionPage, VideoObject. Each generator ensures valid schema.org structure and auto-fills URLs.',
  },
  {
    question: 'Why use JSON-LD instead of microdata?',
    answer:
      'JSON-LD is cleaner (separate from HTML), easier to maintain, less error-prone. Search engines treat both equally, but JSON-LD is recommended by Google and Schema.org.',
  },
  {
    question: 'How do schemas improve search results?',
    answer:
      'Schemas enable Rich Snippets: prices/ratings for products, question/answer accordion for FAQs, navigation breadcrumbs, author info for articles. These stand out in SERP, increasing click-through rates 20-40%.',
  },
  {
    question: 'Can I use multiple schemas on one page?',
    answer:
      'Yes. Combine Article + BreadcrumbList + Organization. The starter provides mergeSchemas() to combine multiple schemas. Each <script type="application/ld+json"> block is separate and valid.',
  },

  // Noscript Safe Feature
  {
    question: 'What happens if JavaScript is disabled?',
    answer:
      'The page still renders. All content in semantic HTML (article, section, h1, p, etc.) is immediately visible. Navigation works via links. Forms work if server-side handlers exist. Graceful degradation, not total failure.',
  },
  {
    question: 'Why should I care about noscript users?',
    answer:
      'Search engines often crawl without JS execution (especially Bing, smaller engines). Users on slow networks disable JS to reduce data. Accessibility tools (screen readers) work better with semantic HTML.',
  },
  {
    question: 'How do I test my site without JavaScript?',
    answer:
      'Disable JS in DevTools (F12 → Settings → Disable JavaScript). Reload. If layout breaks or content disappears, refactor to use semantic HTML, CSS layout, and server-side rendering.',
  },
  {
    question: 'Should I remove interactive features if JS is disabled?',
    answer:
      'No. Degrade gracefully: buttons become links, modals become pages, carousels become static lists. Show a noscript warning if core functionality requires JS. The starter includes a helpful noscript fallback.',
  },

  // Static Generation Feature
  {
    question: 'What is Static Generation (SSG)?',
    answer:
      'Pages are pre-rendered at build time into static HTML. Each request serves the same HTML from a cache. Zero server-side processing, instant load times, perfect for blogs, marketing sites.',
  },
  {
    question: 'What is Incremental Static Regeneration (ISR)?',
    answer:
      'Set revalidate = 3600 (seconds) on a page. First request after 3600s triggers a rebuild in the background. Users see old cached page (fast), next user sees fresh version. Best of both worlds.',
  },
  {
    question: 'When should I use Static Generation vs. Server-Rendering?',
    answer:
      'Static: blogs, landing pages, docs, products (content changes infrequently). Server-rendering: dashboards, user-specific content, real-time data. Combine both: static homepage + SSR for dynamic sections.',
  },
  {
  question: 'How do I regenerate a page when content changes?',
  answer:
    'Use ISR with revalidate export (e.g., export const revalidate = 3600). For on-demand revalidation, add Server Actions with revalidatePath("/blog") or revalidateTag("blog"). This requires additional setup beyond the starter.',
},


  // Security Headers Feature
  {
    question: 'What is Content Security Policy (CSP)?',
    answer:
      'CSP restricts where resources (scripts, styles, images) can load from. Prevents malicious scripts from injecting code. Example: script-src self → only your own scripts run.',
  },
  {
    question: 'What does HSTS do?',
    answer:
      'HTTP Strict-Transport-Security forces HTTPS only. After first visit, browsers refuse to load your site over HTTP, blocking man-in-the-middle attacks. Set max-age to 31536000 (1 year).',
  },
  {
    question: 'What is Referrer-Policy?',
    answer:
      'Controls what referrer info is sent when users click your links. strict-origin-when-cross-origin only sends domain name (not full URL) to external sites, protecting privacy.',
  },
  {
    question: 'Do security headers harm performance?',
    answer:
      'No. They add tiny response headers, negligible overhead. The upside: blocked XSS attacks, clickjacking prevention, protection against malicious ads. Security headers have 0 downside.',
  },
];

// Build JSON-LD FAQPage schema from core features
const coreFeaturesSchema = generateFAQSchema(
  CORE_FEATURES_FAQS.map((f) => ({ question: f.question, answer: f.answer }))
);

export default async function Home() {
  return (
    <>
      {/* JSON-LD Schema for SEO */}
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
        strategy="beforeInteractive"
      />

      <Script
  id="core-features-faq-schema"
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(coreFeaturesSchema),
  }}
  strategy="beforeInteractive"
/>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-12 sm:py-16">
        {/* Hero Section (unchanged) */}
        <section className="grid items-center gap-8 sm:grid-cols-2" aria-labelledby="hero-title">
          <div className="space-y-5">
            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              <Pill text="Next.js 15" />
              <Pill text="React 19" />
              <Pill text="PWA" />
              <Pill text="SEO-first" />
              <Pill text="Env-driven" />
            </div>

            {/* Hero heading */}
            <h1
              id="hero-title"
              className="text-4xl font-bold leading-tight tracking-[-0.02em] text-foreground sm:text-5xl"
            >
              SEO-First PWA Starter — {appConfig.name}
            </h1>

            {/* Hero description */}
            <p className="text-base text-muted-foreground sm:text-lg">
              Production-ready Next.js starter with battle-tested SEO infrastructure, Progressive Web App core, and env-driven configuration. Ship search-optimized, installable apps instantly  — Next.js 15 + React 19.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="https://github.com/aifa-agi/aifa-v2"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Get Starter
              </Link>
              <Link
                href="https://github.com/aifa-agi/aifa-v2"
                className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Read Docs
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg border border-border bg-card p-4 text-center">
                <div className="text-2xl font-bold text-foreground">15+</div>
                <div className="text-xs text-muted-foreground">Core features</div>
              </div>
              <div className="rounded-lg border border-border bg-card p-4 text-center">
                <div className="text-2xl font-bold text-foreground">A+</div>
                <div className="text-xs text-muted-foreground">SEO score ready</div>
              </div>
              <div className="rounded-lg border border-border bg-card p-4 text-center">
                <div className="text-2xl font-bold text-foreground">PWA</div>
                <div className="text-xs text-muted-foreground">Installable</div>
              </div>
              <div className="rounded-lg border border-border bg-card p-4 text-center">
                <div className="text-2xl font-bold text-foreground">Env</div>
                <div className="text-xs text-muted-foreground">Config-only</div>
              </div>
            </div>
          </div>

          {/* Hero Image (unchanged) */}
          <div className="relative">
            <div className="aspect-[4/3] w-full overflow-hidden ">
              <LoadingIllustrationSSR />
            </div>
          </div>
        </section>

        {/* Features Section (all links -> "/") */}
        <section aria-labelledby="features-title" className="space-y-6">
          <h2 id="features-title" className="text-xl font-semibold text-foreground">
            What you get out of the box
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              title="SEO Kernel"
              desc="Metadata API, i18n alternates, OpenGraph/Twitter, JSON-LD builders, robots with AI crawlers."
              href="/"
            />
            <Feature
              title="PWA Stack"
              desc="Manifest, icons, shortcuts, screenshots, SW caching for fonts/images/API, install-ready."
              href="/"
            />
            <Feature
              title="DX & Structure"
              desc="App Router, Env-only branding, semantic routes, error/not-found pages, ISR-friendly."
              href="/"
            />
            <Feature
              title="AI-ready"
              desc="AI bots access rules, knowledge routes (blog/news/docs), and performance baseline."
              href="/"
            />
            <Feature
              title="Security Headers"
              desc="nosniff, XSS, frame options, referrer policy, permissions policy baked-in."
              href="/"
            />
            <Feature
              title="Image & Fonts"
              desc="AVIF/WebP, remotePatterns, display=swap, preconnect/preload examples."
              href="/"
            />
          </div>
        </section>

        {/* Deep-dive Section (all links -> "/") */}
        <section aria-labelledby="deepdive-title" className="space-y-6">
          <h2 id="deepdive-title" className="text-xl font-semibold text-foreground">
            Deep-dive quick panels
          </h2>
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-lg font-semibold text-foreground">SEO Core</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              <li className="text-sm text-muted-foreground">• Metadata API with env-driven branding</li>
              <li className="text-sm text-muted-foreground">• robots.txt with AI crawlers allowlists</li>
              <li className="text-sm text-muted-foreground">• sitemap.ts with i18n alternates and priority</li>
              <li className="text-sm text-muted-foreground">• JSON-LD builders: Article, FAQ, Product, Breadcrumb</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/robots.txt"
                className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Robots
              </Link>
              <Link
                href="/sitemap.xml"
                className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Sitemap
              </Link>
              <Link
                href="/"
                className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Docs
              </Link>
            </div>
            <div className="mt-5">
              <Hint
                title="Setup hints"
                lines={[
                  'Set NEXT_PUBLIC_SITE_URL and NEXT_PUBLIC_APP_NAME in .env.local',
                  'Configure title template in pageDefaults.titleTemplate',
                  'Add Search Console codes when ready',
                ]}
              />
            </div>
            <ClientTabs />
          </div>
        </section>

        {/* Configure Section (all links -> "/") */}
        <section aria-labelledby="config-title" className="space-y-6">
          <h2 id="config-title" className="text-xl font-semibold text-foreground">
            Configure in minutes
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold text-foreground">Brand & SEO via .env</h3>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>• NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_APP_NAME, NEXT_PUBLIC_APP_DESCRIPTION</li>
                <li>• NEXT_PUBLIC_DEFAULT_LOCALE, NEXT_PUBLIC_TWITTER_HANDLE</li>
                <li>• NEXT_PUBLIC_GOOGLE_VERIFICATION, NEXT_PUBLIC_YANDEX_VERIFICATION</li>
              </ul>
              <div className="mt-3">
                <Link href="/" className="text-sm font-medium text-primary hover:underline">
                  See full list →
                </Link>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold text-foreground">PWA in production</h3>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>• Manifest with 192/512 icons and maskable variants</li>
                <li>• SW: Google Fonts, images, API caching strategies</li>
                <li>• Screenshots for install prompt (env-driven)</li>
              </ul>
              <div className="mt-3">
                <Link href="/" className="text-sm font-medium text-primary hover:underline">
                  Use PWA starter →
                </Link>
              </div>
            </div>
          </div>
        </section>

               {/* Explore Features - Core Components */}
        <section aria-labelledby="explore-title" className="space-y-6">
          <h2 id="explore-title" className="text-xl font-semibold text-foreground">
            Core features
          </h2>
          <nav className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Sitemap Generation */}
            <div
              className="rounded-lg border border-border bg-card p-4 hover:bg-muted focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary transition"
            >
              <div className="text-base font-semibold text-foreground">Sitemap</div>
              <div className="text-sm text-muted-foreground">Dynamic sitemap.xml with i18n alternates, priority, and lastModified timestamps</div>
            </div>

            {/* Robots Configuration */}
            <div
              className="rounded-lg border border-border bg-card p-4 hover:bg-muted focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary transition"
            >
              <div className="text-base font-semibold text-foreground">Robots</div>
              <div className="text-sm text-muted-foreground">Granular crawl policies for search engines and AI bots with disallowPaths</div>
            </div>

            {/* Web App Manifest */}
            <div
              className="rounded-lg border border-border bg-card p-4 hover:bg-muted focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary transition"
            >
              <div className="text-base font-semibold text-foreground">Manifest</div>
              <div className="text-sm text-muted-foreground">PWA manifest with icons, shortcuts, screenshots, and maskable variants</div>
            </div>

            {/* App Configuration */}
            <div
              className="rounded-lg border border-border bg-card p-4 hover:bg-muted focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary transition"
            >
              <div className="text-base font-semibold text-foreground">App Config</div>
              <div className="text-sm text-muted-foreground">Centralized env-driven branding, metadata, and feature toggles</div>
            </div>

            {/* Next.js Config */}
            <div
              className="rounded-lg border border-border bg-card p-4 hover:bg-muted focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary transition"
            >
              <div className="text-base font-semibold text-foreground">Next Config</div>
              <div className="text-sm text-muted-foreground">Image optimization, security headers, caching policies, and SWC minification</div>
            </div>

            {/* PWA Install Prompt */}
            <div
              className="rounded-lg border border-border bg-card p-4 hover:bg-muted focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary transition"
            >
              <div className="text-base font-semibold text-foreground">PWA Install</div>
              <div className="text-sm text-muted-foreground">Cross-platform install prompts for Android, iOS, and desktop browsers</div>
            </div>

            {/* Service Worker */}
            <div
              className="rounded-lg border border-border bg-card p-4 hover:bg-muted focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary transition"
            >
              <div className="text-base font-semibold text-foreground">Service Worker</div>
              <div className="text-sm text-muted-foreground">Workbox caching: Cache-First for static, Network-First for pages/API</div>
            </div>

            {/* Metadata Constructor */}
            <div
              className="rounded-lg border border-border bg-card p-4 hover:bg-muted focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary transition"
            >
              <div className="text-base font-semibold text-foreground">Construct Metadata</div>
              <div className="text-sm text-muted-foreground">Unified metadata API: OpenGraph, Twitter Cards, canonical URLs, robots directives</div>
            </div>

            {/* SEO Generators */}
            <div
              className="rounded-lg border border-border bg-card p-4 hover:bg-muted focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary transition"
            >
              <div className="text-base font-semibold text-foreground">SEO Generators</div>
              <div className="text-sm text-muted-foreground">JSON-LD builders for WebSite, Article, Product, FAQ, Breadcrumb, Organization</div>
            </div>

            {/* No JavaScript Fallback */}
            <div
              className="rounded-lg border border-border bg-card p-4 hover:bg-muted focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary transition"
            >
              <div className="text-base font-semibold text-foreground">Noscript Safe</div>
              <div className="text-sm text-muted-foreground">Full semantic HTML: works without JavaScript, graceful degradation</div>
            </div>

            {/* Static Generation */}
            <div
              className="rounded-lg border border-border bg-card p-4 hover:bg-muted focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary transition"
            >
              <div className="text-base font-semibold text-foreground">Static Generation</div>
              <div className="text-sm text-muted-foreground">ISR with revalidate, static optimization, and edge caching strategies</div>
            </div>

            {/* Security Headers */}
            <div
              className="rounded-lg border border-border bg-card p-4 hover:bg-muted focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary transition"
            >
              <div className="text-base font-semibold text-foreground">Security</div>
              <div className="text-sm text-muted-foreground">CSP, HSTS, X-Frame-Options, Permissions-Policy, Referrer-Policy</div>
            </div>
          </nav>
        </section>


      

        <section aria-labelledby="core-faq-title" className="space-y-6">
  <h2 id="core-faq-title" className="text-xl font-semibold text-foreground">
    Core Features FAQ
  </h2>
  <div className="grid gap-3 sm:grid-cols-2">
    {CORE_FEATURES_FAQS.map((f) => (
      <Hint key={f.question} title={f.question} lines={[f.answer]} />
    ))}
  </div>
</section>

        {/* CTA Section (all links -> "/") */}
        <section
          aria-labelledby="cta-title"
          className="rounded-2xl border border-border bg-gradient-to-br from-muted to-background p-8 text-center"
        >
          <h2 id="cta-title" className="text-2xl font-bold text-foreground sm:text-3xl">
            Ship your AI app with confidence
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Start with an installable PWA, SEO kernel, and production conventions. Configure
            everything through environment variables and scale without rewrites.
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="https://github.com/aifa-agi/aifa-v2"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Use a Starter
            </Link>
            <Link
              href="https://github.com/aifa-agi/aifa-v2"
              className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Follow a Guide
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="pb-4 text-center text-xs text-muted-foreground">
          © {CURRENT_YEAR} {appConfig.short_name}. All rights reserved.
        </footer>
      </main>
    </>
  );
}
