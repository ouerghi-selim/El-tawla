/*
  # Configuration de l'authentification

  1. Tables
    - `profiles`
      - `id` (uuid, clé primaire)
      - `email` (text, unique)
      - `name` (text)
      - `type` (enum: customer, restaurant, admin)
      - `points` (integer, défaut: 0)
      - `reliability_score` (integer, défaut: 100)
      - `score_threshold` (integer, défaut: 70)
      - `score_enabled` (boolean, défaut: false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Sécurité
    - RLS activé sur la table profiles
    - Politiques pour lecture/écriture basées sur l'authentification
*/

-- Création du type d'utilisateur
CREATE TYPE user_type AS ENUM ('customer', 'restaurant', 'admin');

-- Table des profils
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  type user_type NOT NULL DEFAULT 'customer',
  points integer DEFAULT 0,
  reliability_score integer DEFAULT 100 CHECK (reliability_score >= 0 AND reliability_score <= 100),
  score_threshold integer DEFAULT 70 CHECK (score_threshold >= 0 AND score_threshold <= 100),
  score_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Les utilisateurs peuvent lire leur propre profil"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();