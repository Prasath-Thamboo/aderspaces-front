"use client"

import { useEffect, useState } from "react"
import { prefersReducedMotion } from "@/lib/motion"

const SESSION_KEY = "aderspace:intro-played"
const WORD = "Aderspace"

/**
 * Séquence de marque au premier chargement de la session : le nom
 * « Aderspace » se révèle sous un masque montant, un filet se trace,
 * puis l'ensemble s'efface vers le hero. Jouée une seule fois par
 * session, jamais bloquante (le hero est rendu dessous).
 */
export function BrandIntro() {
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) return

    let alreadyPlayed = false
    try {
      alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === "1"
    } catch {
      /* sessionStorage indisponible : on joue quand même une fois */
    }
    if (alreadyPlayed) return

    setPlaying(true)
    try {
      sessionStorage.setItem(SESSION_KEY, "1")
    } catch {
      /* ignore */
    }

    const timer = window.setTimeout(() => setPlaying(false), 1700)
    return () => window.clearTimeout(timer)
  }, [])

  if (!playing) return null

  return (
    <div className="brand-intro" aria-hidden="true">
      <div className="brand-intro__inner">
        <span className="brand-intro__word">
          {WORD.split("").map((char, i) => (
            <span
              key={i}
              className="brand-intro__char"
              style={{ ["--char-index" as string]: i }}
            >
              {char}
            </span>
          ))}
        </span>
        <span className="brand-intro__rule" />
      </div>
    </div>
  )
}
