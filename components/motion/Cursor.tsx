"use client"

import { useEffect, useRef } from "react"
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion"

/**
 * Curseur personnalisé minimal : un anneau fin qui suit la souris avec
 * une légère inertie et s'agrandit sur les éléments interactifs.
 * Actif uniquement sur pointeur fin et hors prefers-reduced-motion.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return
    const dot = ref.current
    if (!dot) return

    document.documentElement.classList.add("has-custom-cursor")

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let targetX = x
    let targetY = y
    let visible = false
    let frame = 0

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      if (!visible) {
        visible = true
        dot.dataset.visible = "true"
      }
    }
    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null
      const interactive = target?.closest(
        "a, button, input, select, textarea, label, [role='button'], [data-magnetic]"
      )
      dot.dataset.active = interactive ? "true" : "false"
    }
    const onDown = () => (dot.dataset.press = "true")
    const onUp = () => (dot.dataset.press = "false")
    const onLeave = () => {
      visible = false
      dot.dataset.visible = "false"
    }

    const tick = () => {
      x += (targetX - x) * 0.18
      y += (targetY - y) * 0.18
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerover", onOver, { passive: true })
    window.addEventListener("pointerdown", onDown, { passive: true })
    window.addEventListener("pointerup", onUp, { passive: true })
    document.addEventListener("pointerleave", onLeave)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerover", onOver)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
      document.removeEventListener("pointerleave", onLeave)
      document.documentElement.classList.remove("has-custom-cursor")
    }
  }, [])

  return <div ref={ref} className="cursor-dot" data-visible="false" aria-hidden="true" />
}
