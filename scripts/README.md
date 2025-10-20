# Seed Scripts

## Dish Categories Seed

This script populates the database with common dish categories for restaurants to use when categorizing their menu items.

### Categories Included

The script seeds 20 common dish categories:

1. **مقبلات** (Appetizers) - Small dishes served before the main meal
2. **شوربات** (Soups) - Various types of hot soups
3. **سلطات** (Salads) - Fresh and varied salads
4. **أطباق رئيسية** (Main Dishes) - Main courses and hearty meals
5. **مشاوي** (Grills) - Grilled meat and chicken dishes
6. **معجنات** (Pastries) - Stuffed pastries and baked goods
7. **أرز وبرياني** (Rice & Biryani) - Various rice and biryani dishes
8. **معكرونة** (Pasta) - Italian and Arabic pasta dishes
9. **بيتزا** (Pizza) - Various types and sizes of pizza
10. **برغر وساندويشات** (Burgers & Sandwiches) - Various burgers and sandwiches
11. **وجبات سريعة** (Fast Food) - Fast food and crispy items
12. **حلويات** (Desserts) - Eastern and Western desserts
13. **آيس كريم** (Ice Cream) - Ice cream and frozen treats with different flavors
14. **مشروبات ساخنة** (Hot Beverages) - Coffee, tea, and hot drinks
15. **مشروبات باردة** (Cold Beverages) - Fresh juices and cold drinks
16. **عصائر طبيعية** (Fresh Juices) - 100% fresh fruit juices
17. **مشروبات غازية** (Soft Drinks) - Carbonated and canned drinks
18. **مأكولات بحرية** (Seafood) - Fish, shrimp, and seafood
19. **أطباق نباتية** (Vegetarian) - Vegetarian dishes without meat
20. **إضافات** (Extras) - Extras and side sauces

### Usage

#### Option 1: Add New Categories (Recommended)
This mode adds new categories while keeping existing ones:

```bash
npm run seed:dish-categories
```

#### Option 2: Clear and Reseed
This mode deletes all existing categories and creates fresh ones:

```bash
npm run seed:dish-categories:clear
```

**⚠️ Warning:** Use the `--clear` flag carefully in production as it will delete all existing dish categories and any dish assignments will lose their category references.

#### Direct Execution
You can also run the script directly:

```bash
node scripts/seedDishCategories.js
node scripts/seedDishCategories.js --clear
```

### Output Example

```
╔════════════════════════════════════════════╗
║   Dish Categories Seed Script              ║
╚════════════════════════════════════════════╝

Mode: Add New Categories Only

🌱 Starting dish categories seed...

⚠️  Found 5 existing dish categories.
Adding new categories only (avoiding duplicates)...

⏭️  Skipped: "مقبلات" (already exists)
✅ Created: "شوربات" (Soups)
✅ Created: "سلطات" (Salads)
⏭️  Skipped: "حلويات" (already exists)
...

📊 Seed Summary:
   ✅ Created: 15 categories
   ⏭️  Skipped: 5 categories
   📦 Total in DB: 20 categories

✨ Dish categories seed completed successfully!
```

### Features

- ✅ **Duplicate Prevention**: Checks for existing categories before creating
- ✅ **Smart Seeding**: Skips existing categories automatically
- ✅ **Clear Summary**: Shows what was created, skipped, and total count
- ✅ **Safe by Default**: Doesn't delete existing data unless `--clear` flag is used
- ✅ **Production Ready**: Can be run safely in production environment
- ✅ **Bilingual**: All categories include Arabic and English names

### Integration

After seeding, the categories will be available:
- In the super admin panel at `/dashboard/management-dish-categories`
- In the restaurant portal when adding/editing dishes at `/restaurant-portal/menu/add`
- In the category filter on the menu listing page

### Notes

- Categories are ordered by `displayOrder` field (1-20)
- All categories are set to `isActive: true` by default
- Each category includes description for clarity
- Categories can be managed (edit/delete) through the admin panel after seeding

