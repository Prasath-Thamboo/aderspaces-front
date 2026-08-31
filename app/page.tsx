import { ScrollDots } from "@/components/home/ScrollDots"
import { HomeMotion } from "@/components/home/HomeMotion"
import { Reveal } from "@/components/motion/Reveal"
import { Magnetic } from "@/components/motion/Magnetic"

type SectionSpec = {
  id: string
  href: string
  video: string
  label: string
  ariaLabel: string
}

const CATEGORY_SECTIONS: SectionSpec[] = [
  {
    id: "home-mobilier",
    href: "/categories/mobilier-moderne",
    video: "mobilier",
    label: "Mobilier",
    ariaLabel: "Découvrir le mobilier",
  },
]

type SupplierSection = {
  id: string
  href: string
  label: string
  ariaLabel: string
  makers: string[]
  video?: string
}

// video: nom du fichier (sans extension) dans public/videos/ ; absent => fond dégradé.
const SUPPLIER_SECTIONS: SupplierSection[] = [
  {
    id: "home-fournisseurs-italie",
    href: "/nos-fournisseurs#italie",
    label: "Italie",
    ariaLabel: "Nos fournisseurs italiens",
    makers: ["Quadrifoglio", "Sinetica", "Estel", "Manerba", "Frezza", "Las Mobili"],
    video: "italie",
  },
  {
    id: "home-fournisseurs-lituanie",
    href: "/nos-fournisseurs#lituanie",
    label: "Lituanie",
    ariaLabel: "Nos fournisseurs lituaniens",
    makers: ["Narbutas"],
    video: "lituanie",
  },
  {
    id: "home-fournisseurs-pologne",
    href: "/nos-fournisseurs#pologne",
    label: "Pologne",
    ariaLabel: "Nos fournisseurs polonais",
    makers: ["Nowy Styl", "MDD", "Bejot"],
    video: "pologne",
  },
]

function CornerLabel({ href, label, ariaLabel }: { href: string; label: string; ariaLabel: string }) {
  return (
    <Magnetic>
      <a href={href} className="fp-corner-label" aria-label={ariaLabel}>
        {label}
        <span className="fp-corner-label__arrow" aria-hidden="true">→</span>
      </a>
    </Magnetic>
  )
}

export default function HomePage() {
  return (
    <>
      <ScrollDots />
      <HomeMotion />
      <div className="fp-container">
        {/* 1. Hero — vidéo plein écran, sans texte ni bouton */}
        <section id="home-hero" className="fp-section fp-section--dark" aria-label="Bienvenue chez Aderspace">
          <div className="fp-section__bg">
            <video className="fp-bg-video" autoPlay muted loop playsInline preload="metadata">
              <source src="/videos/hero.mp4" type="video/mp4" />
            </video>
            <div className="hero-fallback" style={{ position: "absolute", inset: 0 }} />
          </div>
          <div className="hero-scroll-hint">
            <span className="sr-only">Défiler</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </section>

        {/* 2. Catégorie Mobilier — vidéo en fond, libellé serif en bas à gauche */}
        {CATEGORY_SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className="fp-section fp-section--dark fp-section--feature" aria-label={section.label}>
            <div className="fp-section__bg">
              <video className="fp-bg-video" autoPlay muted loop playsInline preload="metadata">
                <source src={`/videos/${section.video}.mp4`} type="video/mp4" />
              </video>
            </div>
            <Reveal variant="fade" as="div" className="fp-corner-slot">
              <CornerLabel href={section.href} label={section.label} ariaLabel={section.ariaLabel} />
            </Reveal>
          </section>
        ))}

        {/* 3-5. Nos fournisseurs par pays de provenance */}
        {SUPPLIER_SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className="fp-section fp-section--dark fp-section--feature" aria-label={section.ariaLabel}>
            <div className="fp-section__bg">
              {section.video && (
                <video className="fp-bg-video" autoPlay muted loop playsInline preload="metadata">
                  <source src={`/videos/${section.video}.mp4`} type="video/mp4" />
                </video>
              )}
            </div>
            <div className="fp-feature-content">
              <ul className="fp-feature-list">
                {section.makers.map((maker, i) => (
                  <Reveal key={maker} as="li" variant="up" delay={i * 56}>
                    {maker}
                  </Reveal>
                ))}
              </ul>
              <Reveal variant="fade" as="div" className="fp-corner-slot" delay={section.makers.length * 56 + 40}>
                <CornerLabel href={section.href} label={section.label} ariaLabel={section.ariaLabel} />
              </Reveal>
            </div>
          </section>
        ))}

        {/* 6. Présentation Aderspace — vidéo plein écran */}
        <section id="home-pitch" className="fp-section fp-section--dark fp-section--pitch" aria-label="Présentation d'Aderspace">
          <div className="fp-section__bg">
            <video className="fp-bg-video" autoPlay muted loop playsInline preload="metadata">
              <source src="/videos/pitch.mp4" type="video/mp4" />
            </video>
          </div>
        </section>
      </div>
    </>
  )
}
