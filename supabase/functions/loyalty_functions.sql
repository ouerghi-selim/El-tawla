CREATE OR REPLACE FUNCTION add_loyalty_points(
  p_user_id UUID,
  p_points INTEGER,
  p_description TEXT,
  p_restaurant_id UUID DEFAULT NULL,
  p_restaurant_name TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  -- Mettre à jour les points de fidélité de l'utilisateur
  UPDATE users
  SET loyalty_points = COALESCE(loyalty_points, 0) + p_points
  WHERE id = p_user_id;
  
  -- Enregistrer la transaction
  INSERT INTO loyalty_transactions (
    user_id,
    points,
    type,
    description,
    restaurant_id,
    restaurant_name
  ) VALUES (
    p_user_id,
    p_points,
    'earned',
    p_description,
    p_restaurant_id,
    p_restaurant_name
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION redeem_loyalty_points(
  p_user_id UUID,
  p_points INTEGER,
  p_description TEXT,
  p_reward_id UUID
) RETURNS VOID AS $$
BEGIN
  -- Vérifier si l'utilisateur a suffisamment de points
  IF (SELECT loyalty_points FROM users WHERE id = p_user_id) < p_points THEN
    RAISE EXCEPTION 'Pas assez de points de fidélité';
  END IF;
  
  -- Mettre à jour les points de fidélité de l'utilisateur
  UPDATE users
  SET loyalty_points = loyalty_points - p_points
  WHERE id = p_user_id;
  
  -- Enregistrer la transaction
  INSERT INTO loyalty_transactions (
    user_id,
    points,
    type,
    description,
    reward_id
  ) VALUES (
    p_user_id,
    p_points,
    'redeemed',
    p_description,
    p_reward_id
  );
END;
$$ LANGUAGE plpgsql;
