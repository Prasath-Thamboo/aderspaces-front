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
        Aderspace imagine des espaces de travail où chaque meuble est choisi avec exigence. Nous
        sélectionnons du mobilier de bureau design et durable — bureaux, sièges et rangements — auprès
        de fabricants européens, pour des équipements pensés pour durer plutôt que pour être remplacés.
      </p>
      <p style={{ marginTop: "1.25rem", color: "#3a362f", maxWidth: "60ch", lineHeight: 1.8 }}>
        Basés en France, nous hébergeons nos données en Union Européenne et construisons Aderspace
        avec des outils ouverts, dans le respect du RGPD.
      </p>
      <p style={{ marginTop: "1.25rem", color: "#3a362f", maxWidth: "60ch", lineHeight: 1.8 }}>
        Notre mobilier vient de fabricants européens choisis un à un —{" "}
        <a href="/nos-fournisseurs">découvrez leur provenance</a>.
      </p>
    </article>
  )
}
