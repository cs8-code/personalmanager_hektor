/*
  # Allow public read access to posts and comments

  1. Changes
    - Drop existing restrictive SELECT policies on posts and comments
    - Add new policies that allow anonymous (public) users to view posts and comments
    - Keep write operations (INSERT, UPDATE, DELETE) restricted to authenticated users only

  2. Security
    - Posts and comments are now publicly readable (no authentication required)
    - Creating, updating, and deleting posts/comments still requires authentication
    - Users can only modify their own content

  3. Important Notes
    - This enables logged-out users to browse the community content
    - Authentication is still required for any write operations
*/

-- Drop existing SELECT policies for posts
DROP POLICY IF EXISTS "Authenticated users can view all posts" ON posts;

-- Drop existing SELECT policies for comments
DROP POLICY IF EXISTS "Authenticated users can view all comments" ON comments;

-- Create new public SELECT policies for posts
CREATE POLICY "Anyone can view all posts"
  ON posts FOR SELECT
  USING (true);

-- Create new public SELECT policies for comments
CREATE POLICY "Anyone can view all comments"
  ON comments FOR SELECT
  USING (true);
