# Youth Education

Base du projet Next.js (App Router) pour **Youth Education**.

## Contenu inclus

- `app/page.tsx` – Page d’accueil minimale
- `app/api/health/route.ts` – Endpoint de santé pour vérifier le fonctionnement de l’API

Les fichiers suivants existent déjà par défaut dans cet environnement (vous n’avez pas besoin de les créer) :
- `app/layout.tsx`, `app/globals.css`
- `components/ui/*` (shadcn/ui)
- `tailwind.config.ts`, `tsconfig.json`, `package.json`, `next.config.mjs`

## Démarrage

1. Ouvrez l’aperçu du bloc dans v0.
2. Utilisez le bouton **Deploy** pour déployer sur Vercel, ou **Download Code** pour récupérer le code.
3. Si vous installez localement :
   - Assurez-vous d’avoir Node.js 18+.
   - Installez les dépendances puis lancez le serveur de dev.

\`\`\`bash
pnpm install    # ou npm install / yarn
pnpm dev        # http://localhost:3000
\`\`\`

## Prochaines étapes

- Modifier `app/layout.tsx` pour définir la typographie, la navigation et les métadonnées globales.
- Ajouter des routes (ex : `app/courses/page.tsx`) et des API supplémentaires (ex : `app/api/courses/route.ts`).
- Configurer les intégrations (Base de données, Auth, Stockage) selon vos besoins.

Bon développement !
