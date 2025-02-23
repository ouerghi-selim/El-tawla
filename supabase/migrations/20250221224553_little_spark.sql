/*
  # Seed Initial Data

  1. Data Population
    - Add sample restaurants
    - Add sample menu categories and items
*/

-- Seed restaurants
INSERT INTO restaurants (name, description, cuisine, price_range, rating, address, hours, phone, image_url) VALUES
  (
    'Le Baroque',
    'Experience the finest Mediterranean and Tunisian cuisine in an elegant setting. Our chefs combine traditional recipes with modern techniques.',
    'Mediterranean, Tunisian',
    '₪₪₪',
    4.8,
    '15 Avenue Habib Bourguiba, Tunis',
    '12:00 PM - 11:00 PM',
    '+216 71 123 456',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'
  ),
  (
    'Dar El Jeld',
    'Housed in a historic building, Dar El Jeld offers authentic Tunisian cuisine in a stunning traditional setting.',
    'Traditional Tunisian',
    '₪₪₪₪',
    4.9,
    '5-10 Rue Dar El Jeld, Medina of Tunis',
    '12:30 PM - 10:30 PM',
    '+216 71 987 654',
    'https://images.unsplash.com/photo-1544148103-0773bf10d330'
  );

-- Get restaurant IDs
DO $$
DECLARE
  le_baroque_id uuid;
  dar_el_jeld_id uuid;
BEGIN
  SELECT id INTO le_baroque_id FROM restaurants WHERE name = 'Le Baroque';
  SELECT id INTO dar_el_jeld_id FROM restaurants WHERE name = 'Dar El Jeld';

  -- Seed menu categories and items for Le Baroque
  WITH starters AS (
    INSERT INTO menu_categories (restaurant_id, name)
    VALUES (le_baroque_id, 'Starters')
    RETURNING id
  )
  INSERT INTO menu_items (category_id, name, description, price)
  SELECT id, 'Tunisian Brik', 'Crispy pastry filled with egg and tuna', 8
  FROM starters
  UNION ALL
  SELECT id, 'Mechouia', 'Grilled vegetable salad with tuna', 10
  FROM starters;

  WITH main_courses AS (
    INSERT INTO menu_categories (restaurant_id, name)
    VALUES (le_baroque_id, 'Main Courses')
    RETURNING id
  )
  INSERT INTO menu_items (category_id, name, description, price)
  SELECT id, 'Couscous Royal', 'Traditional couscous with lamb and vegetables', 25
  FROM main_courses
  UNION ALL
  SELECT id, 'Grilled Sea Bass', 'Fresh sea bass with saffron sauce', 30
  FROM main_courses;

  -- Seed menu categories and items for Dar El Jeld
  WITH starters AS (
    INSERT INTO menu_categories (restaurant_id, name)
    VALUES (dar_el_jeld_id, 'Starters')
    RETURNING id
  )
  INSERT INTO menu_items (category_id, name, description, price)
  SELECT id, 'Slata Tounsia', 'Traditional Tunisian salad', 12
  FROM starters
  UNION ALL
  SELECT id, 'Harissa Prawns', 'Spicy grilled prawns', 15
  FROM starters;

  WITH main_courses AS (
    INSERT INTO menu_categories (restaurant_id, name)
    VALUES (dar_el_jeld_id, 'Main Courses')
    RETURNING id
  )
  INSERT INTO menu_items (category_id, name, description, price)
  SELECT id, 'Tajine Zeitoun', 'Lamb with olives and preserved lemons', 28
  FROM main_courses
  UNION ALL
  SELECT id, 'Samak Meshwi', 'Grilled fish with chermoula', 32
  FROM main_courses;
END $$;