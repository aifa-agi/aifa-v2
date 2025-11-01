// Comments: Home page made purely server-rendered except for ClientTabs block.
// Theme toggles now use server links from layout header.

import Link from 'next/link';
import { ClientTabs } from '@/components/client/tabs';

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
        <Link href={href} className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
          Learn more →
        </Link>
      )}
    </div>
  );
}

function Hint({ title, lines }: { title: string; lines: string[] }) {
  return (
    <details className="group rounded-xl border border-border bg-muted/40 px-5 py-4">
      <summary className="cursor-pointer list-none text-sm font-medium text-foreground">{title}</summary>
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

// Заменяем только иллюстрацию, остальной файл без изменений.

function LoadingIllustrationSSR() {
  const srcLight = '/app-images/app-config-images/loading-light.svg';
  const srcDark = '/app-images/app-config-images/loading-dark.svg';
  return (
    <div className="relative h-full w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <picture>
        <source media="(prefers-color-scheme: dark)" srcSet={srcDark} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={srcLight} alt="Loading" className="h-full w-full object-contain" />
      </picture>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={srcLight} alt="Loading" className="h-full w-full object-contain" />
      </noscript>
    </div>
  );
}


export default async function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-12 sm:py-16">
      <section className="grid items-center gap-8 sm:grid-cols-2">
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <Pill text="Next.js 15" />
            <Pill text="React 19" />
            <Pill text="PWA" />
            <Pill text="SEO-first" />
            <Pill text="Env-driven" />
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-[-0.02em] text-foreground sm:text-5xl">
            AIFA — Enterprise AI Next.js Starter
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            Build production-grade AI apps with a progressive web app core, battle‑tested SEO, and env‑driven branding.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/starters" className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Get Starter
            </Link>
            <Link href="/docs" className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted">
              Read Docs
            </Link>
          </div>
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

        <div className="relative">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-muted">
            <LoadingIllustrationSSR />
          </div>
        </div>
      </section>

      <section aria-labelledby="trust" className="space-y-6">
        <h2 id="trust" className="text-xl font-semibold text-foreground">What you get out of the box</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Feature title="SEO Kernel" desc="Metadata API, i18n alternates, OpenGraph/Twitter, JSON-LD builders, robots with AI crawlers." href="/guides" />
          <Feature title="PWA Stack" desc="Manifest, icons, shortcuts, screenshots, SW caching for fonts/images/API, install-ready." href="/starters" />
          <Feature title="DX & Structure" desc="App Router, Env-only branding, semantic routes, error/not-found pages, ISR-friendly." href="/docs" />
          <Feature title="AI-ready" desc="AI bots access rules, knowledge routes (blog/news/docs), and performance baseline." href="/news" />
          <Feature title="Security Headers" desc="nosniff, XSS, frame options, referrer policy, permissions policy baked-in." href="/docs" />
          <Feature title="Image & Fonts" desc="AVIF/WebP, remotePatterns, display=swap, preconnect/preload examples." href="/tutorials" />
        </div>
      </section>

      <section aria-labelledby="interactive" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 id="interactive" className="text-xl font-semibold text-foreground">Deep-dive quick panels</h2>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-lg font-semibold text-foreground">SEO Core</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            <li className="text-sm text-muted-foreground">• Metadata API with env-driven branding</li>
            <li className="text-sm text-muted-foreground">• robots.txt with AI crawlers allowlists</li>
            <li className="text-sm text-muted-foreground">• sitemap.ts with i18n alternates and priority</li>
            <li className="text-sm text-muted-foreground">• JSON-LD builders: Article, FAQ, Product, Breadcrumb</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/robots.txt" className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted">Robots</Link>
            <Link href="/sitemap.xml" className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted">Sitemap</Link>
            <Link href="/docs" className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted">Docs</Link>
          </div>
          <div className="mt-5">
            <details className="group rounded-xl border border-border bg-muted/40 px-5 py-4">
              <summary className="cursor-pointer list-none text-sm font-medium text-foreground">Setup hints</summary>
              <ul className="mt-3 space-y-1">
                <li className="text-xs text-muted-foreground">Set NEXT_PUBLIC_SITE_URL and NEXT_PUBLIC_APP_NAME in .env.local</li>
                <li className="text-xs text-muted-foreground">Configure title template in pageDefaults.titleTemplate</li>
                <li className="text-xs text-muted-foreground">Add Search Console codes when ready</li>
              </ul>
            </details>
          </div>
          <ClientTabs />
        </div>
      </section>

      <section aria-labelledby="how" className="space-y-6">
        <h2 id="how" className="text-xl font-semibold text-foreground">Configure in minutes</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-base font-semibold text-foreground">Brand & SEO via .env</h3>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_APP_NAME, NEXT_PUBLIC_APP_DESCRIPTION</li>
              <li>• NEXT_PUBLIC_DEFAULT_LOCALE, NEXT_PUBLIC_TWITTER_HANDLE</li>
              <li>• NEXT_PUBLIC_GOOGLE_VERIFICATION, NEXT_PUBLIC_YANDEX_VERIFICATION</li>
            </ul>
            <div className="mt-3">
              <Link href="/guides" className="text-sm font-medium text-primary hover:underline">
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
              <Link href="/starters" className="text-sm font-medium text-primary hover:underline">
                Use PWA starter →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="quicklinks" className="space-y-6">
        <h2 id="quicklinks" className="text-xl font-semibold text-foreground">Explore sections</h2>
        <nav className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/blog" className="rounded-lg border border-border bg-card p-4 hover:bg-muted">
            <div className="text-base font-semibold text-foreground">Blog</div>
            <div className="text-sm text-muted-foreground">Updates, insights, engineering notes</div>
          </Link>
          <Link href="/news" className="rounded-lg border border-border bg-card p-4 hover:bg-muted">
            <div className="text-base font-semibold text-foreground">News</div>
            <div className="text-sm text-muted-foreground">Releases, announcements</div>
          </Link>
          <Link href="/items" className="rounded-lg border border-border bg-card p-4 hover:bg-muted">
            <div className="text-base font-semibold text-foreground">Items</div>
            <div className="text-sm text-muted-foreground">Templates, assets, tools</div>
          </Link>
          <Link href="/docs" className="rounded-lg border border-border bg-card p-4 hover:bg-muted">
            <div className="text-base font-semibold text-foreground">Docs</div>
            <div className="text-sm text-muted-foreground">Architecture and APIs</div>
          </Link>
          <Link href="/guides" className="rounded-lg border border-border bg-card p-4 hover:bg-muted">
            <div className="text-base font-semibold text-foreground">Guides</div>
            <div className="text-sm text-muted-foreground">Step-by-step how-tos</div>
          </Link>
          <Link href="/tutorials" className="rounded-lg border border-border bg-card p-4 hover:bg-muted">
            <div className="text-base font-semibold text-foreground">Tutorials</div>
            <div className="text-sm text-muted-foreground">Learn through practice</div>
          </Link>
          <Link href="/starters" className="rounded-lg border border-border bg-card p-4 hover:bg-muted">
            <div className="text-base font-semibold text-foreground">Starters</div>
            <div className="text-sm text-muted-foreground">Kickstart new apps</div>
          </Link>
        </nav>
      </section>

      <section aria-labelledby="faq" className="space-y-6">
        <h2 id="faq" className="text-xl font-semibold text-foreground">FAQ</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Hint title="How do I change the site name and description?" lines={['Set NEXT_PUBLIC_APP_NAME and NEXT_PUBLIC_APP_DESCRIPTION in .env.local', 'Brand is auto-injected into metadata, manifest, and UI.']} />
          <Hint title="How to enable Search Console verifications?" lines={['Add NEXT_PUBLIC_GOOGLE_VERIFICATION and NEXT_PUBLIC_YANDEX_VERIFICATION', 'They are added to metadata only when non-empty.']} />
          <Hint title="Can I restrict AI crawlers?" lines={['Edit app/robots.ts and replace allow → disallow for GPTBot, PerplexityBot, etc.', 'Default configuration allows AI bots for better AI search visibility.']} />
          <Hint title="How to add dynamic routes to the sitemap?" lines={['Uncomment examples in app/sitemap.ts and fetch from your database/APIs.', 'Remember the 50k URLs per sitemap limit.']} />
        </div>
      </section>

      <section aria-labelledby="cta" className="rounded-2xl border border-border bg-gradient-to-br from-muted to-background p-8 text-center">
        <h2 id="cta" className="text-2xl font-bold text-foreground sm:text-3xl">Ship your AI app with confidence</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">Start with an installable PWA, SEO kernel, and production conventions. Configure everything through environment variables and scale without rewrites.</p>
        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/starters" className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">Use a Starter</Link>
          <Link href="/guides" className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted">Follow a Guide</Link>
        </div>
      </section>

      <footer className="pb-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} AIFA. All rights reserved.</footer>
    </main>
  );
}
