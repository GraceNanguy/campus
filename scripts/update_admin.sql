-- Vérifier l'entrée existante
SELECT id, email, full_name
FROM admins
WHERE id = 'b82600fc-2857-461f-88bc-8e548ef1eff3';

-- Mettre à jour l'entrée existante au lieu d'en créer une nouvelle
UPDATE admins
SET 
  email = 'youtheducation677@gmail.com',
  full_name = 'Brou',
  password_hash = 'MANAGED_BY_SUPABASE_AUTH',
  updated_at = NOW()
WHERE id = 'b82600fc-2857-461f-88bc-8e548ef1eff3';
