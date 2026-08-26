"use client"

import { useEffect, useState } from "react"

const SECTIONS = [
  { id: "home-hero", label: "Accueil" },
  { id: "home-mobilier", label: "Mobilier" },
  { id: "home-imprimantes", label: "Imprimantes" },
  { id: "home-cartouches", label: "Encre & Cartouches" },
  { id: "home-reparation", label: "Réparation" },
  { id: "home-pitch", label: "À propos" },
]

export function ScrollDots() {
  const [active, setActive] = useState(SECTIONS[0].id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { threshold: 0.6 }
    )

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="scroll-dots" aria-label="Navigation entre sections">
      {SECTIONS.map((s) => (
        <button
          key={s.id}
          type="button"
          aria-label={s.label}
          aria-current={active === s.id}
          onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
        />
      ))}
    </div>
  )
}
