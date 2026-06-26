import type { Metadata } from "next"

export const metadata: Metadata = { title: "Mentions légales" }

export default function MentionsLegalesPage() {
  return (
    <article className="legal-page">
      <h1>Mentions légales</h1>

      <section>
        <h2>Éditeur du site</h2>
        <p>
          <strong>MaisonPrint SAS</strong><br />
          Siège social : 12 rue de l&apos;Innovation, 75001 Paris<br />
          Capital social : 10 000 €<br />
          SIREN : XXX XXX XXX (à compléter)<br />
          TVA intracommunautaire : FR XX XXXXXXXXX<br />
          Directeur de la publication : [Nom du dirigeant]<br />
          Contact : contact@maisonprint.fr
        </p>
      </section>

      <section>
        <h2>Hébergement</h2>
        <p>
          Ce site est hébergé par :<br />
          [Nom de l&apos;hébergeur], [Adresse], [Pays]
        </p>
      </section>

      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble des contenus présents sur ce site (textes, images, logos, icônes) sont la propriété exclusive
          de MaisonPrint SAS ou de ses partenaires et sont protégés par le droit d&apos;auteur français et
          international. Toute reproduction, même partielle, est interdite sans autorisation préalable écrite.
        </p>
      </section>

      <section>
        <h2>Limitation de responsabilité</h2>
        <p>
          MaisonPrint SAS s&apos;efforce d&apos;assurer l&apos;exactitude des informations diffusées sur ce site.
          Toutefois, elle ne peut garantir l&apos;exactitude, la complétude ou l&apos;actualité des informations
          et décline toute responsabilité pour les dommages résultant d&apos;une utilisation du site.
        </p>
      </section>

      <section>
        <h2>Droit applicable</h2>
        <p>
          Les présentes mentions légales sont soumises au droit français. Tout litige sera de la compétence
          exclusive des tribunaux français.
        </p>
      </section>
    </article>
  )
}
