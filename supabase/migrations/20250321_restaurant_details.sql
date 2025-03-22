CREATE TABLE IF NOT EXISTS restaurant_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  is_vegetarian BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  is_gluten_free BOOLEAN DEFAULT false,
  is_spicy BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_item_allergens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  allergen_name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS restaurant_opening_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  day_of_week VARCHAR(10) NOT NULL,
  day_order INT NOT NULL,
  open_time TIME,
  close_time TIME,
  is_closed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(restaurant_id, day_of_week)
);

CREATE TABLE IF NOT EXISTS restaurant_cuisine_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  cuisine_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(restaurant_id, cuisine_type)
);

CREATE TABLE IF NOT EXISTS restaurant_specialties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  is_local BOOLEAN DEFAULT false,
  count INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(restaurant_id, name)
);

-- Ajout de colonnes à la table restaurants existante
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS price_level INT DEFAULT 2;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS has_wifi BOOLEAN DEFAULT false;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS has_parking BOOLEAN DEFAULT false;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS is_accessible BOOLEAN DEFAULT false;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS accepts_credit_cards BOOLEAN DEFAULT true;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS has_outdoor_seating BOOLEAN DEFAULT false;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS email TEXT;

-- Fonction pour rechercher des restaurants avec filtres
CREATE OR REPLACE FUNCTION search_restaurants(
  p_query TEXT DEFAULT NULL,
  p_city TEXT DEFAULT NULL,
  p_cuisine_type TEXT DEFAULT NULL,
  p_price_level INT DEFAULT NULL,
  p_features TEXT[] DEFAULT NULL,
  p_sort_by TEXT DEFAULT 'relevance'
) RETURNS SETOF restaurants AS $$
DECLARE
  query_sql TEXT;
BEGIN
  query_sql := 'SELECT DISTINCT r.* FROM restaurants r ';
  
  -- Jointure pour le type de cuisine si nécessaire
  IF p_cuisine_type IS NOT NULL THEN
    query_sql := query_sql || 'JOIN restaurant_cuisine_types ct ON r.id = ct.restaurant_id ';
  END IF;
  
  -- Conditions WHERE
  query_sql := query_sql || 'WHERE 1=1 ';
  
  -- Filtre par recherche textuelle
  IF p_query IS NOT NULL THEN
    query_sql := query_sql || 'AND (r.name ILIKE ''%' || p_query || '%'' OR r.description ILIKE ''%' || p_query || '%'') ';
  END IF;
  
  -- Filtre par ville
  IF p_city IS NOT NULL THEN
    query_sql := query_sql || 'AND r.city ILIKE ''%' || p_city || '%'' ';
  END IF;
  
  -- Filtre par type de cuisine
  IF p_cuisine_type IS NOT NULL THEN
    query_sql := query_sql || 'AND ct.cuisine_type = ''' || p_cuisine_type || ''' ';
  END IF;
  
  -- Filtre par niveau de prix
  IF p_price_level IS NOT NULL THEN
    query_sql := query_sql || 'AND r.price_level = ' || p_price_level || ' ';
  END IF;
  
  -- Filtre par caractéristiques
  IF p_features IS NOT NULL THEN
    FOREACH feature IN ARRAY p_features LOOP
      query_sql := query_sql || 'AND r.' || feature || ' = true ';
    END LOOP;
  END IF;
  
  -- Tri
  IF p_sort_by = 'rating' THEN
    -- Tri par note moyenne (nécessite une sous-requête)
    query_sql := query_sql || 'ORDER BY (SELECT AVG(rating) FROM reviews WHERE restaurant_id = r.id) DESC NULLS LAST ';
  ELSIF p_sort_by = 'distance' THEN
    -- Tri par distance (nécessite des coordonnées)
    query_sql := query_sql || 'ORDER BY r.name '; -- Fallback si pas de coordonnées
  ELSE
    -- Tri par pertinence par défaut
    query_sql := query_sql || 'ORDER BY r.name ';
  END IF;
  
  RETURN QUERY EXECUTE query_sql;
END;
$$ LANGUAGE plpgsql;
