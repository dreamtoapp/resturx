# 🧪 QA Test Plan - Restaurant Platform
**Version**: 1.0.0  
**Environment**: Development (localhost:3000)  
**Date**: $(Get-Date)  
**Status**: Ready for Testing

---

## 📋 Test Execution Checklist

### ✅ Pre-Test Setup
- [ ] Dev server running on http://localhost:3000
- [ ] Prisma Client generated (`npx prisma generate`)
- [ ] Database accessible
- [ ] Admin user credentials ready
- [ ] Restaurant Owner user created (role: RESTAURANT_OWNER)

---

## 🧪 Test Scenarios

### **TEST SUITE 1: Homepage & Navigation**

#### TC-001: Homepage Load
**Priority**: Critical  
**Steps**:
1. Open http://localhost:3000
2. Wait for page to fully load

**Expected Results**:
- [ ] Page loads without errors
- [ ] Header displays correctly
- [ ] "تصفح حسب نوع المطبخ" heading visible
- [ ] Categories/Countries section displays
- [ ] Footer loads

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL  
**Screenshot**: _______________

---

#### TC-002: Navigation Menu
**Priority**: High  
**Steps**:
1. From homepage, check navigation menu
2. Click each menu item

**Expected Results**:
- [ ] All menu links are clickable
- [ ] No broken links
- [ ] Active state shows correctly
- [ ] Mobile menu works (if responsive)

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

### **TEST SUITE 2: Admin Dashboard - Countries**

#### TC-003: Access Countries Management
**Priority**: Critical  
**Steps**:
1. Login as ADMIN
2. Navigate to /dashboard/management-countries

**Expected Results**:
- [ ] Page title: "إدارة البلدان/الجنسيات"
- [ ] "إضافة" button visible
- [ ] Existing countries list (if any)
- [ ] Badge shows country count

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-004: Add New Country
**Priority**: Critical  
**Steps**:
1. Click "إضافة" button
2. Fill form:
   - Name: "المطبخ الهندي"
   - Description: "أشهى الأطباق الهندية"
3. Click "حفظ"
4. Wait for success message

**Expected Results**:
- [ ] Form modal opens
- [ ] All fields render correctly
- [ ] Validation works (name required)
- [ ] Success toast appears
- [ ] Page refreshes
- [ ] New country appears in list

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-005: Edit Country
**Priority**: High  
**Steps**:
1. Click edit icon on a country
2. Modify name to "المطبخ الهندي المميز"
3. Click save

**Expected Results**:
- [ ] Form pre-fills with existing data
- [ ] Changes save successfully
- [ ] Updated name displays

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-006: Delete Country (with restaurants)
**Priority**: High  
**Steps**:
1. Create country with linked restaurant
2. Try to delete country
3. Confirm deletion

**Expected Results**:
- [ ] Warning message appears
- [ ] Deletion prevented if restaurants exist
- [ ] Error message clear

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-007: Delete Country (empty)
**Priority**: Medium  
**Steps**:
1. Create new country without restaurants
2. Click delete
3. Confirm deletion

**Expected Results**:
- [ ] Confirmation dialog appears
- [ ] Delete successful
- [ ] Country removed from list
- [ ] Success message shown

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-008: View Country Details
**Priority**: Medium  
**Steps**:
1. Click "View" icon on country
2. Check details page

**Expected Results**:
- [ ] Country name, description displayed
- [ ] Restaurant count shown
- [ ] List of restaurants (if any)
- [ ] Back navigation works

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

### **TEST SUITE 3: Admin Dashboard - Restaurants**

#### TC-009: Access Restaurants Management
**Priority**: Critical  
**Steps**:
1. Login as ADMIN
2. Navigate to /dashboard/management-categories

**Expected Results**:
- [ ] Page title: "إدارة المطاعم"
- [ ] "إضافة مطعم" button visible
- [ ] Restaurant cards display correctly
- [ ] Count badge accurate

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-010: Add Restaurant - Form Validation
**Priority**: Critical  
**Steps**:
1. Click "إضافة مطعم"
2. Try to submit empty form
3. Check validation messages

**Expected Results**:
- [ ] Name field: "اسم المطعم مطلوب"
- [ ] Country field: "يجب اختيار نوع المطبخ"
- [ ] Owner field: "يجب اختيار صاحب المطعم"
- [ ] Email validation (if provided)
- [ ] Form doesn't submit

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-011: Add Restaurant - Full Form
**Priority**: Critical  
**Steps**:
1. Click "إضافة مطعم"
2. Fill ALL fields:
   - **نوع المطبخ**: Select "المطبخ الهندي"
   - **صاحب المطعم**: Select owner user
   - **اسم المطعم**: "مطعم تاج محل"
   - **الوصف**: "أشهى الأطباق الهندية الأصيلة"
   - **رقم الهاتف**: "+966501234567"
   - **البريد الإلكتروني**: "taj@restaurant.sa"
   - **العنوان**: "طريق الملك فهد، الرياض"
   - **وقت التوصيل**: "30-45 دقيقة"
   - **الحد الأدنى**: 50
   - **رسوم التوصيل**: 10
   - ✓ **خدمة توصيل خاصة**
3. Click submit

**Expected Results**:
- [ ] All selectors populate correctly
- [ ] Number fields accept numbers only
- [ ] Checkbox toggles
- [ ] Form submits successfully
- [ ] Success toast appears
- [ ] Page refreshes
- [ ] New restaurant appears

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-012: Restaurant Card Display
**Priority**: High  
**Steps**:
1. View restaurant in list
2. Check card details

**Expected Results**:
- [ ] Restaurant logo/image displays
- [ ] Name shown clearly
- [ ] Status badge: "نشط" (green)
- [ ] Country badge displays
- [ ] "0 طبق" shown initially
- [ ] Address displays (if provided)
- [ ] Phone displays (if provided)
- [ ] Rating displays (if set)

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-013: Edit Restaurant
**Priority**: High  
**Steps**:
1. Click edit on restaurant
2. Modify description
3. Change delivery time
4. Save

**Expected Results**:
- [ ] Form pre-fills (except country & owner)
- [ ] Changes save
- [ ] Updates reflect in card

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-014: Delete Restaurant (with dishes)
**Priority**: High  
**Steps**:
1. Create restaurant with dishes
2. Try to delete
3. Check error message

**Expected Results**:
- [ ] Deletion prevented
- [ ] Error message: "لا يمكن حذف المطعم لأنه مرتبط بأطباق حالية"

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-015: Delete Restaurant (empty)
**Priority**: Medium  
**Steps**:
1. Create restaurant without dishes
2. Delete it
3. Confirm

**Expected Results**:
- [ ] Confirmation dialog
- [ ] Deletes successfully
- [ ] Success message

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

### **TEST SUITE 4: Customer Frontend - Country Page**

#### TC-016: Homepage Categories Display
**Priority**: Critical  
**Steps**:
1. Go to homepage
2. Scroll to categories section

**Expected Results**:
- [ ] Section title: "تصفح حسب نوع المطبخ"
- [ ] Subtitle: "اكتشف المطاعم حسب الجنسية والمطبخ"
- [ ] Country cards display
- [ ] Each card shows "X مطعم" (restaurant count)
- [ ] Restaurant icon (utensils) visible
- [ ] "عرض الكل" link works

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-017: Navigate to Country Page
**Priority**: Critical  
**Steps**:
1. Click on a country card
2. Wait for page load

**Expected Results**:
- [ ] URL: /categories/[country-slug]
- [ ] Page loads
- [ ] Country header displays
- [ ] Restaurant grid shows

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-018: Country Page - Header
**Priority**: High  
**Steps**:
1. On country page, check header section

**Expected Results**:
- [ ] Country logo displays (if exists)
- [ ] Country name as H1
- [ ] Description shown
- [ ] "X مطعم" badge

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-019: Country Page - Restaurant Cards
**Priority**: Critical  
**Steps**:
1. Check restaurant cards in grid

**Expected Results**:
- [ ] 2-3 column grid (responsive)
- [ ] Each card shows:
  - [ ] Cover image
  - [ ] "موثق" badge (if verified)
  - [ ] Restaurant name
  - [ ] Description (truncated)
  - [ ] Delivery time
  - [ ] Min order
  - [ ] Rating (if exists)
  - [ ] Dish count badge
  - [ ] "توصيل خاص" badge (if hasOwnDelivery)
  - [ ] Services preview (first 4)
  - [ ] "عرض القائمة" button

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-020: Empty Country Page
**Priority**: Medium  
**Steps**:
1. View country with no restaurants

**Expected Results**:
- [ ] Empty state card displays
- [ ] Icon shown
- [ ] Message: "لا توجد مطاعم متاحة"
- [ ] Helpful text shown

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

### **TEST SUITE 5: Restaurant Profile Page**

#### TC-021: Access Restaurant Profile
**Priority**: Critical  
**Steps**:
1. Click "عرض القائمة" on restaurant card
2. Wait for page load

**Expected Results**:
- [ ] URL: /restaurant/[slug]
- [ ] Page loads without errors
- [ ] All sections render

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-022: Profile - Hero Section
**Priority**: High  
**Steps**:
1. Check top hero section

**Expected Results**:
- [ ] Cover image displays (or gradient)
- [ ] Restaurant logo overlay (bottom-right)
- [ ] Logo has border & shadow
- [ ] Gradient overlay visible

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-023: Profile - Header Info
**Priority**: Critical  
**Steps**:
1. Check header information section

**Expected Results**:
- [ ] Restaurant name (H1, 3-4xl)
- [ ] Badges:
  - [ ] "موثق" (green, if isVerified)
  - [ ] "شائع" (if isPopular)
  - [ ] Country badge
  - [ ] Cuisine type badges (if any)
- [ ] Rating section:
  - [ ] 5 star icons
  - [ ] Filled stars (yellow)
  - [ ] Rating number (e.g., 4.5)
  - [ ] Review count (e.g., "(25 تقييم)")
- [ ] Quick action buttons:
  - [ ] "اتصل" (if phone exists)
  - [ ] "الموقع" (if lat/long exist)

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-024: Profile - Tabs Navigation
**Priority**: High  
**Steps**:
1. Check tabs bar
2. Click each tab

**Expected Results**:
- [ ] 4 tabs visible:
  1. نظرة عامة
  2. القائمة
  3. الصور
  4. معلومات الاتصال
- [ ] Active tab highlighted
- [ ] Clicking switches content
- [ ] No errors on switch

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-025: Profile - Overview Tab
**Priority**: Critical  
**Steps**:
1. Check "نظرة عامة" tab content

**Expected Results**:
- [ ] **About Section** (if bio exists):
  - [ ] Card with "عن المطعم" title
  - [ ] Bio text displayed
- [ ] **Specialties** (if exists):
  - [ ] Card with "الأطباق المميزة" title
  - [ ] Specialty badges
- [ ] **Services Card**:
  - [ ] "الخدمات والمرافق" title
  - [ ] Grid layout (2-3 columns)
  - [ ] Each service shows:
    - [ ] Icon circle
    - [ ] Service name
    - [ ] Description (if exists)
- [ ] **Features Card** (if exists):
  - [ ] "ما يميزنا" title
  - [ ] 2-column grid
  - [ ] Each feature shows:
    - [ ] Icon circle
    - [ ] Title
    - [ ] Description
- [ ] **Delivery Info Card**:
  - [ ] "معلومات التوصيل" title
  - [ ] Delivery time
  - [ ] Min order
  - [ ] Delivery fee
  - [ ] Own delivery badge
- [ ] **Payment Methods** (if exists):
  - [ ] "طرق الدفع المقبولة" title
  - [ ] Payment badges

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-026: Profile - Menu Tab
**Priority**: Critical  
**Steps**:
1. Click "القائمة" tab

**Expected Results**:
- [ ] "القائمة" title shown
- [ ] "عرض القائمة الكاملة ←" link visible
- [ ] Dish grid (3-4 columns)
- [ ] Shows up to 12 dishes
- [ ] Each dish card:
  - [ ] Image
  - [ ] "نفذ" badge (if out of stock)
  - [ ] Name
  - [ ] Description (truncated)
  - [ ] Price in green
  - [ ] Compare price (strikethrough if exists)
  - [ ] "التفاصيل →" link
- [ ] Empty state if no dishes

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-027: Profile - Gallery Tab
**Priority**: Medium  
**Steps**:
1. Click "الصور" tab

**Expected Results**:
- [ ] Image grid (2/3/4 columns responsive)
- [ ] Each image:
  - [ ] Square aspect ratio
  - [ ] Hover zoom effect
  - [ ] Caption at bottom (if exists)
- [ ] Empty state if no images

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-028: Profile - Info Tab
**Priority**: High  
**Steps**:
1. Click "معلومات الاتصال" tab

**Expected Results**:
- [ ] **Contact Card**:
  - [ ] Phone (with icon, clickable)
  - [ ] Email (with icon, clickable)
  - [ ] Address (with icon)
- [ ] **Working Hours Card** (if exists):
  - [ ] "ساعات العمل" title
  - [ ] Hours text (pre-formatted)
- [ ] **Location Card** (if lat/long):
  - [ ] "الموقع" title
  - [ ] Google Maps iframe
  - [ ] "احصل على الاتجاهات" link

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-029: Profile - Click Phone Number
**Priority**: Medium  
**Steps**:
1. Click phone number
2. Check system behavior

**Expected Results**:
- [ ] Opens phone dialer (on mobile)
- [ ] Correct format (tel: link)

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-030: Profile - Click Location
**Priority**: Medium  
**Steps**:
1. Click "الموقع" button in header
2. Or click "احصل على الاتجاهات"

**Expected Results**:
- [ ] Opens Google Maps
- [ ] Correct coordinates
- [ ] Opens in new tab

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

### **TEST SUITE 6: Restaurant Menu Page**

#### TC-031: Access Full Menu
**Priority**: Critical  
**Steps**:
1. From restaurant profile, click "عرض القائمة الكاملة"
2. Wait for page load

**Expected Results**:
- [ ] URL: /restaurant/[slug]/menu
- [ ] Page loads
- [ ] Full dish list shows

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-032: Menu Page - Header
**Priority**: Medium  
**Steps**:
1. Check menu page header

**Expected Results**:
- [ ] Compact restaurant header:
  - [ ] Restaurant logo (small)
  - [ ] Restaurant name (clickable to profile)
  - [ ] Country name
  - [ ] Delivery time badge
  - [ ] Min order badge

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-033: Menu Page - Dish Grid
**Priority**: Critical  
**Steps**:
1. Check dish grid

**Expected Results**:
- [ ] "القائمة الكاملة" title
- [ ] Grid layout (4 columns)
- [ ] ALL published dishes shown
- [ ] Each card:
  - [ ] Image with hover zoom
  - [ ] Name
  - [ ] Description
  - [ ] Price
  - [ ] Rating (if exists)
  - [ ] Add to Cart button (if in stock)

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-034: Menu - Add to Cart
**Priority**: Critical  
**Steps**:
1. Click "Add to Cart" on a dish
2. Check cart

**Expected Results**:
- [ ] Item added to cart
- [ ] Cart count increases
- [ ] Success notification

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

### **TEST SUITE 7: Restaurant Owner Portal**

#### TC-035: Access Portal (Unauthorized)
**Priority**: Critical  
**Steps**:
1. Logout or use CUSTOMER account
2. Try to access /restaurant-portal

**Expected Results**:
- [ ] Redirects to login
- [ ] Error parameter in URL
- [ ] Cannot access portal

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-036: Access Portal (No Restaurant)
**Priority**: High  
**Steps**:
1. Login as RESTAURANT_OWNER with no linked restaurant
2. Access /restaurant-portal

**Expected Results**:
- [ ] Shows "لا يوجد مطعم مسجل"
- [ ] Store icon displayed
- [ ] Message to contact admin

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-037: Access Portal (Suspended)
**Priority**: High  
**Steps**:
1. Suspend a restaurant (status = SUSPENDED)
2. Login as that restaurant owner
3. Access portal

**Expected Results**:
- [ ] Shows "المطعم معلق"
- [ ] Warning icon
- [ ] Message to contact admin
- [ ] Cannot access dashboard

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-038: Portal Dashboard - Load
**Priority**: Critical  
**Steps**:
1. Login as RESTAURANT_OWNER with active restaurant
2. Access /restaurant-portal

**Expected Results**:
- [ ] Dashboard loads
- [ ] Header shows:
  - [ ] Restaurant logo
  - [ ] Restaurant name
  - [ ] "بوابة المطعم" subtitle
  - [ ] "عرض الواجهة" button
- [ ] Sidebar shows 7 items:
  1. لوحة التحكم
  2. بيانات المطعم
  3. القائمة
  4. الخدمات
  5. المميزات
  6. معرض الصور
  7. الطلبات

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-039: Portal - Stats Cards
**Priority**: High  
**Steps**:
1. Check 4 stat cards

**Expected Results**:
- [ ] **Card 1**: طلبات اليوم (count)
- [ ] **Card 2**: إجمالي الأطباق (count)
- [ ] **Card 3**: التقييم (rating with star)
- [ ] **Card 4**: إيرادات اليوم (SAR)
- [ ] All cards have icons
- [ ] Numbers display correctly

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-040: Portal - Recent Orders
**Priority**: Medium  
**Steps**:
1. Check recent orders section

**Expected Results**:
- [ ] "الطلبات الأخيرة" title
- [ ] "عرض الكل →" link
- [ ] Up to 10 orders shown
- [ ] Each order:
  - [ ] Order number badge
  - [ ] Customer name
  - [ ] Item count
  - [ ] Total amount
  - [ ] Status badge (colored)
- [ ] Empty state if no orders

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-041: Portal - Quick Actions
**Priority**: Medium  
**Steps**:
1. Check quick actions section
2. Click each button

**Expected Results**:
- [ ] 3 buttons visible:
  - [ ] "إضافة طبق جديد" (primary)
  - [ ] "تعديل البيانات"
  - [ ] "عرض الصفحة العامة" (opens in new tab)
- [ ] All buttons work
- [ ] Icons display

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-042: Portal - Restaurant Status
**Priority**: Low  
**Steps**:
1. Check status indicator at bottom

**Expected Results**:
- [ ] "حالة المطعم:" label
- [ ] Badge shows:
  - [ ] "🟢 نشط" (if ACTIVE)
  - [ ] "🟡 معلق" (if SUSPENDED)
  - [ ] "⚫ غير نشط" (if INACTIVE)

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

### **TEST SUITE 8: Portal - Profile Editor**

#### TC-043: Access Profile Editor
**Priority**: Critical  
**Steps**:
1. Click "بيانات المطعم" in sidebar
2. Or click "تعديل البيانات" button

**Expected Results**:
- [ ] URL: /restaurant-portal/profile
- [ ] Page title: "تعديل بيانات المطعم"
- [ ] Form loads with existing data

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-044: Profile - Tabs System
**Priority**: High  
**Steps**:
1. Check tabs
2. Click each tab

**Expected Results**:
- [ ] 4 tabs visible:
  1. معلومات أساسية
  2. الاتصال والموقع
  3. التشغيل
  4. عن المطعم
- [ ] Tab switching works
- [ ] Content changes

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-045: Profile - Basic Info Tab
**Priority**: High  
**Steps**:
1. Check "معلومات أساسية" tab

**Expected Results**:
- [ ] Name field (pre-filled)
- [ ] Description field (pre-filled)
- [ ] Cuisine type (read-only, shows country)
- [ ] Note about contacting admin to change

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-046: Profile - Contact Tab
**Priority**: High  
**Steps**:
1. Check "الاتصال والموقع" tab

**Expected Results**:
- [ ] Phone field
- [ ] Email field (with validation)
- [ ] Address field (textarea)
- [ ] Info note about map location

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-047: Profile - Operations Tab
**Priority**: High  
**Steps**:
1. Check "التشغيل" tab

**Expected Results**:
- [ ] Working hours field (textarea, multi-line)
- [ ] Delivery time field
- [ ] Min order field (number)
- [ ] Delivery fee field (number)
- [ ] "Own delivery" checkbox

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-048: Profile - About Tab
**Priority**: Medium  
**Steps**:
1. Check "عن المطعم" tab

**Expected Results**:
- [ ] Bio field (large textarea, 6 rows)
- [ ] Helper text below
- [ ] Character count (optional)

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-049: Profile - Form Validation
**Priority**: Critical  
**Steps**:
1. Clear name field
2. Try to submit

**Expected Results**:
- [ ] "الاسم مطلوب" error shows
- [ ] Form doesn't submit
- [ ] Focus on error field

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-050: Profile - Email Validation
**Priority**: High  
**Steps**:
1. Enter invalid email: "notanemail"
2. Try to submit

**Expected Results**:
- [ ] "صيغة البريد غير صحيحة" error
- [ ] Form doesn't submit

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-051: Profile - Save Changes
**Priority**: Critical  
**Steps**:
1. Modify multiple fields across tabs
2. Click "حفظ التعديلات"
3. Wait for response

**Expected Results**:
- [ ] Loading state shows
- [ ] Button text: "جارٍ الحفظ..."
- [ ] Success toast: "تم تحديث بيانات المطعم بنجاح"
- [ ] Page refreshes after 1.5s
- [ ] Changes persist

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-052: Profile - Cancel Button
**Priority**: Low  
**Steps**:
1. Make changes
2. Click "إلغاء"

**Expected Results**:
- [ ] Returns to previous page
- [ ] Changes discarded

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

### **TEST SUITE 9: Portal - Menu Management**

#### TC-053: Access Menu Management
**Priority**: Critical  
**Steps**:
1. Click "القائمة" in sidebar

**Expected Results**:
- [ ] URL: /restaurant-portal/menu
- [ ] Page title: "إدارة القائمة"
- [ ] "إضافة طبق جديد" button visible

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-054: Menu - Empty State
**Priority**: Medium  
**Steps**:
1. View menu with no dishes

**Expected Results**:
- [ ] Card with:
  - [ ] Utensils icon
  - [ ] "لا توجد أطباق في القائمة"
  - [ ] Helpful message
  - [ ] "إضافة أول طبق" button

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-055: Menu - Dish Cards Display
**Priority**: High  
**Steps**:
1. View menu with dishes

**Expected Results**:
- [ ] Grid layout (4 columns)
- [ ] Each card shows:
  - [ ] Dish image
  - [ ] "منشور" badge (green) or "مخفي" (gray)
  - [ ] "نفذ" badge (red) if out of stock
  - [ ] Name
  - [ ] Description (truncated)
  - [ ] Price (bold, green)
  - [ ] Stock count (if tracked)
  - [ ] Edit button
  - [ ] Delete button

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

### **TEST SUITE 10: Responsive Design**

#### TC-056: Mobile - Homepage
**Priority**: High  
**Steps**:
1. Resize browser to 375px width
2. Check homepage

**Expected Results**:
- [ ] Header responsive
- [ ] Burger menu works
- [ ] Categories grid: 1-2 columns
- [ ] All content readable

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-057: Mobile - Restaurant Profile
**Priority**: High  
**Steps**:
1. Resize to mobile
2. View restaurant profile

**Expected Results**:
- [ ] Hero scales properly
- [ ] Tabs scroll horizontally
- [ ] Content stacks vertically
- [ ] Buttons full-width

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-058: Tablet - Dashboard
**Priority**: Medium  
**Steps**:
1. Resize to 768px
2. Check admin dashboard

**Expected Results**:
- [ ] Sidebar collapses or shrinks
- [ ] Grid adjusts (2-3 columns)
- [ ] All functions accessible

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

### **TEST SUITE 11: Performance**

#### TC-059: Page Load Time
**Priority**: High  
**Steps**:
1. Clear cache
2. Load homepage
3. Measure time

**Expected Results**:
- [ ] Initial load < 3 seconds
- [ ] Time to Interactive < 5 seconds

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-060: Image Loading
**Priority**: Medium  
**Steps**:
1. Check image lazy loading
2. Scroll through pages

**Expected Results**:
- [ ] Images load progressively
- [ ] No layout shift
- [ ] Placeholders show

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

### **TEST SUITE 12: Error Handling**

#### TC-061: 404 Page
**Priority**: Medium  
**Steps**:
1. Navigate to /nonexistent-page

**Expected Results**:
- [ ] Custom 404 page shows
- [ ] "Page not found" message
- [ ] Link back to homepage

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-062: Restaurant Not Found
**Priority**: Medium  
**Steps**:
1. Navigate to /restaurant/nonexistent

**Expected Results**:
- [ ] 404 or "Not Found" page
- [ ] Proper error handling

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-063: Network Error Handling
**Priority**: Low  
**Steps**:
1. Disconnect internet
2. Try to submit form

**Expected Results**:
- [ ] Error message shows
- [ ] User informed
- [ ] No crash

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

### **TEST SUITE 13: Security**

#### TC-064: Direct URL Access - Portal
**Priority**: Critical  
**Steps**:
1. Logout
2. Try to access /restaurant-portal directly

**Expected Results**:
- [ ] Redirects to login
- [ ] Cannot access dashboard

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-065: Role Check - CUSTOMER as Owner
**Priority**: Critical  
**Steps**:
1. Login as CUSTOMER
2. Try to access /restaurant-portal

**Expected Results**:
- [ ] Access denied
- [ ] Redirects to login with error

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-066: CSRF Protection
**Priority**: High  
**Steps**:
1. Check form submissions
2. Verify CSRF tokens

**Expected Results**:
- [ ] Forms have CSRF protection
- [ ] Invalid requests rejected

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

### **TEST SUITE 14: Data Integrity**

#### TC-067: Backward Compatibility - Old URLs
**Priority**: Critical  
**Steps**:
1. Navigate to /categories (old route)
2. Navigate to /dashboard/management-suppliers

**Expected Results**:
- [ ] Old routes still work
- [ ] Show countries/restaurants
- [ ] No errors

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

#### TC-068: Database - @@map Safety
**Priority**: Critical  
**Steps**:
1. Check MongoDB collections
2. Verify names

**Expected Results**:
- [ ] Collection "suppliers" exists (not "countries")
- [ ] Collection "categories" exists (not "restaurants")
- [ ] Collection "products" exists (not "dishes")
- [ ] Data intact

**Actual Result**: _______________  
**Status**: [ ] PASS [ ] FAIL

---

## 📊 Test Summary

### Overall Statistics
- **Total Test Cases**: 68
- **Passed**: ___ / 68
- **Failed**: ___ / 68
- **Blocked**: ___ / 68
- **Pass Rate**: ____%

### Priority Breakdown
- **Critical**: ___ / 28
- **High**: ___ / 24
- **Medium**: ___ / 13
- **Low**: ___ / 3

### Test Coverage
- [ ] Database Schema
- [ ] Admin Dashboard
- [ ] Customer Frontend
- [ ] Restaurant Portal
- [ ] Forms & Validation
- [ ] Navigation
- [ ] Responsive Design
- [ ] Performance
- [ ] Error Handling
- [ ] Security
- [ ] Backward Compatibility

---

## 🐛 Bug Report Template

### Bug ID: BUG-XXX
**Priority**: Critical / High / Medium / Low  
**Status**: Open / In Progress / Fixed / Closed

**Summary**:  
_______________

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Result**:  
_______________

**Actual Result**:  
_______________

**Screenshots**:  
[Attach here]

**Console Errors**:
```
[Paste console errors]
```

**Environment**:
- Browser: Chrome 120.0.0
- OS: Windows 11
- Screen Size: 1920x1080
- Dev Server: localhost:3000

**Additional Notes**:  
_______________

---

## ✅ Sign-Off

**Tested By**: _______________  
**Date**: _______________  
**Approval**: [ ] Approved [ ] Rejected  
**Notes**: _______________

---

**End of QA Test Plan**







