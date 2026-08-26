"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"

type Mode = "login" | "register"

export function AuthDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<Mode>("login")
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [registerForm, setRegisterForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [open, onClose])

  if (!open) return null

  const switchMode = (m: Mode) => {
    setMode(m)
    setStatus("idle")
    setError("")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setError("")
    try {
      await login(loginForm.email, loginForm.password)
      onClose()
    } catch {
      setStatus("error")
      setError("Email ou mot de passe incorrect.")
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (registerForm.password !== registerForm.passwordConfirm) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }
    if (registerForm.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.")
      return
    }

    setStatus("loading")
    try {
      await register({
        email: registerForm.email,
        password: registerForm.password,
        first_name: registerForm.first_name,
        last_name: registerForm.last_name,
      })
      onClose()
    } catch {
      setStatus("error")
      setError("Impossible de créer le compte. Cet email est peut-être déjà utilisé.")
    }
  }

  return (
    <>
      <div className="auth-overlay" onClick={onClose} aria-hidden="true" />
      <aside className="auth-drawer" aria-label={mode === "login" ? "Connexion" : "Créer un compte"}>
        <div className="auth-drawer-header">
          <h2>{mode === "login" ? "Connexion" : "Créer un compte"}</h2>
          <button onClick={onClose} aria-label="Fermer" className="cart-close-btn">✕</button>
        </div>

        <div className="auth-drawer-body">
          {mode === "login" ? (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="auth-email">Email *</label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="votre@email.fr"
                />
              </div>
              <div className="form-group">
                <label htmlFor="auth-password">Mot de passe *</label>
                <input
                  id="auth-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                />
              </div>

              {status === "error" && <p className="auth-error">{error}</p>}

              <button type="submit" disabled={status === "loading"} className="btn-submit auth-submit">
                {status === "loading" ? "Connexion…" : "Se connecter"}
              </button>

              <p className="auth-switch-note">
                <a href="/mot-de-passe-oublie" onClick={onClose}>Mot de passe oublié ?</a>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="auth-form-row">
                <div className="form-group">
                  <label htmlFor="auth-first-name">Prénom *</label>
                  <input
                    id="auth-first-name"
                    type="text"
                    required
                    autoComplete="given-name"
                    value={registerForm.first_name}
                    onChange={(e) => setRegisterForm((f) => ({ ...f, first_name: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="auth-last-name">Nom *</label>
                  <input
                    id="auth-last-name"
                    type="text"
                    required
                    autoComplete="family-name"
                    value={registerForm.last_name}
                    onChange={(e) => setRegisterForm((f) => ({ ...f, last_name: e.target.value }))}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="auth-reg-email">Email *</label>
                <input
                  id="auth-reg-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="votre@email.fr"
                />
              </div>
              <div className="form-group">
                <label htmlFor="auth-reg-password">Mot de passe *</label>
                <input
                  id="auth-reg-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="8 caractères minimum"
                />
              </div>
              <div className="form-group">
                <label htmlFor="auth-reg-password-confirm">Confirmer le mot de passe *</label>
                <input
                  id="auth-reg-password-confirm"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={registerForm.passwordConfirm}
                  onChange={(e) => setRegisterForm((f) => ({ ...f, passwordConfirm: e.target.value }))}
                />
              </div>

              {error && <p className="auth-error">{error}</p>}

              <button type="submit" disabled={status === "loading"} className="btn-submit auth-submit">
                {status === "loading" ? "Création…" : "Créer mon compte"}
              </button>
            </form>
          )}
        </div>

        <div className="auth-drawer-footer">
          {mode === "login" ? (
            <p>
              Pas encore de compte ?{" "}
              <button type="button" className="auth-switch-btn" onClick={() => switchMode("register")}>
                Créer un compte
              </button>
            </p>
          ) : (
            <p>
              Déjà un compte ?{" "}
              <button type="button" className="auth-switch-btn" onClick={() => switchMode("login")}>
                Se connecter
              </button>
            </p>
          )}
        </div>
      </aside>
    </>
  )
}
