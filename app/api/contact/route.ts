import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 })
    }

    // En production : envoyer via Brevo au support
    // Pour l'instant, on log le message
    console.log(`[Contact] Nouveau message — nom: ${name}, email: ${email}`)
    console.log(`[Contact] Message: ${message}`)

    // TODO: Remplacer par un appel à l'API Brevo via le backend Medusa
    // ou directement via @getbrevo/brevo dans une Server Action

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Contact]", error)
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
  }
}
