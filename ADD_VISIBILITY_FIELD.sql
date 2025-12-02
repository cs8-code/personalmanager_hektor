-- =====================================================
-- RUN THIS IN SUPABASE DASHBOARD → SQL EDITOR
-- =====================================================
-- Adds visibility control to workers table
-- =====================================================

-- Add visible_in_listing column
ALTER TABLE workers
ADD COLUMN IF NOT EXISTS visible_in_listing boolean DEFAULT false;

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_workers_visible_in_listing ON workers(visible_in_listing);

-- Optional: Make existing workers visible
-- Uncomment the line below if you want all existing workers to be visible by default
-- UPDATE workers SET visible_in_listing = true WHERE visible_in_listing IS NULL;

-- =====================================================
-- DONE! Now users can control their visibility
-- =====================================================
