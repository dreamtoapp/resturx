# Dish Categories Management

## Overview
Centralized management system for dish categories (e.g., حلويات, مقبلات, مشروبات). Super admins create and manage categories, and restaurant owners assign them to their dishes.

## Features

### Super Admin Features
- Create, edit, and delete dish categories
- Set display order and active status
- View dish count for each category
- Prevent deletion of categories with dishes

### Restaurant Owner Features
- Select category when adding/editing dishes
- Filter dishes by category in menu listing
- View category badges on dish cards

## File Structure

```
app/dashboard/management-dish-categories/
├── page.tsx                          # Main listing page
├── actions/
│   ├── getMasterDishCategories.ts    # Fetch all categories
│   ├── upsertMasterDishCategory.ts   # Create/update category
│   └── deleteMasterDishCategory.ts   # Delete category (with validation)
├── components/
│   ├── MasterDishCategoryCard.tsx    # Category card display
│   └── MasterDishCategoryUpsert.tsx  # Add/Edit form dialog
└── helpers/
    └── dishCategorySchema.ts         # Zod validation schema

app/restaurant-portal/menu/
├── page.tsx                          # Menu listing with filter
├── add/
│   └── page.tsx                      # Add dish page
├── [dishId]/
│   └── page.tsx                      # Edit dish page
├── components/
│   ├── DishForm.tsx                  # Dish add/edit form
│   ├── CategoryFilter.tsx            # Category filter dropdown
│   └── DeleteDishButton.tsx          # Delete dish button
└── actions/
    ├── getDishData.ts                # Fetch dish for editing
    ├── upsertDish.ts                 # Create/update dish
    └── deleteDish.ts                 # Delete dish
```

## Database Schema

### MasterDishCategory Model
```prisma
model MasterDishCategory {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String   @unique
  nameEn      String?
  imageUrl    String?
  description String?
  isActive    Boolean  @default(true)
  displayOrder Int     @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  dishes      Dish[]   @relation("DishCategory")
  
  @@map("masterdishcategories")
}
```

### Dish Model Addition
```prisma
dishCategoryId String?              @db.ObjectId
dishCategory   MasterDishCategory? @relation("DishCategory", fields: [dishCategoryId], references: [id])
```

## Usage

### For Super Admins
1. Navigate to `/dashboard/management-dish-categories`
2. Click "إضافة صنف" to create a new category
3. Fill in Arabic name (required), English name, description, and display order
4. Set active status
5. Edit or delete categories as needed (deletion blocked if dishes exist)

### For Restaurant Owners
1. Navigate to `/restaurant-portal/menu`
2. Click "إضافة طبق جديد"
3. Fill in dish details and select a category from the dropdown
4. Category appears as a blue badge on the dish card
5. Use the category filter dropdown to view dishes by category

## Production Safety

✅ **Backward Compatible**: Category is optional (nullable field)  
✅ **Existing Data Safe**: Dishes without categories continue to work  
✅ **Zero Breaking Changes**: No modifications to existing dish functionality  
✅ **Validation**: Prevents deletion of categories with dishes  
✅ **Type Safe**: Full TypeScript and Zod validation  
✅ **Follows Patterns**: Matches MasterService/MasterFeature architecture  

## Navigation

Category management is accessible from:
- Dashboard sidebar: القائمة والمنتجات → أصناف الأطباق
- Direct URL: `/dashboard/management-dish-categories`

## Implementation Date
October 19, 2025

