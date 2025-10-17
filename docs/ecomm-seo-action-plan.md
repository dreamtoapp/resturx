### E‑commerce SEO Action Plan (Storefront Only)

Scope: `app/(e-comm)/**` only. Excludes any `app/dashboard/**` routes.

Principle: All SEO content must be dynamic from the database (no hardcoded literals). Titles, descriptions, canonicals, images, prices, availability, site name/logo, and URLs are resolved from DB-backed sources at request time or via cached server helpers.

Strict rule (must follow before any new step)
- Always consult the official docs and align with best practices:
  - Next.js App Router SEO: metadata/generateMetadata/sitemap/robots
  - Google Search guidelines: Product/ItemList/Breadcrumb/Organization/WebSite JSON‑LD, canonicals, robots.txt
- Apply zero‑risk changes only (minimal, isolated, reversible). No global behavior/styling changes.
- Prefer reusable helpers over per‑page logic. Keep pages thin.
- Before any edit: deep‑scan the codebase. If the item is already implemented, mark the task as completed (no edit made).

### High-Importance SEO Must-Haves (Storefront)
- [x] Canonical helper from DB base URL and usage on key routes
- [x] Home: generateMetadata, canonical `/`, WebPage + ItemList JSON‑LD
- [x] Product: canonical, Product JSON‑LD (offers absolute url, price, currency, availability), aggregateRating when present
- [x] Product: BreadcrumbList (Home → Category → Product) when relations exist
- [x] Category: generateMetadata, canonical, ItemList JSON‑LD, alternates.pagination
- [x] Offers: generateMetadata, canonical, ItemList JSON‑LD
- [x] Layout defaults + Organization/WebSite JSON‑LD with SearchAction
- [x] Robots/Sitemap: DB-driven sitemap; robots disallow dashboard/api/search; API X‑Robots‑Tag: noindex
- [x] Image LCP: priority + fetchpriority="high" on home hero and product main image
- [x] Optional: layout metadata extras from DB (twitter:site from company.twitter; fb:app_id from env)

Configuration notes:
- `company.twitter`: store only the handle (e.g., `mybrand` or `@mybrand`). Do NOT store the full URL.
- Environment: set `NEXT_PUBLIC_FB_APP_ID` (or `FB_APP_ID`) to your Facebook App ID.

Data sources (DB → SEO):
- Company (`company`): brand name, logo, website/appUrl (canonical base), tax %, social, defaultCurrency.
- Product (`product`, `reviews`, `supplier`): name, details, images, price/compareAtPrice, stock, rating/reviewCount, brand.
- Category (`category`): name, description/intro, slug.
- Offer (`offer`, linking table): title, description, product list.

#### 0) Baseline Findings
- Home (`app/(e-comm)/page.tsx`): no `generateMetadata`; no canonical; no JSON‑LD; dynamic grid; sections lack headings for SEO context.
- Product (`app/(e-comm)/(home-page-sections)/product/[slug]/page.tsx`): has `generateMetadata` + OG image. Missing: canonical, `BreadcrumbList`, `Product` JSON‑LD with `offers`/`aggregateRating`, structured Q&A/FAQ.
- Category/Offer pages: partial metadata (check), but likely missing canonical, `ItemList` JSON‑LD, pagination rel prev/next.
- Layout (`app/(e-comm)/layout.tsx`): no global `metadata` defaults (site name, OG/Twitter, robots), no `WebSite`/`Organization` JSON‑LD, no SearchAction.

---

#### 1) Global SEO Defaults (layout)
- [x] Add site‑wide `metadata` defaults in `app/(e-comm)/layout.tsx` using values fetched from DB (`company`): site name, description, logo, social links → openGraph/twitter/robots/icons.
- [ ] Inject Organization + WebSite JSON‑LD with `SearchAction` from DB company fields (name, logo, website/appUrl).
- [ ] Ensure `<html lang="ar" dir="rtl">` is preserved; canonical base host comes from DB `company.website` (fallback: env).

Best‑practice extras:
- [ ] Add `metadata.alternates.types` for `application/rss+xml` if you expose feeds later.
- [ ] Provide `metadata.other` with `fb:app_id`/`og:site_name`/`twitter:site` when available from DB.

#### 2) Home Page
- [x] Implement `export async function generateMetadata()` in `app/(e-comm)/page.tsx` (title/description from DB `company`, canonical `/` built from `company.website`).
- [x] Add `WebPage` + `ItemList` JSON‑LD summarizing featured products (top N from DB query): id, name, url, image, price/currency.
 - [x] Ensure sections have semantic headings (`h2` with Arabic keywords: العروض، التصنيفات، المنتجات).
- [x] Include short intro copy (≤ 160 chars) for topical relevance (added small paragraph).

#### 3) Product Detail Page
- [x] Add canonical URL to metadata (`/product/[slug]`) using DB base URL.
- [x] Add `BreadcrumbList` JSON‑LD (Home → Category → Product) from DB relations (product.category path).
- [x] Expand `Product` JSON‑LD from DB fields: `brand`/supplier, `sku`/`gtin` (if available), `offers` (price, priceCurrency from company.defaultCurrency, availability from stock), `aggregateRating` from reviews.
- [ ] Add `FAQPage` JSON‑LD only if per‑product Q&A exists (currently not in schema) — skip for now.
- [x] Ensure `alt` text on product images maps to product name (verified in components).
- [ ] Prefer stable product URLs using immutable slugs; redirect old slugs with 301.
- [ ] Add `meta robots: max-image-preview:large` (OpenGraph already carries main image).
 - [x] Add `meta robots: max-image-preview:large` (OpenGraph already carries main image).

#### 4) Category Pages `app/(e-comm)/(home-page-sections)/categories/[slug]/page.tsx`
- [x] Implement/verify `generateMetadata` (title/description from DB category), canonical from DB base.
- [x] Add `ItemList` JSON‑LD for the first page of products (limit 50) populated from DB query.
 - [x] Add rel prev/next for paginated results via metadata links (Next alternates.pagination).
- [x] H1 is category name; add intro copy (1–2 sentences) for relevance.
- [ ] Add filter facets as query params but canonicalize to unfiltered category unless filter pages have search demand.

#### 5) Offer Pages `app/(e-comm)/(home-page-sections)/offers/[slug]/page.tsx`
- [x] Ensure `generateMetadata`, canonical, OG/Twitter using DB offer title/desc.
- [x] Add `ItemList` JSON‑LD of discounted items from DB.
- [ ] Add campaign `utm_*` handling: strip on canonical, allow for analytics only.

#### 6) Canonicals & Sitemaps
- [x] Create canonical helper that builds absolute URLs from DB `company.website`; use in all `generateMetadata`.
- [x] Ensure sitemap (`app/sitemap.ts` or `next-sitemap`) queries DB to emit: home, categories, offers, products with `lastmod` = `updatedAt`.
- [x] Add `/robots.txt` to allow crawl; disallow dashboard and API; use DB base for sitemap URL.
- [x] Add `X‑Robots‑Tag: noindex` in API routes where applicable to keep them out of index (middleware).
 - [x] Exclude filtered/sort URLs from sitemap; include only canonical pages.

#### 7) Performance/Indexability Aids (SEO‑adjacent)
- [x] Verify LCP hero images use `priority`/`fetchpriority` and stable sizing (no change needed).
- [x] Switch primary font to Tajawal using next/font with preload+swap.
- [ ] Preload critical font; keep CLS stable; ensure `Image` has width/height).
- [ ] Use pagination (infinite scroll keeps SSR’ed first page, expose paginated API links for bots).
- [ ] Ensure no blocking console errors; avoid duplicate titles.
- [ ] Lazy‑load below‑the‑fold images; keep LCP image not lazy.
- [ ] Use `priority` on above‑the‑fold media; add `fetchpriority="high"` to LCP where beneficial.
- [ ] Add `next/headers` caching where safe, and `revalidatePath` on catalog changes.
 - [x] Enable ISR on product and category pages (`revalidate = 60`).

#### 8) Internationalization (optional, later)
- [ ] If adding English later, implement `alternates.languages` in metadata + `hreflang` pairs.

---

### Implementation Todo (by file)
- [x] `app/(e-comm)/layout.tsx`: add `metadata` defaults + Organization & WebSite JSON‑LD fed by DB (`company`).
- [x] `app/(e-comm)/page.tsx`: `generateMetadata` from DB, canonical via helper, `ItemList` JSON‑LD from product query, semantic headings.
- [x] `app/(e-comm)/(home-page-sections)/product/[slug]/page.tsx`: canonical via helper, `BreadcrumbList` from DB relations, enriched `Product` JSON‑LD from DB, optional FAQ JSON‑LD.
- [x] `app/(e-comm)/(home-page-sections)/categories/[slug]/page.tsx`: metadata/canonical from DB, `ItemList` JSON‑LD, rel prev/next.
- [x] `app/(e-comm)/(home-page-sections)/offers/[slug]/page.tsx`: metadata/canonical from DB, `ItemList` JSON‑LD.
- [x] `helpers/seo/canonical.ts` (new): build absolute canonical from DB `company.website` (with server cache).
- [x] `app/sitemap.ts`: uses helpers/seo to build URLs from DB (single public sitemap route).
- [x] `app/robots.ts`: uses DB canonical base; excludes `/dashboard/**` and `/api/**`.

---

### New Reusable Helpers (to create under `helpers/seo/`)
- [x] `canonical.ts`: `buildCanonical(path: string): Promise<string>` — reads `company.website` once (cached) and returns absolute URL.
- [x] `metadata.ts`: `buildMetadata(opts)` — composes Next `Metadata` using DB company defaults; accepts per‑page overrides and canonical.
- [x] `jsonld/organization.ts`, `jsonld/website.ts`: layout‑level JSON‑LD using company name/logo/website.
- [x] `jsonld/product.ts`: from Product + Reviews + Supplier + currency; emits valid Product schema.
- [x] `jsonld/itemList.ts`: for Home/Category/Offers first page items.
- [x] `jsonld/breadcrumb.ts`: from entity path (Home → Category → Product).
- [x] `jsonld/faq.ts`: optional from product Q&A if present.
- [x] `sitemap.ts`: DB → array of { url, lastmod } for home/categories/offers/products.

Usage pattern: pages stay thin — fetch DB data, call helpers, return metadata/JSON‑LD. No duplication across routes.

### Faceted Navigation & Pagination Rules
- Canonical:
  - [ ] Canonical to the clean category URL by default.
  - [ ] If a facet has proven search demand (e.g., brand=adidas), generate a dedicated canonical landing page; otherwise keep canonical to parent.
- Pagination:
  - [ ] Use `metadata.alternates` with `pagination: { current, previous, next }` or link tags to hint sequences.
  - [ ] Keep page 1 canonical to base; page ≥2 canonical to ?page=N.
- Indexing controls:
  - [ ] `noindex` for thin/empty category pages; lift when populated.
  - [ ] Block internal sort parameters (`?sort=price_asc`) from sitemap and canonicalize to base.

### URL & Content Hygiene
- [ ] Enforce lowercase, hyphenated slugs; strip stop‑words in Arabic where sensible.
- [ ] 301 redirect old product slugs to new slugs; keep a slug history table if possible.
- [ ] Unique titles/descriptions per page; avoid templated duplicates across categories.
- [ ] Image SEO: descriptive `alt`, `width/height`, WebP/AVIF, `og:image:width/height` 1200×630.

### Structured Data Do/Don’t
- Do: Validate in Google Rich Results; include only available fields; keep currency from DB.
- Do: Include `availability` and `priceValidUntil` when known.
- Don’t: Emit empty arrays or placeholder values; don’t duplicate conflicting JSON‑LD blocks.

### Monitoring & QA
- [ ] Add a nightly job to regenerate sitemap and ping Google when product counts change.
- [ ] GSC dashboards: coverage errors, enhancement (Product/Breadcrumb/ItemList), CTR per page type.
- [ ] Track LCP/CLS/INP per template via Web Vitals.
- [ ] Log canonical and robots meta for sampled URLs in production to catch regressions.

### Rollout Order (highest ROI first)
1) Product JSON‑LD (offers/rating) + canonical helper
2) Layout metadata defaults + Organization/WebSite JSON‑LD
3) Category metadata + ItemList + pagination signals
4) Sitemap/robots from DB
5) Home metadata + WebPage/ItemList
6) Offers metadata + ItemList
7) Performance polish (LCP preloads, lazy‑load)

---

### Recommendation Order (Safe, Minimal Edits)
1) Add WebPage JSON‑LD on Home (`app/(e-comm)/page.tsx`) — DONE
2) Include category in Product `BreadcrumbList` when available — DONE
3) Use absolute URL for `offers.url` in Product JSON‑LD — DONE
4) Canonicalize filtered category URLs to base unless facet is whitelisted — DONE
5) Strip `utm_*` from canonicals if ever passed through — DONE
6) Optional layout metadata extras from DB (`twitter:site`, `fb:app_id`)

### Remaining (by priority)
1) Auto-apply `noindex` on thin/empty category pages (lift when populated) — DONE
2) Preload critical font subset (Tajawal) and verify CLS stability — DONE
3) Enforce slug hygiene (lowercase, hyphenated) and add 301 redirects for old product slugs
4) Nightly sitemap regeneration and Google ping on product count changes
5) GSC dashboards/alerts for coverage and rich results; track CTR per template
6) Production logging for sampled canonical/robots to detect regressions
7) Expose RSS feed later and add `metadata.alternates.types` (if needed)
8) Add `alternates.languages`/`hreflang` when English is introduced

### Success Criteria
- Core pages render titles/descriptions, canonical, OG/Twitter.
- JSON‑LD valid in Rich Results Test for Product, ItemList, Breadcrumb, Organization, WebSite.
- No duplicate titles/canonicals; paginated category pages expose prev/next.
- Sitemap lists products/categories/offers with `lastmod`.



---

### Next.js App Router SEO Best Practices (v15)
- **Metadata generation**: Prefer `generateMetadata()` per route. Keep pages thin; delegate to `helpers/seo/metadata.ts`.
- **Canonical**: Use `metadata.alternates.canonical` with absolute URLs derived from DB via `helpers/seo/canonical.ts`.
- **Pagination**: Use `metadata.alternates.pagination = { current, previous, next }` where applicable.
- **metadataBase**: Always set from DB base (`getCanonicalBase()`), ensuring relative OG/Twitter URLs resolve correctly.
- **Robots**: Set `robots` per page when needed (e.g., `max-image-preview:large` on product). Block internal pages via `app/robots.ts` and `X‑Robots‑Tag` for API in `middleware.ts`.
- **OpenGraph/Twitter**: Provide image with 1200×630 when possible; include `siteName`, `url`.
- **RSC boundaries**: Keep layouts/pages as server components; inject JSON‑LD via `<script type="application/ld+json" />` only.

### Structured Data Best Practices
- **WebSite**: Include `potentialAction` → `SearchAction` with query param, using DB base URL.
- **Organization**: Emit `name`, `url`, `logo` from DB.
- **WebPage (home)**: Emit high-level `WebPage` or `CollectionPage` when relevant; pair with `ItemList`.
- **Product**:
  - Required: `name`, `image`, `description` (when available), `offers` `{ price, priceCurrency, availability, url(abs) }`.
  - Recommended: `brand` (supplier), `aggregateRating` `{ ratingValue, reviewCount }` when present.
  - Use absolute URLs in `offers.url` (canonical helper).
- **BreadcrumbList**: Use full path `Home → Category → Product` when relations exist.
- **ItemList**: Limit to top 50 items per page; include `position`, `url(abs)`, `name`, `image`.
- Validate in Google Rich Results; avoid emitting empty arrays or placeholder values.

### Canonicalization Policy Details
- **Base rule**: Canonical to the cleanest, user-friendly URL.
- **Facets/filters**: Canonicalize filtered category URLs to base unless a facet is productized/whitelisted for SEO.
- **Tracking params**: Strip `utm_*`, `gclid`, etc., from canonical construction.
- **Pagination**: Page 1 canonical → base; page ≥ 2 canonical → include `?page=N`.
- **Duplicates**: Ensure only one canonical per route; exclude filtered/sorted URLs from sitemap.

### Pagination & Filtering Signals
- **Alternates**: Provide `previous`/`next` links via `metadata.alternates.pagination` on categories.
- **Sitemap**: Include only canonical pages; do not include pages with transient filters/sorts.
- **Indexing**: Thin pages can use `noindex` until populated; remove when content threshold is met.

### Robots & Sitemap
- **robots.txt**: Allow storefront; disallow dashboard, auth, cart/checkout, internal search, API. Point `sitemap` to DB-derived base.
- **X‑Robots‑Tag**: Set `noindex` for API responses in middleware.
- **Sitemap**: Emit home, categories, offers, products with `lastmod` from DB `updatedAt`. Deduplicate and strip query/hash.

### Performance & Indexability Aids
- **Images**: Provide explicit `width/height`; use `priority`/`fetchpriority="high"` for LCP image; lazy‑load below-the-fold. — DONE (home hero + product main image)
- **Fonts**: Preload critical font subset; use `display=swap`; maintain CLS stability.
- **Caching**: Use ISR (`export const revalidate = 60`) where safe; revalidate on catalog changes.
- **Console**: Ensure no blocking errors; avoid duplicate titles/descriptions.

### QA & Monitoring
- Validate JSON‑LD regularly (Rich Results test) and track coverage in GSC.
- Monitor Core Web Vitals (LCP/CLS/INP) per template via Web Vitals.
- Log sampled canonicals/robots in production to catch regressions quickly.

---

### Tag Management (GTM) Guidance
- Use GTM for client-side pixels/tags:
  - GA4 (Config + Events), Google Ads/Remarketing
  - Meta (Facebook) Pixel, TikTok, Snapchat, Pinterest, LinkedIn
  - Consent Mode v2, custom HTML tags
  - Ref: https://support.google.com/tagmanager/answer/6103696
- Do not use GTM for:
  - Server-side events/APIs (Meta/TikTok CAPI) → needs server endpoint
  - Google Merchant Center product feeds → separate feed/job
  - Sitemaps/robots or SEO metadata → in code (this repo)
  - GSC verification (GTM works, but DNS TXT/HTML file is more reliable)
- Recommended setup in this repo:
  - Keep GA4 via code (already wired); add ad/marketing pixels via GTM
  - Enable Consent Mode v2 in GTM
  - Verify GSC via DNS TXT; keep sitemap/robots in code
