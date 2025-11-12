/*
  # Create Storage Bucket for Profile Pictures

  1. New Storage Bucket
    - `profile-pictures` bucket for storing user profile images
    - Public access for reading images
    - Authenticated users can upload their own images
  
  2. Security
    - RLS policies to allow users to upload/update their own profile pictures
    - Public read access to all profile pictures
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can upload their own profile picture'
  ) THEN
    CREATE POLICY "Users can upload their own profile picture"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'profile-pictures' AND
      auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can update their own profile picture'
  ) THEN
    CREATE POLICY "Users can update their own profile picture"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
      bucket_id = 'profile-pictures' AND
      auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can delete their own profile picture'
  ) THEN
    CREATE POLICY "Users can delete their own profile picture"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'profile-pictures' AND
      auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public can view profile pictures'
  ) THEN
    CREATE POLICY "Public can view profile pictures"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'profile-pictures');
  END IF;
END $$;
