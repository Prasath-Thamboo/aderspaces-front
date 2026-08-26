import { ScrollDots } from "@/components/home/ScrollDots"

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
  {
    id: "home-imprimantes",
    href: "/categories/imprimantes",
    video: "imprimantes",
    label: "Imprimantes",
    ariaLabel: "Découvrir les imprimantes",
  },
  {
    id: "home-cartouches",
    href: "/categories/encre-cartouches",
    video: "cartouches",
    label: "Encre & Cartouches",
    ariaLabel: "Découvrir l'encre et les cartouches",
  },
]

const REPARATION_SECTION: SectionSpec = {
  id: "home-reparation",
  href: "/reparation",
  video: "reparation",
  label: "Réparation",
  ariaLabel: "Découvrir le service de réparation",
}

function CornerLabel({ href, label, ariaLabel }: { href: string; label: string; ariaLabel: string }) {
  return (
    <a href={href} className="fp-corner-label" aria-label={ariaLabel}>
      {label}
      <span className="fp-corner-label__arrow" aria-hidden="true">→</span>
    </a>
  )
}

export default function HomePage() {
  return (
    <>
      <ScrollDots />
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

        {/* 2-4. Catégories produit — vidéo en fond, texte en capitale en bas à gauche */}
        {CATEGORY_SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className="fp-section fp-section--dark fp-section--feature" aria-label={section.label}>
            <div className="fp-section__bg">
              <video className="fp-bg-video" autoPlay muted loop playsInline preload="metadata">
                <source src={`/videos/${section.video}.mp4`} type="video/mp4" />
              </video>
            </div>
            <CornerLabel href={section.href} label={section.label} ariaLabel={section.ariaLabel} />
          </section>
        ))}

        {/* 5. Service de réparation — vidéo en fond, texte en capitale en bas à gauche */}
        <section id={REPARATION_SECTION.id} className="fp-section fp-section--dark fp-section--feature" aria-label={REPARATION_SECTION.label}>
          <div className="fp-section__bg">
            <video className="fp-bg-video" autoPlay muted loop playsInline preload="metadata">
              <source src={`/videos/${REPARATION_SECTION.video}.mp4`} type="video/mp4" />
            </video>
          </div>
          <CornerLabel href={REPARATION_SECTION.href} label={REPARATION_SECTION.label} ariaLabel={REPARATION_SECTION.ariaLabel} />
        </section>

        {/* 6. Présentation Aderspace — vidéo plein écran, sans texte ni image */}
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
