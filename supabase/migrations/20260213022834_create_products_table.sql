/*
  # Create products table for Freedom Projet PM store

  1. New Tables
    - `products`
      - `id` (uuid, primary key) - Unique identifier for each product
      - `name` (text) - Product name
      - `price` (numeric) - Product price in dollars
      - `category` (text) - Product category (sneakers, men, women, caps)
      - `image_url` (text) - URL to product image
      - `stock` (integer) - Available stock quantity
      - `sizes` (text[]) - Available sizes for the product
      - `created_at` (timestamptz) - Timestamp when product was added
  
  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access (anyone can view products)
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL,
  category text NOT NULL,
  image_url text DEFAULT '',
  stock integer DEFAULT 0,
  sizes text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);