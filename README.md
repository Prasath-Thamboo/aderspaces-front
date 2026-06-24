# MaisonPrint — Storefront (Next.js)

Interface boutique pour MaisonPrint, construite avec Next.js 15 App Router et le SDK Medusa v2.

## Stack

- **Framework** : Next.js 15 (App Router, SSR/ISR)
- **Langage** : TypeScript strict
- **API** : Medusa v2 via `@medusajs/js-sdk`

## Prérequis

- Node.js >= 20
- pnpm >= 9
- Backend Medusa démarré (voir `maisonprint-backend`)

## Installation

### 1. Cloner le dépôt et installer les dépendances

```bash
git clone https://github.com/VOTRE_ORG/maisonprint-storefront.git
cd maisonprint-storefront
pnpm install
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env.local
# Éditer .env.local
```

**Important** : Récupérer la `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` dans l'Admin Medusa :
→ http://localhost:9000/app → Paramètres → Canaux de vente → Boutique en ligne → Clés publiables

### 3. Démarrer le serveur de développement

```bash
pnpm dev
```

Le storefront est accessible sur **http://localhost:3000**

## Commandes

| Commande | Description |
|---|---|
| `pnpm dev` | Démarrage en mode développement |
| `pnpm build` | Build de production |
| `pnpm start` | Démarrage en production |
| `pnpm lint` | Lint ESLint |
| `pnpm type-check` | Vérification TypeScript |

## Variables d'environnement

| Variable | Description | Obligatoire |
|---|---|---|
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | URL du backend Medusa | Oui |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | Clé publiable Medusa (depuis l'Admin) | Oui |
| `NEXT_PUBLIC_STORE_URL` | URL publique du storefront | Non |

## Structure

```
app/
├── layout.tsx              # Layout racine (header, footer)
├── page.tsx                # Page d'accueil
├── globals.css             # Styles globaux
├── not-found.tsx           # Page 404
└── (main)/
    ├── produits/[handle]/  # Fiche produit (SSR/ISR)
    └── categories/[handle]/# Liste par catégorie (SSR/ISR)
lib/
└── medusa.ts               # Client Medusa SDK configuré
```

## Ordre de démarrage

1. `docker compose up -d` (dans `maisonprint-backend`)
2. `pnpm dev` (dans `maisonprint-backend`)
3. Créer la clé publiable dans l'Admin
4. Renseigner la clé dans `.env.local`
5. `pnpm dev` (dans `maisonprint-storefront`)
