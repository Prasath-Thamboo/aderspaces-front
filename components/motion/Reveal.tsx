"use client"

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react"

type RevealVariant = "up" | "fade" | "image" | "mask"

type Props = {
  children: ReactNode
  /** Élément rendu (div par défaut). */
  as?: ElementType
  className?: string
  /** Type de révélation — voir globals.css `[data-reveal]`. */
  variant?: RevealVariant
  /** Délai avant le démarrage, en ms (utile pour orchestrer un stagger). */
  delay?: number
  /** Ne joue qu'une fois (défaut) ou rejoue à chaque entrée dans le viewport. */
  once?: boolean
  /** Fraction de visibilité déclenchant la révélation (0 → 1). */
  amount?: number
}

/**
 * Révélation au scroll, discrète et GPU-only (opacity + transform + clip-path).
 * S'appuie sur IntersectionObserver ; compatible Lenis. Respecte
 * prefers-reduced-motion (le contenu est affiché immédiatement).
 */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  variant = "up",
  delay = 0,
  once = true,
  amount = 0.25,
}: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.revealed = "true"
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.dataset.revealed = "true"
            if (once) io.unobserve(el)
          } else if (!once) {
            el.dataset.revealed = "false"
          }
        }
      },
      { threshold: amount, rootMargin: "0px 0px -8% 0px" }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [once, amount])

  const style = delay
    ? ({ ["--reveal-delay" as string]: `${delay}ms` } as CSSProperties)
    : undefined

  return (
    <Tag ref={ref as never} className={className} data-reveal={variant} style={style}>
      {children}
    </Tag>
  )
}
