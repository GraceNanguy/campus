-- Adding sample courses and categories for testing
INSERT INTO categories (id, name, description) VALUES 
  (gen_random_uuid(), 'Design', 'Cours de design graphique et UI/UX'),
  (gen_random_uuid(), 'Développement', 'Cours de programmation et développement web'),
  (gen_random_uuid(), 'Marketing', 'Cours de marketing digital et stratégie');

-- Add sample admin
INSERT INTO admins (id, email, password_hash, full_name) VALUES 
  (gen_random_uuid(), 'admin@example.com', '$2a$10$example', 'Admin Test');

-- Add sample courses
WITH design_cat AS (SELECT id FROM categories WHERE name = 'Design' LIMIT 1),
     dev_cat AS (SELECT id FROM categories WHERE name = 'Développement' LIMIT 1),
     marketing_cat AS (SELECT id FROM categories WHERE name = 'Marketing' LIMIT 1),
     admin_user AS (SELECT id FROM admins LIMIT 1)
INSERT INTO courses (id, title, description, price, category_id, admin_id, is_published, duration, level, image_url) VALUES 
  (gen_random_uuid(), 'UI/UX Design Fundamentals', 'Apprenez les bases du design d''interface utilisateur et d''expérience utilisateur', 99.99, (SELECT id FROM design_cat), (SELECT id FROM admin_user), true, '8 heures', 'Débutant', '/placeholder.svg?height=200&width=300'),
  (gen_random_uuid(), 'Advanced Figma Techniques', 'Maîtrisez les techniques avancées de Figma pour créer des designs professionnels', 149.99, (SELECT id FROM design_cat), (SELECT id FROM admin_user), true, '12 heures', 'Avancé', '/placeholder.svg?height=200&width=300'),
  (gen_random_uuid(), 'React Development Bootcamp', 'Formation complète au développement React pour créer des applications modernes', 199.99, (SELECT id FROM dev_cat), (SELECT id FROM admin_user), true, '20 heures', 'Intermédiaire', '/placeholder.svg?height=200&width=300'),
  (gen_random_uuid(), 'Digital Marketing Strategy', 'Stratégies de marketing digital pour faire croître votre business en ligne', 129.99, (SELECT id FROM marketing_cat), (SELECT id FROM admin_user), true, '10 heures', 'Débutant', '/placeholder.svg?height=200&width=300');
