# Customer Actions

This directory contains server actions for customer management functionality.

## Actions Overview

### getCustomerById.ts
- **Purpose**: Fetches detailed customer information by ID
- **Features**:
  - Customer basic information
  - Address list with default ordering
  - Complete order history with items
  - Product reviews
  - Calculated statistics (total spent, average order value)
  - Customer metrics (order count, review count)

### getCustomers.ts
- **Purpose**: Fetches list of all customers (used in main customer page)
- **Features**:
  - Customer list with basic information
  - Order count per customer
  - Pagination support
  - Search and filtering capabilities

## Database Relations

The `getCustomerById` action includes the following relations:
- `addresses`: Customer delivery addresses
- `orders`: Complete order history with items
- `reviews`: Product reviews given by customer

## Statistics Calculation

The action calculates:
- `totalSpent`: Sum of all order totals
- `averageOrderValue`: Average order value
- `lastOrderDate`: Date of most recent order
- `orderCount`: Total number of orders
- `reviewCount`: Total number of reviews

## Error Handling

All actions include proper error handling and return `null` on failure to prevent application crashes.
