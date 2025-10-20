# Database Cleanup TODO

## Dish Model - Remove Unused Inventory Fields

### Context
For restaurant dishes, detailed inventory management (tracking stock quantities) is not needed. Restaurants only need:
- ✅ `published` - To show/hide dish in menu
- ✅ `outOfStock` - To mark dish as temporarily unavailable

The following fields are **NOT USED** for restaurants and should be removed in a future database cleanup:

### Fields to Remove from Dish Model

1. **`manageInventory`** (Boolean)
   - Currently: `Boolean @default(true)`
   - Used for: E-commerce products to track inventory
   - Restaurant need: ❌ Not needed
   - Action: Remove field and all references

2. **`stockQuantity`** (Number)
   - Currently: `Int?`
   - Used for: E-commerce products quantity tracking
   - Restaurant need: ❌ Not needed
   - Action: Remove field and all references

### Other Product-Related Fields to Review

These fields exist for backward compatibility with the original e-commerce system. Review if needed for restaurants:

3. **`requiresShipping`** (Boolean)
   - Currently: `Boolean @default(true)`
   - Restaurant need: ❌ Food doesn't require shipping (uses delivery)
   - Suggestion: Keep for now (default false for dishes)

4. **`shippingDays`** (String)
   - Currently: `String? @default("3-5")`
   - Restaurant need: ❌ Not applicable
   - Action: Consider removing or renaming to `preparationTime`

5. **`returnPeriodDays`** (Int)
   - Currently: `Int? @default(14)`
   - Restaurant need: ❌ Food cannot be returned
   - Action: Remove field

6. **`hasQualityGuarantee`** (Boolean)
   - Currently: `Boolean @default(true)`
   - Restaurant need: ❌ Not standard for food
   - Action: Remove field

7. **`careInstructions`** (String)
   - Currently: `String?`
   - Restaurant need: ❌ Not applicable for prepared food
   - Action: Remove field

8. **E-commerce specific fields:**
   - `productCode` (String?)
   - `gtin` (String?)
   - `material` (String?)
   - `brand` (String?)
   - `color` (String?)
   - `dimensions` (String?)
   - `weight` (String?)
   - `features` (String[])
   - `size` (String?)
   - `details` (String?)
   
   **Action**: Review if any of these are useful for restaurants, otherwise remove

### Implementation Plan

#### Phase 1: Immediate (Already Done ✅)
- [x] Remove `manageInventory` from dish form UI
- [x] Remove `stockQuantity` from dish form UI
- [x] Remove from form validation schema
- [x] Remove from server actions (upsertDish)
- [x] Remove from default values

#### Phase 2: Database Migration (TODO - Do Later)
**⚠️ CAUTION: Only do this during low-traffic period**

```prisma
// In prisma/schema.prisma

model Dish {
  // ... existing fields ...
  
  // 🗑️ REMOVE THESE FIELDS:
  // manageInventory Boolean @default(true)
  // stockQuantity   Int?
  // requiresShipping Boolean @default(true)
  // shippingDays String? @default("3-5")
  // returnPeriodDays Int? @default(14)
  // hasQualityGuarantee Boolean @default(true)
  // careInstructions String?
  // productCode String?
  // gtin String?
  // material String?
  // brand String?
  // color String?
  // dimensions String?
  // weight String?
  // features String[] @default([])
  // size String?
  // details String? // OR keep as "preparation notes"
  
  // ... keep other fields ...
}
```

**Steps:**
1. ✅ First update all UI and application code (DONE)
2. ⏳ Wait for deployment and monitoring
3. ⏳ Create database backup
4. ⏳ Update Prisma schema
5. ⏳ Run migration: `npx prisma db push`
6. ⏳ Verify data integrity
7. ⏳ Monitor for issues

#### Phase 3: Code Cleanup (TODO - After Migration)
- [ ] Remove any remaining references in codebase
- [ ] Update TypeScript types
- [ ] Update documentation
- [ ] Remove from seed data
- [ ] Update API responses if affected

### Migration Script (When Ready)

```javascript
// scripts/cleanupDishFields.js
// Run this BEFORE schema update to document current usage

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function analyzeDishFields() {
  const stats = await prisma.dish.aggregate({
    _count: true,
    where: {
      type: 'dish'
    }
  });
  
  const withInventory = await prisma.dish.count({
    where: {
      type: 'dish',
      manageInventory: true
    }
  });
  
  const withStock = await prisma.dish.count({
    where: {
      type: 'dish',
      stockQuantity: { not: null }
    }
  });
  
  console.log('Dish Field Usage Analysis:');
  console.log(`Total dishes: ${stats._count}`);
  console.log(`With manageInventory=true: ${withInventory}`);
  console.log(`With stockQuantity set: ${withStock}`);
  
  // Check if safe to remove
  if (withInventory === 0 && withStock === 0) {
    console.log('✅ SAFE to remove inventory fields');
  } else {
    console.log('⚠️ WARNING: Some dishes use inventory fields');
  }
}

analyzeDishFields()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
  });
```

### Risk Assessment

**Low Risk:**
- ✅ `manageInventory` - Not used in restaurant context
- ✅ `stockQuantity` - Not used in restaurant context

**Medium Risk:**
- ⚠️ E-commerce fields - May be used by existing products
- ⚠️ Ensure no code depends on these fields

**High Risk:**
- 🔴 None identified

### Rollback Plan

If issues occur after migration:
1. Revert Prisma schema to previous version
2. Run: `npx prisma db push --force-reset` (⚠️ only in emergency)
3. Restore from backup
4. Redeploy previous code version

### Timeline

- **Phase 1**: ✅ COMPLETED (October 19, 2025)
- **Phase 2**: ⏳ Scheduled for next maintenance window
- **Phase 3**: ⏳ After Phase 2 verification (1 week later)

### Notes

- The Dish model is used for both e-commerce products AND restaurant dishes
- We use `type: 'dish'` to distinguish restaurant dishes
- Keep fields that might be useful for e-commerce products
- Only remove fields that are truly unused and restaurant-specific

### Approval Checklist

Before proceeding with database migration:
- [ ] All UI code updated and tested
- [ ] No console errors in production
- [ ] Restaurant owners confirm new form works
- [ ] Database backup created
- [ ] Low traffic time scheduled
- [ ] Rollback plan tested
- [ ] Team notified

---

**Created**: October 19, 2025  
**Status**: Phase 1 Complete, Phase 2 Pending  
**Priority**: Low (Not urgent, cosmetic cleanup)  
**Estimated Effort**: 2-3 hours for full cleanup

