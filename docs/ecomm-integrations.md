### E‑commerce Integrations Checklist (SEO, Analytics, Ads, Monitoring)

Scope: Storefront only. Minimal, safe setup references with official docs links.

—

#### 1) Google Search Console (GSC)
- Purpose: Indexing, coverage, enhancements (Product, ItemList, Breadcrumb), sitemaps.
- Verify: DNS TXT (recommended) or HTML file/meta tag.
- In this app: `app/robots.ts` already points to `sitemap.xml` from DB base.
- Official docs: https://support.google.com/webmasters/answer/34592

#### 2) Google Analytics 4 (GA4)
- Purpose: Traffic, conversions, funnels.
- In this app: GA4 via `@next/third-parties` in `app/layout.tsx` using `NEXT_PUBLIC_GA4_MEASUREMENT_ID`.
- Recommended events: view_item, add_to_cart, begin_checkout, purchase.
- Official docs: https://support.google.com/analytics/answer/9304153

#### 3) Google Tag Manager (GTM)
- Purpose: Central tag management (ads pixels, custom events).
- DB field exists (`AnalyticsSettings.gtmContainerId`). If used, add `<GTM />` in root layout.
- Official docs: https://support.google.com/tagmanager/answer/6103696

#### 4) Google Merchant Center
- Purpose: Product feeds for Shopping ads/free listings.
- Needs product feed (cron or on‑demand), GTIN/price/availability.
- Official docs: https://support.google.com/merchants/answer/188475

#### 5) Google Ads (Conversion + Remarketing)
- Purpose: Ad conversion tracking and remarketing audiences.
- Implement via GTM or direct gtag; map purchase value/currency.
- Official docs: https://support.google.com/google-ads/answer/6095821

#### 6) Facebook (Meta) Pixel + Conversions API
- Purpose: Ad tracking for Meta platforms.
- Env in app: `NEXT_PUBLIC_FB_APP_ID` supported in metadata extras.
- Use Pixel (browser) + CAPI (server) for resilience.
- Official docs: https://www.facebook.com/business/help/952192354843755

#### 7) TikTok Pixel + Events API
- Purpose: TikTok ads tracking.
- Add via GTM or SDK; send view_content, add_to_cart, purchase.
- Official docs: https://ads.tiktok.com/help/article?aid=10028

#### 8) Snapchat Pixel
- Purpose: Snap ads tracking.
- Add via GTM; track page_view, add_cart, purchase.
- Official docs: https://businesshelp.snapchat.com/s/article/pixel-website-installation

#### 9) Pinterest Tag
- Purpose: Pinterest ads tracking and catalogs.
- Official docs: https://help.pinterest.com/en/business/article/install-the-pinterest-tag

#### 10) LinkedIn Insight Tag
- Purpose: Ads and audience insights for LinkedIn.
- Official docs: https://www.linkedin.com/help/lms/answer/a427660

#### 11) Microsoft Clarity (Session Replay + Heatmaps)
- Purpose: UX insights; privacy‑aware session replay.
- Official docs: https://clarity.microsoft.com/

#### 12) Hotjar (Session Replay + Surveys)
- Purpose: Heatmaps, recordings, feedback.
- Official docs: https://help.hotjar.com/

#### 13) Sentry (Error Monitoring)
- Purpose: Frontend/runtime error tracking with traces.
- Official docs: https://docs.sentry.io/platforms/javascript/guides/nextjs/

#### 14) LogRocket (Session Replay + Errors)
- Purpose: Replay + performance + network diagnostics.
- Official docs: https://docs.logrocket.com/docs/platforms/nextjs

—

### Minimal Setup Map (this repo)
- GA4: set `NEXT_PUBLIC_GA4_MEASUREMENT_ID`. Already wired in `app/layout.tsx`.
- Metadata extras: `company.twitter` (handle only), `NEXT_PUBLIC_FB_APP_ID` for `fb:app_id`.
- Sitemap/robots: `app/sitemap.ts`, `app/robots.ts` ready; DB base URL used.
- SEO JSON‑LD: Organization/WebSite/WebPage/Product/Breadcrumb/ItemList implemented via `helpers/seo`.

### What to Track (baseline e‑comm)
- Product: impressions, view_item, add_to_cart, begin_checkout, purchase (value, currency, items).
- Funnels: homepage → category → product → cart → checkout → purchase.
- Quality: web vitals (LCP, CLS, INP), 404s, API error rates.

### Privacy/Compliance
- Respect consent (CMP) before firing advertising pixels where required.
- Anonymize IP where applicable; document data retention.

### Optional (later, low risk)
- RSS feed for content (add `metadata.alternates.types` + `/feed.xml`).
- Nightly sitemap ping job (Google/Bing) after catalog updates.

---

### GTM Guidance (What to use it for)
- Use GTM for client-side pixels/tags:
  - GA4 (Configuration + Events), Google Ads/Remarketing
  - Meta (Facebook) Pixel, TikTok, Snapchat, Pinterest, LinkedIn
  - Consent Mode v2 and custom HTML tags
  - Ref: https://support.google.com/tagmanager/answer/6103696
- Avoid GTM for:
  - Server-side events/APIs (Meta/TikTok Conversions API) → needs server endpoint
  - Google Merchant Center product feeds → separate feed/job
  - Sitemaps/robots or SEO metadata → handled in code
  - GSC verification (GTM works, but DNS TXT/HTML file is more reliable)
- Recommended here:
  - Keep GA4 via code (already wired) and add ad/marketing pixels via GTM
  - Enable Consent Mode v2 in GTM
  - Verify GSC via DNS TXT; keep sitemap/robots in code

