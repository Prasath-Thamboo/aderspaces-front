import type { Metadata } from "next"

export const metadata: Metadata = { title: "Conditions Générales de Vente" }

export default function CgvPage() {
  return (
    <article className="legal-page">
      <h1>Conditions Générales de Vente</h1>
      <p className="legal-date">En vigueur au 1er janvier 2025</p>

      <section>
        <h2>Article 1 — Objet</h2>
        <p>
          Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre
          MaisonPrint SAS (ci-après « le Vendeur ») et tout acheteur (ci-après « le Client ») effectuant
          un achat sur le site maisonprint.fr.
        </p>
      </section>

      <section>
        <h2>Article 2 — Prix</h2>
        <p>
          Tous les prix sont exprimés en euros TTC (TVA française incluse au taux applicable). Le Vendeur
          se réserve le droit de modifier ses prix à tout moment, étant entendu que le prix figurant au
          catalogue le jour de la commande sera le seul applicable au Client.
        </p>
      </section>

      <section>
        <h2>Article 3 — Commande</h2>
        <p>
          La commande n&apos;est définitive qu&apos;après confirmation du paiement. Le Vendeur se réserve
          le droit d&apos;annuler ou de refuser toute commande d&apos;un Client avec lequel il existerait
          un litige relatif au paiement d&apos;une commande antérieure.
        </p>
      </section>

      <section>
        <h2>Article 4 — Livraison</h2>
        <p>
          Les produits sont livrés à l&apos;adresse indiquée lors de la commande, en France métropolitaine.
          Les délais de livraison sont indiqués à titre indicatif et ne constituent pas un délai de rigueur.
          En cas de retard, le Client pourra demander la résolution de la vente.
        </p>
      </section>

      <section>
        <h2>Article 5 — Droit de rétractation</h2>
        <p>
          Conformément à l&apos;article L.221-18 du Code de la consommation, le Client dispose d&apos;un
          délai de 14 jours francs pour exercer son droit de rétractation sans motif ni pénalité, à compter
          de la réception des produits. Le retour des produits est à la charge du Client.
        </p>
      </section>

      <section>
        <h2>Article 6 — Garanties</h2>
        <p>
          Tous les produits bénéficient de la garantie légale de conformité (articles L.217-4 et suivants
          du Code de la consommation) et de la garantie des vices cachés (articles 1641 et suivants du
          Code civil).
        </p>
      </section>

      <section>
        <h2>Article 7 — Protection des données</h2>
        <p>
          Les informations collectées lors de la commande sont nécessaires au traitement de celle-ci.
          Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression
          de vos données. Voir notre <a href="/politique-confidentialite">Politique de confidentialité</a>.
        </p>
      </section>

      <section>
        <h2>Article 8 — Droit applicable</h2>
        <p>
          Les présentes CGV sont soumises au droit français. Tout litige relatif à leur interprétation
          et/ou leur exécution relève de la compétence des tribunaux français.
        </p>
      </section>
    </article>
  )
}
