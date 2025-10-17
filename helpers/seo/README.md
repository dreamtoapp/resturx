SEO Helpers (Storefront)

Purpose
- Central, reusable, DB‑driven builders for canonical URLs, Next.js metadata, JSON‑LD, and sitemap entries.
- Pages stay thin: fetch data → call helpers → return metadata/JSON‑LD.

Data sources
- company: db.company.findFirst() → website (canonical base), fullName (brand), logo, defaultCurrency
- product (+reviews, supplier), category, offer → page‑level data

Modules
- canonical.ts: buildCanonical(path)
- metadata.ts: buildMetadata(opts)
- jsonld/organization.ts, website.ts
- jsonld/product.ts, itemList.ts, breadcrumb.ts, faq.ts
- sitemap.ts: DB → urls

Notes
- All helpers are read‑only and cache company read to avoid extra DB calls.
- No pages modified by these helpers; wire them incrementally after validation.


