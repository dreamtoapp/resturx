# 🛒 Cart Tab System - Complete Documentation

## Overview

The cart system has been redesigned to use a **Tab-based approach** within the restaurant page instead of a floating cart button. This provides a more integrated and intuitive user experience.

---

## 🎯 Key Features

### 1. Cart as a Tab
- Cart is now a dedicated tab in the restaurant page
- Shows only items from the current restaurant
- Displays real-time item count in badge
- Integrated seamlessly with other tabs (Menu, Gallery, Videos)

### 2. Restaurant-Specific Cart
- Cart filters items by restaurant ID
- If viewing different restaurant → cart appears empty
- Switching restaurants triggers confirmation dialog
- All items belong to one restaurant at a time

### 3. Order History
- Dedicated page showing past orders from specific restaurant
- Accessible via "طلباتي السابقة" button in cart
- Shows order status, date, items, and total
- Filtered per restaurant

---

## 📋 System Architecture

### Flow Diagram

```
Restaurant Page
├── Tab: نظرة عامة
├── Tab: قائمة الطعام
│   └── Add to Cart → Updates Zustand
├── Tab: السلة ⭐
│   ├── Shows items for THIS restaurant only
│   ├── Edit quantities & notes
│   ├── View summary (subtotal, tax, total)
│   └── Button: اعتماد الطلب → /dine-in/checkout
├── Tab: طلباتي ⭐ NEW
│   ├── Shows past orders from THIS restaurant only
│   ├── Requires login (shows login prompt if not authenticated)
│   ├── Expandable order details
│   └── Shows order status, items, and totals
├── Tab: الصور
├── Tab: الفيديوهات
└── Tab: معلومات الاتصال
```

---

## 🗂️ File Structure

### Created Files

```
app/(e-comm)/restaurant/[slug]/
├── components/
│   ├── RestaurantCartTab.tsx          ✅ Main cart tab component
│   ├── RestaurantOrdersTab.tsx        ✅ Order history tab component (NEW)
│   ├── CartBadge.tsx                  ✅ Badge showing item count in tab
│   └── CartItemCard.tsx               ✅ Individual cart item display
└── orders/
    └── page.tsx                        ✅ Legacy order history page (still available)
```

### Deleted Files

```
components/cart/
├── FloatingCartButton.tsx             ❌ Removed (replaced by tab)
├── CartDrawer.tsx                     ❌ Removed (replaced by tab content)
└── CartItemCard.tsx                   ❌ Moved to restaurant components
```

### Modified Files

```
app/(e-comm)/
├── layout.tsx                         📝 Removed FloatingCartButton
└── restaurant/[slug]/
    └── page.tsx                       📝 Added cart tab
```

---

## 🔧 Technical Implementation

### 1. RestaurantCartTab Component

**Path:** `app/(e-comm)/restaurant/[slug]/components/RestaurantCartTab.tsx`

**Purpose:** Main cart display within restaurant page tab

**Features:**
- Filters items by restaurant ID
- Two-column layout (items on left, summary on right)
- Shows empty state with "browse menu" button
- Clear cart button
- Checkout button
- Order history button

**Key Logic:**
```typescript
const isCurrentRestaurant = cartRestaurantId === restaurantId;
const restaurantItems = isCurrentRestaurant ? items : [];
```

### 2. CartBadge Component

**Path:** `app/(e-comm)/restaurant/[slug]/components/CartBadge.tsx`

**Purpose:** Shows item count in cart tab trigger

**Features:**
- Hydration-safe (uses mounted state)
- Only shows for current restaurant's items
- Hides if count is 0

**Key Logic:**
```typescript
const itemCount = isCurrentRestaurant 
  ? items.reduce((sum, item) => sum + item.quantity, 0) 
  : 0;
```

### 3. CartItemCard Component

**Path:** `app/(e-comm)/restaurant/[slug]/components/CartItemCard.tsx`

**Purpose:** Display and edit individual cart items

**Features:**
- Shows dish image, name, price
- Quantity adjustment buttons (+/-)
- Remove item button
- Add/edit notes functionality
- Collapsible notes section

### 4. RestaurantOrdersTab Component

**Path:** `app/(e-comm)/restaurant/[slug]/components/RestaurantOrdersTab.tsx`

**Purpose:** Display order history within restaurant page tab

**Features:**
- Shows past orders from current restaurant only
- Login prompt for unauthenticated users
- Expandable order cards to view details
- Shows order status with colored badges
- Displays order items, quantities, prices, and notes
- Empty state with "browse menu" button

**Key Logic:**
```typescript
// Show login prompt if not authenticated
if (!isLoggedIn) {
  return <LoginPrompt />;
}

// Show empty state if no orders
if (orders.length === 0) {
  return <EmptyState />;
}

// Expandable order cards
const [expandedOrderId, setExpandedOrderId] = useState(null);
```

### 5. Order History Page (Legacy)

**Path:** `app/(e-comm)/restaurant/[slug]/orders/page.tsx`

**Purpose:** Standalone page for order history (still available)

**Features:**
- Same functionality as tab but as dedicated page
- Can be accessed via direct URL
- Useful for deep linking

---

## 🎨 User Experience

### Scenario 1: First Time User

```
1. User visits restaurant page
2. Browses menu (Tab: قائمة الطعام)
3. Adds items to cart → Zustand updates
4. Clicks "السلة" tab → Sees items
5. Reviews order and clicks "اعتماد الطلب"
6. Redirects to checkout
```

### Scenario 2: Different Restaurant

```
1. User has items from Restaurant A in cart
2. Visits Restaurant B page
3. Cart tab shows "السلة فارغة" (because cartRestaurantId !== restaurantId)
4. Tries to add item → Dialog: "هل تريد مسح الطلب السابق؟"
5. If Yes → Clear cart, add new item
6. If No → Cancel, keep old cart
```

### Scenario 3: View Order History (NEW)

```
1. User clicks "طلباتي" tab
2. If not logged in → Shows login prompt
3. If logged in:
   → Shows all past orders from THIS restaurant
   → Can expand any order to see details (items, prices, notes)
   → Badge shows order count
4. No orders → Shows empty state with "browse menu" button
```

### Scenario 4: Expandable Order Details

```
1. User in "طلباتي" tab
2. Sees list of past orders (cards)
3. Clicks "التفاصيل" button on any order
4. Order card expands to show:
   ├── All order items with quantities
   ├── Item prices and notes
   ├── Subtotal breakdown
   └── Tax calculation
5. Clicks again to collapse
```

---

## 🔄 State Management

### Zustand Store

**Path:** `stores/cartStore.ts`

**State:**
```typescript
{
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  tableNumber: number | null;
  orderType: 'DINE_IN' | 'DINE_OUT';
}
```

**Actions:**
- `addItem()` - Add dish to cart
- `updateQuantity()` - Change item quantity
- `updateNotes()` - Add/edit item notes
- `removeItem()` - Remove item from cart
- `clearCart()` - Empty entire cart
- `setMetadata()` - Update restaurant info

---

## ✅ Advantages of Tab-Based Approach

### vs. Floating Button + Drawer

| Feature | Floating Button | Cart Tab |
|---------|----------------|----------|
| **Visibility** | Always visible (can be intrusive) | Only visible in restaurant page |
| **Context** | Global (shows everywhere) | Restaurant-specific |
| **Navigation** | Side drawer (overlay) | Integrated tab (seamless) |
| **Space** | Takes screen space | Part of page layout |
| **UX** | Extra click to view | One click to switch tab |
| **History** | No connection | Direct link to order history |

### Benefits

1. **Better Context**: Cart is where it makes sense (restaurant page)
2. **Less Clutter**: No floating button on every page
3. **Clearer Flow**: Menu → Cart → Checkout is linear
4. **Restaurant Focus**: Cart belongs to the restaurant you're viewing
5. **Easy Access**: Same navigation pattern as other restaurant sections

---

## 🧪 Testing Checklist

### Cart Tab
- [ ] Add item to cart from menu tab
- [ ] View cart in السلة tab
- [ ] Badge shows correct item count
- [ ] Edit quantity (+ / -)
- [ ] Add notes to item
- [ ] Remove item from cart
- [ ] Clear entire cart
- [ ] Checkout button works
- [ ] Switch to different restaurant → cart empty
- [ ] Try adding item from different restaurant → dialog appears
- [ ] Confirm switch → old cart cleared, new item added
- [ ] Cancel switch → old cart preserved

### Orders Tab (NEW)
- [ ] Click "طلباتي" tab
- [ ] Not logged in → Shows login prompt
- [ ] Logged in but no orders → Shows empty state
- [ ] Logged in with orders → Shows order list
- [ ] Badge shows correct order count
- [ ] Click "التفاصيل" → Order expands
- [ ] See all order items, prices, notes
- [ ] Click again → Order collapses
- [ ] Status badges show correct colors
- [ ] Switch to different restaurant → Shows orders for that restaurant only
- [ ] "تصفح القائمة" button switches to menu tab

---

## 🚀 Future Enhancements

### Potential Improvements

1. **Quick Add to Cart**: Add button in menu cards that opens cart tab
2. **Cart Preview**: Small preview in menu tab showing current items
3. **Recently Ordered**: Show frequently ordered items in cart
4. **Favorites**: Save favorite orders for quick reordering
5. **Cart Sharing**: Share cart with friends for group orders
6. **Multi-Restaurant Cart**: Support items from multiple restaurants (with separate checkout)

---

## 📊 Implementation Summary

### Changes Made

✅ Removed FloatingCartButton from global layout  
✅ Removed CartDrawer component  
✅ Created RestaurantCartTab component  
✅ Created RestaurantOrdersTab component (NEW)  
✅ Created CartBadge component  
✅ Moved CartItemCard to restaurant components  
✅ Added cart tab to restaurant page  
✅ Added orders tab to restaurant page (NEW)  
✅ Integrated order fetching in page.tsx  
✅ Created standalone order history page (legacy)  
✅ Updated all imports and references  
✅ Zero linter errors  

### Files Changed: 9
### Files Created: 5
### Files Deleted: 3

---

## ✨ Result

The cart is now seamlessly integrated into the restaurant page as a dedicated tab, providing a more intuitive and focused user experience for dine-in ordering.

