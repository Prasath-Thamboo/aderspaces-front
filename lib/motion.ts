/**
 * Tokens de motion — miroir JS des variables CSS (globals.css :root).
 * Toute animation pilotée en JS (GSAP / Framer Motion) doit puiser ici,
 * pour rester alignée sur le design system « Atelier ».
 *
 * Philosophie : lent, intentionnel, discret. Une seule chose bouge par
 * zone de regard. Pas de linear, pas de spring rebondissant.
 */

type Bezier = [number, number, number, number]

/** Courbes d'easing, au format [x1, y1, x2, y2] (Framer Motion / cubic-bezier). */
export const ease: Record<"outExpo" | "outQuint" | "inOut" | "standard", Bezier> = {
  /** Révélations — « ease-out expo ». */
  outExpo: [0.16, 1, 0.3, 1],
  /** Transitions guidées entre sections / pages. */
  outQuint: [0.22, 1, 0.36, 1],
  /** Fondus symétriques. */
  inOut: [0.65, 0, 0.35, 1],
  /** Micro-interactions. */
  standard: [0.4, 0, 0.2, 1],
}

/** Chaînes CSS correspondantes (pour GSAP : `ease: cssEase.outExpo`). */
export const cssEase = {
  outExpo: "cubic-bezier(0.16, 1, 0.3, 1)",
  outQuint: "cubic-bezier(0.22, 1, 0.36, 1)",
  inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
  standard: "cubic-bezier(0.4, 0, 0.2, 1)",
}

/** Durées en secondes (unité GSAP / Framer Motion). */
export const dur = {
  instant: 0.12,
  fast: 0.2,
  medium: 0.32,
  slow: 0.6,
  reveal: 0.76,
  xslow: 0.9,
}

/** Décalages de stagger, en secondes. */
export const stagger = {
  base: 0.08,
  tight: 0.056,
}

/** Amplitude de parallaxe (fraction de la hauteur de l'élément). */
export const parallaxShift = 0.03

/** `true` si l'utilisateur demande une réduction des animations. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/** `true` sur pointeur fin (souris) — condition du curseur personnalisé. */
export function hasFinePointer(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches
}

/** Variantes Framer Motion réutilisables pour les transitions de page. */
export const pageVariants = {
  initial: { opacity: 0 },
  enter: {
    opacity: 1,
    transition: { duration: dur.slow, ease: ease.outQuint },
  },
  exit: {
    opacity: 0,
    transition: { duration: dur.medium, ease: ease.inOut },
  },
}
