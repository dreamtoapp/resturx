# Gallery Components

## GalleryManager

Client component for managing restaurant gallery images.

### Features

- **Image Upload**: Upload images with file validation (max 5MB)
- **Caption Management**: Click any image caption to edit inline
- **Drag & Drop Reordering**: Drag images to reorder them
- **Delete Confirmation**: Safe deletion with confirmation dialog
- **Real-time Updates**: Optimistic UI updates with server synchronization
- **Max Limit**: 20 images per restaurant gallery

### Usage

```tsx
<GalleryManager
  restaurantId={restaurant.id}
  images={restaurant.images}
/>
```

### Props

- `restaurantId` (string): The restaurant ID
- `images` (GalleryImage[]): Array of gallery images

### GalleryImage Type

```typescript
interface GalleryImage {
  id: string;
  imageUrl: string;
  caption: string | null;
  order: number;
  createdAt: Date;
}
```

### User Interactions

1. **Add Image**: Click the "+" card to upload a new image
2. **Edit Caption**: Click on any caption text to edit it (Enter to save, Esc to cancel)
3. **Reorder**: Drag and drop images to change their display order
4. **Delete**: Click the trash icon (appears on hover) to delete an image

### Server Actions

All mutations are handled through server actions in `../actions/`:
- `addGalleryImage` - Add new image to gallery
- `deleteGalleryImage` - Delete image from gallery
- `updateImageCaption` - Update image caption
- `reorderImages` - Update display order of all images


