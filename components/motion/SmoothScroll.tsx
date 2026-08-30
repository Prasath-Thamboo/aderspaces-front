"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import Lenis from "lenis"
import { prefersReducedMotion } from "@/lib/motion"

/**
 * Défilement lissé (Lenis) sur tout le site SAUF la page d'accueil :
 * la home garde son scroll-snap CSS plein écran, avec lequel Lenis
 * entre en conflit. Désactivé aussi si prefers-reduced-motion.
 */
export function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === "/" || prefersReducedMotion()) return

    const lenis = new Lenis({
      duration: 1.1,
      // ease-out expo — cohérent avec --ease-out-expo
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    })

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [pathname])

  return null
}
