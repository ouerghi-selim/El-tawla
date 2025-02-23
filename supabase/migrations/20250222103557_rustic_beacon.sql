/*
  # Add storage bucket for menu photos

  1. New Storage
    - Create a new public bucket for storing menu photos
    - Set up security policies for the bucket

  2. Security
    - Enable authenticated users to upload photos
    - Allow public access for viewing photos
*/

-- Create storage bucket for menu photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-photos', 'menu-photos', true);

-- Set up storage policies
CREATE POLICY "Allow public access to menu photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'menu-photos');

CREATE POLICY "Allow authenticated users to upload menu photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'menu-photos');

CREATE POLICY "Allow authenticated users to update their menu photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'menu-photos');

CREATE POLICY "Allow authenticated users to delete their menu photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'menu-photos');