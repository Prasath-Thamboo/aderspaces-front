"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { sdk } from "@/lib/medusa"

type Customer = {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone?: string | null
}

type RegisterInput = {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
}

type AuthContextType = {
  customer: Customer | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider")
  return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const { customer } = await sdk.store.customer.retrieve()
      setCustomer(customer as unknown as Customer)
    } catch {
      setCustomer(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const login = useCallback(async (email: string, password: string) => {
    const result = await sdk.auth.login("customer", "emailpass", { email, password })
    if (typeof result !== "string") {
      throw new Error("Cette méthode de connexion nécessite une étape supplémentaire non prise en charge.")
    }
    await refresh()
  }, [refresh])

  const register = useCallback(async ({ email, password, first_name, last_name, phone }: RegisterInput) => {
    const token = await sdk.auth.register("customer", "emailpass", { email, password })
    await sdk.store.customer.create(
      { email, first_name, last_name, phone },
      {},
      { Authorization: `Bearer ${token}` }
    )
    await refresh()
  }, [refresh])

  const logout = useCallback(async () => {
    await sdk.auth.logout()
    setCustomer(null)
  }, [])

  return (
    <AuthContext.Provider value={{ customer, isLoading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}
