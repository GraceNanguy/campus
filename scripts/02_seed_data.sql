-- Insert categories
INSERT INTO categories (name, description) VALUES
('Design', 'Cours de design graphique, UI/UX et créativité'),
('Développement', 'Programmation web, mobile et logiciel'),
('Marketing', 'Marketing digital, réseaux sociaux et communication'),
('Business', 'Entrepreneuriat, gestion et stratégie d''entreprise')
ON CONFLICT (name) DO NOTHING;

-- Insert predefined admins (professors)
INSERT INTO admins (email, password_hash, full_name) VALUES
('prof.design@education.com', '$2b$10$rQZ9QmjqjKjK5K5K5K5K5u', 'Marie Dubois - Professeur Design'),
('prof.dev@education.com', '$2b$10$rQZ9QmjqjKjK5K5K5K5K5u', 'Jean Martin - Professeur Développement'),
('prof.marketing@education.com', '$2b$10$rQZ9QmjqjKjK5K5K5K5K5u', 'Sophie Laurent - Professeur Marketing')
ON CONFLICT (email) DO NOTHING;

-- Insert sample courses
WITH design_category AS (SELECT id FROM categories WHERE name = 'Design' LIMIT 1),
     dev_category AS (SELECT id FROM categories WHERE name = 'Développement' LIMIT 1),
     marketing_category AS (SELECT id FROM categories WHERE name = 'Marketing' LIMIT 1),
     design_admin AS (SELECT id FROM admins WHERE email = 'prof.design@education.com' LIMIT 1),
     dev_admin AS (SELECT id FROM admins WHERE email = 'prof.dev@education.com' LIMIT 1),
     marketing_admin AS (SELECT id FROM admins WHERE email = 'prof.marketing@education.com' LIMIT 1)

INSERT INTO courses (title, description, price, duration, level, image_url, category_id, admin_id, is_published) VALUES
('UI/UX Design Complet', 'Apprenez les fondamentaux du design d''interface et d''expérience utilisateur', 99.99, '8 semaines', 'Débutant', '/placeholder.svg?height=200&width=300', (SELECT id FROM design_category), (SELECT id FROM design_admin), true),
('Développement Web Moderne', 'Maîtrisez React, Next.js et les technologies web actuelles', 149.99, '12 semaines', 'Intermédiaire', '/placeholder.svg?height=200&width=300', (SELECT id FROM dev_category), (SELECT id FROM dev_admin), true),
('Marketing Digital Avancé', 'Stratégies complètes de marketing digital et réseaux sociaux', 79.99, '6 semaines', 'Intermédiaire', '/placeholder.svg?height=200&width=300', (SELECT id FROM marketing_category), (SELECT id FROM marketing_admin), true)
ON CONFLICT DO NOTHING;
