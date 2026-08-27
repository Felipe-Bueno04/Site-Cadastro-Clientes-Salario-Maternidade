import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware() {},
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        const adminRoutes = ["/financeiro", "/usuarios"]

        // Se não estiver logado → bloqueia
        if (!token) return false

        // Proteção por role (ADMIN)
        if (
          adminRoutes.some((route) => 
            pathname.startsWith(route)
          ) &&
          token.role !== "ADMIN"
        ) {
          return false
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: [
    "/dashboard", 
    "/clientes/:path*", 
    "/financeiro/:path*",
    "/usuarios/:path*"
  ],
}