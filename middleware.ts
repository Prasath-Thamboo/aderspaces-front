import { NextResponse, type NextRequest } from "next/server"

/**
 * Protection par mot de passe (HTTP Basic) du storefront, pour un déploiement
 * provisoire / de recette. Active uniquement si BASIC_AUTH_USER et
 * BASIC_AUTH_PASSWORD sont renseignées (variables serveur, lues au runtime) ;
 * sans elles le site est public, comme en local.
 */
export function middleware(request: NextRequest) {
  const user = process.env.BASIC_AUTH_USER
  const password = process.env.BASIC_AUTH_PASSWORD
  if (!user || !password) return NextResponse.next()

  const header = request.headers.get("authorization")
  if (header?.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6))
      const separator = decoded.indexOf(":")
      if (
        separator !== -1 &&
        decoded.slice(0, separator) === user &&
        decoded.slice(separator + 1) === password
      ) {
        return NextResponse.next()
      }
    } catch {
      // En-tête mal formé → traité comme non authentifié.
    }
  }

  return new NextResponse("Authentification requise.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Aderspace", charset="UTF-8"',
      "X-Robots-Tag": "noindex, nofollow",
    },
  })
}

export const config = {
  // Tout sauf les assets de build Next (hachés, sans contenu sensible).
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
