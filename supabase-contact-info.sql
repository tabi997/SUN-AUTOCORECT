-- Create contact_info table for storing company contact information
CREATE TABLE IF NOT EXISTS contact_info (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  working_hours TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default contact information
INSERT INTO contact_info (phone, email, address, working_hours) VALUES (
  '+40 721 234 567',
  'office@sunautocorect.ro',
  'Strada Principală 123, București',
  'Lun-Vin: 9:00-18:00, Sâmbătă: 9:00-14:00, Duminică: Închis'
) ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_contact_info_updated_at 
    BEFORE UPDATE ON contact_info 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON contact_info TO authenticated;
GRANT SELECT ON contact_info TO anon;
