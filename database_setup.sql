-- Create workers table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS workers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  image_url TEXT,
  phone TEXT,
  qualifications TEXT[] DEFAULT '{}',
  availability_status TEXT NOT NULL DEFAULT 'sofort verfügbar',
  location TEXT,
  experience_years INTEGER DEFAULT 0,
  bio TEXT,
  role TEXT DEFAULT 'Subunternehmer' CHECK (role IN ('Subunternehmer', 'Sipo')),
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on workers table
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;

-- Create policies for workers table
-- Anyone can view workers (public read access)
CREATE POLICY "Anyone can view workers" ON workers
  FOR SELECT USING (true);

-- Anyone can insert workers (for registration)
CREATE POLICY "Anyone can insert workers" ON workers
  FOR INSERT WITH CHECK (true);

-- Insert some sample workers for testing
INSERT INTO workers (name, email, phone, qualifications, availability_status, location, experience_years, bio, role, company) VALUES
('Max Mustermann', 'max.mustermann@example.com', '+49 123 456789', ARRAY['Maurer', 'Betonarbeiten', 'Fassadenarbeiten'], 'sofort verfügbar', 'Berlin', 5, 'Erfahrener Maurer mit Spezialisierung auf moderne Fassadentechniken.', 'Subunternehmer', 'Mustermann Bau GmbH'),
('Anna Schmidt', 'anna.schmidt@example.com', '+49 987 654321', ARRAY['Elektriker', 'Smart Home', 'Beleuchtung'], 'demnächst verfügbar', 'München', 8, 'Qualifizierte Elektrikerin mit Fokus auf nachhaltige Energielösungen.', 'Sipo', ''),
('Peter Weber', 'peter.weber@example.com', '+49 555 123456', ARRAY['Zimmerer', 'Holzbau', 'Dachdecker'], 'Minijob beschäftigt und teilzeit arbeitssuchend', 'Hamburg', 12, 'Meister im Zimmererhandwerk mit langjähriger Erfahrung im Holzbau.', 'Subunternehmer', 'Weber Holzbau'),
('Lisa Müller', 'lisa.mueller@example.com', '+49 777 888999', ARRAY['Maler', 'Tapezierer', 'Renovierung'], 'aktuell beschäftigt', 'Köln', 3, 'Kreative Malerin mit einem Auge für Details und moderne Farbgestaltung.', 'Sipo', ''),
('Tom Fischer', 'tom.fischer@example.com', '+49 333 444555', ARRAY['Fliesenleger', 'Badezimmer', 'Küche'], 'sofort verfügbar', 'Frankfurt', 6, 'Spezialist für hochwertige Fliesenarbeiten in Bad und Küche.', 'Subunternehmer', 'Fischer Fliesen');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workers_role ON workers(role);
CREATE INDEX IF NOT EXISTS idx_workers_availability ON workers(availability_status);
CREATE INDEX IF NOT EXISTS idx_workers_location ON workers(location);
