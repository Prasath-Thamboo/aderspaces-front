"use client"

import { useEffect, useRef, type ReactElement, cloneElement } from "react"
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion"

type Props = {
  /** Élément unique (lien / bouton) à rendre légèrement magnétique. */
  children: ReactElement
  /** Amplitude max du déplacement, en px (discret : 6–10). */
  strength?: number
}

/**
 * Aimantation discrète : au survol, l'élément se décale de quelques pixels
 * vers le curseur, puis revient. Souris uniquement, jamais si
 * prefers-reduced-motion. Anime `transform` (GPU).
 */
export function Magnetic({ children, strength = 8 }: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !hasFinePointer() || prefersReducedMotion()) return

    let raf = 0
    let currentX = 0
    let currentY = 0
    let goalX = 0
    let goalY = 0

    const render = () => {
      currentX += (goalX - currentX) * 0.2
      currentY += (goalY - currentY) * 0.2
      el.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`
      raf = Math.abs(goalX - currentX) > 0.1 || Math.abs(goalY - currentY) > 0.1
        ? requestAnimationFrame(render)
        : 0
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(render)
    }
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
      goalX = Math.max(-1, Math.min(1, dx)) * strength
      goalY = Math.max(-1, Math.min(1, dy)) * strength
      kick()
    }
    const onLeave = () => {
      goalX = 0
      goalY = 0
      kick()
    }

    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerleave", onLeave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerleave", onLeave)
      el.style.transform = ""
    }
  }, [strength])

  return cloneElement(children, { ref } as never)
}
