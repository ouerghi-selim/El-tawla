CREATE TABLE IF NOT EXISTS user_payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_provider VARCHAR(50) NOT NULL, -- 'stripe', 'edinar', 'flouci', etc.
  payment_method_id VARCHAR(100), -- External payment method ID (e.g., Stripe payment method ID)
  card_last_four VARCHAR(4), -- Last 4 digits of card number
  card_brand VARCHAR(50), -- 'visa', 'mastercard', 'amex', etc.
  card_exp_month INTEGER, -- Expiration month
  card_exp_year INTEGER, -- Expiration year
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL, -- Amount in cents
  currency VARCHAR(3) NOT NULL DEFAULT 'TND', -- Currency code (ISO 4217)
  payment_method_id VARCHAR(100), -- External payment method ID
  payment_intent_id VARCHAR(100), -- External payment intent ID
  status VARCHAR(50) NOT NULL, -- 'succeeded', 'pending', 'failed', etc.
  description TEXT,
  metadata JSONB, -- Additional metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  receipt_url TEXT, -- URL to the receipt PDF
  receipt_number VARCHAR(50), -- Unique receipt number
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to get user's payment methods
CREATE OR REPLACE FUNCTION get_user_payment_methods(
  p_user_id UUID
) RETURNS TABLE (
  id UUID,
  payment_provider VARCHAR(50),
  payment_method_id VARCHAR(100),
  card_last_four VARCHAR(4),
  card_brand VARCHAR(50),
  card_exp_month INTEGER,
  card_exp_year INTEGER,
  is_default BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    upm.id,
    upm.payment_provider,
    upm.payment_method_id,
    upm.card_last_four,
    upm.card_brand,
    upm.card_exp_month,
    upm.card_exp_year,
    upm.is_default,
    upm.created_at
  FROM 
    user_payment_methods upm
  WHERE 
    upm.user_id = p_user_id
  ORDER BY 
    upm.is_default DESC, upm.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's payment history
CREATE OR REPLACE FUNCTION get_user_payment_history(
  p_user_id UUID
) RETURNS TABLE (
  id UUID,
  reservation_id UUID,
  amount INTEGER,
  currency VARCHAR(3),
  status VARCHAR(50),
  description TEXT,
  payment_method_id VARCHAR(100),
  card_last_four VARCHAR(4),
  card_brand VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.reservation_id,
    p.amount,
    p.currency,
    p.status,
    p.description,
    p.payment_method_id,
    upm.card_last_four,
    upm.card_brand,
    p.created_at
  FROM 
    payments p
    LEFT JOIN user_payment_methods upm ON p.payment_method_id = upm.payment_method_id
  WHERE 
    p.user_id = p_user_id
  ORDER BY 
    p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to process a payment for a reservation
CREATE OR REPLACE FUNCTION process_reservation_payment(
  p_reservation_id UUID,
  p_payment_method_id VARCHAR(100),
  p_payment_intent_id VARCHAR(100),
  p_amount INTEGER,
  p_currency VARCHAR(3),
  p_status VARCHAR(50),
  p_description TEXT,
  p_metadata JSONB
) RETURNS TABLE (
  payment_id UUID,
  reservation_id UUID,
  status VARCHAR(50)
) AS $$
DECLARE
  v_user_id UUID;
  v_payment_id UUID;
BEGIN
  -- Get user ID from reservation
  SELECT user_id INTO v_user_id
  FROM reservations
  WHERE id = p_reservation_id;
  
  -- Insert payment record
  INSERT INTO payments (
    user_id,
    reservation_id,
    amount,
    currency,
    payment_method_id,
    payment_intent_id,
    status,
    description,
    metadata
  ) VALUES (
    v_user_id,
    p_reservation_id,
    p_amount,
    p_currency,
    p_payment_method_id,
    p_payment_intent_id,
    p_status,
    p_description,
    p_metadata
  ) RETURNING id INTO v_payment_id;
  
  -- Update reservation payment status
  UPDATE reservations
  SET 
    payment_status = p_status,
    updated_at = NOW()
  WHERE id = p_reservation_id;
  
  -- Return payment details
  RETURN QUERY
  SELECT 
    v_payment_id,
    p_reservation_id,
    p_status;
END;
$$ LANGUAGE plpgsql;
