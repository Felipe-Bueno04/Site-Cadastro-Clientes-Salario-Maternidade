import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware() {},
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Se não estiver logado → bloqueia
        if (!token) return false

        // Bloquear financeiro para parceiro
        if (
          pathname.startsWith("/financeiro") &&
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
  matcher: ["/dashboard", "/clientes", "/financeiro"],
}