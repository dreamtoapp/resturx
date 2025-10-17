# 🍽️ Restaurant Platform - User Flow

## ✅ **CORRECT FLOW (3 LEVELS)**

```
1. COUNTRIES/CUISINES (Homepage)
   ↓
2. RESTAURANTS (by cuisine)
   ↓
3. DISHES (restaurant menu)
```

---

## 📱 **Detailed User Journey**

### **Level 1: Homepage - Countries/Cuisines**

**URL**: `http://localhost:3000`

**What User Sees:**
- Section title: **"تصفح حسب نوع المطبخ"**
- Subtitle: "اكتشف المطاعم حسب الجنسية والمطبخ"
- Horizontal scroll of cuisine cards:
  - 🇮🇳 **المطبخ الهندي** (Indian Cuisine)
  - 🇪🇬 **المطبخ المصري** (Egyptian Cuisine)
  - 🇮🇹 **المطبخ الإيطالي** (Italian Cuisine)
  - 🇨🇳 **المطبخ الصيني** (Chinese Cuisine)
  - 🌍 **المطبخ العربي** (Arabic Cuisine)

**Each Card Shows:**
- Cuisine logo/icon
- Cuisine name
- Badge: "X مطعم" (X restaurants)
- Restaurant icon (utensils)

**User Action**: Click on any cuisine card

---

### **Level 2: Country Page - Restaurants**

**URL**: `/categories/[country-slug]`  
**Example**: `/categories/indian-cuisine`

**What User Sees:**
- **Page Header**:
  - Cuisine logo (circular)
  - Cuisine name (H1): "المطبخ الهندي"
  - Description: "أشهى الأطباق الهندية التقليدية والمعاصرة"
  - Badge: "3 مطعم"

- **Restaurant Grid** (2-3 columns):
  - Restaurant cards with:
    - ✅ Cover image
    - ✅ Verified badge (if isVerified)
    - ✅ Restaurant name
    - ✅ Description (2 lines max)
    - ✅ Delivery time (🕐)
    - ✅ Min order (💰)
    - ✅ Rating (⭐)
    - ✅ Dish count badge ("X طبق")
    - ✅ Own delivery badge (if hasOwnDelivery)
    - ✅ Services preview (first 4)
    - ✅ Button: "عرض القائمة"

**User Action**: Click "عرض القائمة" on any restaurant

---

### **Level 3: Restaurant Profile - Dishes**

**URL**: `/restaurant/[restaurant-slug]`  
**Example**: `/restaurant/indian-cuisine-مطعم-تاج-محل`

**What User Sees:**

#### **A. Hero Section**
- Cover image (full width)
- Restaurant logo (overlay, bottom-right)

#### **B. Header Info**
- Restaurant name (large)
- Badges:
  - "موثق" (verified, green)
  - "شائع" (popular)
  - Cuisine badge
- Star rating (1-5 stars)
- Review count
- Quick actions:
  - "اتصل" button
  - "الموقع" button

#### **C. 4 Tabs**

**Tab 1: نظرة عامة (Overview)**
- About section (bio)
- Specialties (badges)
- Services & Amenities (grid with icons)
- Features (what makes it special)
- Delivery Info (time, min, fee)
- Payment Methods

**Tab 2: القائمة (Menu)**
- Shows first 12 dishes
- "عرض القائمة الكاملة ←" link
- Dish cards:
  - Image
  - Name
  - Description
  - Price
  - Rating
  - Link to dish details

**Tab 3: الصور (Gallery)**
- Grid of restaurant images
- Captions
- Hover zoom effect

**Tab 4: معلومات الاتصال (Info)**
- Contact details (phone, email, address)
- Working hours
- Google Maps (embedded)
- "Get Directions" link

**User Actions:**
1. View menu items in "القائمة" tab
2. Click "عرض القائمة الكاملة" for full menu
3. Or click on individual dish for details

---

### **Level 3B: Full Menu Page**

**URL**: `/restaurant/[restaurant-slug]/menu`  
**Example**: `/restaurant/indian-cuisine-مطعم-تاج-محل/menu`

**What User Sees:**
- Compact restaurant header (logo, name, badges)
- Title: "القائمة الكاملة"
- Grid of **ALL dishes** (4 columns)
- Each dish:
  - Image
  - Name, description
  - Price, compare price
  - Rating
  - **Add to Cart button** ← CAN ORDER!

**User Action**: Add dishes to cart, proceed to checkout

---

## 🔄 **Navigation Summary**

```
Homepage
  → Click "المطبخ الهندي"
    → Country Page (Indian Cuisine)
      → Shows 3 Indian restaurants
        → Click "عرض القائمة" on "مطعم تاج محل"
          → Restaurant Profile
            → Click "القائمة" tab
              → See dishes
                → Click "Add to Cart"
                  → Checkout & Order! ✅
```

---

## 🎯 **Test This Flow Now!**

### **Step 1: Go to Homepage**
```
http://localhost:3000
```
✅ Should see 5 cuisines with restaurant counts

### **Step 2: Click Indian Cuisine**
```
http://localhost:3000/categories/indian-cuisine
```
✅ Should see 3 Indian restaurants:
- مطعم تاج محل
- بومباي بايتس
- دلهي دينرز

### **Step 3: Click "عرض القائمة" on Taj Mahal**
```
http://localhost:3000/restaurant/indian-cuisine-مطعم-تاج-محل
```
✅ Should see:
- Hero with cover & logo
- 4 tabs working
- Services, features displayed
- Dishes in menu tab

### **Step 4: Click "عرض القائمة الكاملة"**
```
http://localhost:3000/restaurant/indian-cuisine-مطعم-تاج-محل/menu
```
✅ Should see:
- Full menu grid
- All dishes with "Add to Cart"
- Can order dishes!

---

## 📊 **Data Flow**

### **Countries Table (suppliers collection)**
```
المطبخ الهندي
المطبخ المصري
المطبخ الإيطالي
المطبخ الصيني
المطبخ العربي
```

### **Restaurants Table (categories collection)**
```
مطعم تاج محل → countryId: "المطبخ الهندي"
بومباي بايتس → countryId: "المطبخ الهندي"
دلهي دينرز → countryId: "المطبخ الهندي"
مطعم النيل → countryId: "المطبخ المصري"
...
```

### **Dishes Table (products collection)**
```
بيرياني دجاج → supplierId: "مطعم تاج محل"
دجاج تندوري → supplierId: "مطعم تاج محل"
كاري لحم → supplierId: "مطعم تاج محل"
...
```

---

## ✅ **FLOW IS NOW CORRECT!**

**The 3-level hierarchy is working:**
1. ✅ Countries (Cuisines)
2. ✅ Restaurants (by Cuisine)  
3. ✅ Dishes (Menu Items)

**Test it now at http://localhost:3000!** 🚀




