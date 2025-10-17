## Zero-Risk Action Plan: Multi-Image Hero Slider

Goal: Enable a multi-image hero slider on the homepage without breaking existing single-image behavior that uses `company.profilePicture` and `showHeroImage`.

### Implementation TODOs (Start with Dashboard)
- [x] Dashboard: extend `HeroImageForm` to manage multiple images
  - [x] Add list UI for slides with preview, add, remove, reorder
  - [x] Persist order and values via server action `saveHeroSlides`
  - [x] Enforce max 10 slides with remaining count hint
- [x] Dashboard: validation updates
  - [x] Update `companyZodAndInputs.ts` to accept `heroSlides` (Json[]) and `useHeroSlider`
  - [x] Backward-compat support for `heroImages` (String[])
- [x] API: image deletion (DB + Cloudinary)
  - [x] Add DELETE endpoint (e.g., `app/api/images/delete/route.ts`)
  - [x] Request: `{ table:'company', recordId, field:'heroSlides'|'heroImages', publicId?, url?, index? }`
  - [x] Steps: destroy by `publicId` → update DB → revalidate tags/paths
- [x] Schema (MongoDB, additive only)
  - [x] Add `heroSlides Json[] @default([])` to `Company`
  - [x] Keep `heroImages String[] @default([])` and `profilePicture` untouched
  - [x] Run `pnpm prisma db push && pnpm prisma generate`
- [x] Upload flow (reuse, no new infra)
  - [x] Use existing `app/api/images/route.ts` with `uploadOnly`
  - [x] Store `{ url, publicId }` in `heroSlides` (and sync `heroImages`)
- [x] Homepage selection logic (non-invasive)
  - [x] If `showHeroImage=false` → render nothing
  - [x] Else if `useHeroSlider=true` and `heroSlides.length>0` → render slider
  - [x] Else if `profilePicture` exists → render current `HomepageHeroSection`
- [x] Slider adapter (data mapping only)
  - [x] Map `heroSlides` to `HomepageHeroSlider` props; keep existing optimizations
- [ ] Testing (no regressions)
  - [ ] Verify three states above on mobile/tablet/desktop
  - [ ] Confirm no layout shifts or performance regressions

### Constraints (Production-Safe)
- Preserve current behavior by default: if no new data is configured, the homepage continues to use the current single image section or renders nothing when disabled.
- No breaking schema changes; only additive fields and flags.
- No dependency/version changes.
- Guard all new UI/logic behind feature flags and non-invasive fallbacks.

---

### Step 1: Database (Additive-only)
Explicit schema update for `prisma/schema.prisma` → `model Company`.

Add these additive fields (do not modify existing ones):

```prisma
// In model Company { ... }
heroImages    String[] @default([])    // Legacy: image URLs only (kept for backward compatibility)
useHeroSlider Boolean  @default(false) // Feature flag to enable slider
heroSlides    Json      @default([])   // New: [{ url: string, publicId: string }] for Cloudinary
```

Recommended placement (right after the existing `profilePicture` field for clarity), but any position inside `Company` is fine:

```prisma
model Company {
  // ... existing fields ...
  profilePicture String @default("") // Profile picture URL

  // New additive fields for hero slider (backward compatible)
  heroImages    String[] @default([])
  useHeroSlider Boolean  @default(false)
  heroSlides    Json      @default([])

  // ... existing fields remain unchanged ...
}
```

Do NOT remove or change `profilePicture` or `showHeroImage`.

Apply schema to MongoDB and regenerate client:
- `pnpm prisma db push`
- `pnpm prisma generate`

Risk: None (purely additive fields, disabled by default, no behavior change until used).

---

### Step 2: Admin Settings UI (Add-only, Feature-Flagged)
- Location: `app/dashboard/management/health-status/setting/hero-image/`.
- Extend the existing `HeroImageForm` to manage:
  - Upload and manage multiple images (array of URLs) using existing upload flow (`app/api/images/route.ts`).
  - Toggle `useHeroSlider`.
  - Reorder slides via drag-and-drop and persist order on Save.
- Remove/replace image safely (DB + Cloudinary):
  - Remove: call a delete action (see Step 5) that destroys on Cloudinary by `publicId`, then removes the item from DB (`heroSlides`/`heroImages`).
  - Replace: first remove (Cloudinary + DB), then upload new, insert at same index, Save.
- Validation updates:
  - Update relevant Zod schemas in `app/dashboard/management/settings/helper/companyZodAndInputs.ts` to accept `heroImages: z.array(z.string().url()).optional()` and `useHeroSlider: z.boolean().optional()`.
- Server action to save fields (co-locate with existing company update actions):
  - Upsert `heroImages` and `useHeroSlider` on the company record.

Fallback preserved: If `useHeroSlider` is false or `heroImages` is empty, nothing changes for users.

---

### Step 3: Public Homepage Logic (Non-invasive Switch)
- File: `app/(e-comm)/page.tsx`.
- Fetch `company.heroImages` and `company.useHeroSlider` alongside existing fields.
- Render logic (in order):
  1. If `showHeroImage` is false → render nothing (unchanged).
  2. If `useHeroSlider` is true AND `heroImages.length > 0` → render slider.
  3. Else if `profilePicture` exists → render current `HomepageHeroSection` (exactly as now).
  4. Else → render nothing (unchanged).

Note: Keep `HomepageHeroSection` unchanged for backward compatibility. Introduce a new wrapper that chooses between section and slider.

---

### Step 4: Slider Component (Reuse Existing, Data-Driven)
- Reuse `app/(e-comm)/homepage/component/slider/HomepageHeroSlider.tsx`.
- Create a small adapter that maps `heroImages: string[]` to the component’s required `slides` shape (image-only is acceptable; headers/CTA can be empty or pulled from future CMS fields if provided).
- Ensure the slider is rendered only when `useHeroSlider` is true and `heroImages` is not empty.

Performance and UX safeguards:
- Keep `priority` only for the first slide, lazy-load subsequent ones.
- Maintain blur placeholders and sizes as currently implemented.

---

### Step 5: Image Upload/Removal Flow (DB + Cloudinary)
- Upload: reuse `app/api/images/route.ts` (upload-only mode supported) to get Cloudinary URL; store `{ url, publicId }` in `heroSlides` (preferred) or URL in `heroImages`.
- Remove: remove from Cloudinary AND DB.
  - API: add `DELETE app/api/images/route.ts` (or create `app/api/images/delete/route.ts`).
  - Request body (JSON): `{ table: 'company', recordId: string, field: 'heroSlides' | 'heroImages', publicId?: string, url?: string, index?: number }`.
  - Server steps (ordered, with safety):
    1) If `publicId` provided → `cloudinary.v2.uploader.destroy(publicId)`; if it fails, return 502 and do NOT mutate DB.
    2) Update DB: remove matching slide from `heroSlides` by `publicId` (or matching URL in `heroImages`). Persist the updated array.
    3) Revalidate relevant tags/paths (e.g., `company`, `/`).
  - Idempotency: if asset already removed on Cloudinary, treat as success and still remove from DB.
- Ensure client-side form supports add/remove/reorder with optimistic UI limited to admin scope.

---

### Step 6: Feature Flags and Safe Rollout
- Default `useHeroSlider` to false.
- Admin enables `useHeroSlider` only after uploading at least one image.
- Quick rollback: toggle `useHeroSlider` off to immediately return to the single-image hero.

---

### Step 7: SEO/Accessibility
- Keep alt text generic for now (no schema change); use `"Hero Slide"` as alt.
- No change to structured data required; this is a visual hero element.

---

### Step 8: Testing & Verification (No UI regressions)
- Build & type-check: `pnpm build`.
- Verify homepage when:
  - `showHeroImage=false` → no hero (unchanged).
  - `showHeroImage=true`, `useHeroSlider=false`, `profilePicture` set → single image renders (unchanged).
  - `showHeroImage=true`, `useHeroSlider=true`, `heroImages=[...]` → slider renders.
- Responsive checks: mobile, tablet, desktop heights unchanged; no layout shift.
- Performance: verify initial slide is preloaded; others lazy.

---

### Step 9: Rollback Plan
- To disable slider instantly: set `useHeroSlider=false`.
- To fully revert: leave `heroImages` populated; fields are ignored unless `useHeroSlider` is true.
- No code revert required; fields are additive and harmless when unused.

---

### Deliverables Summary
- Schema: Add `heroImages: String[]`, `useHeroSlider: Boolean` (Company).
- Admin: Extended hero image settings to manage multiple images + toggle.
- Frontend: Non-breaking wrapper that selects slider vs single-image component.
- No changes to existing `HomepageHeroSection` behavior.


