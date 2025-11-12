/*
  # Update Workers Table for Supabase Auth Integration

  1. Changes
    - Update workers table to use auth.users.id as primary key
    - Add RLS policies for authenticated users
    - Update sample data to work with auth system

  2. Security
    - Users can only see and manage their own profile
    - Public read access for worker listings (for job matching)
*/

-- First, let's clear existing data to avoid conflicts
DELETE FROM workers;

-- Update the workers table to use auth.users.id as primary key
ALTER TABLE workers DROP CONSTRAINT IF EXISTS workers_pkey;
ALTER TABLE workers ALTER COLUMN id DROP DEFAULT;
ALTER TABLE workers ADD CONSTRAINT workers_pkey PRIMARY KEY (id);
ALTER TABLE workers ADD CONSTRAINT workers_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update RLS policies
DROP POLICY IF EXISTS "Anyone can view workers" ON workers;
DROP POLICY IF EXISTS "Anyone can insert workers" ON workers;

-- Create new policies
-- Anyone can view workers (for job matching)
CREATE POLICY "Anyone can view workers" ON workers
  FOR SELECT USING (true);

-- Only authenticated users can insert their own profile
CREATE POLICY "Users can insert own profile" ON workers
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON workers
  FOR UPDATE USING (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile" ON workers
  FOR DELETE USING (auth.uid() = id);

-- Insert some sample workers for testing (these will be dummy entries for demo)
-- Note: These won't have corresponding auth users, so they're just for display
INSERT INTO workers (id, name, email, phone, qualifications, availability_status, location, experience_years, bio, role, company) VALUES
('00000000-0000-0000-0000-000000000001', 'Max Mustermann', 'max.mustermann@example.com', '+49 123 456789', ARRAY['Maurer', 'Betonarbeiten', 'Fassadenarbeiten'], 'sofort verfügbar', 'Berlin', 5, 'Erfahrener Maurer mit Spezialisierung auf moderne Fassadentechniken.', 'Subunternehmer', 'Mustermann Bau GmbH'),
('00000000-0000-0000-0000-000000000002', 'Anna Schmidt', 'anna.schmidt@example.com', '+49 987 654321', ARRAY['Elektriker', 'Smart Home', 'Beleuchtung'], 'demnächst verfügbar', 'München', 8, 'Qualifizierte Elektrikerin mit Fokus auf nachhaltige Energielösungen.', 'Sipo', ''),
('00000000-0000-0000-0000-000000000003', 'Peter Weber', 'peter.weber@example.com', '+49 555 123456', ARRAY['Zimmerer', 'Holzbau', 'Dachdecker'], 'Minijob beschäftigt und teilzeit arbeitssuchend', 'Hamburg', 12, 'Meister im Zimmererhandwerk mit langjähriger Erfahrung im Holzbau.', 'Subunternehmer', 'Weber Holzbau'),
('00000000-0000-0000-0000-000000000004', 'Lisa Müller', 'lisa.mueller@example.com', '+49 777 888999', ARRAY['Maler', 'Tapezierer', 'Renovierung'], 'aktuell beschäftigt', 'Köln', 3, 'Kreative Malerin mit einem Auge für Details und moderne Farbgestaltung.', 'Sipo', ''),
('00000000-0000-0000-0000-000000000005', 'Tom Fischer', 'tom.fischer@example.com', '+49 333 444555', ARRAY['Fliesenleger', 'Badezimmer', 'Küche'], 'sofort verfügbar', 'Frankfurt', 6, 'Spezialist für hochwertige Fliesenarbeiten in Bad und Küche.', 'Subunternehmer', 'Fischer Fliesen');
