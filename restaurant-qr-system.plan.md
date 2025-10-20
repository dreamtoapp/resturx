<!-- PLAN: Restaurant QR Code System -->
# Restaurant QR Code System Implementation

## Overview
Implement a comprehensive QR code system where each restaurant gets a unique branded QR code with their logo, linking to their public page. Include QR code management page and scan tracking for analytics.

## Library Recommendation

**Best Choice: `qrcode` (npm package)**
- **Why:** Most stable and widely used (18M+ weekly downloads)
- Server-side generation in Next.js API routes
- Excellent accuracy and reliability
- Small bundle size
- Easy logo overlay with Canvas API
- Works with both SVG and PNG formats

**Installation:**
```bash
npm install qrcode
npm install @types/qrcode --save-dev
```

**Alternative considered:** `qr-code-styling` has built-in logo support but larger bundle and less stable.

---

## Database Changes

### Update Restaurant Model (prisma/schema.prisma)

Add QR tracking fields to Restaurant model:
```prisma
model Restaurant {
  // ... existing fields ...
  
  // QR Code tracking (new fields)
  qrCodeUrl       String?   // Cached QR code image URL (Cloudinary)
  qrCodeGenerated DateTime? // When QR was last generated
  qrScanCount     Int       @default(0) // Total scans
  lastQrScan      DateTime? // Last scan timestamp
  
  // ... existing relations ...
}
```

### Create QRCodeScan Model (Track individual scans)

```prisma
model QRCodeScan {
  id           String     @id @default(auto()) @map("_id") @db.ObjectId
  restaurantId String     @db.ObjectId
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  
  // Scan metadata
  scannedAt    DateTime   @default(now())
  ipAddress    String?    // For unique visitor tracking
  userAgent    String?    // Device info
  referrer     String?    // Where they came from
  
  // Location (if available from IP)
  city         String?
  country      String?
  
  @@index([restaurantId])
  @@index([scannedAt])
  @@map("qrcodescans")
}
```

---

## Implementation Steps

### 1. Database Migration

**File:** `prisma/schema.prisma`
- Add qrCodeUrl, qrCodeGenerated, qrScanCount, lastQrScan to Restaurant model
- Create QRCodeScan model
- Run migration: `npx prisma migrate dev --name add_qr_tracking`

---

### 2. QR Code Generation API

**File:** `app/api/qr-code/generate/route.ts` (NEW)

Create API endpoint to generate QR code with logo:
```typescript
POST /api/qr-code/generate
Body: { restaurantId: string, includeStats?: boolean }
Response: { qrCodeDataUrl: string, downloadUrl: string, stats: {...} }
```

**Features:**
- Generate QR code pointing to `/restaurant/{slug}?ref=qr`
- Add restaurant logo overlay in center (if imageUrl exists)
- Upload to Cloudinary
- Update restaurant.qrCodeUrl in database
- Return data URL for preview and Cloudinary URL for download

**Implementation:**
1. Fetch restaurant data (slug, imageUrl)
2. Generate QR code using `qrcode` library
3. If logo exists: Download logo, resize, overlay on QR center
4. Upload final QR to Cloudinary with folder `qr-codes/`
5. Update database with qrCodeUrl and qrCodeGenerated timestamp
6. Return both data URL and Cloudinary URL

---

### 3. QR Code Scan Tracking

**File:** `app/restaurant/[slug]/page.tsx` (UPDATE)

Modify existing restaurant public page:
1. Check URL parameter `?ref=qr`
2. If present, call tracking API
3. Render page normally (no user disruption)

**File:** `app/api/qr-code/track/route.ts` (NEW)

Create API endpoint to track scans:
```typescript
POST /api/qr-code/track
Body: { restaurantId: string, metadata: {...} }
Response: { success: boolean }
```

**Features:**
- Record scan in QRCodeScan table
- Increment restaurant.qrScanCount
- Update restaurant.lastQrScan timestamp
- Extract IP, user agent, referrer from headers
- Optional: Use IP geolocation service (future enhancement)

---

### 4. Restaurant Portal QR Page

**File:** `app/restaurant-portal/qr-code/page.tsx` (NEW)

Create dedicated QR code management page:

**Layout:**
```
┌─────────────────────────────────────────┐
│ رمز QR للمطعم                            │
│                                         │
│ ┌─────────────┐  ┌──────────────────┐  │
│ │             │  │ معلومات QR       │  │
│ │   QR Code   │  │                  │  │
│ │   Preview   │  │ مرات المسح: 152  │  │
│ │             │  │ آخر مسح: قبل ساعة │  │
│ └─────────────┘  │                  │  │
│                  │ [تحميل PNG]      │  │
│                  │ [تحميل SVG]      │  │
│                  └──────────────────┘  │
│                                         │
│ نصائح الاستخدام:                        │
│ • اطبع الرمز على قوائم الطعام           │
│ • ضعه على واجهة المطعم                  │
│ • شاركه على وسائل التواصل               │
└─────────────────────────────────────────┘
```

**Features:**
- Large QR code preview (300x300px)
- Display scan statistics (total scans, last scan time)
- Download buttons (PNG, SVG formats)
- Regenerate button (if logo changed)
- Usage tips and best practices
- Link to analytics for detailed scan data

**Implementation:**
1. Check if QR exists (restaurant.qrCodeUrl)
2. If not, auto-generate on page load
3. Display QR with stats
4. Download buttons trigger blob download
5. Regenerate button calls API and refreshes

---

### 5. Update Sidebar Navigation

**File:** `app/restaurant-portal/components/RestaurantPortalSidebar.tsx` (UPDATE)

Add QR Code link to sidebar:
```typescript
{
  href: '/restaurant-portal/qr-code',
  icon: 'QrCode',
  label: 'رمز QR',
  exact: false
}
```

Add in "إدارة المطعم" (Restaurant Management) section, after "معرض الصور".

---

### 6. Analytics Integration

**File:** `app/restaurant-portal/analytics/page.tsx` (UPDATE)

Update analytics placeholder to show QR scan data:
- Total QR scans (all time)
- QR scans today
- QR scans this week
- Chart: Scans over time (last 30 days)
- Top scan sources (cities/countries if available)

**Query:**
```typescript
const qrScans = await db.qRCodeScan.groupBy({
  by: ['scannedAt'],
  where: {
    restaurantId: restaurant.id,
    scannedAt: { gte: thirtyDaysAgo }
  },
  _count: true
});
```

---

### 7. Helper Functions

**File:** `app/restaurant-portal/qr-code/helpers/generateQR.ts` (NEW)

Utility functions:
- `generateQRCode(url: string, size: number): Promise<string>` - Generate base QR
- `overlayLogo(qrDataUrl: string, logoUrl: string): Promise<string>` - Add logo
- `uploadToCloudinary(dataUrl: string, folder: string): Promise<string>` - Upload
- `getQRStats(restaurantId: string): Promise<QRStats>` - Fetch stats

---

### 8. Components

**File:** `app/restaurant-portal/qr-code/components/QRPreview.tsx` (NEW)

Client component for QR display:
- Shows QR code image
- Loading state while generating
- Error handling
- Responsive sizing

**File:** `app/restaurant-portal/qr-code/components/QRDownloadButtons.tsx` (NEW)

Client component for download actions:
- PNG download button
- SVG download button
- Share button (future: social media share)
- Copy link button

**File:** `app/restaurant-portal/qr-code/components/QRStats.tsx` (NEW)

Display QR statistics:
- Total scans card
- Today's scans card
- Last scan timestamp
- Link to full analytics

---

## Technical Specifications

### QR Code Properties
- **Size:** 512x512px (high resolution for printing)
- **Error Correction:** High (30% - allows logo overlay)
- **Format:** PNG (for download), SVG (optional)
- **Logo:** Center overlay, max 20% of QR size, rounded corners
- **Margin:** 4 modules (white border)
- **Color:** Black on white (best scan reliability)

### URL Structure
```
https://yourdomain.com/restaurant/{slug}?ref=qr&qrid={restaurantId}
```
- `ref=qr` - Indicates QR scan
- `qrid` - Restaurant ID for tracking (backup if slug changes)

### Performance
- Cache generated QR codes in database (qrCodeUrl)
- Only regenerate if:
  - Logo changed
  - Manual regeneration requested
  - QR doesn't exist
- Lazy load QR preview image
- Download as blob (no server request)

### Security
- Validate restaurant ownership before generating
- Rate limit QR generation API (max 5/minute per restaurant)
- Sanitize metadata in tracking (prevent injection)
- Optional: CAPTCHA for regeneration (prevent abuse)

---

## Testing Checklist

- [ ] QR code generation works with and without logo
- [ ] QR code scans correctly on mobile devices
- [ ] Tracking records scans properly
- [ ] Download buttons work (PNG/SVG)
- [ ] Stats update in real-time
- [ ] Page handles missing QR gracefully
- [ ] Regeneration works after logo change
- [ ] Analytics shows QR scan data
- [ ] Mobile responsive design
- [ ] Print quality is high resolution

---

## Future Enhancements (Phase 2)

1. **Customization:**
   - Custom QR colors (match brand)
   - Different QR styles (dots, rounded, etc.)
   - Multiple QR codes per restaurant (table-specific)

2. **Advanced Tracking:**
   - Heatmap of scan locations
   - Device type breakdown (iOS/Android/Desktop)
   - Conversion tracking (scan → order)
   - A/B testing different QR designs

3. **Integration:**
   - Email QR to restaurant owner
   - Print-ready PDF with QR
   - Social media share templates
   - Bulk QR generation for chains

4. **Gamification:**
   - QR scan rewards/coupons
   - First-time scan discount
   - Loyalty points for scanning

---

## File Structure

```
app/
├── api/
│   └── qr-code/
│       ├── generate/
│       │   └── route.ts (QR generation API)
│       └── track/
│           └── route.ts (Scan tracking API)
├── restaurant/
│   └── [slug]/
│       └── page.tsx (UPDATE: Add QR tracking)
└── restaurant-portal/
    ├── qr-code/
    │   ├── page.tsx (Main QR page)
    │   ├── helpers/
    │   │   └── generateQR.ts (Utility functions)
    │   └── components/
    │       ├── QRPreview.tsx
    │       ├── QRDownloadButtons.tsx
    │       └── QRStats.tsx
    ├── analytics/
    │   └── page.tsx (UPDATE: Add QR stats)
    └── components/
        └── RestaurantPortalSidebar.tsx (UPDATE: Add QR link)
```

---

## Dependencies

```json
{
  "dependencies": {
    "qrcode": "^1.5.4"
  },
  "devDependencies": {
    "@types/qrcode": "^1.5.5"
  }
}
```

---

## Migration Commands

```bash
# 1. Install dependencies
npm install qrcode
npm install @types/qrcode --save-dev

# 2. Update schema
# (Edit prisma/schema.prisma as per plan)

# 3. Create migration
npx prisma migrate dev --name add_qr_tracking

# 4. Generate Prisma client
npx prisma generate
```

---

## Summary

This plan implements a complete QR code system with:
✅ Unique QR per restaurant with logo overlay
✅ Dedicated management page in restaurant portal
✅ Download in multiple formats
✅ Scan tracking and analytics
✅ High-quality, print-ready QR codes
✅ Scalable architecture for future enhancements

**Estimated Development Time:** 8-12 hours
**Priority:** High (valuable marketing tool)
**Complexity:** Medium

