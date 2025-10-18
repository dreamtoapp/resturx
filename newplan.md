# Restaurant Owner Complete Portal - Full Implementation

## Goal

When a new restaurant joins, they receive eachRest.md as a guide and can independently manage ALL sections through their restaurant portal, creating a complete, professional restaurant profile.

## Current State Analysis

### ✅ Already Implemented

- Restaurant portal with authentication (RESTAURANT_OWNER role)
- Basic profile editor (name, description, contact, operations, bio)
- Menu management (dishes CRUD)
- Dashboard with stats
- Public restaurant pages (`/restaurant/[slug]`)

### ❌ Missing Features (from eachRest.md)

1. **Specialties Management** (الأطباق المميزة)
2. **Payment Methods** (طرق الدفع)
3. **Cuisine Types** (أنواع المطبخ المتعددة)
4. **Services Management** (الخدمات - WiFi, Parking, etc.)
5. **Features Management** (المميزات - Awards, etc.)
6. **Gallery Management** (معرض الصور)
7. **Reservations System** (نظام الحجز)
8. **Reviews/Testimonials** (التقييمات والآراء)
9. **Restaurant Blog/News** (أخبار المطعم)

---

## Implementation Plan

### Phase 1: Profile Enhancements (Core Fields)

#### 1.1 Add Specialties, Payment Methods, Cuisine Types to Profile

**Files to modify:**

- `app/restaurant-portal/profile/components/RestaurantProfileForm.tsx`
- `app/restaurant-portal/profile/actions/updateProfile.ts`

**New UI in Profile Form (add 5th tab: "Additional"):**

```tsx
<TabsTrigger value="additional">معلومات إضافية</TabsTrigger>

<TabsContent value="additional">
  {/* Specialties - Array input */}
  <Label>الأطباق المميزة</Label>
  <TagInput 
    placeholder="أضف طبق مميز (اضغط Enter)"
    values={specialties}
    onChange={setSpecialties}
  />
  
  {/* Cuisine Types - Multi-select */}
  <Label>أنواع المطبخ</Label>
  <MultiSelect options={["هندي", "باكستاني", "حيدرابادي"]} />
  
  {/* Payment Methods - Checkboxes */}
  <Label>طرق الدفع المقبولة</Label>
  <CheckboxGroup options={["كاش", "مدى", "فيزا", "Apple Pay"]} />
</TabsContent>
```

**Database:** Already exists in Restaurant model (specialties[], cuisineTypes[], paymentMethods[])

---

### Phase 2: Services Management

#### 2.1 Create Services Page

**New files:**

- `app/restaurant-portal/services/page.tsx`
- `app/restaurant-portal/services/actions/upsertService.ts`
- `app/restaurant-portal/services/actions/deleteService.ts`
- `app/restaurant-portal/services/components/ServiceCard.tsx`
- `app/restaurant-portal/services/components/ServiceUpsert.tsx`

**UI Structure:**

```
┌─────────────────────────────────────────────────┐
│ الخدمات والمرافق              [+ إضافة خدمة]   │
├─────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│ │ 📶 WiFi │ │ 🅿️ موقف│ │ ♿ خدمات│            │
│ │ متاح    │ │ مجاني  │ │ ذوي الهمم│            │
│ │ [تعديل] │ │ [تعديل] │ │ [تعديل] │            │
│ └─────────┘ └─────────┘ └─────────┘            │
└─────────────────────────────────────────────────┘
```

**Form Fields:**

- Icon selector (dropdown with preview)
- Name (e.g., "موقف سيارات")
- Description (optional)
- Display order (number)
- Active toggle

**Database:** Uses existing `RestaurantService` model

---

### Phase 3: Features Management

#### 3.1 Create Features Page

**New files:**

- `app/restaurant-portal/features/page.tsx`
- `app/restaurant-portal/features/actions/upsertFeature.ts`
- `app/restaurant-portal/features/actions/deleteFeature.ts`
- `app/restaurant-portal/features/components/FeatureCard.tsx`
- `app/restaurant-portal/features/components/FeatureUpsert.tsx`

**UI Structure:**

```
┌──────────────────────────────────────────────────┐
│ ما يميز مطعمك                  [+ إضافة ميزة]   │
├──────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────┐  │
│ │ 🏆 Award-Winning Chef                      │  │
│ │ حاصل على جائزة أفضل مطبخ هندي 2024        │  │
│ │                         [تعديل] [حذف]      │  │
│ └────────────────────────────────────────────┘  │
│ ┌────────────────────────────────────────────┐  │
│ │ 🌿 Fresh Ingredients                       │  │
│ │ نستخدم مكونات طازجة يومياً               │  │
│ │                         [تعديل] [حذف]      │  │
│ └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

**Form Fields:**

- Icon selector
- Title (e.g., "شيف حائز على جوائز")
- Description (detailed text)
- Display order
- Active toggle

**Database:** Uses existing `RestaurantFeature` model

---

### Phase 4: Gallery Management

#### 4.1 Create Gallery Page

**New files:**

- `app/restaurant-portal/gallery/page.tsx`
- `app/restaurant-portal/gallery/actions/uploadImage.ts`
- `app/restaurant-portal/gallery/actions/deleteImage.ts`
- `app/restaurant-portal/gallery/actions/updateImageOrder.ts`
- `app/restaurant-portal/gallery/components/ImageUploader.tsx`

**UI Structure:**

```
┌──────────────────────────────────────────────────┐
│ معرض الصور                      [+ إضافة صورة]  │
├──────────────────────────────────────────────────┤
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │
│ │[Image1]│ │[Image2]│ │[Image3]│ │[Image4]│    │
│ │Caption │ │Caption │ │        │ │        │    │
│ │  [✏️][🗑️]│ │  [✏️][🗑️]│ │  [✏️][🗑️]│ │  [✏️][🗑️]│    │
│ └────────┘ └────────┘ └────────┘ └────────┘    │
└──────────────────────────────────────────────────┘
```

**Features:**

- Drag-and-drop upload
- Image preview
- Caption/alt text editor
- Reorder images (drag & drop)
- Delete confirmation

**Database:** Uses existing `RestaurantImage` model

---

### Phase 5: Reservations System

#### 5.1 Create Reservations Management

**New files:**

- `app/restaurant-portal/reservations/page.tsx`
- `app/restaurant-portal/reservations/actions/getReservations.ts`
- `app/restaurant-portal/reservations/actions/updateReservationStatus.ts`
- `app/restaurant-portal/reservations/components/ReservationCard.tsx`

**New Prisma Model:**

```prisma
model Reservation {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  restaurantId String   @db.ObjectId
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  
  // Customer info
  customerName  String
  customerPhone String
  customerEmail String?
  
  // Reservation details
  date          DateTime
  time          String // "7:00 PM"
  partySize     Int // Number of people
  specialRequests String?
  
  // Status
  status        ReservationStatus @default(PENDING)
  confirmedAt   DateTime?
  canceledAt    DateTime?
  cancelReason  String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([restaurantId, date])
  @@map("reservations")
}

enum ReservationStatus {
  PENDING
  CONFIRMED
  CANCELED
  COMPLETED
}
```

#### 5.2 Public Reservation Form

**New files:**

- `app/(e-comm)/restaurant/[slug]/reservations/page.tsx`
- `app/(e-comm)/restaurant/[slug]/reservations/actions/createReservation.ts`

**UI on Public Restaurant Page:**

- Add "احجز طاولة" button in quick actions
- Reservation form with: name, phone, email, date, time, party size, special requests
- Confirmation message with reservation ID

---

### Phase 6: Reviews System

#### 6.1 Create Reviews Management

**New files:**

- `app/restaurant-portal/reviews/page.tsx`
- `app/restaurant-portal/reviews/actions/getReviews.ts`
- `app/restaurant-portal/reviews/actions/respondToReview.ts`
- `app/restaurant-portal/reviews/actions/reportReview.ts`
- `app/restaurant-portal/reviews/components/ReviewCard.tsx`

**New Prisma Model:**

```prisma
model RestaurantReview {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  restaurantId String   @db.ObjectId
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  
  // Customer
  customerId   String?  @db.ObjectId
  customerName String
  
  // Review content
  rating       Int // 1-5
  title        String?
  comment      String
  images       String[] @default([])
  
  // Response from owner
  ownerResponse String?
  respondedAt   DateTime?
  
  // Moderation
  isApproved   Boolean @default(false)
  isReported   Boolean @default(false)
  reportReason String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([restaurantId, isApproved])
  @@map("restaurantreviews")
}
```

#### 6.2 Public Review Display & Submission

**Files to modify:**

- `app/(e-comm)/restaurant/[slug]/page.tsx` - Add Reviews tab
- Create `app/(e-comm)/restaurant/[slug]/reviews/actions/submitReview.ts`

---

### Phase 7: Restaurant Blog/News

#### 7.1 Create Blog Management

**New files:**

- `app/restaurant-portal/blog/page.tsx`
- `app/restaurant-portal/blog/new/page.tsx`
- `app/restaurant-portal/blog/edit/[id]/page.tsx`
- `app/restaurant-portal/blog/actions/upsertPost.ts`
- `app/restaurant-portal/blog/actions/deletePost.ts`
- `app/restaurant-portal/blog/components/PostEditor.tsx`

**New Prisma Model:**

```prisma
model RestaurantPost {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  restaurantId String   @db.ObjectId
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  
  title        String
  slug         String   @unique
  content      String   @db.String // Rich text
  excerpt      String?
  imageUrl     String?
  
  isPublished  Boolean @default(false)
  publishedAt  DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([restaurantId, isPublished])
  @@map("restaurantposts")
}
```

**Features:**

- Rich text editor (markdown or WYSIWYG)
- Featured image upload
- Publish/draft toggle
- Public view at `/restaurant/[slug]/blog`

---

### Phase 8: Update Public Restaurant Page

#### 8.1 Enhance `/restaurant/[slug]/page.tsx`

**Modifications needed:**

1. **Update Overview Tab** to show:

   - Specialties (if available)
   - Payment methods (if available)
   - Cuisine types (if available)

2. **Add new tabs:**

   - "Reservations" (احجز الآن)
   - "Reviews" (التقييمات)
   - "Blog" (الأخبار) - if restaurant has posts

3. **Enhance existing tabs:**

   - Gallery tab - show all uploaded images
   - Info tab - show all services and features

---

### Phase 9: Navigation & Layout Updates

#### 9.1 Update Restaurant Portal Navigation

**File:** `app/restaurant-portal/layout.tsx`

**Add new menu items:**

```tsx
const navItems = [
  { href: '/restaurant-portal', label: 'لوحة التحكم', icon: 'LayoutDashboard' },
  { href: '/restaurant-portal/profile', label: 'الملف الشخصي', icon: 'Store' },
  { href: '/restaurant-portal/menu', label: 'القائمة', icon: 'UtensilsCrossed' },
  { href: '/restaurant-portal/services', label: 'الخدمات', icon: 'Wifi' }, // NEW
  { href: '/restaurant-portal/features', label: 'المميزات', icon: 'Star' }, // NEW
  { href: '/restaurant-portal/gallery', label: 'المعرض', icon: 'Image' }, // NEW
  { href: '/restaurant-portal/reservations', label: 'الحجوزات', icon: 'Calendar' }, // NEW
  { href: '/restaurant-portal/reviews', label: 'التقييمات', icon: 'MessageSquare' }, // NEW
  { href: '/restaurant-portal/blog', label: 'المدونة', icon: 'Newspaper' }, // NEW
  { href: '/restaurant-portal/orders', label: 'الطلبات', icon: 'Package' },
];
```

---

## Implementation Todos

### Phase 1: Profile Enhancements

- Enhance profile form with specialties, cuisine types, payment methods inputs
- Update updateProfile action to handle new fields
- Add validation for array fields

### Phase 2: Services Management

- Create services management page with CRUD
- Build service card and upsert dialog components
- Implement server actions for services

### Phase 3: Features Management  

- Create features management page with CRUD
- Build feature card and form components
- Implement server actions for features

### Phase 4: Gallery Management

- Create gallery page with image upload
- Implement drag-drop reordering
- Add image caption editor
- Implement delete with confirmation

### Phase 5: Reservations System

- Add Reservation model to Prisma schema
- Create reservations management page for owners
- Build public reservation form
- Implement email/SMS confirmations
- Add reservation status management

### Phase 6: Reviews System

- Add RestaurantReview model to Prisma schema
- Create reviews dashboard for owners
- Build owner response functionality
- Create public review submission form
- Display reviews on restaurant page
- Implement review moderation

### Phase 7: Blog/News System

- Add RestaurantPost model to Prisma schema
- Create blog management page
- Build rich text post editor
- Implement publish/draft system
- Create public blog listing and detail pages

### Phase 8: Public Page Updates

- Update restaurant page to display new data
- Add reservations tab/button
- Add reviews tab with submission form
- Add blog/news section
- Enhance services and features display

### Phase 9: Final Integration

- Update portal navigation with all new sections
- Test all CRUD operations
- Verify authorization (owners can only edit their restaurant)
- Add loading states and error handling
- Run production safety checks

---

## Production Safety Checklist

- ✅ All new pages check RESTAURANT_OWNER role
- ✅ All actions verify restaurant ownership (userId match)
- ✅ Existing functionality preserved (zero breaking changes)
- ✅ Database changes use new models (no modification to existing)
- ✅ Image uploads use existing Cloudinary integration
- ✅ Forms have proper validation
- ✅ Cache revalidation after mutations
- ✅ Mobile responsive design
- ✅ Arabic RTL support maintained
- ✅ TypeScript strict mode compliance

---

## Success Criteria

When complete, a new restaurant owner can:

1. ✅ Receive eachRest.md as a comprehensive guide
2. ✅ Log into restaurant portal
3. ✅ Fill in ALL profile sections independently
4. ✅ Add services, features, and gallery images
5. ✅ Receive and manage table reservations
6. ✅ View and respond to customer reviews
7. ✅ Publish blog posts about events/offers
8. ✅ See all changes reflected on public restaurant page immediately

Public visitors can:

1. ✅ View complete restaurant profile with all information
2. ✅ Book table reservations online
3. ✅ Submit and read reviews
4. ✅ Browse restaurant blog/news
5. ✅ See photo gallery and all features