const CART_COOKIE = "maisonprint_cart"

export function getCartId(): string | undefined {
  if (typeof document === "undefined") return undefined
  const match = document.cookie.match(new RegExp(`(?:^|; )${CART_COOKIE}=([^;]+)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

export function saveCartId(cartId: string): void {
  const maxAge = 60 * 60 * 24 * 30 // 30 jours
  document.cookie = `${CART_COOKIE}=${encodeURIComponent(cartId)}; max-age=${maxAge}; path=/; SameSite=Lax`
}

export function clearCartId(): void {
  document.cookie = `${CART_COOKIE}=; max-age=0; path=/`
}

export function formatPrice(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount / 100)
}
