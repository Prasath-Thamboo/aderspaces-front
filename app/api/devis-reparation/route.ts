import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, deviceType, description } = await req.json()

    if (!name || !email || !deviceType || !description) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 })
    }

    // TODO: Remplacer par un appel à l'API Brevo via le backend Medusa
    console.log(`[Devis réparation] nom: ${name}, email: ${email}, tél: ${phone ?? "-"}, appareil: ${deviceType}`)
    console.log(`[Devis réparation] Description: ${description}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Devis réparation]", error)
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
  }
}
