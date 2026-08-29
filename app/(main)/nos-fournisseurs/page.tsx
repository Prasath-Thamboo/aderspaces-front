import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nos fournisseurs",
  description:
    "La provenance de notre mobilier de bureau : fabricants italiens, lituaniens et polonais sélectionnés par Aderspace.",
}

type Supplier = {
  name: string
  note: string
}

type Origin = {
  country: string
  flag: string
  intro: string
  suppliers: Supplier[]
}

const origins: Origin[] = [
  {
    country: "Italie",
    flag: "🇮🇹",
    intro:
      "Le cœur de notre sélection. La tradition italienne du mobilier de bureau associe recherche esthétique, finitions soignées et systèmes évolutifs.",
    suppliers: [
      {
        name: "Quadrifoglio",
        note: "Groupe basé dans la région de Pordenone, l'un des plus grands fabricants italiens de mobilier de bureau opérationnel et collaboratif.",
      },
      {
        name: "Sinetica",
        note: "Fabricant de la région de Trévise, reconnu pour ses bureaux de direction et ses cloisons au design contemporain.",
      },
      {
        name: "Estel",
        note: "Maison vénète (Thiene) qui décloisonne bureau et espaces de vie, avec une forte culture du projet sur mesure.",
      },
      {
        name: "Manerba",
        note: "Fabricant lombard (Guidizzolo) spécialisé dans les systèmes de bureaux, rangements et open spaces.",
      },
      {
        name: "Frezza",
        note: "Marque de Trévise, mobilier exécutif et opératif haut de gamme, aujourd'hui au sein du groupe Quadrifoglio.",
      },
      {
        name: "Las Mobili",
        note: "Fabricant de la province de Brescia, gammes opératives et bench pensées pour les aménagements de grande série.",
      },
    ],
  },
  {
    country: "Lituanie",
    flag: "🇱🇹",
    intro:
      "Une industrie récente et très intégrée, tournée vers l'export européen et les certifications environnementales.",
    suppliers: [
      {
        name: "Narbutas",
        note: "Fabricant de Vilnius, mobilier de bureau moderne exporté dans toute l'Europe, avec un fort engagement sur l'éco-conception.",
      },
    ],
  },
  {
    country: "Pologne",
    flag: "🇵🇱",
    intro:
      "Un pôle industriel majeur du mobilier de bureau en Europe, réputé pour son rapport qualité-prix et sa capacité de production.",
    suppliers: [
      {
        name: "Nowy Styl",
        note: "Groupe de Krosno, l'un des premiers fabricants de mobilier et de sièges de bureau en Europe.",
      },
      {
        name: "MDD",
        note: "Fabricant polonais au positionnement design, bureaux, bench et cloisons acoustiques.",
      },
      {
        name: "Bejot",
        note: "Spécialiste du siège (région de Poznań) : fauteuils de bureau, sièges visiteurs et solutions pour espaces collectifs.",
      },
    ],
  },
]

export default function NosFournisseursPage() {
  return (
    <article className="legal-page">
      <h1>Nos fournisseurs</h1>
      <p style={{ marginTop: "0.75rem", color: "#3a362f", maxWidth: "62ch", lineHeight: 1.8 }}>
        Notre mobilier de bureau provient de fabricants européens sélectionnés pour la qualité de leur
        conception, la durabilité de leurs produits et leur engagement environnemental. Voici d&apos;où
        vient ce que nous vous proposons.
      </p>

      {origins.map((origin) => (
        <section key={origin.country} id={origin.country.toLowerCase()} style={{ scrollMarginTop: "6rem" }}>
          <h2>
            <span aria-hidden="true" style={{ marginRight: "0.4rem" }}>{origin.flag}</span>
            {origin.country}
          </h2>
          <p style={{ maxWidth: "62ch" }}>{origin.intro}</p>
          <div className="suppliers-grid">
            {origin.suppliers.map((s) => (
              <div className="supplier-card" key={s.name}>
                <h3>{s.name}</h3>
                <p>{s.note}</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section>
        <p style={{ color: "var(--color-neutral)", fontSize: "0.9rem", maxWidth: "62ch" }}>
          Les marques citées restent la propriété de leurs fabricants respectifs. La disponibilité des
          gammes varie selon les saisons et les collections.
        </p>
      </section>
    </article>
  )
}
