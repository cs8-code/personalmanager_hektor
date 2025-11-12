-- Add arbeitsort column to workers table
-- This field stores the work location preference for each worker

ALTER TABLE workers
ADD COLUMN IF NOT EXISTS arbeitsort TEXT CHECK (
  arbeitsort IN (
    'Nahbaustellen',
    'Montage (ohne km-Begrenzung)',
    'Montage (mit km-Begrenzung)',
    'Nahbau & Montage'
  )
);

-- Create index for filtering by arbeitsort
CREATE INDEX IF NOT EXISTS idx_workers_arbeitsort ON workers(arbeitsort);

-- Add comment to document the column
COMMENT ON COLUMN workers.arbeitsort IS 'Work location preference: Nahbaustellen, Montage (ohne km-Begrenzung), Montage (mit km-Begrenzung), or Nahbau & Montage';
