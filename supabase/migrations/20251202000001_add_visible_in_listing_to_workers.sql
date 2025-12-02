/*
  # Add visible_in_listing field to workers table

  1. Changes
    - Add visible_in_listing boolean column to workers table
    - Default to false for privacy (opt-in model)
    - Users must explicitly choose to appear in Personalsuche

  2. Notes
    - This allows workers to control their visibility
    - Only workers with visible_in_listing = true will appear in public listings
    - Workers can still be found by managers who created them
*/

-- Add visible_in_listing column
ALTER TABLE workers
ADD COLUMN IF NOT EXISTS visible_in_listing boolean DEFAULT false;

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_workers_visible_in_listing ON workers(visible_in_listing);

-- Update existing workers to be visible (optional - uncomment if you want existing users visible)
-- UPDATE workers SET visible_in_listing = true WHERE visible_in_listing IS NULL;
