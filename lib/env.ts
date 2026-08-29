/**
 * Accès centralisé et validé aux variables d'environnement publiques.
 * Aucune valeur de repli en dur : une config absente casse tôt, avec un
 * message clair, plutôt que de laisser passer une URL « localhost » en prod.
 *
 * Les `NEXT_PUBLIC_*` sont figées au build → l'accès direct à `process.env`
 * est nécessaire pour que Next les inline.
 */

function required(name: string, value: string | undefined): string {
  if (!value || value.trim() === "") {
    throw new Error(
      `Variable d'environnement manquante : ${name}. ` +
        `Renseignez-la dans .env (voir .env.example).`
    )
  }
  return value
}

export const MEDUSA_BACKEND_URL = required(
  "NEXT_PUBLIC_MEDUSA_BACKEND_URL",
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
)

export const MEDUSA_PUBLISHABLE_KEY = required(
  "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY",
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
)

/** Optionnelles : renvoient `undefined` si non configurées. */
export const STORE_URL = process.env.NEXT_PUBLIC_STORE_URL
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
export const ASSET_HOST = process.env.NEXT_PUBLIC_ASSET_HOST
