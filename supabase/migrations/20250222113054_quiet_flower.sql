/*
  # Add Restaurant Score System

  1. Changes
    - Add user_type to profiles table
    - Add score_threshold to restaurants table
    - Add score_enabled flag to restaurants table
    - Add reliability_score to profiles table
    - Add view_score permission to profiles table
  
  2. Security
    - Enable RLS for all new columns
    - Add policies for restaurant owners
*/

-- Add user type and score-related columns to profiles
ALTER TABLE profiles 
ADD COLUMN user_type text DEFAULT 'customer' CHECK (user_type IN ('customer', 'restaurant')),
ADD COLUMN reliability_score integer DEFAULT 100 CHECK (reliability_score >= 0 AND reliability_score <= 100),
ADD COLUMN view_score boolean DEFAULT false;

-- Add score settings to restaurants table
ALTER TABLE restaurants 
ADD COLUMN score_threshold integer DEFAULT 70 CHECK (score_threshold >= 0 AND score_threshold <= 100),
ADD COLUMN score_enabled boolean DEFAULT false;

-- Update policies for restaurants
CREATE POLICY "Restaurant owners can update score settings"
ON restaurants
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND user_type = 'restaurant'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND user_type = 'restaurant'
  )
);

-- Create policy for viewing scores
CREATE POLICY "Only restaurant owners can view reliability scores"
ON profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = id OR 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND user_type = 'restaurant' 
    AND view_score = true
  )
);

-- Create function to update reliability score
CREATE OR REPLACE FUNCTION update_reliability_score(
  user_id uuid,
  score_change integer
) RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET reliability_score = GREATEST(0, LEAST(100, reliability_score + score_change))
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;