"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === "/"

  useEffect(() => {
    document.documentElement.classList.toggle("is-home-scroll", isHome)
    return () => document.documentElement.classList.remove("is-home-scroll")
  }, [isHome])

  return <main className={isHome ? undefined : "main--padded"}>{children}</main>
}
