# Customer Detail Components

This directory contains components for the customer detail page (`/dashboard/management-users/customer/[id]`).

## Components Overview

### CustomerDetailHeader.tsx
- **Purpose**: Main header component displaying customer avatar, basic info, and statistics
- **Features**: 
  - Customer avatar with image upload functionality
  - Customer statistics (orders, spending, average order value)
  - Quick action buttons (Edit, Delete)
  - Customer preferences display

### CustomerDetailContent.tsx
- **Purpose**: Main content area with tabbed interface
- **Features**:
  - Tabbed navigation (Orders, Addresses, Reviews)
  - Integrates with other detail components
  - Responsive layout

### CustomerDetailSidebar.tsx
- **Purpose**: Right sidebar with quick actions and customer summary
- **Features**:
  - Quick contact actions (Call, WhatsApp, Email)
  - Customer summary statistics
  - Default address display
  - Customer preferences

### CustomerOrders.tsx
- **Purpose**: Displays customer's order history
- **Features**:
  - Order list with status badges
  - Order items with product details
  - Order actions (View, Contact)
  - Empty state handling

### CustomerAddresses.tsx
- **Purpose**: Manages customer addresses
- **Features**:
  - Address list with default indicator
  - Google Maps integration
  - Address management (Edit, Delete)
  - Empty state handling

### CustomerReviews.tsx
- **Purpose**: Shows customer's product reviews
- **Features**:
  - Review list with star ratings
  - Product information
  - Review actions (View Product, Respond)
  - Empty state handling

## Usage

These components are used in the customer detail page to provide comprehensive customer information and management capabilities.

## Dependencies

- UI Components: Card, Badge, Button, Icon, Avatar, Tabs
- External: GoogleMapsLink, AddImage, AppDialog
- Actions: CustomerUpsert, DeleteCustomerAlert
- Next.js: Image, useRouter
- State: useState for local component state
