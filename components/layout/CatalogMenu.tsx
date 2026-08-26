"use client"

import { useEffect, useRef, useState } from "react"

type Tone = "terracotta" | "forest" | "ochre" | "ink"

type CatalogItem = {
  href: string
  label: string
  tagline: string
  tone: Tone
  icon: React.ReactNode
}

const ITEMS: CatalogItem[] = [
  {
    href: "/categories/mobilier-moderne",
    label: "Mobilier",
    tagline: "Bureaux, sièges et rangements pour un espace qui vous ressemble.",
    tone: "forest",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 13V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
        <path d="M4 13a2 2 0 0 0-1 1.73V17a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h10v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2.27A2 2 0 0 0 20 13" />
        <path d="M6 18v2M18 18v2" />
      </svg>
    ),
  },
  {
    href: "/categories/imprimantes",
    label: "Imprimantes",
    tagline: "Modèles fiables pour la maison comme pour le bureau.",
    tone: "ink",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9V3h12v6" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </svg>
    ),
  },
  {
    href: "/categories/encre-cartouches",
    label: "Encre & Cartouches",
    tagline: "Consommables compatibles avec votre imprimante.",
    tone: "ochre",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.7s5 5.5 5 9.3a5 5 0 0 1-10 0c0-3.8 5-9.3 5-9.3z" />
      </svg>
    ),
  },
  {
    href: "/reparation",
    label: "Réparation",
    tagline: "Diagnostic, devis et remise en état de vos équipements.",
    tone: "terracotta",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a5 5 0 0 0-6.4 6.4L2 19l3 3 6.3-6.3a5 5 0 0 0 6.4-6.4l-3.35 3.35a1.5 1.5 0 0 1-2.1-2.1z" />
      </svg>
    ),
  },
]

export function CatalogMenu() {
  const [open, setOpen] = useState(false)
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

  return (
    <div className="catalog-menu" ref={wrapperRef}>
      <button
        type="button"
        className="catalog-menu__trigger"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
        <span className="catalog-menu__trigger-label">Catalogue</span>
        <svg
          className={`catalog-menu__chevron${open ? " catalog-menu__chevron--open" : ""}`}
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div className="catalog-menu__panel" data-open={open}>
        <div className="catalog-menu__grid">
          {ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`catalog-card catalog-card--${item.tone}`}
              onClick={() => setOpen(false)}
            >
              <span className="catalog-card__icon">{item.icon}</span>
              <span className="catalog-card__label">{item.label}</span>
              <span className="catalog-card__tagline">{item.tagline}</span>
              <span className="catalog-card__arrow" aria-hidden="true">→</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
