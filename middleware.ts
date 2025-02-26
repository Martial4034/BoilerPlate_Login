import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")
  const currentPath = request.nextUrl.pathname

  // Liste des chemins publics
  const publicPaths = ["/login", "/signup"]
  const isPublicPath = publicPaths.includes(currentPath)

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (!session && !isPublicPath) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", currentPath)
    return NextResponse.redirect(url)
  }

  // Si l'utilisateur est connecté et essaie d'accéder à login/signup
  if (session && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

// Configuration des chemins sur lesquels le middleware s'applique
export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
} 