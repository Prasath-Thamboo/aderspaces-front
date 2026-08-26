"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { AuthDrawer } from "@/components/layout/AuthDrawer"

export function AccountLink() {
  const { customer, isLoading, logout } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false)
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }

    document.addEventListener("click", handleClick)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("click", handleClick)
      document.removeEventListener("keydown", handleKey)
    }
  }, [open])

  if (isLoading) {
    return <span className="account-link" aria-hidden="true" />
  }

  if (!customer) {
    return (
      <>
        <button
          type="button"
          aria-label="Connexion"
          aria-haspopup="dialog"
          aria-expanded={authOpen}
          className="account-link"
          onClick={() => setAuthOpen(true)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>
        <AuthDrawer open={authOpen} onClose={() => setAuthOpen(false)} />
      </>
    )
  }

  const handleLogout = async () => {
    setOpen(false)
    await logout()
    router.push("/")
  }

  return (
    <div className="account-menu" ref={wrapperRef}>
      <button
        type="button"
        className="account-link"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span className="account-link__name">{customer.first_name || "Mon compte"}</span>
      </button>

      <div className="account-menu__panel" data-open={open}>
        <div className="account-menu__box">
          <a href="/compte" className="account-menu__item" onClick={() => setOpen(false)}>
            Paramètres de compte
          </a>
          <a href="/compte/commandes" className="account-menu__item" onClick={() => setOpen(false)}>
            Commandes
          </a>
          <a href="/contact" className="account-menu__item" onClick={() => setOpen(false)}>
            Service client
          </a>
          <button type="button" className="account-menu__item account-menu__item--logout" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  )
}
