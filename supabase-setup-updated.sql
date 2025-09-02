-- Script actualizat pentru configurarea tabelelor în Supabase
-- Rulează acest script în SQL Editor din Supabase Dashboard
-- Acest script include suportul pentru multiple imagini per mașină

-- 1. Tabela pentru mașini (actualizată)
CREATE TABLE IF NOT EXISTS cars (
  id BIGSERIAL PRIMARY KEY,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2100),
  kilometers INTEGER NOT NULL CHECK (kilometers >= 0),
  fuel VARCHAR(50) NOT NULL,
  power INTEGER NOT NULL CHECK (power >= 0),
  transmission VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  monthly_rate DECIMAL(8,2) CHECK (monthly_rate >= 0),
  featured BOOLEAN DEFAULT false,
  image_url TEXT, -- Imaginea principală (compatibilitate cu versiunea veche)
  description TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'reserved', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela pentru imagini multiple per mașină
CREATE TABLE IF NOT EXISTS car_images (
  id BIGSERIAL PRIMARY KEY,
  car_id BIGINT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_name VARCHAR(255),
  is_primary BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela pentru lead-uri
CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  source VARCHAR(50) NOT NULL DEFAULT 'contact' CHECK (source IN ('contact', 'newsletter', 'car_inquiry')),
  car_id BIGINT REFERENCES cars(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'lost')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela pentru newsletter
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela pentru utilizatori admin (opțional, dacă vrei să gestionezi utilizatorii manual)
CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Indexuri pentru performanță
CREATE INDEX IF NOT EXISTS idx_cars_featured ON cars(featured);
CREATE INDEX IF NOT EXISTS idx_cars_brand ON cars(brand);
CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price);
CREATE INDEX IF NOT EXISTS idx_cars_created_at ON cars(created_at);
CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);

CREATE INDEX IF NOT EXISTS idx_car_images_car_id ON car_images(car_id);
CREATE INDEX IF NOT EXISTS idx_car_images_order ON car_images(order_index);
CREATE INDEX IF NOT EXISTS idx_car_images_primary ON car_images(is_primary);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscriptions(active);

-- 7. Funcție pentru actualizarea timestamp-ului updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Trigger pentru actualizarea automată a updated_at
CREATE TRIGGER update_cars_updated_at 
  BEFORE UPDATE ON cars 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 9. Funcție pentru a obține prima imagine a unei mașini
CREATE OR REPLACE FUNCTION get_car_primary_image(car_id BIGINT)
RETURNS TEXT AS $$
DECLARE
  primary_image_url TEXT;
BEGIN
  SELECT image_url INTO primary_image_url
  FROM car_images
  WHERE car_id = $1 AND is_primary = true
  ORDER BY order_index
  LIMIT 1;
  
  RETURN COALESCE(primary_image_url, '');
END;
$$ LANGUAGE plpgsql;

-- 10. Politici RLS (Row Level Security) - deblochează dacă vrei să folosești
-- ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE car_images ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- 11. Date de test (opțional)
INSERT INTO cars (brand, model, year, kilometers, fuel, power, transmission, price, monthly_rate, featured, image_url, description, status) VALUES
('BMW', 'Seria 3 320d', 2022, 45000, 'Diesel', 190, 'Automată', 32500, 450, true, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', 'BMW Seria 3 320d în stare excelentă, verificat complet', 'active'),
('Mercedes-Benz', 'GLC 220d', 2021, 52000, 'Diesel', 194, 'Automată', 38900, 520, false, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', 'Mercedes GLC 220d SUV elegant, perfect pentru familie', 'active'),
('Audi', 'A4 2.0 TFSI', 2023, 28000, 'Benzină', 245, 'Automată', 41200, 580, true, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800', 'Audi A4 2.0 TFSI sportiv, performanță excelentă', 'active')
ON CONFLICT DO NOTHING;

-- 12. Comentarii pentru documentație
COMMENT ON TABLE cars IS 'Tabela pentru anunțurile de mașini';
COMMENT ON TABLE car_images IS 'Tabela pentru imagini multiple per mașină (max 20)';
COMMENT ON TABLE leads IS 'Tabela pentru lead-urile din formulare';
COMMENT ON TABLE newsletter_subscriptions IS 'Tabela pentru abonamentele la newsletter';
COMMENT ON TABLE admin_users IS 'Tabela pentru utilizatorii admin';

-- 13. Verificare tabele create
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('cars', 'car_images', 'leads', 'newsletter_subscriptions', 'admin_users')
ORDER BY table_name, ordinal_position;

-- 14. Verificare indexuri create
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('cars', 'car_images', 'leads', 'newsletter_subscriptions')
ORDER BY tablename, indexname;
