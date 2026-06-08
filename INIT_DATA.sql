-- Initialize Default Data for Backend
-- Run this script after creating the database tables

-- 1. Create default roles
INSERT INTO roles (name, slug) VALUES 
  ('admin', 'admin'),
  ('user', 'user'),
  ('moderator', 'moderator')
ON CONFLICT (slug) DO NOTHING;

-- 2. Create content types
INSERT INTO content_types (name, slug) VALUES
  ('Music', 'music'),
  ('Movie', 'movie'),
  ('News', 'news')
ON CONFLICT (slug) DO NOTHING;

-- 3. Create default categories
INSERT INTO categories (name, slug, description) VALUES
  ('Pop', 'pop', 'Pop music and entertainment'),
  ('Rock', 'rock', 'Rock music'),
  ('Jazz', 'jazz', 'Jazz music'),
  ('Comedy', 'comedy', 'Comedy content'),
  ('Drama', 'drama', 'Drama movies'),
  ('Action', 'action', 'Action movies'),
  ('Technology', 'technology', 'Technology news'),
  ('Sports', 'sports', 'Sports news'),
  ('Entertainment', 'entertainment', 'Entertainment news')
ON CONFLICT (slug) DO NOTHING;

-- 4. Create subscription plans
INSERT INTO plans (name, slug, price, duration_days, description, is_active) VALUES
  ('Free', 'free', 0, 30, 'Free plan with limited features', TRUE),
  ('Basic', 'basic', 9.99, 30, 'Basic subscription plan', TRUE),
  ('Premium', 'premium', 19.99, 30, 'Premium subscription with all features', TRUE),
  ('Family', 'family', 29.99, 30, 'Family plan for up to 5 users', TRUE)
ON CONFLICT (slug) DO NOTHING;

-- Verify data was inserted
SELECT 'Roles created: ' || COUNT(*) FROM roles;
SELECT 'Content types created: ' || COUNT(*) FROM content_types;
SELECT 'Categories created: ' || COUNT(*) FROM categories;
SELECT 'Plans created: ' || COUNT(*) FROM plans;
