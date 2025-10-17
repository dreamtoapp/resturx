# Cuisine Actions

This folder contains server actions and business logic for cuisine-related functionality.

## What Goes Here

- ✅ Server actions (functions with `'use server'`)
- ✅ Database queries for cuisine data
- ✅ Business logic for cuisine operations
- ✅ Data fetching and transformations

## What Does NOT Go Here

- ❌ UI components (those go in `components/`)
- ❌ Utility functions (those go in `helpers/`)
- ❌ React hooks (those go in `hooks/`)
- ❌ Route pages (those stay in `[slug]/`)

## Current Actions

### `getCuisineArticle.ts`
Fetches cuisine article data by slug. Used by the article page to display cuisine information and article content.

### `getCuisineWithDishes.ts`
Fetches cuisine data with popular dishes and featured restaurants. Used by the popular dishes page.

## Usage Example

```typescript
import { getCuisineArticle } from '@/app/(e-comm)/cuisine/actions/getCuisineArticle';

const cuisine = await getCuisineArticle(slug);
```

