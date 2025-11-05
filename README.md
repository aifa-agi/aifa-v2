# SEO and PWA Starter Architecture: Detailed Analysis

The presented Next.js starter represents an engineering solution where each component operates in synergy to achieve maximum search visibility and seamless user experience as a progressive web application.

## App Config - Central Nervous System of the Application

App Config functions as a single source of truth for all critical application parameters. This TypeScript module imports values from environment variables and creates a strictly typed configuration object accessible throughout the application.

URL and branding management is implemented through the `getSiteUrl()` function, which intelligently determines the base URL. In production, it uses `NEXT_PUBLIC_SITE_URL`; when deploying to Vercel, it automatically substitutes `VERCEL_URL` with HTTPS prefix; in development, it works with `window.location.origin`. This solves the problem of hardcoded URLs and allows a single codebase to work in different environments without modification.

Branding through environment variables eliminates the need to edit code during rebranding. `NEXT_PUBLIC_APP_NAME` controls the full name ("AIFA"), `NEXT_PUBLIC_APP_SHORT_NAME` controls the short name for PWA, `NEXT_PUBLIC_APP_DESCRIPTION` forms the meta description and PWA description. When changing the brand, it suffices to change values in `.env` and rebuild the application.

Image structure is organized as a typed dictionary with metadata. Each image stores the path, format (png, jpg, svg, webp), upload date, and optionally size and resolution. Thematic variants for light/dark modes (loading, notFound, error500, homePage, chatbot) automatically switch through helper functions `getLoadingIllustration(theme)`, `getErrorIllustration(errorType, theme)`. This enables centralized visual asset management and ensures type-safety when accessing images.

SEO configuration contains all parameters affecting indexing. `indexing: 'allow'` globally permits indexing; `sitemapUrl` points to the dynamically generated sitemap.xml; `canonicalBase` establishes the base URL for canonical links. The `disallowPaths` array containing paths for robots.txt - admin, auth, API routes are automatically excluded from indexing. The `social` object consolidates Twitter, GitHub, LinkedIn, Facebook - these data are used in OpenGraph tags, JSON-LD schemas, and hreflang attributes.

OpenGraph parameters are standardized at the configuration level. `type: 'website'` sets the default type with the ability to override at the page level to 'article', 'blog', 'product'. `locale: 'en_US'` follows the OpenGraph format; `imageWidth: 1200` and `imageHeight: 630` correspond to Facebook/LinkedIn recommendations for full-size previews.

Author configuration supports multiple authors through the AuthorConfig interface. Default author is set through env variables with fields: name, email, social profiles (Twitter, LinkedIn, Facebook), bio, jobTitle, image, url. The `getDefaultAuthor()` function returns the standard author for content without explicit authorship. This is critical for Article/BlogPosting schemas where author is a required field.

Content Type Defaults bind sections of the site to content types. Blog → 'blog', Product → 'product', Documentation → 'documentation'. `getContentTypeForSection(section)` returns the correct type for generating specific meta tags and JSON-LD schemas.

**SEO Advantages**: Centralized management prevents metadata desynchronization; type-safety eliminates typos in critical fields; env-driven approach enables deployment to different environments without code changes; helper functions ensure consistency in URL generation and social profile links.

## Construct Metadata - Metadata Factory

Construct Metadata is a universal function for generating Next.js Metadata objects with a complete set of SEO attributes. The function accepts arguments: title, description, image, pathname, locale, contentType, noIndex, noFollow, author and returns a ready object for export in layout/page components.

Data normalization occurs at multiple levels. `truncateDescription()` trims descriptions to 160 characters - the limit beyond which Google truncates snippets with ellipsis. `normalizePath()` ensures proper path format - adds leading slash, removes multiple slashes, trims whitespace. `normalizeOpenGraphType()` maps content types to OpenGraph formats: 'article'/'blog' → 'article', others → 'website'.

Canonical URLs are constructed via `new URL(path, base)` ensuring absolute links. The base URL is taken from `appConfig.seo.canonicalBase` or `appConfig.url`; the path is normalized; the result is always a valid absolute URL without trailing slash. Google requires absolute canonical URLs; relative ones are ignored.

The cached icon collection is formed once at application startup through the `CACHED_ICONS` constant. All icons from app-config are collected (favicon.ico, 32px, 48px, 192px, 512px, Apple Touch Icon) with proper rel, sizes, type attributes. `buildIconConfig()` filters invalid paths and forms an array of IconConfig objects. Caching is critical - metadata is generated on every render; rebuilding the icon array would create unnecessary overhead.

OpenGraph and Twitter Cards are generated from a single dataset. The `openGraph` object contains type, title, description, url, siteName, images (with width/height/alt), locale. The `twitter` object with card: 'summary_large_image', title, description, images, creator, site. Data duplication ensures maximum compatibility - some platforms read only OpenGraph, others only Twitter Cards.

Robots directives are managed at two levels. Base `robots` object with index, follow for all crawlers. Specialized `googleBot` with additional directives: `max-snippet: -1` (unlimited snippet length), `max-image-preview: 'large'` (large image previews), `max-video-preview: -1` (unlimited video preview length). These directives improve representation in Google search results.

Search engine verification is added through the `verification` object if `NEXT_PUBLIC_GOOGLE_VERIFICATION` and `NEXT_PUBLIC_YANDEX_VERIFICATION` environment variables are present. Verification codes are automatically inserted into meta tags, simplifying domain verification in Google Search Console and Yandex Webmaster.

Author information is integrated through the `authors` array. If an explicit author is provided, it is used; otherwise, the default author from app-config is taken. Each author includes name and url, creating a connection to profiles and improving E-A-T (Expertise, Authoritativeness, Trustworthiness) signals for Google.

**SEO Advantages**: A single function ensures metadata consistency across all pages; automatic validation prevents errors (overly long descriptions, incorrect URLs); centralized management simplifies bulk changes; full OpenGraph and Twitter Cards support guarantees beautiful social network previews; robots directives provide fine-grained control over indexing.

## Environment Variables - Configuration Without Compilation

Environment Variables (.env) create an abstraction layer between code and configuration. All variables with the `NEXT_PUBLIC_` prefix are available in the browser; others are server-only.

Site Configuration group manages basic parameters. `NEXT_PUBLIC_SITE_URL=https://aifa.dev` sets the production URL for canonical links and sitemap. `NEXT_PUBLIC_APP_NAME=AIFA` - full name for title tags and OpenGraph. `NEXT_PUBLIC_APP_DESCRIPTION` - long description, truncated to 160 characters for meta description. `NEXT_PUBLIC_MAIL_SUPPORT` is used in JSON-LD ContactPoint and mailto links.

Social Media Links consolidate profiles. `NEXT_PUBLIC_TWITTER_HANDLE=@aifa_agi` supports formats with and without @, normalized to https://twitter.com/aifa_agi. `NEXT_PUBLIC_GITHUB_URL`, `NEXT_PUBLIC_LINKEDIN_URL`, `NEXT_PUBLIC_FACEBOOK_URL` are used in OpenGraph, JSON-LD Organization sameAs, and author profiles. Empty values are ignored, allowing selective profile population.

PWA Configuration controls the manifest. `NEXT_PUBLIC_PWA_THEME_COLOR=#ffffff` sets the toolbar color when the app is installed. `NEXT_PUBLIC_PWA_BACKGROUND_COLOR=#ffffff` - splash screen color at launch. `NEXT_PUBLIC_PWA_SCREENSHOT_MOBILE` and `NEXT_PUBLIC_PWA_SCREENSHOT_DESKTOP` - screenshot URLs for enhanced install prompt in Chrome.

SEO Configuration manages indexing. `NEXT_PUBLIC_SEO_INDEXING=allow` globally permits/forbids indexing. `NEXT_PUBLIC_ROBOTS_INDEX=true` and `NEXT_PUBLIC_ROBOTS_FOLLOW=true` control default directives. In dev/staging, you can set false to prevent indexing of incomplete content.

OpenGraph Configuration standardizes OG tags. `NEXT_PUBLIC_OG_LOCALE=en_US` sets the primary language in OpenGraph format. `NEXT_PUBLIC_OG_IMAGE_WIDTH=1200` and `NEXT_PUBLIC_OG_IMAGE_HEIGHT=630` - recommended sizes for full-size previews. `NEXT_PUBLIC_OG_TYPE=website` - default type, overrideable on article pages.

Content Type Defaults bind sections to types. `NEXT_PUBLIC_BLOG_CONTENT_TYPE=blog`, `NEXT_PUBLIC_PRODUCT_CONTENT_TYPE=product`, `NEXT_PUBLIC_DOC_CONTENT_TYPE=documentation` are used for generating correct JSON-LD schemas (BlogPosting vs Article vs TechArticle).

Author Configuration creates a default author. `NEXT_PUBLIC_DEFAULT_AUTHOR_NAME=AIFA Team`, `NEXT_PUBLIC_DEFAULT_AUTHOR_EMAIL`, `NEXT_PUBLIC_DEFAULT_AUTHOR_TWITTER`, `NEXT_PUBLIC_DEFAULT_AUTHOR_LINKEDIN` form PersonSchema for JSON-LD. `NEXT_PUBLIC_DEFAULT_AUTHOR_BIO` and `NEXT_PUBLIC_DEFAULT_AUTHOR_JOB_TITLE` add context for E-A-T signals. `NEXT_PUBLIC_DEFAULT_AUTHOR_IMAGE` and `NEXT_PUBLIC_DEFAULT_AUTHOR_URL` create visual and link anchoring.

Search Engine Verification simplifies domain verification. `NEXT_PUBLIC_GOOGLE_VERIFICATION` and `NEXT_PUBLIC_YANDEX_VERIFICATION` contain verification codes, automatically inserted into meta tags through construct-metadata. Empty values don't generate tags.

Mobile App Configuration reserves space for native app integration. `NEXT_PUBLIC_IOS_APP_ID` and `NEXT_PUBLIC_ANDROID_PACKAGE` are used in the manifest for deep linking and App Store/Play Store connections.

Environment identifies the environment. `NEXT_PUBLIC_ENVIRONMENT=production` enables conditional logic (analytics disable in dev, different API endpoints in staging).

**SEO Advantages**: Metadata changes without code editing; testing different values through env files; secure verification code storage; data consistency across components; different configurations for staging/production.

## PWA Infrastructure - Progressive Web Application

Next-PWA configuration with Workbox creates production-ready Service Worker. `disable: isDev` disables SW in development for faster development. `register: true` and `skipWaiting: true` ensure automatic registration and immediate update activation without waiting for all tabs to close.

Runtime Caching strategies are differentiated by resource type:

**Google Fonts** use CacheFirst with maximum storage duration (365 days). Styles (fonts.googleapis.com) are cached forever as they're immutable and versioned through URL. Font files (fonts.gstatic.com) also get yearly storage - they don't change, and style changes result in a different URL.

**Images** (png, jpg, jpeg, svg, gif, webp, avif, ico) work on CacheFirst with 30-day duration and 64-entry limit. This ensures instant loading of repeatedly visited pages and offline functionality. LRU (Least Recently Used) eviction automatically removes old images when reaching the limit.

**Next.js static assets** (/_next/static/) get CacheFirst for 24 hours. These files contain hashes in names, so they're safely cached aggressively. 64 entries suffice for most applications.

**API routes** use NetworkFirst with 10-second timeout. Priority goes to fresh data, but when offline, cached response is returned. 24-hour storage and 16-entry limit prevent cache bloat.

Service Worker implementation (public/sw.js) creates three named caches. CACHE_NAME for versioned assets, RUNTIME_CACHE for dynamically cached requests, ASSETS_CACHE for critical static resources.

The install event caches a critical resource set. Icons (192px, 512px), logo, og-image, loading animations for light/dark modes are preloaded when SW installs. `self.skipWaiting()` activates the worker immediately, not waiting for old tabs to close.

The activate event clears outdated caches. `caches.keys()` gets a list of all caches; filtering leaves only current versions; others are deleted via `caches.delete()`. `self.clients.claim()` takes control of all open pages.

The fetch event implements smart request routing. Non-GET requests and external domains are skipped. Static assets (by extension) get Cache-First; pages (navigation requests) - Network-First; API routes - Network-First with JSON-fallback; everything else - Network-First.

Cache-First strategy optimizes static content. First, cache is checked via `cache.match(request)`. On hit, resource returns instantly. On miss, network request is made; successful response (status 200) is cloned and saved in cache for future access. On network error, offline-fallback or 503-response is returned.

Network-First strategy prioritizes freshness. First attempts fetch from network. Successful response is cached and returned. On network error, cache is checked. For pages, offline-fallback or 503 message is returned; for API - JSON with `{"error": "offline"}`.

Push notifications are handled via push event. Data is parsed from `event.data.json()` with default title/body fallback. `self.registration.showNotification()` displays notification with icon, badge, actions (Open/Close).

Notification click manages reactions to clicks. Closes notification, checks for open app windows via `clients.matchAll()`, focuses existing window or opens new via `clients.openWindow()`.

Background sync retries failed requests. Sync event with 'sync-data' tag triggers `retryFailedRequests()`. The function iterates cached requests, attempts fetch retry; on success, updates cache.

Service Worker registration (public/register-sw.js) uses vanilla JavaScript. Checks support via `'serviceWorker' in navigator`. Registers sw.js with scope '/' to control the entire application. Sets update check every hour via `setInterval`. Adds check when page regains focus via visibilitychange event.

Web Manifest (app/manifest.ts) dynamically generates JSON manifest. Takes data from app-config: name, short_name, description, start_url, display, orientation, theme_color, background_color. Assembles array of icons in all sizes with correct purpose (any/maskable). Adds screenshots for rich install prompt, shortcuts for quick access, categories for App Store classification.

PWA Install Prompt component (components/pwa-install-prompt.tsx) creates custom install UI. Detects platform via `navigator.userAgent`; checks installation via `matchMedia('display-mode: standalone')`. Manages state via localStorage with dismissDuration to control show frequency. For Android uses native beforeinstallprompt API; for iOS shows instruction via alert. Badge with pulse animation attracts attention unobtrusively; full prompt expands on click.

**PWA Advantages**: Offline functionality increases retention; fast loading improves Core Web Vitals (important ranking factor); home screen installation increases engagement; push notifications bring users back; app-like experience creates premium perception.

## Next.js Configuration - Production Optimization

Basic optimizations are configured for maximum performance. `reactStrictMode: true` activates additional checks in development to identify issues. `swcMinify: true` uses SWC minifier (7x faster than Terser) for JavaScript compression. `compress: true` enables gzip compression of responses, reducing transmitted data by 70-80%. `poweredByHeader: false` removes X-Powered-By header, hiding the tech stack from potential attacks.

Image optimization is configured for modern formats. `formats: ['image/avif', 'image/webp']` automatically converts to AVIF (20% smaller than WebP) and WebP (30% smaller than JPEG). `deviceSizes` and `imageSizes` cover the full spectrum from mobile to 4K monitors. `minimumCacheTTL: 31536000` caches optimized images for a year. `dangerouslyAllowSVG: true` with CSP allows safe SVG rendering.

HTTP security headers create defense-in-depth. `X-Frame-Options: SAMEORIGIN` blocks embedding in iframes from other domains, preventing clickjacking. `X-XSS-Protection: 1; mode=block` activates browser XSS filter. `X-Content-Type-Options: nosniff` forbids MIME-sniffing, preventing JavaScript execution masked as image. `Referrer-Policy: strict-origin-when-cross-origin` controls redirect information leakage. Permissions-Policy limits access to camera, microphone, geolocation. Strict-Transport-Security forces HTTPS for a year with includeSubDomains.

Content Security Policy details regulate content sources. `default-src 'self'` allows only same-origin by default. `script-src 'self' 'wasm-unsafe-eval'` permits WebAssembly for modern apps. `style-src 'self' 'unsafe-inline'` allows inline styles for CSS-in-JS. `img-src 'self' data: https:` allows base64 data-URLs and any HTTPS images. `connect-src 'self' https:` restricts API requests to HTTPS. `upgrade-insecure-requests` automatically upgrades HTTP to HTTPS.

Differentiated caching optimizes each resource type. Static assets (/public/) get max-age=31536000, immutable - year-long storage without revalidation. Images (/app-images/) similarly cached forever. Next.js static (/_next/static/) with hashed names gets maximum duration. Dynamic content (/api/) marked no-store, must-revalidate for guaranteed freshness. Service Worker (sw.js) gets no-cache, no-store for immediate updates. Manifest cached for an hour; robots.txt for a day; sitemap.xml for an hour.

**SEO Advantages**: Fast loading improves Core Web Vitals (LCP, FID, CLS) - Google ranking factors; security increases Trust Score; proper caching accelerates crawling (Googlebot spends less time loading pages); modern image formats reduce page size (considered in mobile-first indexing); gzip compression accelerates Time to First Byte.

## Service Files - Technical SEO Infrastructure

Sitemap.xml (app/sitemap.ts) dynamically generates the site map. Static routes with priorities: homepage (1.0, daily), about (0.8, monthly), pricing (0.9, weekly), blog/news (0.9, daily). The `buildUrl()` function normalizes paths and builds absolute URLs. `buildAlternates()` generates hreflang for all locales. Commented functions (getDynamicBlogPosts, getDynamicNewsArticles) show the pattern for CMS/database integration. `revalidate: 3600` updates sitemap hourly.

Robots.txt (app/robots.ts) manages bot access. Differentiated crawl delays: Googlebot unrestricted (Google manages itself), Bing/Yandex/DuckDuckGo with 1 second, AdsBots unrestricted for correct ad display, AI bots (GPTBot, Claude, Perplexity) allowed with 1 second. Commented examples show how to block AI crawlers. `disallowPaths` from app-config automatically excludes admin/auth/API. When `indexing: 'disallow'`, returns `disallow: '/'` for all bots.

**SEO Advantages**: Sitemap accelerates discovery of new content; priorities suggest page importance; hreflang prevents multilingual content duplication; robots.txt protects utility sections from indexing; crawl delays reduce server load; AI bot control manages content usage for model training.

This architecture creates a robust foundation where each component strengthens others, forming a cohesive ecosystem for achieving maximum search visibility and superior user experience.

# Integration Guide — Practical Application of the Starter

## SEO-Optimized Page Anatomy

Every page in this starter follows a unified architectural model that guarantees full utilization of all SEO and PWA capabilities. The home page (app/page.tsx) demonstrates the reference structure that developers should reproduce for each new page.

### Three-Component Page Model

**Metadata export** constitutes the first critical layer. The `constructMetadata()` function generates a complete set of meta tags from a minimal set of parameters. On the home page it looks like this:

```
export const metadata: Metadata = constructMetadata({
title: "Enterprise AI Next.js Starter",
description: "Build production-grade AI apps...",
pathname: "/",
contentType: "website",
});
```

The developer passes only page-specific data — title, description, pathname, contentType. The function automatically adds canonical URL, OpenGraph tags, Twitter Cards, icons, robots directives, search engine verification codes, author information. The pathname parameter must exactly match the page route for correct canonical link generation. contentType determines the OpenGraph type (website, article, blog, product, documentation) and affects structured data.

**JSON-LD schemas** form the second layer of semantic markup. The home page includes two basic schemas — WebSite and Organization:

```
const jsonLdWebSite = {
"@context": "https://schema.org",
"@type": "WebSite",
"name": appConfig.name,
"url": appConfig.url,
"description": appConfig.description,
"inLanguage": appConfig.lang,
"potentialAction": {
"@type": "SearchAction",
"target": {
"@type": "EntryPoint",
"urlTemplate": ${appConfig.url}/search?q={search_term_string}
},
"query-input": "required name=search_term_string"
}
};
```


These schemas are embedded into the page via Next.js Script components with `type="application/ld+json"` and `strategy="beforeInteractive"`. The WebSite schema includes SearchAction, which creates a site search box directly in Google results. The Organization schema contains contact information, logo, social profiles from appConfig.seo.social.

**HTML content** represents the third layer with semantic structure. Sections are marked with `<section>` using aria-labelledby; headings are structured hierarchically (h1 → h2 → h3); links contain aria-label for accessibility. Next.js Image components use priority for critical images, unoptimized for SVG, width/height for CLS optimization.

## Patterns for Different Page Types

### Static Page Pattern

The "About" page (app/about/page.tsx) should repeat this structure with adapted parameters:

```
export const metadata: Metadata = constructMetadata({
title: "About AIFA",
description: "Learn about AIFA's mission to democratize AI development...",
pathname: "/about",
contentType: "website",
});

const jsonLdOrganization = generateOrganizationSchema();

export default function AboutPage() {
return (
<>
<Script id="schema-organization" type="application/ld+json"
dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
strategy="beforeInteractive"
/>
<main className="mx-auto max-w-4xl px-6 py-12">
<h1>About {appConfig.name}</h1>
{/* Content */}
</main>
</>
);
}
```


The `pathname: "/about"` parameter generates the correct canonical URL [https://aifa.dev/about](https://aifa.dev/about). The Organization schema is created via the ready-made `generateOrganizationSchema()` generator from lib/seo-generators.ts. The title automatically receives the template from appConfig.pageDefaults.titleTemplate, forming "About AIFA - AIFA".

### Content Page Pattern

The blog page (app/blog/[slug]/page.tsx) requires dynamic metadata generation and Article schema:

```
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
const post = await getBlogPost(params.slug);

return constructMetadata({
title: post.title,
description: post.excerpt,
image: post.featuredImage,
pathname: /blog/${params.slug},
contentType: "blog",
author: post.author,
});
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
const post = await getBlogPost(params.slug);

const jsonLdArticle = generateArticleSchema({
headline: post.title,
datePublished: post.publishedAt,
dateModified: post.updatedAt,
author: post.author,
description: post.excerpt,
image: post.featuredImage,
articleBody: post.content,
wordCount: post.wordCount,
type: "blog",
contentType: "blog"
});

return (
<>
<Script id="schema-article" type="application/ld+json"
dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
strategy="beforeInteractive"
/>
<article>
<h1>{post.title}</h1>
<time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
{/* Content */}
</article>
</>
);
}
```


The `generateMetadata` function dynamically creates metadata based on post data. The `contentType: "blog"` parameter switches the OpenGraph type to "article", which is critical for correct display in social networks. `generateArticleSchema()` creates BlogPosting schema with author information, publication/update dates, image. The author parameter can be an AuthorConfig object or array for multiple authors.

### Product Page Pattern

The product page (app/items/[id]/page.tsx) uses Product schema with ratings and prices:

```
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
const product = await getProduct(params.id);

return constructMetadata({
title: product.name,
description: product.description,
image: product.image,
pathname: /items/${params.id},
contentType: "product",
});
}

export default async function ProductPage({ params }: { params: { id: string } }) {
const product = await getProduct(params.id);

const jsonLdProduct = generateProductSchema({
name: product.name,
description: product.description,
price: product.price,
currency: "USD",
image: product.image,
brand: product.brand,
url: /items/${params.id},
rating: product.averageRating,
reviewCount: product.reviewCount,
});

return (
<>
<Script id="schema-product" type="application/ld+json"
dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProduct) }}
strategy="beforeInteractive"
/>
<div>
<h1>{product.name}</h1>
{/* Product details */}
</div>
</>
);
}

```


Product schema includes required fields: name, price, currency, availability and optional aggregateRating, brand, image. This markup creates Rich Snippets in Google with prices, ratings, and product availability.

### FAQ Page Pattern

The FAQ page receives a special FAQ schema for Rich Snippets:

```
export const metadata: Metadata = constructMetadata({
title: "Frequently Asked Questions",
description: "Find answers to common questions about AIFA...",
pathname: "/faq",
contentType: "website",
});

export default function FAQPage() {
const faqs = [
{ question: "What is AIFA?", answer: "AIFA is an enterprise-ready AI starter..." },
{ question: "Is it open source?", answer: "Yes, AIFA is fully open source under MIT license." },
// More FAQs...
];

const jsonLdFAQ = generateFAQSchema(faqs);

return (
<>
<Script id="schema-faq" type="application/ld+json"
dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }}
strategy="beforeInteractive"
/>
<main>
<h1>FAQ</h1>
{faqs.map((faq, i) => (
<details key={i}>
<summary>{faq.question}</summary>
<p>{faq.answer}</p>
</details>
))}
</main>
</>
);
}
```


FAQ schema uses an array of question-answer pairs and generates an accordion directly in Google search results. HTML structure with `<details>` and `<summary>` is semantically correct and accessible.

### Breadcrumb Pattern

Pages with deep navigation should include BreadcrumbList schema:

```
export default function DocPage({ params }: { params: { category: string, slug: string } }) {
const breadcrumbs = [
{ name: "Home", url: "/" },
{ name: "Documentation", url: "/docs" },
{ name: params.category, url: /docs/${params.category} },
{ name: params.slug, url: /docs/${params.category}/${params.slug} },
];

const jsonLdBreadcrumb = generateBreadcrumbSchema(breadcrumbs);

return (
<>
<Script id="schema-breadcrumb" type="application/ld+json"
dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
strategy="beforeInteractive"
/>
<nav aria-label="Breadcrumb">
{breadcrumbs.map((item, i) => (
<Link key={i} href={item.url}>{item.name}</Link>
))}
</nav>
{/* Content */}
</>
);
}
```


BreadcrumbList schema creates a navigation chain in Google results, improving UX and clickability. Each element contains position, name, item (URL).

## Critical Rules for All Pages

**Metadata uniqueness** is mandatory — each page must have unique title and description. Duplication creates indexing issues and reduces ranking. The `truncateDescription()` function automatically trims descriptions to 160 characters, but developers should create relevant text for each page.

**Correct pathname** is critical for canonical URLs. The pathname parameter must exactly match the route segment in Next.js file structure. For dynamic routes ([slug], [id]), pathname is formed with substituted values. The `normalizeUrl()` function automatically adds leading slash and removes multiple slashes, but initially correct path specification prevents errors.

**Correct contentType** affects OpenGraph type and JSON-LD schemas. Blogs and articles should use `contentType: "blog"` or `"article"`, products — `"product"`, documentation — `"documentation"`. The `normalizeOpenGraphType()` function maps content types to OpenGraph formats: "blog"/"article" → "article", others → "website".

**JSON-LD schemas** must match content type. A page without explicit schema loses Rich Snippets opportunity in Google. The starter provides ready generators for 8 schema types: WebSite, Organization, Person, Article/BlogPosting/NewsArticle, Product, FAQPage, BreadcrumbList, CollectionPage. The `validateSchema()` function checks for required @context and @type fields before sending to DOM.

**Strategy beforeInteractive** for Script components ensures JSON-LD schemas load before page interactivity, critical for crawlers. Unique id prevents script duplication during client-side routing.

**Semantic HTML structure** strengthens SEO signals. One `<h1>` per page; heading hierarchy without gaps (h2 → h3, not h2 → h4); semantic tags (`<article>`, `<section>`, `<nav>`, `<aside>`); alt attributes for images; aria-label for interactive elements.

## ISR Revalidation Implementation

Pages with dynamic content should export revalidate for incremental static regeneration:

```export const revalidate = 3600; // 1 hour

export default async function BlogPage() {
const posts = await getBlogPosts();
// Render posts
}
```


The home page uses `revalidate = 3600`, which rebuilds the page every hour on request. This ensures content freshness without full rebuild. Static pages (about, pricing) can use `revalidate = false` or larger values.

## Page-Level Indexation Control

For pages that shouldn't be indexed (admin panels, drafts), pass `noIndex: true`:

```
export const metadata: Metadata = constructMetadata({
title: "Admin Dashboard",
description: "Internal admin panel",
pathname: "/admin",
noIndex: true,
noFollow: true,
});
```


The `noIndex` and `noFollow` parameters control robots directives at page level, overriding global settings from appConfig.pageDefaults. This creates `<meta name="robots" content="noindex, nofollow">` in `<head>`.

## Author Information Integration

For content with explicit authorship (blogs, articles, guides), pass an author object:

```
export const metadata: Metadata = constructMetadata({
title: "Admin Dashboard",
description: "Internal admin panel",
pathname: "/admin",
noIndex: true,
noFollow: true,
});
```


The `noIndex` and `noFollow` parameters control robots directives at page level, overriding global settings from appConfig.pageDefaults. This creates `<meta name="robots" content="noindex, nofollow">` in `<head>`.

## Author Information Integration

For content with explicit authorship (blogs, articles, guides), pass an author object:

```
const authorConfig: AuthorConfig = {
name: "John Doe",
email: "john@aifa.dev",
twitter: "@johndoe",
linkedin: "johndoe",
bio: "Senior AI Engineer at AIFA",
jobTitle: "AI Engineer",
image: "/team/john.jpg",
url: "https://aifa.dev/team/john"
};

export const metadata: Metadata = constructMetadata({
title: post.title,
description: post.excerpt,
pathname: /blog/${slug},
contentType: "blog",
author: authorConfig,
});

```


Author information is added to authors meta tags and used in Article schemas via `generatePersonSchema()`. Author social profiles are combined into sameAs array for linking to external profiles. If author is not provided, default author from appConfig.author is used.

## Image Optimization for SEO

Open Graph images should conform to recommended 1200×630 pixel dimensions. The image parameter in `constructMetadata()` accepts relative (/images/og.jpg) or absolute URLs (https://aifa.dev/images/og.jpg). Relative URLs are automatically converted to absolute via `new URL(image, appConfig.url)`.

For dynamic Open Graph images, use Next.js Image Generation API:

```
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export async function generateImageMetadata({ params }: { params: { slug: string } }) {
const post = await getBlogPost(params.slug);

return new ImageResponse(
(
<div style={{ /* Styling */ }}>
<h1>{post.title}</h1>
</div>
),
{ width: 1200, height: 630 }
);
}
```


Auto-generated OG images create unique previews for each page.

## Unified Approach Advantages

Using `constructMetadata()` on every page ensures metadata consistency, automatic canonical URL generation, correct OpenGraph and Twitter Cards, icons and verification codes without code duplication. A centralized function simplifies bulk changes — updating title template format or adding new meta tag requires editing only lib/construct-metadata.ts.

Ready-made JSON-LD schema generators guarantee structured data validity and Schema.org specification compliance. The `validateSchema()` function prevents sending invalid schemas to DOM, critical for Rich Snippets.

Env-driven configuration via appConfig allows changing branding, URL, social profiles without modifying page code. During rebranding, it suffices to update .env and rebuild the app — all pages automatically receive new data.

This architecture ensures that each new page automatically gets a complete set of SEO optimizations, PWA compatibility, accessibility, and performance without additional developer effort.

```
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://aifa.dev
NEXT_PUBLIC_APP_NAME=AIFA
NEXT_PUBLIC_APP_SHORT_NAME=AIFA
NEXT_PUBLIC_APP_DESCRIPTION=Free open-source starter kit to build, deploy, and scale intelligent AI applications. Features secure multi-provider auth, Stripe payments, vector knowledge bases, deep-research agents, and unique fractal architecture designed for the future of AI.
NEXT_PUBLIC_MAIL_SUPPORT=support@aifa.dev
NEXT_PUBLIC_CHAT_BRAND=ChatGPT

# Localization
NEXT_PUBLIC_DEFAULT_LOCALE=en

# Social Media Links
NEXT_PUBLIC_TWITTER_HANDLE=@aifa_agi
NEXT_PUBLIC_GITHUB_URL=https://github.com/aifa-agi/aifa
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/company/aifa
NEXT_PUBLIC_FACEBOOK_URL=

# PWA Configuration
NEXT_PUBLIC_PWA_THEME_COLOR=#ffffff
NEXT_PUBLIC_PWA_BACKGROUND_COLOR=#ffffff
NEXT_PUBLIC_PWA_SCREENSHOT_MOBILE=
NEXT_PUBLIC_PWA_SCREENSHOT_DESKTOP=

NEXT_PUBLICTHEME_COLORS_LIGHT=#ffffff
NEXT_PUBLIC_THEME_COLORS_DARK=#09090b

# SEO Configuration
NEXT_PUBLIC_SEO_INDEXING=allow
NEXT_PUBLIC_ROBOTS_INDEX=true
NEXT_PUBLIC_ROBOTS_FOLLOW=true

# OpenGraph Configuration
NEXT_PUBLIC_OG_LOCALE=en_US
NEXT_PUBLIC_OG_IMAGE_WIDTH=1200
NEXT_PUBLIC_OG_IMAGE_HEIGHT=630
NEXT_PUBLIC_OG_TYPE=website

# Content Type Defaults (for different sections)
NEXT_PUBLIC_BLOG_CONTENT_TYPE=blog
NEXT_PUBLIC_PRODUCT_CONTENT_TYPE=product
NEXT_PUBLIC_DOC_CONTENT_TYPE=documentation

# Author Configuration
NEXT_PUBLIC_DEFAULT_AUTHOR_NAME=AIFA Team
NEXT_PUBLIC_DEFAULT_AUTHOR_EMAIL=author@aifa.dev
NEXT_PUBLIC_DEFAULT_AUTHOR_TWITTER=aifa_agi
NEXT_PUBLIC_DEFAULT_AUTHOR_LINKEDIN=aifa
NEXT_PUBLIC_DEFAULT_AUTHOR_FACEBOOK=
NEXT_PUBLIC_DEFAULT_AUTHOR_BIO=Building the future of AI applications
NEXT_PUBLIC_DEFAULT_AUTHOR_IMAGE=/app-config-images/author-avatar.jpg
NEXT_PUBLIC_DEFAULT_AUTHOR_URL=https://aifa.dev
NEXT_PUBLIC_DEFAULT_AUTHOR_JOB_TITLE=AI Developer

# Search Engine Verification
NEXT_PUBLIC_GOOGLE_VERIFICATION=
NEXT_PUBLIC_YANDEX_VERIFICATION=

NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=

# Mobile App Configuration
NEXT_PUBLIC_IOS_APP_ID=
NEXT_PUBLIC_ANDROID_PACKAGE=

# Environment
NEXT_PUBLIC_ENVIRONMENT=production
```


