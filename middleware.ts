import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rutas que no requieren autenticación
const publicRoutes = [
  "/login",
  // Rutas compartidas
  "/shared",
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar si la ruta es pública o comienza con /shared/
  const isPublicRoute = publicRoutes.some((route) => pathname === route) || pathname.startsWith("/shared/")

  // Si la ruta es pública, permitir acceso sin verificación
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Verificar si hay un token en las cookies
  const token = request.cookies.get("auth_token")?.value

  // Si no hay token y no es una ruta pública, redirigir al login
  if (!token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  // Si hay token, permitir acceso
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
