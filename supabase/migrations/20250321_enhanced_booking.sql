CREATE TABLE IF NOT EXISTS restaurant_tables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  table_number VARCHAR(10) NOT NULL,
  capacity INT NOT NULL,
  location VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_guarantees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  card_last_four VARCHAR(4),
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  charge_amount DECIMAL(10, 2),
  charge_time TIMESTAMP WITH TIME ZONE,
  charge_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajout de colonnes à la table reservations existante
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS is_group_reservation BOOLEAN DEFAULT false;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS group_name VARCHAR(100);
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS has_card_guarantee BOOLEAN DEFAULT false;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS card_last_four VARCHAR(4);
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS send_sms_confirmation BOOLEAN DEFAULT true;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS send_email_confirmation BOOLEAN DEFAULT true;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS table_id UUID REFERENCES restaurant_tables(id);
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS cancellation_time TIMESTAMP WITH TIME ZONE;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS late_cancellation BOOLEAN DEFAULT false;

-- Fonction pour vérifier la disponibilité des tables
CREATE OR REPLACE FUNCTION check_table_availability(
  p_restaurant_id UUID,
  p_date DATE,
  p_time TIME,
  p_party_size INT
) RETURNS TABLE (
  table_id UUID,
  table_number VARCHAR(10),
  capacity INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.table_number,
    t.capacity
  FROM 
    restaurant_tables t
  WHERE 
    t.restaurant_id = p_restaurant_id
    AND t.capacity >= p_party_size
    AND t.is_active = true
    AND t.id NOT IN (
      SELECT r.table_id 
      FROM reservations r 
      WHERE 
        r.restaurant_id = p_restaurant_id
        AND r.date = p_date
        AND r.status = 'confirmed'
        AND (
          r.time = p_time
          OR (r.time > p_time - INTERVAL '1 hour' AND r.time < p_time + INTERVAL '1 hour')
        )
        AND r.table_id IS NOT NULL
    )
  ORDER BY 
    t.capacity ASC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;
