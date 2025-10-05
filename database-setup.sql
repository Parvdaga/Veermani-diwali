-- =====================================================
-- VEERMANI KITCHEN'S DATABASE SETUP
-- =====================================================
-- This file contains all the SQL commands needed to set up
-- the complete database for Veermani Kitchen's e-commerce
-- and POS system.
--
-- INSTRUCTIONS:
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to SQL Editor
-- 3. Copy and paste this entire file
-- 4. Click "Run" to execute
-- =====================================================

-- Create ENUM types
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status_enum') THEN
    CREATE TYPE order_status_enum AS ENUM ('received', 'processing', 'ready', 'completed', 'cancelled');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method_enum') THEN
    CREATE TYPE payment_method_enum AS ENUM ('cash', 'upi', 'pending');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fulfillment_type_enum') THEN
    CREATE TYPE fulfillment_type_enum AS ENUM ('take_away', 'parcel');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_type_enum') THEN
    CREATE TYPE order_type_enum AS ENUM ('online', 'counter');
  END IF;
END $$;

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_english text NOT NULL,
  price_per_kg numeric(10, 2) NOT NULL CHECK (price_per_kg >= 0),
  category text NOT NULL CHECK (category IN ('sweets', 'namkeen')),
  is_on_order boolean DEFAULT false,
  image_url text,
  display_order integer DEFAULT 0,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  order_type order_type_enum NOT NULL,
  items jsonb NOT NULL,
  total_amount numeric(10, 2) NOT NULL CHECK (total_amount >= 0),
  status order_status_enum DEFAULT 'received',
  payment_method payment_method_enum DEFAULT 'pending',
  fulfillment_type fulfillment_type_enum,
  pickup_datetime timestamptz,
  custom_packing boolean DEFAULT false,
  special_instructions text,
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- BULK ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bulk_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  items_description text NOT NULL,
  special_instructions text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'completed'))
);

-- =====================================================
-- OTHER PAYMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS other_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  customer_name text NOT NULL,
  customer_phone text,
  amount numeric(10, 2) NOT NULL CHECK (amount >= 0),
  payment_method payment_method_enum NOT NULL,
  description text NOT NULL,
  recorded_by uuid REFERENCES auth.users(id)
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_display_order ON products(display_order);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_bulk_orders_status ON bulk_orders(status);

-- =====================================================
-- TRIGGERS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE other_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products
DROP POLICY IF EXISTS "Public can view available products" ON products;
CREATE POLICY "Public can view available products"
  ON products FOR SELECT
  USING (is_available = true);

DROP POLICY IF EXISTS "Admin can view all products" ON products;
CREATE POLICY "Admin can view all products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin can insert products" ON products;
CREATE POLICY "Admin can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can update products" ON products;
CREATE POLICY "Admin can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can delete products" ON products;
CREATE POLICY "Admin can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for orders
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can view all orders" ON orders;
CREATE POLICY "Admin can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin can update orders" ON orders;
CREATE POLICY "Admin can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can delete orders" ON orders;
CREATE POLICY "Admin can delete orders"
  ON orders FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for bulk_orders
DROP POLICY IF EXISTS "Anyone can create bulk orders" ON bulk_orders;
CREATE POLICY "Anyone can create bulk orders"
  ON bulk_orders FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can view bulk orders" ON bulk_orders;
CREATE POLICY "Admin can view bulk orders"
  ON bulk_orders FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin can update bulk orders" ON bulk_orders;
CREATE POLICY "Admin can update bulk orders"
  ON bulk_orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for other_payments
DROP POLICY IF EXISTS "Admin can view other payments" ON other_payments;
CREATE POLICY "Admin can view other payments"
  ON other_payments FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin can insert other payments" ON other_payments;
CREATE POLICY "Admin can insert other payments"
  ON other_payments FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can update other payments" ON other_payments;
CREATE POLICY "Admin can update other payments"
  ON other_payments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can delete other payments" ON other_payments;
CREATE POLICY "Admin can delete other payments"
  ON other_payments FOR DELETE
  TO authenticated
  USING (true);

-- =====================================================
-- INITIAL DATA - PRODUCTS
-- All products from Diwali Special 2025 rate list
-- =====================================================
INSERT INTO products (name, name_english, price_per_kg, category, is_on_order, display_order) VALUES
  -- SWEETS (Regular Stock)
  ('काजू कतली', 'Kaju Katli', 900.00, 'sweets', false, 1),
  ('बादाम कतली', 'Badam Katli', 900.00, 'sweets', false, 2),
  ('मूंग की दाल के लड्डू', 'Moong Dal Laddu', 480.00, 'sweets', false, 3),
  ('बेसन चक्की', 'Besan Chakki', 480.00, 'sweets', false, 4),
  ('मखन बड़ा', 'Makhan Bada', 480.00, 'sweets', false, 5),
  ('मीठे शकरपारे', 'Meethe Shakarpare', 300.00, 'sweets', false, 6),
  ('मीठे शकरपारे (चाशनी)', 'Meethe Shakarpare (Chashni)', 260.00, 'sweets', false, 7),

  -- NAMKEEN (Regular Stock)
  ('चने की दाल (ड्रायफ्रूट)', 'Chane Ki Dal (Dry Fruit)', 360.00, 'namkeen', false, 8),
  ('चने की दाल (साधी)', 'Chane Ki Dal (Plain)', 300.00, 'namkeen', false, 9),
  ('मठरी', 'Mathri', 300.00, 'namkeen', false, 10),

  -- ON ORDER ITEMS (Order by Oct 14th)
  ('चिवड़ा', 'Chivda', 280.00, 'namkeen', true, 11),
  ('मीठे शकरपारे (घी)', 'Meethe Shakarpare (Ghee)', 450.00, 'sweets', true, 12),
  ('सांव', 'Saanv', 320.00, 'namkeen', true, 13),
  ('मेसूर पाक बेसन', 'Mysore Pak Besan', 560.00, 'sweets', true, 14),
  ('शुगर फ्री लड्डू', 'Sugar Free Laddu', 1200.00, 'sweets', true, 15)
ON CONFLICT DO NOTHING;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Next steps:
-- 1. Create an admin user in Supabase Authentication
-- 2. Your database is ready to use
-- =====================================================
