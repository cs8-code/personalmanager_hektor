/*
  # Create posts and comments tables for SIPO News & Austausch

  1. New Tables
    - `posts`
      - `id` (uuid, primary key) - Unique identifier for each post
      - `user_id` (uuid, foreign key) - References auth.users, author of the post
      - `type` (text) - Type of post: 'news' or 'question'
      - `title` (text) - Title of the post
      - `content` (text) - Main content/body of the post
      - `created_at` (timestamptz) - Timestamp when post was created
      - `updated_at` (timestamptz) - Timestamp when post was last updated

    - `comments`
      - `id` (uuid, primary key) - Unique identifier for each comment
      - `post_id` (uuid, foreign key) - References posts table
      - `user_id` (uuid, foreign key) - References auth.users, author of the comment
      - `content` (text) - Comment text content
      - `created_at` (timestamptz) - Timestamp when comment was created
      - `updated_at` (timestamptz) - Timestamp when comment was last updated

  2. Security
    - Enable RLS on both `posts` and `comments` tables
    - Posts policies:
      - Anyone (authenticated users) can view all posts
      - Authenticated users can create posts
      - Users can update their own posts
      - Users can delete their own posts
    - Comments policies:
      - Anyone (authenticated users) can view all comments
      - Authenticated users can create comments
      - Users can update their own comments
      - Users can delete their own comments

  3. Indexes
    - Index on posts.user_id for efficient user post queries
    - Index on posts.type for filtering by post type
    - Index on posts.created_at for chronological ordering
    - Index on comments.post_id for efficient post comment queries
    - Index on comments.user_id for efficient user comment queries

  4. Important Notes
    - All tables use UUID primary keys with automatic generation
    - Timestamps use timestamptz for proper timezone handling
    - Foreign key constraints ensure referential integrity
    - RLS policies are restrictive by default - data only accessible to authenticated users
    - Users can only modify their own content (posts and comments)
*/

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('news', 'question')),
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for posts
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Create indexes for comments
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Posts policies
CREATE POLICY "Authenticated users can view all posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Authenticated users can view all comments"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic updated_at updates
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
