-- Create business_posts table for Business Room (selbständige users)
CREATE TABLE IF NOT EXISTS business_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('news', 'question')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create business_comments table
CREATE TABLE IF NOT EXISTS business_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES business_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS business_posts_user_id_idx ON business_posts(user_id);
CREATE INDEX IF NOT EXISTS business_posts_type_idx ON business_posts(type);
CREATE INDEX IF NOT EXISTS business_posts_created_at_idx ON business_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS business_comments_post_id_idx ON business_comments(post_id);
CREATE INDEX IF NOT EXISTS business_comments_user_id_idx ON business_comments(user_id);

-- Enable RLS
ALTER TABLE business_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for business_posts
-- Allow selbständige users to view all posts
CREATE POLICY "Selbständige users can view business posts"
  ON business_posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workers
      WHERE workers.id = auth.uid()
      AND workers.employment_type = 'selbständig'
    )
  );

-- Allow selbständige users to create posts
CREATE POLICY "Selbständige users can create business posts"
  ON business_posts FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM workers
      WHERE workers.id = auth.uid()
      AND workers.employment_type = 'selbständig'
    )
  );

-- Allow users to update their own posts
CREATE POLICY "Users can update own business posts"
  ON business_posts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own posts
CREATE POLICY "Users can delete own business posts"
  ON business_posts FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for business_comments
-- Allow selbständige users to view all comments
CREATE POLICY "Selbständige users can view business comments"
  ON business_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workers
      WHERE workers.id = auth.uid()
      AND workers.employment_type = 'selbständig'
    )
  );

-- Allow selbständige users to create comments
CREATE POLICY "Selbständige users can create business comments"
  ON business_comments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM workers
      WHERE workers.id = auth.uid()
      AND workers.employment_type = 'selbständig'
    )
  );

-- Allow users to update their own comments
CREATE POLICY "Users can update own business comments"
  ON business_comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own comments
CREATE POLICY "Users can delete own business comments"
  ON business_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_business_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_business_posts_updated_at
  BEFORE UPDATE ON business_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_business_updated_at();

CREATE TRIGGER update_business_comments_updated_at
  BEFORE UPDATE ON business_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_business_updated_at();
