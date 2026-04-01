declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "ADMIN" | "PARCEIRO"
      name?: string | null
      email?: string | null
    }
  }

  interface User {
    role: "ADMIN" | "PARCEIRO"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "ADMIN" | "PARCEIRO"
  }
}

export {}