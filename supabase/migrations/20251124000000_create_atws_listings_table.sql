-- Create ATWS Listings Table
CREATE TABLE IF NOT EXISTS atws_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  listing_type VARCHAR(50) NOT NULL CHECK (listing_type IN ('verkaufen', 'kaufen', 'vermieten', 'mieten')),
  condition VARCHAR(50) CHECK (condition IN ('neu', 'gebraucht', 'überholt')),
  price DECIMAL(10, 2),
  price_negotiable BOOLEAN DEFAULT false,
  location VARCHAR(255),
  contact_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50),
  images TEXT[], -- Array of image URLs from Supabase Storage
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'closed', 'draft')),
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX idx_atws_listings_user_id ON atws_listings(user_id);

-- Create index on status for filtering
CREATE INDEX idx_atws_listings_status ON atws_listings(status);

-- Create index on listing_type for filtering
CREATE INDEX idx_atws_listings_type ON atws_listings(listing_type);

-- Create index on created_at for sorting
CREATE INDEX idx_atws_listings_created_at ON atws_listings(created_at DESC);

-- Enable Row Level Security
ALTER TABLE atws_listings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active listings
CREATE POLICY "Anyone can view active ATWS listings"
  ON atws_listings FOR SELECT
  USING (status = 'active');

-- Policy: Users can view their own listings (all statuses)
CREATE POLICY "Users can view their own ATWS listings"
  ON atws_listings FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Authenticated users can create listings
CREATE POLICY "Authenticated users can create ATWS listings"
  ON atws_listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own listings
CREATE POLICY "Users can update their own ATWS listings"
  ON atws_listings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own listings
CREATE POLICY "Users can delete their own ATWS listings"
  ON atws_listings FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_atws_listings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_atws_listings_updated_at_trigger
  BEFORE UPDATE ON atws_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_atws_listings_updated_at();

-- Create storage bucket for ATWS images
INSERT INTO storage.buckets (id, name, public)
VALUES ('atws-images', 'atws-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for atws-images bucket
CREATE POLICY "Anyone can view ATWS images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'atws-images');

CREATE POLICY "Authenticated users can upload ATWS images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'atws-images'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own ATWS images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'atws-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'atws-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own ATWS images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'atws-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
