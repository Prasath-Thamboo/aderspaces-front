import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "À propos",
  description: "L'histoire et la philosophie d'Aderspace.",
}

export default function AProposPage() {
  return (
    <article className="legal-page">
      <h1>À propos d&apos;Aderspace</h1>
      <p style={{ marginTop: "0.75rem", color: "#3a362f", maxWidth: "60ch", lineHeight: 1.8 }}>
        Aderspace imagine des espaces de travail où le mobilier, la technologie et l&apos;impression
        se répondent avec exigence. Nous sélectionnons du mobilier de bureau moderne, des ordinateurs
        et des imprimantes durables, et accompagnons chaque équipement avec un service de réparation
        pensé pour prolonger sa vie plutôt que le remplacer.
      </p>
      <p style={{ marginTop: "1.25rem", color: "#3a362f", maxWidth: "60ch", lineHeight: 1.8 }}>
        Basés en France, nous hébergeons nos données en Union Européenne et construisons Aderspace
        avec des outils ouverts, dans le respect du RGPD.
      </p>
    </article>
  )
}
