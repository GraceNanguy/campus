# Structure de base ajoutée

- `public/`
  - `favicon.ico`, `next.svg`, `vercel.svg` (assets statiques). Les fichiers dans `public` sont servis depuis la racine `/`. [^1]
- `components/`
  - `hello.tsx` (exemple de composant réutilisable)
- `src/`
  - `.gitkeep` (placeholder pour créer le dossier; l’utilisation de `src/` est optionnelle) [^1][^3]

Bon à savoir:
- Le moyen le plus rapide de créer un projet Next.js est `npx create-next-app@latest` qui génère ces éléments de base. [^1]
- Vous pouvez opter pour un dossier `src/` pour regrouper le code applicatif. C’est facultatif. [^1][^3]
