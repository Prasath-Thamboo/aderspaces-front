"use client"

import { useState, useEffect } from "react"

type Consent = { analytics: boolean; marketing: boolean }

const COOKIE_NAME = "maisonprint_consent"

function getConsent(): Consent | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]+)`))
  if (!match) return null
  try { return JSON.parse(decodeURIComponent(match[1])) } catch { return null }
}

function saveConsent(consent: Consent) {
  const value = encodeURIComponent(JSON.stringify(consent))
  document.cookie = `${COOKIE_NAME}=${value}; max-age=${60 * 60 * 24 * 365}; path=/; SameSite=Lax`
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [prefs, setPrefs] = useState<Consent>({ analytics: false, marketing: false })

  useEffect(() => {
    if (getConsent() === null) setVisible(true)
  }, [])

  if (!visible) return null

  const accept = () => { saveConsent({ analytics: true, marketing: true }); setVisible(false) }
  const refuse = () => { saveConsent({ analytics: false, marketing: false }); setVisible(false) }
  const save = () => { saveConsent(prefs); setVisible(false) }

  return (
    <div className="cookie-banner" role="dialog" aria-label="Paramètres de cookies" aria-modal="false">
      <div className="cookie-banner-content">
        <p>
          Nous utilisons des cookies pour améliorer votre expérience.{" "}
          <a href="/cookies">En savoir plus</a>
        </p>

        {showDetails && (
          <div className="cookie-details">
            <label>
              <input type="checkbox" checked disabled /> Cookies essentiels (obligatoires)
            </label>
            <label>
              <input
                type="checkbox"
                checked={prefs.analytics}
                onChange={(e) => setPrefs((p) => ({ ...p, analytics: e.target.checked }))}
              />
              Cookies analytiques (mesure d&apos;audience)
            </label>
            <label>
              <input
                type="checkbox"
                checked={prefs.marketing}
                onChange={(e) => setPrefs((p) => ({ ...p, marketing: e.target.checked }))}
              />
              Cookies marketing (publicité personnalisée)
            </label>
          </div>
        )}

        <div className="cookie-actions">
          <button onClick={accept} className="btn-primary">Tout accepter</button>
          {showDetails ? (
            <button onClick={save} className="btn-secondary">Enregistrer</button>
          ) : (
            <button onClick={() => setShowDetails(true)} className="btn-secondary">Personnaliser</button>
          )}
          <button onClick={refuse} className="btn-text">Tout refuser</button>
        </div>
      </div>
    </div>
  )
}
