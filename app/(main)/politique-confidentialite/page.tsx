import type { Metadata } from "next"

export const metadata: Metadata = { title: "Politique de confidentialité" }

export default function PolitiqueConfidentialitePage() {
  return (
    <article className="legal-page">
      <h1>Politique de confidentialité</h1>
      <p className="legal-date">Dernière mise à jour : 1er janvier 2025</p>

      <section>
        <h2>1. Responsable du traitement</h2>
        <p>
          MaisonPrint SAS, 12 rue de l&apos;Innovation, 75001 Paris<br />
          Email : dpo@maisonprint.fr
        </p>
      </section>

      <section>
        <h2>2. Données collectées</h2>
        <p>Nous collectons les données suivantes lors de vos achats et visites :</p>
        <ul>
          <li>Données d&apos;identification : nom, prénom, adresse email</li>
          <li>Données de livraison : adresse postale, numéro de téléphone</li>
          <li>Données de paiement : traitées par notre prestataire de paiement sécurisé (nous ne stockons pas vos données bancaires)</li>
          <li>Données de navigation : adresse IP, pages visitées, navigateur (via cookies)</li>
        </ul>
      </section>

      <section>
        <h2>3. Finalités et bases légales</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #e5e5e5" }}>Finalité</th>
              <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #e5e5e5" }}>Base légale</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "0.5rem", border: "1px solid #e5e5e5" }}>Traitement des commandes</td>
              <td style={{ padding: "0.5rem", border: "1px solid #e5e5e5" }}>Exécution du contrat</td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem", border: "1px solid #e5e5e5" }}>Envoi d&apos;emails transactionnels</td>
              <td style={{ padding: "0.5rem", border: "1px solid #e5e5e5" }}>Exécution du contrat</td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem", border: "1px solid #e5e5e5" }}>Mesure d&apos;audience</td>
              <td style={{ padding: "0.5rem", border: "1px solid #e5e5e5" }}>Consentement</td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem", border: "1px solid #e5e5e5" }}>Marketing</td>
              <td style={{ padding: "0.5rem", border: "1px solid #e5e5e5" }}>Consentement</td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem", border: "1px solid #e5e5e5" }}>Obligations légales (comptabilité)</td>
              <td style={{ padding: "0.5rem", border: "1px solid #e5e5e5" }}>Obligation légale</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>4. Destinataires des données</h2>
        <p>
          Vos données sont transmises aux prestataires suivants dans le cadre du traitement de vos commandes :
          prestataire de paiement, transporteur, outil d&apos;emailing (Brevo/Sendinblue). Aucune donnée n&apos;est
          vendue à des tiers.
        </p>
      </section>

      <section>
        <h2>5. Durée de conservation</h2>
        <ul>
          <li>Données de commande : 10 ans (obligation légale comptable)</li>
          <li>Données clients sans achat : 3 ans après le dernier contact</li>
          <li>Cookies : selon la durée définie dans notre <a href="/cookies">politique cookies</a></li>
        </ul>
      </section>

      <section>
        <h2>6. Vos droits</h2>
        <p>
          Conformément au RGPD (Règlement UE 2016/679) et à la loi Informatique et Libertés, vous disposez
          des droits suivants sur vos données personnelles :
        </p>
        <ul>
          <li>Droit d&apos;accès</li>
          <li>Droit de rectification</li>
          <li>Droit à l&apos;effacement (« droit à l&apos;oubli »)</li>
          <li>Droit à la portabilité</li>
          <li>Droit d&apos;opposition</li>
          <li>Droit à la limitation du traitement</li>
        </ul>
        <p>
          Pour exercer ces droits : <a href="/mes-droits">formulaire de demande RGPD</a> ou par email à dpo@maisonprint.fr.
          Vous pouvez également contacter la CNIL (www.cnil.fr) en cas de litige.
        </p>
      </section>

      <section>
        <h2>7. Transferts hors UE</h2>
        <p>
          Vos données sont traitées au sein de l&apos;Union européenne. En cas de transfert hors UE,
          des garanties appropriées (clauses contractuelles types) sont mises en œuvre.
        </p>
      </section>
    </article>
  )
}
