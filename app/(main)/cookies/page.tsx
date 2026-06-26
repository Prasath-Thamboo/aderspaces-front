import type { Metadata } from "next"

export const metadata: Metadata = { title: "Politique cookies" }

export default function CookiesPage() {
  return (
    <article className="legal-page">
      <h1>Politique de gestion des cookies</h1>
      <p className="legal-date">Dernière mise à jour : 1er janvier 2025</p>

      <section>
        <h2>Qu&apos;est-ce qu&apos;un cookie ?</h2>
        <p>
          Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, mobile, tablette)
          lors de la visite d&apos;un site web. Il permet au site de mémoriser des informations vous concernant.
        </p>
      </section>

      <section>
        <h2>Cookies que nous utilisons</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #e5e5e5" }}>Nom</th>
              <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #e5e5e5" }}>Type</th>
              <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #e5e5e5" }}>Durée</th>
              <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #e5e5e5" }}>Finalité</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "0.5rem", border: "1px solid #e5e5e5" }}>maisonprint_cart</td>
              <td style={{ padding: "0.5rem", border: "1px solid #e5e5e5" }}>Essentiel</td>
              <td style={{ padding: "0.5rem", border: "1px solid #e5e5e5" }}>30 jours</td>
              <td style={{ padding: "0.5rem", border: "1px solid #e5e5e5" }}>Mémorisation du panier</td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem", border: "1px solid #e5e5e5" }}>maisonprint_consent</td>
              <td style={{ padding: "0.5rem", border: "1px solid #e5e5e5" }}>Essentiel</td>
              <td style={{ padding: "0.5rem", border: "1px solid #e5e5e5" }}>1 an</td>
              <td style={{ padding: "0.5rem", border: "1px solid #e5e5e5" }}>Mémorisation de vos préférences cookies</td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: "1rem", color: "#666", fontSize: "0.9rem" }}>
          Nous n&apos;utilisons pas actuellement de cookies analytiques ou publicitaires sans votre consentement explicite.
        </p>
      </section>

      <section>
        <h2>Comment gérer vos cookies</h2>
        <p>
          Vous pouvez modifier vos préférences à tout moment en cliquant sur le lien
          « Paramètres cookies » en bas de chaque page, ou en configurant votre navigateur :
        </p>
        <ul>
          <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
          <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
          <li><a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
        </ul>
        <p>
          La désactivation des cookies essentiels peut nuire au bon fonctionnement du site
          (panier, session, etc.).
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>Pour toute question : dpo@maisonprint.fr</p>
      </section>
    </article>
  )
}
