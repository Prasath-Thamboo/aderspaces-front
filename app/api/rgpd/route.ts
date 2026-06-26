import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { email, type, message } = await req.json()

    if (!email || !type) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 })
    }

    // En production : envoyer via Brevo au DPO
    // Pour l'instant, on log la demande (à remplacer par l'envoi email Brevo)
    console.log(`[RGPD] Demande reçue — type: ${type}, email: ${email}, message: ${message}`)

    // TODO: Envoyer un email au DPO via Brevo
    // const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
    // await apiInstance.sendTransacEmail({ ... })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[RGPD]", error)
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
  }
}
