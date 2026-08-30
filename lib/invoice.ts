import { MEDUSA_BACKEND_URL, MEDUSA_PUBLISHABLE_KEY } from "@/lib/env"

/**
 * Télécharge la facture PDF d'une commande. La route backend exige le JWT
 * client (stocké par le SDK Medusa dans `localStorage`) + la clé publiable.
 */
export async function downloadInvoice(
  orderId: string,
  displayId: number | string
): Promise<void> {
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("medusa_auth_token")
      : null

  const res = await fetch(
    `${MEDUSA_BACKEND_URL}/store/orders/${orderId}/invoice`,
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY,
      },
    }
  )
  if (!res.ok) throw new Error(`invoice_http_${res.status}`)

  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `facture-commande-${displayId}.pdf`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
