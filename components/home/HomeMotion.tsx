"use client"

import { useEffect } from "react"
import { prefersReducedMotion } from "@/lib/motion"

/**
 * Motion propre à la home (scroll plein écran) :
 *  - parallaxe SUBTILE de la vidéo de fond (quelques %),
 *  - voile guidé : le fond s'assombrit légèrement en entrée de section
 *    puis s'éclaircit une fois la section centrée (transition « fondue »
 *    plutôt qu'une coupe sèche),
 *  - fondu de l'indice de scroll du hero.
 * GSAP + ScrollTrigger, chargés dynamiquement côté client uniquement.
 * Entièrement neutralisé si prefers-reduced-motion.
 */
export function HomeMotion() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    let cleanup = () => {}
    let cancelled = false

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return
        gsap.registerPlugin(ScrollTrigger)

        const ctx = gsap.context(() => {
          const sections = gsap.utils.toArray<HTMLElement>(".fp-section")

          sections.forEach((section) => {
            const video = section.querySelector<HTMLElement>(".fp-bg-video")
            const veil = section.querySelector<HTMLElement>(".fp-section__bg")

            if (video) {
              gsap.fromTo(
                video,
                { yPercent: -3 },
                {
                  yPercent: 3,
                  ease: "none",
                  scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                  },
                }
              )
            }

            if (veil) {
              gsap.fromTo(
                veil,
                { "--veil": 0.52 },
                {
                  "--veil": 0.24,
                  ease: "none",
                  scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "top center",
                    scrub: true,
                  },
                }
              )
            }
          })

          const hint = document.querySelector<HTMLElement>(".hero-scroll-hint")
          const hero = document.getElementById("home-hero")
          if (hint && hero) {
            gsap.to(hint, {
              opacity: 0,
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom center",
                scrub: true,
              },
            })
          }

          ScrollTrigger.refresh()
        })

        cleanup = () => ctx.revert()
      }
    )

    return () => {
      cancelled = true
      cleanup()
    }
  }, [])

  return null
}
