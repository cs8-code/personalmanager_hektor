-- Add images column to posts and business_posts tables
-- Allow users to upload multiple images per post

-- Add images column to posts table (SIPO News & Austausch)
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}';

-- Add images column to business_posts table (Business Room)
ALTER TABLE business_posts
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}';

-- Create storage bucket for post images
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for post-images bucket
-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload post images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'post-images');

-- Allow authenticated users to update their own images
CREATE POLICY "Users can update own post images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete their own images
CREATE POLICY "Users can delete own post images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow anyone to view post images (public bucket)
CREATE POLICY "Anyone can view post images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'post-images');
