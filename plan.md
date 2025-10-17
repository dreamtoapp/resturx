# Restaurant Platform - Complete Implementation Plan

## Part 1: Database Schema (Reference from previous plan)

See `restaurant-platform-transformation.plan.md` for complete schema details:

- Country, Restaurant, RestaurantService, RestaurantFeature, RestaurantImage, Dish models
- All with @@map for zero-risk data migration

## Part 2: ADMIN DASHBOARD - Complete UI & Functionality

### 2.1 Country Management

**Location**: `app/dashboard/management-countries/`

**UI Design - Country List Page**:

```
┌─────────────────────────────────────────────────────┐
│ إدارة البلدان/الجنسيات          [🔍 Search] [+ Add] │
├─────────────────────────────────────────────────────┤
│ ┌───────────┐ ┌───────────┐ ┌───────────┐          │
│ │ 🇮🇳       │ │ 🇪🇬       │ │ 🇮🇹       │          │
│ │ هندي      │ │ مصري      │ │ إيطالي    │          │
│ │ 12 مطعم   │ │ 8 مطاعم   │ │ 5 مطاعم   │          │
│ │ [Edit][❌]│ │ [Edit][❌]│ │ [Edit][❌]│          │
│ └───────────┘ └───────────┘ └───────────┘          │
└─────────────────────────────────────────────────────┘
```

**Functionality**:

- List all countries with restaurant count
- Add country (modal form: name, slug, logo, description)
- Edit country (same form, pre-filled)
- Delete country (only if no restaurants)
- Click country card → view restaurants for that country
- Search/filter by name

**Files to Create/Update**:

- `page.tsx` - Main list page
- `components/CountryCard.tsx`
- `components/CountryForm.tsx` (modal)
- `components/DeleteCountryDialog.tsx`
- `actions/getCountries.ts`
- `actions/upsertCountry.ts`
- `actions/deleteCountry.ts`

### 2.2 Restaurant Management (DETAILED)

**Location**: `app/dashboard/management-restaurants/`

**UI Design - Restaurant List**:

```
┌──────────────────────────────────────────────────────────────┐
│ إدارة المطاعم                  [+ Add Restaurant]            │
├──────────────────────────────────────────────────────────────┤
│ Filters: [Cuisine ▼] [Owner ▼] [Status ▼] [🔍 Search...]   │
├──────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────┐│
│ │ [Logo] مطعم تاج محل                            🟢 ACTIVE││
│ │        هندي | Owner: أحمد | ⭐ 4.5 (23 reviews)         ││
│ │        📍 الرياض | 📞 +966... | 🍽️ 45 dishes            ││
│ │        [View] [Edit] [Suspend] [Delete]                  ││
│ └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

**Add Restaurant Form (Multi-Step)**:

**Step 1: Basic Info**

```
┌───────────────────────────────────┐
│ Restaurant Name: [____________]   │
│ Slug: [auto-generated_____]       │
│ Cuisine Type: [Dropdown ▼]        │
│ Owner: [Select User ▼]            │
│ Description: [____________]        │
│ Logo: [Upload Image]               │
│ Cover Image: [Upload Image]        │
│                                    │
│ [Cancel] [Next →]                  │
└───────────────────────────────────┘
```

**Step 2: Contact & Location**

```
┌───────────────────────────────────┐
│ Phone: [____________]             │
│ Email: [____________]             │
│ Address: [____________]           │
│                                   │
│ Location (Click on map):          │
│ ┌───────────────────────────────┐│
│ │      [Interactive Map]        ││
│ │      📍 Click to set marker   ││
│ └───────────────────────────────┘│
│ Latitude: [auto-filled]           │
│ Longitude: [auto-filled]          │
│                                   │
│ [← Back] [Next →]                 │
└───────────────────────────────────┘
```

**Step 3: Operations**

```
┌───────────────────────────────────┐
│ Working Hours:                    │
│ Monday: [09:00] to [23:00] ☑️ Open│
│ Tuesday: [09:00] to [23:00] ☑️    │
│ ... (all 7 days)                  │
│                                   │
│ Delivery Time: [30-45 minutes]   │
│ Minimum Order: [50] SAR           │
│ Delivery Fee: [10] SAR            │
│ ☑️ Has Own Delivery Service       │
│                                   │
│ [← Back] [Next →]                 │
└───────────────────────────────────┘
```

**Step 4: About & Details**

```
┌───────────────────────────────────┐
│ Bio/Story:                        │
│ [Rich text editor____________]    │
│                                   │
│ Specialties (Tags):               │
│ [برياني] [تكا مسالا] [+ Add]    │
│                                   │
│ Cuisine Types:                    │
│ [هندي] [باكستاني] [+ Add]       │
│                                   │
│ Payment Methods:                  │
│ ☑️ Cash  ☑️ Card  ☑️ Mada        │
│ ☑️ Apple Pay  ☑️ STC Pay          │
│                                   │
│ [← Back] [Save Restaurant]        │
└───────────────────────────────────┘
```

**Functionality**:

- List all restaurants with filters
- Add restaurant (multi-step form)
- Edit restaurant (same form, load data)
- Suspend restaurant (modal with reason)
- Delete restaurant (with confirmation)
- View restaurant details (full page)
- Assign/reassign owner
- Toggle status (ACTIVE/SUSPENDED/INACTIVE)

**Files**:

- `page.tsx` - List page
- `new/page.tsx` - Add restaurant
- `[id]/edit/page.tsx` - Edit restaurant
- `[id]/page.tsx` - View details
- `components/RestaurantTable.tsx`
- `components/RestaurantForm.tsx`
- `components/SuspendDialog.tsx`
- `components/LocationPicker.tsx`
- `actions/getRestaurants.ts`
- `actions/upsertRestaurant.ts`
- `actions/suspendRestaurant.ts`

### 2.3 Dish Management

**Location**: `app/dashboard/management-dishes/`

**UI - Dish Grid**:

```
┌──────────────────────────────────────────────────────────┐
│ إدارة الأطباق                         [+ Add Dish]       │
├──────────────────────────────────────────────────────────┤
│ [Country ▼] [Restaurant ▼] [Status ▼] [🔍 Search...]    │
├──────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│ │ [Image] │ │ [Image] │ │ [Image] │ │ [Image] │        │
│ │ برياني  │ │ تكا     │ │ نان     │ │ دال     │        │
│ │ 25 SAR  │ │ 35 SAR  │ │ 5 SAR   │ │ 15 SAR  │        │
│ │تاج محل  │ │تاج محل  │ │تاج محل  │ │تاج محل  │        │
│ │🟢 متاح  │ │🔴 نفذ   │ │🟢 متاح  │ │⚫ غيرمنشور│        │
│ │[Edit][❌]│ │[Edit][❌]│ │[Edit][❌]│ │[Edit][❌]│        │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘        │
└──────────────────────────────────────────────────────────┘
```

**Add/Edit Dish Form**:

```
┌──────────────────────────────────────────┐
│ Add New Dish                             │
├──────────────────────────────────────────┤
│ Cuisine: [Dropdown ▼] → Restaurant: [▼] │
│                                          │
│ Dish Name: [_______________]             │
│ Slug: [auto-generated______]             │
│ Description: [_______________]           │
│                                          │
│ Price: [___] SAR                         │
│ Compare At Price: [___] SAR (optional)   │
│ Cost Price: [___] SAR (internal)         │
│                                          │
│ Images:                                  │
│ ┌────┐ ┌────┐ ┌────┐ [+ Upload]        │
│ │img1│ │img2│ │img3│                   │
│ └────┘ └────┘ └────┘                   │
│                                          │
│ Availability:                            │
│ ☑️ Published  ☐ Out of Stock            │
│ ☑️ Manage Inventory                     │
│ Stock Quantity: [__] items               │
│                                          │
│ [Cancel] [Save Dish]                     │
└──────────────────────────────────────────┘
```

**Files**:

- `page.tsx` - Grid view
- `new/page.tsx` - Add dish
- `[id]/page.tsx` - Edit dish
- `components/DishGrid.tsx`
- `components/DishCard.tsx`
- `components/DishForm.tsx`
- `actions/getDishes.ts`
- `actions/upsertDish.ts`

### 2.4 User Management (Restaurant Owners)

**Location**: `app/dashboard/management-users/restaurant-owners/`

**UI**:

```
┌──────────────────────────────────────────────────┐
│ Restaurant Owners              [+ Add Owner]     │
├──────────────────────────────────────────────────┤
│ [🔍 Search by name, email, phone...]            │
├──────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────┐  │
│ │ 👤 أحمد محمد              🟢 Active       │  │
│ │    📧 ahmad@example.com | 📞 +966...      │  │
│ │    🏪 Restaurant: تاج محل                 │  │
│ │    [View] [Edit] [Change Restaurant]      │  │
│ └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

**Add Owner Form**:

```
┌─────────────────────────────┐
│ Create Restaurant Owner     │
├─────────────────────────────┤
│ Name: [_______________]     │
│ Email: [_______________]    │
│ Phone: [_______________]    │
│ Password: [_______________] │
│ Role: RESTAURANT_OWNER (✓)  │
│                             │
│ [Cancel] [Create User]      │
└─────────────────────────────┘
```

After creating user, admin goes to Restaurant Management to create restaurant and assign this userId.

## Part 3: RESTAURANT OWNER PORTAL - Complete UI & Functionality

### 3.1 Portal Layout & Navigation

**Location**: `app/restaurant-portal/`

**Layout Structure**:

```
┌────────────────────────────────────────────────────────┐
│ [Logo] Restaurant Name               [User Menu ▼]     │
├──────────┬─────────────────────────────────────────────┤
│ Sidebar  │ Main Content Area                           │
│          │                                             │
│ 📊 Dashboard                                           │
│ 🏪 Profile                                             │
│ 🍽️ Menu                                                │
│ ⚙️ Services                                            │
│ ⭐ Features                                            │
│ 🖼️ Gallery                                             │
│ 📦 Orders                                              │
│ 📈 Analytics                                           │
│          │                                             │
└──────────┴─────────────────────────────────────────────┘
```

**Access Control** (in layout.tsx):

```typescript
const session = await auth();
if (!session || session.user.role !== 'RESTAURANT_OWNER') {
  redirect('/auth/login?error=unauthorized');
}

const restaurant = await prisma.restaurant.findFirst({
  where: { userId: session.user.id }
});

if (!restaurant) {
  return <NoRestaurantPage />;
}

// Pass restaurant to all child pages via context
```

### 3.2 Dashboard (Overview)

**Page**: `app/restaurant-portal/page.tsx`

**UI**:

```
┌──────────────────────────────────────────────────────────┐
│ Welcome back, أحمد! 👋                                   │
├──────────────────────────────────────────────────────────┤
│ ┌─────────────┬─────────────┬─────────────┬────────────┐│
│ │📦 Today     │🍽️ Total     │⭐ Rating    │💰 Revenue  ││
│ │   Orders    │   Dishes    │             │   Today    ││
│ │     12      │     45      │   4.5 ⭐    │ 1,250 SAR  ││
│ └─────────────┴─────────────┴─────────────┴────────────┘│
│                                                          │
│ Recent Orders                            [View All →]   │
│ ┌──────────────────────────────────────────────────────┐│
│ │#1234│ أحمد  │ 3 items│ 75 SAR │🟡Pending │10:30 AM││
│ │#1235│ فاطمة │ 2 items│ 50 SAR │🟢Delivered│09:15 AM││
│ └──────────────────────────────────────────────────────┘│
│                                                          │
│ Quick Actions:                                           │
│ [➕ Add Dish] [✏️ Edit Profile] [📊 View Analytics]     │
│                                                          │
│ Restaurant Status: 🟢 ACTIVE                            │
└──────────────────────────────────────────────────────────┘
```

**Functionality**:

```typescript
- Fetch today's order count
- Fetch total dish count  
- Calculate average rating
- Calculate today's revenue
- Fetch last 10 orders
- Show quick action buttons
```

### 3.3 Profile Editor

**Page**: `app/restaurant-portal/profile/page.tsx`

**UI - Tabbed Interface**:

```
┌──────────────────────────────────────────────────────┐
│ Edit Restaurant Profile                              │
├──────────────────────────────────────────────────────┤
│ [Basic Info] [Contact] [Operations] [About]          │
├──────────────────────────────────────────────────────┤
│ (Tab content shown below for each tab)               │
│                                                      │
│                  [Cancel] [Save Changes]             │
└──────────────────────────────────────────────────────┘
```

**Tab 1: Basic Info**

```
Restaurant Name: [تاج محل_______]
Cuisine Type: هندي (read-only - contact admin to change)
Description: [مطعم هندي أصيل...____]
Logo: [Current Logo] [Change]
Cover Image: [Current Cover] [Change]
```

**Tab 2: Contact & Location**

```
Phone: [+966501234567]
Email: [tajmahal@example.com]
Address: [شارع الأمير محمد بن عبدالعزيز...]

Location:
┌──────────────────────────────────┐
│   [Interactive Google Map]       │
│   📍 Click to update location    │
└──────────────────────────────────┘
Latitude: [24.7136] (auto-filled)
Longitude: [46.6753] (auto-filled)
[📍 Use Current Location]
```

**Tab 3: Operations**

```
Working Hours:
┌────────────────────────────────┐
│ Day      | Open  | Close | Open│
├────────────────────────────────┤
│ السبت    │ 09:00 │ 23:00 │ ☑️ │
│ الأحد    │ 09:00 │ 23:00 │ ☑️ │
│ الاثنين  │ 09:00 │ 23:00 │ ☑️ │
│ الثلاثاء │ 09:00 │ 23:00 │ ☑️ │
│ الأربعاء │ 09:00 │ 23:00 │ ☑️ │
│ الخميس   │ 09:00 │ 23:00 │ ☑️ │
│ الجمعة   │ 12:00 │ 23:00 │ ☑️ │
└────────────────────────────────┘

Delivery Information:
Delivery Time: [30-45 دقيقة]
Minimum Order: [50] SAR
Delivery Fee: [10] SAR
☑️ نوفر خدمة التوصيل الخاصة بنا
```

**Tab 4: About**

```
Restaurant Story:
[Rich Text Editor with formatting toolbar]
مطعم تاج محل تأسس عام...

Our Specialties:
[برياني حيدرابادي] [تكا مسالا] [نان بالزبدة] [+ Add]

Cuisine Types:
[هندي] [باكستاني] [+ Add]

Accepted Payment Methods:
☑️ نقداً (Cash)
☑️ بطاقة ائتمان (Credit Card)  
☑️ مدى (Mada)
☑️ Apple Pay
☑️ STC Pay
☐ Urpay
```

**Functionality**:

```typescript
- Load restaurant data from DB
- Form validation (required fields)
- Image upload to Cloudinary
- Map integration for location picker
- Auto-generate slug on name change
- Submit → direct update (no approval)
- Success notification
- Stay on page or redirect to dashboard
```

### 3.4 Menu Management

**Page**: `app/restaurant-portal/menu/page.tsx`

**UI**:

```
┌──────────────────────────────────────────────────────┐
│ Menu Management                    [+ Add Dish]      │
├──────────────────────────────────────────────────────┤
│ [🔍 Search dishes...] [All▼] [Published▼] [In Stock▼]│
├──────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│
│ │ [Image]  │ │ [Image]  │ │ [Image]  │ │ [Image]  ││
│ │ برياني   │ │ تكا مسالا│ │ نان      │ │ دال      ││
│ │ 25 SAR   │ │ 35 SAR   │ │ 5 SAR    │ │ 15 SAR   ││
│ │ 🟢 متاح  │ │ 🔴 نفذ   │ │ 🟢 متاح  │ │ ⚫ مخفي   ││
│ │ Stock:50 │ │ Stock:0  │ │ Stock:∞  │ │ Stock:20 ││
│ │ [Edit]   │ │ [Edit]   │ │ [Edit]   │ │ [Edit]   ││
│ │ [Delete] │ │ [Delete] │ │ [Delete] │ │ [Delete] ││
│ │ [Toggle] │ │ [Toggle] │ │ [Toggle] │ │ [Toggle] ││
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘│
└──────────────────────────────────────────────────────┘
```

**Add/Edit Dish Page**: `app/restaurant-portal/menu/[dishId]/page.tsx`

**UI Form**:

```
┌──────────────────────────────────────────┐
│ Add New Dish to Menu                     │
├──────────────────────────────────────────┤
│ Dish Name (Arabic): [برياني حيدرابادي]  │
│ Dish Name (English): [Hyderabadi Biryani]│
│ Slug: [hyderabadi-biryani] (auto)        │
│                                          │
│ Description:                             │
│ [برياني أصيل بالبهارات الهندية...]      │
│                                          │
│ Price: [25] SAR                          │
│ Sale Price: [20] SAR (optional)          │
│ Cost: [12] SAR (for your records)        │
│                                          │
│ Images: (Drag to reorder)                │
│ ┌────┐ ┌────┐ ┌────┐ [+ Upload More]   │
│ │img1│ │img2│ │img3│                   │
│ │ ✓  │ │    │ │    │ (primary)        │
│ └────┘ └────┘ └────┘                   │
│ [Maximum 5 images]                       │
│                                          │
│ Availability:                            │
│ ☑️ Publish (visible to customers)       │
│ ☐ Out of Stock                          │
│                                          │
│ Inventory:                               │
│ ☑️ Track inventory for this dish        │
│ Current Stock: [50] portions             │
│ Low Stock Alert: [10] portions           │
│                                          │
│ [Cancel] [Save Dish]                     │
└──────────────────────────────────────────┘
```

**Functionality**:

```typescript
// List page
- Fetch dishes WHERE supplierId = restaurant.id
- Search by name/description
- Filter: published/unpublished, in stock/out of stock
- Quick toggle: published, outOfStock
- Click Edit → go to edit page
- Click Delete → confirm & delete

// Add/Edit page
- Form validation
- Multi-image upload with preview
- Drag to reorder images
- Set primary image
- Auto-generate slug from name
- Submit → create/update dish
- Redirect back to menu list
```

**Files**:

- `menu/page.tsx` - List
- `menu/new/page.tsx` - Add  
- `menu/[id]/page.tsx` - Edit
- `components/DishCard.tsx`
- `components/DishForm.tsx`
- `actions/getMyDishes.ts`
- `actions/upsertDish.ts`
- `actions/deleteDish.ts`

### 3.5 Services Management

**Page**: `app/restaurant-portal/services/page.tsx`

**UI**:

```
┌──────────────────────────────────────────────────────┐
│ Restaurant Services               [+ Add Service]    │
├──────────────────────────────────────────────────────┤
│ Manage the services you offer to customers           │
├──────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────┐  │
│ │ 📶 WiFi مجاني                        [Active] │  │
│ │ إنترنت سريع متوفر لجميع الزبائن              │  │
│ │ [✏️ Edit] [❌ Delete] [⬆️⬇️ Reorder]           │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ ┌────────────────────────────────────────────────┐  │
│ │ 🚗 موقف سيارات                      [Active] │  │
│ │ موقف مجاني لمدة ساعتين                       │  │
│ │ [✏️ Edit] [❌ Delete] [⬆️⬇️ Reorder]           │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ ┌────────────────────────────────────────────────┐  │
│ │ 🍽️ صالات طعام عائلية                [Active] │  │
│ │ صالات خاصة للعائلات                          │  │
│ │ [✏️ Edit] [❌ Delete] [⬆️⬇️ Reorder]           │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ Drag cards to reorder                                │
└──────────────────────────────────────────────────────┘
```

**Add/Edit Service Modal**:

```
┌───────────────────────────────┐
│ Add Service                   │
├───────────────────────────────┤
│ Icon: [Icon Picker ▼]        │
│ ┌──┬──┬──┬──┬──┬──┬──┬──┐   │
│ │📶│🚗│🍽️│🎉│☕│🎵│📺│...│   │
│ └──┴──┴──┴──┴──┴──┴──┴──┘   │
│                               │
│ Service Name:                 │
│ [__________________]          │
│                               │
│ Description:                  │
│ [__________________]          │
│ [__________________]          │
│                               │
│ ☑️ Active (show to customers) │
│                               │
│ [Cancel] [Save Service]       │
└───────────────────────────────┘
```

**Functionality**:

```typescript
- Fetch services WHERE restaurantId = restaurant.id
- Add service (modal form)
- Edit service (modal with pre-filled data)
- Delete service (confirmation)
- Toggle active status
- Drag & drop to reorder (updates displayOrder)
- Icon picker component
```

**Common Services to Suggest**:

- 📶 WiFi
- 🚗 Parking
- 🍽️ Dine-in
- 🎉 Event Catering
- ☕ Outdoor Seating
- 🎵 Live Music
- 📺 TV Screens
- 🚭 Non-Smoking Area
- ♿ Wheelchair Accessible
- 👶 Kids Friendly

### 3.6 Features Management

**Page**: `app/restaurant-portal/features/page.tsx`

Similar UI to Services but for detailed features/highlights.

**Example Features**:

- ⭐ Award-winning chef
- 🏆 Best Restaurant 2024
- 🌿 Organic ingredients
- 🔥 Traditional cooking methods
- 📜 Family recipes since 1980

### 3.7 Gallery Management

**Page**: `app/restaurant-portal/gallery/page.tsx`

**UI**:

```
┌──────────────────────────────────────────────────────┐
│ Restaurant Gallery              [📤 Upload Images]   │
├──────────────────────────────────────────────────────┤
│ Drag to reorder • Click to edit • Max 20 images      │
├──────────────────────────────────────────────────────┤
│ ┌────────────┐ ┌────────────┐ ┌────────────┐       │
│ │  [Image 1] │ │  [Image 2] │ │  [Image 3] │       │
│ │            │ │            │ │            │       │
│ │ Interior   │ │ Food       │ │ Chef       │       │
│ │ [Edit][❌] │ │ [Edit][❌] │ │ [Edit][❌] │       │
│ └────────────┘ └────────────┘ └────────────┘       │
│                                                      │
│ ┌────────────┐ ┌────────────┐                      │
│ │  [Image 4] │ │  [Image 5] │     [+ Upload]       │
│ │            │ │            │                      │
│ │ Exterior   │ │ Dining     │                      │
│ │ [Edit][❌] │ │ [Edit][❌] │                      │
│ └────────────┘ └────────────┘                      │
└──────────────────────────────────────────────────────┘
```

**Edit Image Modal**:

```
┌─────────────────────────────┐
│ Edit Image                  │
├─────────────────────────────┤
│ [Preview Image]             │
│                             │
│ Caption (optional):         │
│ [مطبخنا الحديث_________]   │
│                             │
│ [Cancel] [Save]             │
└─────────────────────────────┘
```

**Functionality**:

```typescript
- Fetch images WHERE restaurantId = restaurant.id
- Upload multiple images at once
- Drag & drop to reorder (updates order field)
- Edit caption per image
- Delete image (confirmation)
- Click image → lightbox view
- Max 20 images limit
```

### 3.8 Orders View

**Page**: `app/restaurant-portal/orders/page.tsx`

**UI**:

```
┌──────────────────────────────────────────────────────────┐
│ Orders                                                   │
├──────────────────────────────────────────────────────────┤
│ [All▼] [Pending▼] [In Progress▼] [Delivered▼]          │
│ [Today ▼] [This Week ▼] [This Month ▼] [Custom Range]  │
├──────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────┐  │
│ │Order│Customer│Items│Total│Status│Driver│Time      │  │
│ ├────────────────────────────────────────────────────┤  │
│ │#1234│أحمد    │3    │75   │🟡Pending│-│10:30 AM  │  │
│ │#1235│فاطمة   │2    │50   │🟢Delivered│علي│9:15AM │  │
│ │#1236│محمد    │5    │120  │🔵In Transit│سعد│8:00AM│  │
│ └────────────────────────────────────────────────────┘  │
│ [Export CSV] [Export PDF]                                │
└──────────────────────────────────────────────────────────┘
```

**Click Order → Order Details Modal**:

```
┌─────────────────────────────────────────┐
│ Order #1234                         [❌] │
├─────────────────────────────────────────┤
│ Customer: أحمد محمد                     │
│ Phone: +966501234567                    │
│ Address: الرياض، حي...                  │
│                                         │
│ Items:                                  │
│ • برياني × 2 = 50 SAR                  │
│ • تكا مسالا × 1 = 25 SAR               │
│ Subtotal: 75 SAR                        │
│ Delivery: 10 SAR                        │
│ Total: 85 SAR                           │
│                                         │
│ Status: 🟡 Pending                      │
│ Driver: Not assigned yet                │
│ Ordered: 10:30 AM                       │
│                                         │
│ [Print Receipt] [Contact Customer]      │
└─────────────────────────────────────────┘
```

**Functionality**:

```typescript
// Orders filtered by restaurant
- Join OrderItem → Dish → Restaurant
- WHERE Restaurant.id = current restaurant
- Filter by status, date range
- Real-time updates via Pusher
- View order details (modal)
- Export orders (CSV/PDF)
- Print receipt
- Contact customer (WhatsApp link)
```

**Note**: Restaurant owner can VIEW orders but cannot change order status (only admin/driver can).

## Part 4: CUSTOMER FRONTEND - Complete UI & Functionality

### 4.1 Homepage Updates

**Page**: `app/(e-comm)/page.tsx`

**New UI**:

```
┌──────────────────────────────────────────────────────┐
│ [Header with Logo, Search, Cart, User]              │
├──────────────────────────────────────────────────────┤
│ [Hero Slider - if enabled]                          │
├──────────────────────────────────────────────────────┤
│ تصفح حسب نوع المطبخ           [View All →]          │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│
│ │ 🇮🇳      │ │ 🇪🇬      │ │ 🇮🇹      │ │ 🇨🇳      ││
│ │ هندي     │ │ مصري     │ │ إيطالي   │ │ صيني     ││
│ │12 مطعم   │ │8 مطاعم   │ │5 مطاعم   │ │6 مطاعم   ││
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘│
├──────────────────────────────────────────────────────┤
│ Featured Restaurants                [View All →]     │
│ [Restaurant Cards - top rated/popular]               │
├──────────────────────────────────────────────────────┤
│ Popular Dishes                      [View All →]     │
│ [Dish Cards Grid]                                    │
└──────────────────────────────────────────────────────┘
```

**Changes from Current**:

- Replace "Categories" section with "Cuisine Types" (Countries)
- Add "Featured Restaurants" section
- Keep "Popular Dishes" but filtered by all restaurants
- Update search to include restaurant names

### 4.2 Country/Cuisine Page

**Page**: `app/(e-comm)/countries/[slug]/page.tsx` (or keep as `/categories/[slug]`)

**UI - Show Restaurants**:

```
┌──────────────────────────────────────────────────────┐
│ 🇮🇳 المطبخ الهندي                                    │
│ اكتشف أفضل المطاعم الهندية                          │
├──────────────────────────────────────────────────────┤
│ [Sort: Recommended ▼] [Filter: Delivery Available ▼] │
├──────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────┐  │
│ │ [Logo] مطعم تاج محل              ⭐ 4.5 (23)  │  │
│ │ 🇮🇳 هندي • 📍 الرياض • 🚗 توصيل خاص           │  │
│ │ ⏱️ 30-45 دقيقة • 💰 Min 50 SAR                 │  │
│ │ 📶 WiFi • 🚗 Parking • 🍽️ Dine-in              │  │
│ │ [View Menu →]                                   │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ ┌────────────────────────────────────────────────┐  │
│ │ [Logo] مطعم بومباي                ⭐ 4.2 (15)  │  │
│ │ 🇮🇳 هندي • 📍 جدة • ⏱️ 25-35 دقيقة            │  │
│ │ [View Menu →]                                   │  │
│ └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

**Functionality**:

```typescript
- Fetch restaurants WHERE countryId = selected country
- Show restaurant cards with:
  - Logo, name, rating, review count
  - Location, delivery time, min order
  - Services icons (quick view)
  - "View Menu" button
- Sort by: recommended, rating, distance, delivery time
- Filter by: delivery available, dine-in, parking, etc
```

### 4.3 Restaurant Profile Page (NEW - KEY)

**Page**: `app/(e-comm)/restaurant/[slug]/page.tsx`

**UI - Complete Profile**:

**Hero Section**:

```
┌──────────────────────────────────────────────────────┐
│ [Cover Image spanning full width]                   │
│ ┌────────┐                                          │
│ │ [Logo] │ مطعم تاج محل         ⭐ 4.5 (23 reviews)│
│ └────────┘ 🇮🇳 مطبخ هندي        ✅ Verified        │
│ 📍 الرياض • 📞 +966... • ⏱️ 30-45 دقيقة            │
│ [📱 Call] [🗺️ Directions] [❤️ Favorite] [⚙️ Share] │
└──────────────────────────────────────────────────────┘
```

**Tabs Navigation**:

```
[Overview] [Menu] [Gallery] [Reviews] [Info]
```

**Tab 1: Overview**

```
┌──────────────────────────────────────────┐
│ About                                    │
│ مطعم تاج محل هو مطعم هندي أصيل...       │
│                                          │
│ Specialties:                             │
│ [برياني حيدرابادي] [تكا مسالا] [نان]   │
│                                          │
│ Services & Amenities:                    │
│ 📶 WiFi Free                             │
│ 🚗 Free Parking                          │
│ 🍽️ Family Dining Halls                  │
│ 🎉 Outdoor Catering                      │
│ ☑️ Own Delivery Service                  │
│                                          │
│ Features:                                │
│ ⭐ Award-winning chef                    │
│ 🏆 Best Indian Restaurant 2024           │
│ 🌿 Organic Ingredients                   │
│                                          │
│ Payment Methods:                         │
│ 💵 Cash • 💳 Card • 🏦 Mada             │
└──────────────────────────────────────────┘
```

**Tab 2: Menu**

```
Show all dishes for this restaurant
[Dish Grid with Add to Cart buttons]
```

**Tab 3: Gallery**

```
[Lightbox Image Gallery]
Click any image → full screen view
```

**Tab 4: Reviews**

```
Customer reviews (future feature)
```

**Tab 5: Info**

```
┌─────────────────────────────────┐
│ Contact Information             │
│ Phone: +966501234567            │
│ Email: tajmahal@example.com     │
│                                 │
│ Location:                       │
│ [Embedded Google Map]           │
│ Address: شارع الأمير...         │
│ [Get Directions]                │
│                                 │
│ Working Hours:                  │
│ السبت - الخميس: 9am - 11pm     │
│ الجمعة: 12pm - 11pm             │
│                                 │
│ Delivery Info:                  │
│ Delivery Time: 30-45 minutes    │
│ Minimum Order: 50 SAR           │
│ Delivery Fee: 10 SAR            │
└─────────────────────────────────┘
```

**Functionality**:

```typescript
- Fetch restaurant with all relations (services, features, images)
- Dynamic tabs
- Embedded map with marker
- Click "View Menu" → scroll to menu tab or separate page
- Add to cart functionality
- Favorite button (save to wishlist)
- Share button (copy link, WhatsApp, etc)
- Call button (tel: link)
- Directions button (Google Maps link)
```

**SEO - Restaurant Schema**:

```json
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "مطعم تاج محل",
  "image": "https://...",
  "servesCuisine": "Indian",
  "address": {...},
  "telephone": "+966...",
  "priceRange": "$$",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "23"
  }
}
```

### 4.4 Restaurant Menu Page

**Page**: `app/(e-comm)/restaurant/[slug]/menu/page.tsx`

**UI**:

```
┌──────────────────────────────────────────────────────┐
│ [Restaurant Header - compact version]                │
├──────────────────────────────────────────────────────┤
│ Menu - مطعم تاج محل                                 │
├──────────────────────────────────────────────────────┤
│ [🔍 Search dishes...] [Sort: Popular ▼]             │
├──────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│ │ [Image] │ │ [Image] │ │ [Image] │ │ [Image] │    │
│ │ برياني  │ │ تكا     │ │ نان     │ │ دال     │    │
│ │ حيدرابادي│ │ مسالا   │ │         │ │         │    │
│ │ 25 SAR  │ │ 35 SAR  │ │ 5 SAR   │ │ 15 SAR  │    │
│ │ ⭐ 4.8  │ │ ⭐ 4.6  │ │ ⭐ 4.3  │ │ ⭐ 4.5  │    │
│ │ [+ Cart]│ │ [+ Cart]│ │ [+ Cart]│ │ [+ Cart]│    │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘    │
└──────────────────────────────────────────────────────┘
```

**Functionality**:

```typescript
- Fetch dishes WHERE supplierId = restaurant.id AND published = true
- Show dish cards with add to cart
- Search by name/description
- Sort by: popular, price low-high, price high-low, rating
- Click dish → dish detail page (or modal)
- Add to cart → update cart state
```

### 4.5 Dish Detail Page

**Page**: `app/(e-comm)/dish/[slug]/page.tsx` (or `/product/[slug]` if keeping old)

**UI**:

```
┌──────────────────────────────────────────────────────┐
│ ← Back to Menu                                       │
├──────────────────────────────────────────────────────┤
│ ┌──────────────┐  برياني حيدرابادي                  │
│ │ [Main Image] │  From: مطعم تاج محل (link)          │
│ │              │  🇮🇳 هندي                           │
│ │ [img][img]   │                                     │
│ │ [img][img]   │  ⭐ 4.8 (15 reviews)                │
│ └──────────────┘                                     │
│                   25 SAR                             │
│                   ~~30 SAR~~ (if on sale)            │
│                                                      │
│ Description:                                         │
│ برياني أصيل بالبهارات الهندية...                    │
│                                                      │
│ Quantity: [-] [1] [+]                                │
│ [🛒 Add to Cart] [❤️ Add to Favorites]              │
│                                                      │
│ ✅ In Stock                                          │
│ ⏱️ Delivery in 30-45 minutes                        │
└──────────────────────────────────────────────────────┘
```

**Functionality**:

- Show dish details
- Image gallery (click to zoom)
- Restaurant info (clickable link to restaurant page)
- Quantity selector
- Add to cart
- Add to favorites/wishlist
- Show availability status
- Reviews section (future)

## Part 5: API for Mobile App

**Location**: `app/api/v1/`

**Shared Service Layer**: `lib/services/`

All business logic in services, used by both Server Actions and API routes.

**API Endpoints**:

```
GET  /api/v1/countries
GET  /api/v1/countries/:slug
GET  /api/v1/countries/:slug/restaurants
GET  /api/v1/restaurants
GET  /api/v1/restaurants/:slug
GET  /api/v1/restaurants/:slug/menu
GET  /api/v1/restaurants/:slug/services
GET  /api/v1/restaurants/:slug/features
GET  /api/v1/restaurants/:slug/gallery
GET  /api/v1/dishes
GET  /api/v1/dishes/:slug
POST /api/v1/cart
GET  /api/v1/cart
POST /api/v1/orders
GET  /api/v1/orders
GET  /api/v1/orders/:id
```

**Standard Response Format**:

```json
{
  "success": true,
  "data": {...},
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

## Implementation Summary

**Total New Pages**: ~30+

**Total Components**: ~50+

**Total Actions**: ~40+

**Complexity Level**: Medium-High

**Estimated Development Time**: 4-6 weeks for MVP

This covers complete UI/UX and functionality for all three interfaces!