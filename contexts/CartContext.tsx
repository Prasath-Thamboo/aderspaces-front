"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { sdk } from "@/lib/medusa"
import { getCartId, saveCartId } from "@/lib/cart"

type CartItem = {
  id: string
  title: string
  thumbnail: string | null
  quantity: number
  unit_price: number
  currency_code: string
  variant_id: string
  variant?: { title?: string | null }
}

type Cart = {
  id: string
  items: CartItem[]
  total: number
  currency_code: string
  region_id?: string | null
}

type CartContextType = {
  cart: Cart | null
  isLoading: boolean
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  addItem: (variantId: string, quantity?: number) => Promise<void>
  removeItem: (lineItemId: string) => Promise<void>
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>
  itemCount: number
}

const CartContext = createContext<CartContextType | null>(null)

export function useCart(): CartContextType {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart doit être utilisé dans CartProvider")
  return ctx
}

async function getOrCreateCart(): Promise<Cart> {
  const cartId = getCartId()
  if (cartId) {
    try {
      const { cart } = await sdk.store.cart.retrieve(cartId)
      return cart as unknown as Cart
    } catch {
      // cart expiré ou invalide
    }
  }
  const { regions } = await sdk.store.region.list()
  const regionId = regions[0]?.id
  const { cart } = await sdk.store.cart.create({ region_id: regionId })
  saveCartId(cart.id)
  return cart as unknown as Cart
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const cartId = getCartId()
    if (!cartId) return
    sdk.store.cart.retrieve(cartId)
      .then(({ cart }) => setCart(cart as unknown as Cart))
      .catch(() => null)
  }, [])

  const addItem = useCallback(async (variantId: string, quantity = 1) => {
    setIsLoading(true)
    try {
      const currentCart = cart ?? await getOrCreateCart()
      if (!cart) setCart(currentCart)

      const { cart: updated } = await sdk.store.cart.createLineItem(currentCart.id, {
        variant_id: variantId,
        quantity,
      })
      setCart(updated as unknown as Cart)
      setIsOpen(true)
    } finally {
      setIsLoading(false)
    }
  }, [cart])

  const removeItem = useCallback(async (lineItemId: string) => {
    if (!cart) return
    setIsLoading(true)
    try {
      await sdk.store.cart.deleteLineItem(cart.id, lineItemId)
      const { cart: updated } = await sdk.store.cart.retrieve(cart.id)
      setCart(updated as unknown as Cart)
    } finally {
      setIsLoading(false)
    }
  }, [cart])

  const updateQuantity = useCallback(async (lineItemId: string, quantity: number) => {
    if (!cart) return
    if (quantity <= 0) { await removeItem(lineItemId); return }
    setIsLoading(true)
    try {
      const { cart: updated } = await sdk.store.cart.updateLineItem(cart.id, lineItemId, { quantity })
      setCart(updated as unknown as Cart)
    } finally {
      setIsLoading(false)
    }
  }, [cart, removeItem])

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  return (
    <CartContext.Provider value={{ cart, isLoading, isOpen, setIsOpen, addItem, removeItem, updateQuantity, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}
