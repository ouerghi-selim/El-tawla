CREATE TABLE IF NOT EXISTS user_social_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bio TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  twitter_url TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_friends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, accepted, blocked
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, restaurant_id)
);

CREATE TABLE IF NOT EXISTS restaurant_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  message TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, viewed, accepted, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL, -- reservation, review, favorite, share, recommendation
  reference_id UUID, -- ID of the related entity (reservation, review, etc.)
  platform VARCHAR(50), -- For share activities: whatsapp, facebook, twitter, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- friend_request, recommendation, reservation_reminder, etc.
  reference_id UUID, -- ID of the related entity
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fonction pour obtenir les recommandations reçues par un utilisateur
CREATE OR REPLACE FUNCTION get_user_recommendations(
  p_user_id UUID
) RETURNS TABLE (
  id UUID,
  sender_id UUID,
  sender_first_name TEXT,
  sender_last_name TEXT,
  sender_avatar_url TEXT,
  restaurant_id UUID,
  restaurant_name TEXT,
  restaurant_image TEXT,
  message TEXT,
  status VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.sender_id,
    u.first_name AS sender_first_name,
    u.last_name AS sender_last_name,
    u.avatar_url AS sender_avatar_url,
    r.restaurant_id,
    rest.name AS restaurant_name,
    rest.cover_image AS restaurant_image,
    r.message,
    r.status,
    r.created_at
  FROM 
    restaurant_recommendations r
    JOIN auth.users u ON r.sender_id = u.id
    JOIN restaurants rest ON r.restaurant_id = rest.id
  WHERE 
    r.receiver_id = p_user_id
  ORDER BY 
    r.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les amis d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_friends(
  p_user_id UUID
) RETURNS TABLE (
  friend_id UUID,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  status VARCHAR(20)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN uf.user_id = p_user_id THEN uf.friend_id
      ELSE uf.user_id
    END AS friend_id,
    u.first_name,
    u.last_name,
    u.avatar_url,
    uf.status
  FROM 
    user_friends uf
    JOIN auth.users u ON (
      CASE 
        WHEN uf.user_id = p_user_id THEN uf.friend_id
        ELSE uf.user_id
      END = u.id
    )
  WHERE 
    (uf.user_id = p_user_id OR uf.friend_id = p_user_id)
    AND uf.status = 'accepted'
  ORDER BY 
    u.first_name, u.last_name;
END;
$$ LANGUAGE plpgsql;
