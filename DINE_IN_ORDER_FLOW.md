# 🍽️ Dine-In Order Flow - Complete Documentation

## 📌 Correct Flow (Updated)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Customer Browses Restaurant Menu                         │
│    ✅ NO table number required                              │
│    ✅ Can add items freely to cart (Zustand store)         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Customer Views Cart (Floating Button)                    │
│    ✅ Edit quantities, add notes                            │
│    ✅ Still NO table number required                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Customer Clicks "اعتماد الطلب" (Checkout)               │
│    → Redirects to /dine-in/checkout                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Checkout Page - TABLE NUMBER INPUT ⭐                     │
│    📍 THIS is where table number is requested               │
│    Options:                                                 │
│    - Manual input (number field)                            │
│    - QR code scan (future: auto-fill from ?table=5)        │
│    Validation:                                              │
│    - Required field                                         │
│    - Must be positive integer                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Order Confirmation                                        │
│    ✅ Create DineInOrder in database                        │
│    ✅ Clear Zustand cart                                    │
│    ✅ Redirect to /orders/[orderId]                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Restaurant Dashboard                                      │
│    ✅ Owner sees order with table number                    │
│    ✅ Can update status: NEW → PREPARING → READY → DONE    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Technical Implementation

### 1. **RestaurantMenuTab Component**
- ✅ **NO** table number validation
- ✅ Customer can add items without any restrictions
- ✅ Uses Zustand `addItem` and `setMetadata` with `tableNumber: null`

```typescript
const handleAddToCart = (dish: any) => {
  setMetadata({
    restaurantId,
    restaurantName,
    tableNumber: null, // Will be set at checkout
    orderType: 'DINE_IN'
  });
  addItem({
    dishId: dish.id,
    dishName: dish.name,
    dishImage: dish.imageUrl,
    price: dish.price
  });
};
```

### 2. **Checkout Page (`/dine-in/checkout`)**
- ✅ **Displays table number input field**
- ✅ Supports two methods:
  1. **Manual entry**: User types table number
  2. **QR scan**: Auto-fill from `?table=X` param (if available)
- ✅ **Validation before submission**:
  - Not empty
  - Must be positive integer
- ✅ Updates Zustand metadata with table number
- ✅ Submits order to database

```typescript
const handleSubmit = async () => {
  // Validate table number
  if (!tableNumber || tableNumber.trim() === '') {
    setTableError('يرجى إدخال رقم الطاولة');
    return;
  }

  const tableNum = parseInt(tableNumber);
  if (isNaN(tableNum) || tableNum < 1) {
    setTableError('رقم الطاولة غير صحيح');
    return;
  }

  // Save to metadata and submit
  setMetadata({ tableNumber: tableNum });
  const result = await createDineInOrderAction(restaurantId, tableNum, items);
  
  if (result.success) {
    clearCart();
    router.push(`/orders/${result.orderId}`);
  }
};
```

---

## 🎯 Key Benefits

### ✅ Better UX
- No interruption when browsing
- No forced QR scan before adding items
- Table number only needed at final step

### ✅ Flexibility
- Works with QR scan (`?table=5`)
- Works with manual entry
- Customer can still browse even without table QR

### ✅ Data Integrity
- Table number validated before order creation
- Cannot submit without valid table number
- Stored properly in database

---

## 📋 File Changes

### Modified Files:
1. ✅ `app/(e-comm)/restaurant/[slug]/components/RestaurantMenuTab.tsx`
   - Removed table number validation on add to cart
   - Removed `useSearchParams` import

2. ✅ `app/(e-comm)/dine-in/checkout/page.tsx` **(NEW)**
   - Created dedicated dine-in checkout page

3. ✅ `app/(e-comm)/dine-in/checkout/components/CheckoutClient.tsx` **(NEW)**
   - Added table number input field
   - Added validation logic
   - Added QR scan button (placeholder)
   - Auto-fills from URL param if available

4. ✅ `components/cart/CartDrawer.tsx`
   - Updated checkout redirect to `/dine-in/checkout`

### Unchanged Files:
- ✅ `stores/cartStore.ts` - Already supports optional table number
- ✅ `app/actions/dineInOrders.ts` - No changes needed
- ✅ All other cart components work as-is
- ✅ Existing `/checkout` for delivery orders remains untouched

---

## 🔮 Future Enhancements

### QR Code Scanner Integration
Instead of placeholder alert, implement actual QR scanner:
- Use camera API or third-party QR library
- Scan QR code on table
- Auto-redirect to checkout with `?table=X`

### QR Code Generation for Tables
- Generate unique QR codes for each table
- QR format: `https://domain.com/restaurant/[slug]?table=5`
- Print and place on tables

---

## ✅ Implementation Complete

All changes have been implemented and tested. The flow is now:

**Browse → Add to Cart → Checkout → Enter Table Number → Confirm → Done** ✨

