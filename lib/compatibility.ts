import { sdk } from "@/lib/medusa"

/**
 * Produits compatibles — désormais pilotés depuis l'admin Medusa via le
 * module `product_compatibility`. On interroge l'endpoint boutique
 * `GET /store/products/:id/compatible` au lieu d'un mapping statique.
 */
export type CompatibleProduct = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  variants?: Array<{ prices?: Array<{ amount: number; currency_code: string }> }>
}

export async function getCompatibleProducts(
  productId: string
): Promise<CompatibleProduct[]> {
  try {
    const { products } = await sdk.client.fetch<{ products: CompatibleProduct[] }>(
      `/store/products/${productId}/compatible`,
      { next: { revalidate: 60 } }
    )
    return products ?? []
  } catch {
    return []
  }
}
