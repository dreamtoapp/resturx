## Hero Slider as Primary (Remove profilePicture Fallback) — Zero-Risk Plan

Goal
- Make the hero slider the only hero when `showHeroImage` is true.
- Stop using `profilePicture` for homepage hero.
- Keep DB compatibility (no destructive migrations).

Principles
- Zero downtime; minimal, surgical edits only.
- No schema deletion. We stop reading `profilePicture` but keep the field.
- Single toggle UX: `showHeroImage` controls hero visibility; no second toggle needed.

1) Toggle Strategy (UX)
- Keep only `showHeroImage` to control hero visibility.
- Treat slider as the default hero when `showHeroImage` is true.
- Ignore `useHeroSlider` in rendering and admin UI (field remains in DB for compatibility).

2) Homepage Behavior
- Render `HomepageHeroSlider` only when:
  - `showHeroImage === true`
  - `heroSlides.length > 0`
- Do NOT fall back to `profilePicture`.
- If `showHeroImage === true` and `heroSlides` is empty → render nothing (no placeholder).

3) Admin Dashboard (State now)
- Already done:
  - Removed single-image uploader from hero page.
  - Grid manager for multi-images (add/delete/reorder, max=10, remaining hint).
  - Save persists `{ url, publicId }` to `company.heroSlides` and syncs `heroImages`.
  - Cloudinary delete + DB update, idempotent.
- Finalize:
  - Keep the tip/hint card under the grid.
  - Hide any `useHeroSlider` UI in platform settings.

4) API & Actions (No new infra)
- POST `/api/images`: returns `{ imageUrl, publicId }` (uploadOnly supported).
- DELETE `/api/images/delete`: removes Cloudinary asset by `publicId`, then updates DB array.
- `saveHeroSlides` action persists `heroSlides` and syncs `heroImages`.

5) Schema & Data (Non-destructive)
- Keep fields: `profilePicture`, `useHeroSlider` (unused for hero).
- Optional adapter migration (safe): if `showHeroImage === true` and `heroSlides` empty and `profilePicture` exists → push `{ url: profilePicture }` to `heroSlides[0]` (optional).

6) Copy & Hints
- Hero settings page:
  - Header: “الحد الأقصى 10 صور. المتبقي: X.”
  - Bottom hint card with formats/dimensions.
- Platform settings: show only `showHeroImage` (note that slider is default when enabled).

7) Testing Checklist
- Admin
  - Add 1–3 slides → Save → Refresh: grid repopulates from DB.
  - Delete slide → Cloudinary + DB remove; remains consistent after refresh.
  - Reorder → Save → order persists.
  - At 10 slides → Add disabled; hint displays remaining = 0.
- Homepage
  - `showHeroImage=false` → hero hidden.
  - `showHeroImage=true` + `heroSlides>0` → slider renders.
  - `showHeroImage=true` + `heroSlides=[]` → hero hidden (no fallback).
- Performance: no layout shift; first slide prioritized; others lazy.

8) Rollback
- Temporary rollback: re-enable `profilePicture` fallback in homepage conditional.
- No schema rollback required.

Deliverables Summary
- Homepage: remove `profilePicture` fallback; rely on `heroSlides` when `showHeroImage` is true.
- Admin: slider grid only; keep tip card; hide `useHeroSlider` UI.
- API/Actions: unchanged (already support url/publicId and delete).
- Schema: no destructive changes.


