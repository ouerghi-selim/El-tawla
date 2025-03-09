/*
  # Initial Data Population

  1. New Data
    - Users (auth.users) and their profiles
    - Restaurant information
    - Menu categories and items
    - Sample reservations

  2. Security
    - All data respects RLS policies
    - Uses proper data types and constraints
*/

-- First, create users in auth.users table
INSERT INTO auth.users (id, email)
VALUES
  -- Restaurant users
  ('00000000-0000-0000-0000-000000000101', 'contact@lebaroque.com'),
  ('00000000-0000-0000-0000-000000000102', 'contact@dareljeld.com'),
  ('00000000-0000-0000-0000-000000000103', 'contact@laterrasse.com'),
  -- Customer users
  ('00000000-0000-0000-0000-000000000201', 'sarah@example.com'),
  ('00000000-0000-0000-0000-000000000202', 'ahmed@example.com'),
  ('00000000-0000-0000-0000-000000000203', 'leila@example.com'),
  ('00000000-0000-0000-0000-000000000204', 'mohamed@example.com'),
  ('00000000-0000-0000-0000-000000000205', 'fatma@example.com');

-- Then create the profiles linked to those users
INSERT INTO profiles (id, email, name, user_type, points, reliability_score, created_at)
VALUES
  -- Customer profiles
  ('00000000-0000-0000-0000-000000000201', 'sarah@example.com', 'Sarah Ben Ali', 'customer', 2500, 95, now()),
  ('00000000-0000-0000-0000-000000000202', 'ahmed@example.com', 'Ahmed Karim', 'customer', 1800, 88, now()),
  ('00000000-0000-0000-0000-000000000203', 'leila@example.com', 'Leila Mansour', 'customer', 500, 75, now()),
  ('00000000-0000-0000-0000-000000000204', 'mohamed@example.com', 'Mohamed Slim', 'customer', 3500, 98, now()),
  ('00000000-0000-0000-0000-000000000205', 'fatma@example.com', 'Fatma Zahra', 'customer', 1200, 82, now());

-- Restaurant profiles
INSERT INTO profiles (id, email, name, user_type, points, reliability_score, score_threshold, view_score, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000101', 'contact@lebaroque.com', 'Le Baroque', 'restaurant', 0, 100, 70, true, now()),
  ('00000000-0000-0000-0000-000000000102', 'contact@dareljeld.com', 'Dar El Jeld', 'restaurant', 0, 100, 75, true, now()),
  ('00000000-0000-0000-0000-000000000103', 'contact@laterrasse.com', 'La Terrasse', 'restaurant', 0, 100, 65, false, now());

-- Restaurant details
INSERT INTO restaurants (id, name, description, cuisine, price_range, rating, address, hours, phone, image_url, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000101', 'Le Baroque', 'Experience the finest Mediterranean and Tunisian cuisine in an elegant setting.', 'Mediterranean, Tunisian', '₪₪₪', 4.8, '15 Avenue Habib Bourguiba, Tunis', '12:00 PM - 11:00 PM', '+216 71 123 456', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', now()),
  ('00000000-0000-0000-0000-000000000102', 'Dar El Jeld', 'Housed in a historic building, offering authentic Tunisian cuisine.', 'Traditional Tunisian', '₪₪₪₪', 4.9, '5-10 Rue Dar El Jeld, Medina of Tunis', '12:30 PM - 10:30 PM', '+216 71 987 654', 'https://images.unsplash.com/photo-1544148103-0773bf10d330', now()),
  ('00000000-0000-0000-0000-000000000103', 'La Terrasse', 'Modern rooftop restaurant with panoramic views of Tunis.', 'Contemporary Tunisian', '₪₪', 4.5, '78 Avenue de Carthage, Tunis', '11:30 AM - 11:00 PM', '+216 71 456 789', 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092', now());

-- Reservations
INSERT INTO reservations (id, profile_id, restaurant_id, date, time, guests, status, created_at)
VALUES
  -- Réservations pour Sarah
  ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', '2025-02-22', '19:00', 2, 'pending', now()),
  ('00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000102', '2025-02-25', '20:30', 4, 'confirmed', now()),
  
  -- Réservations pour Ahmed
  ('00000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000102', '2025-02-23', '19:30', 2, 'confirmed', now()),
  ('00000000-0000-0000-0000-000000000304', '00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000103', '2025-02-24', '20:00', 3, 'cancelled', now()),
  
  -- Réservations pour Leila
  ('00000000-0000-0000-0000-000000000305', '00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000101', '2025-02-21', '19:00', 2, 'completed', now()),
  
  -- Réservations pour Mohamed
  ('00000000-0000-0000-0000-000000000306', '00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000102', '2025-02-22', '20:00', 6, 'pending', now()),
  
  -- Réservations pour Fatma
  ('00000000-0000-0000-0000-000000000307', '00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000103', '2025-02-23', '19:30', 4, 'confirmed', now());

-- Menu categories
INSERT INTO menu_categories (id, restaurant_id, name, created_at)
VALUES
  -- Catégories pour Le Baroque
  ('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000101', 'Entrées', now()),
  ('00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000101', 'Plats Principaux', now()),
  
  -- Catégories pour Dar El Jeld
  ('00000000-0000-0000-0000-000000000403', '00000000-0000-0000-0000-000000000102', 'Entrées Traditionnelles', now()),
  ('00000000-0000-0000-0000-000000000404', '00000000-0000-0000-0000-000000000102', 'Spécialités', now()),
  
  -- Catégories pour La Terrasse
  ('00000000-0000-0000-0000-000000000405', '00000000-0000-0000-0000-000000000103', 'Entrées', now()),
  ('00000000-0000-0000-0000-000000000406', '00000000-0000-0000-0000-000000000103', 'Plats', now());

-- Menu items
INSERT INTO menu_items (id, category_id, name, description, price, created_at)
VALUES
  -- Plats pour Le Baroque
  ('00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000401', 'Brik à l''œuf', 'Feuille de malsouka croustillante farcie d''œuf et de thon', 8, now()),
  ('00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000401', 'Salade Mechouia', 'Salade de légumes grillés avec thon', 10, now()),
  ('00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000402', 'Couscous Royal', 'Couscous traditionnel avec agneau et légumes', 25, now()),
  ('00000000-0000-0000-0000-000000000504', '00000000-0000-0000-0000-000000000402', 'Loup de Mer Grillé', 'Poisson frais grillé avec sauce au safran', 30, now()),

  -- Plats pour Dar El Jeld
  ('00000000-0000-0000-0000-000000000505', '00000000-0000-0000-0000-000000000403', 'Chorba', 'Soupe traditionnelle aux légumes et agneau', 12, now()),
  ('00000000-0000-0000-0000-000000000506', '00000000-0000-0000-0000-000000000403', 'Brick aux Crevettes', 'Crevettes épicées en croûte croustillante', 15, now()),
  ('00000000-0000-0000-0000-000000000507', '00000000-0000-0000-0000-000000000404', 'Tajine Zeitoun', 'Agneau aux olives et citron confit', 28, now()),
  ('00000000-0000-0000-0000-000000000508', '00000000-0000-0000-0000-000000000404', 'Poisson à la Charmoula', 'Poisson mariné aux épices traditionnelles', 32, now()),

  -- Plats pour La Terrasse
  ('00000000-0000-0000-0000-000000000509', '00000000-0000-0000-0000-000000000405', 'Salade Tunisienne', 'Salade fraîche de tomates, concombres et olives', 9, now()),
  ('00000000-0000-0000-0000-000000000510', '00000000-0000-0000-0000-000000000405', 'Houmous', 'Purée de pois chiches à l''huile d''olive', 8, now()),
  ('00000000-0000-0000-0000-000000000511', '00000000-0000-0000-0000-000000000406', 'Grillades Mixtes', 'Assortiment de viandes grillées', 35, now()),
  ('00000000-0000-0000-0000-000000000512', '00000000-0000-0000-0000-000000000406', 'Pâtes aux Fruits de Mer', 'Pâtes fraîches aux fruits de mer', 28, now());