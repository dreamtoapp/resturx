# 🍽️ Dine-In Order System

This directory contains all pages and components related to the **dine-in ordering system**.

## Purpose

Separate from the delivery checkout system, this handles:
- **In-restaurant orders** (customer sits at table)
- **Table-based ordering** (QR code or manual entry)
- **Cart management** via Zustand (client-side)
- **Order submission** to restaurant dashboard

## Structure

```
dine-in/
├── checkout/
│   ├── page.tsx                      # Dine-in checkout page
│   └── components/
│       └── CheckoutClient.tsx        # Table number input + order confirmation
```

## Key Differences from Delivery Checkout

| Feature | Delivery (`/checkout`) | Dine-In (`/dine-in/checkout`) |
|---------|------------------------|-------------------------------|
| **Address** | Required | Not needed |
| **Shipping** | Yes | No |
| **Table Number** | No | Required |
| **Payment** | Multiple methods | Pay at table |
| **Order Type** | DINE_OUT | DINE_IN |

## Flow

1. Customer adds items to cart (Zustand store)
2. Customer clicks "اعتماد الطلب" in cart drawer
3. → Redirects to `/dine-in/checkout`
4. Customer enters table number (manual or QR scan)
5. System validates and creates `DineInOrder` in database
6. Redirects to order confirmation page

## Related Files

- `stores/cartStore.ts` - Zustand cart state
- `app/actions/dineInOrders.ts` - Server actions
- `components/cart/` - Cart UI components
- `app/restaurant-portal/orders/` - Restaurant dashboard

## Why Separate?

Keeping dine-in checkout separate from delivery checkout:
- ✅ Avoids complexity in existing delivery flow
- ✅ Different validation rules
- ✅ Different UI/UX requirements
- ✅ Easier to maintain and test
- ✅ Clear separation of concerns

