## Post Images Feature - Implementation Guide

## Overview

Users can now upload up to 5 images when creating posts in:
- **SIPO News & Austausch** (posts table)
- **Business Room** (business_posts table)

## Database Changes

### Migration File
**File:** `supabase/migrations/20251204000000_add_images_to_posts.sql`

**Changes:**
1. Added `images text[]` column to `posts` table
2. Added `images text[]` column to `business_posts` table
3. Created `post-images` storage bucket (public)
4. Added storage policies for upload/delete/view

### Run Migration
```bash
# In Supabase Dashboard → SQL Editor
# Run the migration file: 20251204000000_add_images_to_posts.sql
```

## New Component

### MultiImageUpload Component
**File:** `src/components/MultiImageUpload.tsx`

**Features:**
- Upload multiple images (up to 5 by default)
- Drag & drop support
- Image preview grid
- Remove individual images
- File validation (type, size)
- Progress indication
- Error handling

**Props:**
```typescript
interface MultiImageUploadProps {
  userId: string;           // User ID for storage path
  images: string[];         // Array of image URLs
  onImagesChange: (images: string[]) => void;  // Callback
  maxImages?: number;       // Default: 5
  disabled?: boolean;       // Disable during submit
}
```

**Usage Example:**
```typescript
const [images, setImages] = useState<string[]>([]);

<MultiImageUpload
  userId={user.id}
  images={images}
  onImagesChange={setImages}
  maxImages={5}
  disabled={submitting}
/>
```

## Integration Steps

### 1. Update Post Interfaces

Add `images` field to post interfaces:

```typescript
interface Post {
  id: string;
  user_id: string;
  type: 'news' | 'question';
  title: string;
  content: string;
  images?: string[];  // Add this
  created_at: string;
  updated_at: string;
}
```

### 2. Update Create Post Forms

**For SipoNewsPage.tsx:**
```typescript
// Import component
import MultiImageUpload from '../components/MultiImageUpload';

// Add state
const [postImages, setPostImages] = useState<string[]>([]);

// Add to form
<MultiImageUpload
  userId={user.id}
  images={postImages}
  onImagesChange={setPostImages}
  disabled={submitting}
/>

// Include in insert
const { data, error } = await supabase
  .from('posts')
  .insert({
    user_id: user.id,
    type: postType,
    title: postTitle,
    content: postContent,
    images: postImages  // Add this
  });

// Reset after submit
setPostImages([]);
```

**For BusinessRoomPage.tsx:**
```typescript
// Same steps as above, but use 'business_posts' table
const { data, error } = await supabase
  .from('business_posts')
  .insert({
    user_id: user.id,
    type: postType,
    title: postTitle,
    content: postContent,
    images: postImages  // Add this
  });
```

### 3. Display Images in Posts

Add image display to post views:

```typescript
{post.images && post.images.length > 0 && (
  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
    {post.images.map((url, index) => (
      <img
        key={index}
        src={url}
        alt={`Post image ${index + 1}`}
        className="w-full h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90"
        onClick={() => window.open(url, '_blank')}
      />
    ))}
  </div>
)}
```

### 4. Handle Image Cleanup on Post Delete

When deleting posts, also delete associated images:

```typescript
const handleDeletePost = async (postId: string, images?: string[]) => {
  // Delete images from storage first
  if (images && images.length > 0) {
    for (const url of images) {
      try {
        const path = url.split('/post-images/')[1];
        await supabase.storage.from('post-images').remove([path]);
      } catch (err) {
        console.error('Error deleting image:', err);
      }
    }
  }

  // Delete post
  const { error } = await supabase
    .from('posts')  // or 'business_posts'
    .delete()
    .eq('id', postId);

  if (error) throw error;
};
```

## Storage Structure

### Bucket: `post-images`
```
post-images/
  ├── {userId}/
  │   ├── {timestamp}-{random}.jpg
  │   ├── {timestamp}-{random}.png
  │   └── ...
```

**Example:**
```
post-images/550e8400-e29b-41d4-a716-446655440000/1701648000000-abc123.jpg
```

## Features

### Validation
- ✅ File type: Only images (PNG, JPG, GIF)
- ✅ File size: Maximum 5MB per image
- ✅ Count limit: Maximum 5 images per post (configurable)

### User Experience
- ✅ Multiple file selection
- ✅ Visual preview before submit
- ✅ Remove individual images
- ✅ Loading indicators
- ✅ Clear error messages
- ✅ Responsive grid layout

### Storage Management
- ✅ Organized by user ID
- ✅ Unique filenames (timestamp + random)
- ✅ Automatic cleanup on error
- ✅ Delete with post removal

## Security

### RLS Policies
- **Upload**: Only authenticated users
- **Update/Delete**: Only own images (by user ID in path)
- **View**: Public (read-only)

### Path-based Security
Storage paths use user ID:
```typescript
`${userId}/${Date.now()}-${random}.${ext}`
```

RLS checks:
```sql
auth.uid()::text = (storage.foldername(name))[1]
```

## Testing Checklist

- [ ] Run migration in Supabase
- [ ] Verify `post-images` bucket created
- [ ] Test image upload (single file)
- [ ] Test multiple images upload
- [ ] Test removing image
- [ ] Test max image limit (5)
- [ ] Test file type validation
- [ ] Test file size validation (>5MB)
- [ ] Test images display in posts
- [ ] Test images persist after page reload
- [ ] Test image deletion with post
- [ ] Test unauthorized access (RLS)

## Next Steps

1. **Run Migration:**
   - Open Supabase Dashboard → SQL Editor
   - Run `20251204000000_add_images_to_posts.sql`

2. **Update SipoNewsPage:**
   - Add MultiImageUpload component
   - Update post creation logic
   - Add image display in post list

3. **Update BusinessRoomPage:**
   - Same steps as SipoNewsPage
   - Use `business_posts` table

4. **Test Thoroughly:**
   - Upload images
   - View images
   - Delete images
   - Delete posts with images

## Future Enhancements

Possible improvements:
- [ ] Image compression before upload
- [ ] Drag & drop file upload
- [ ] Image editing (crop, rotate)
- [ ] Lightbox for full-size view
- [ ] Image captions
- [ ] Automatic thumbnail generation

## Summary

✅ Database schema updated (images column)
✅ Storage bucket created (post-images)
✅ RLS policies configured
✅ Reusable component created (MultiImageUpload)
✅ Complete documentation provided

Ready for integration into SipoNewsPage and BusinessRoomPage!
