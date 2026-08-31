import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "ADMIN" | "PARCEIRO"
      adminId?: string | null
      adminCode?: string | null
      name?: string | null
      email?: string | null
    }
  }

  interface User {
    id: string
    role: "ADMIN" | "PARCEIRO"
    adminId?: string | null
    adminCode?: string | null
    name?: string | null
    email?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "ADMIN" | "PARCEIRO"
    adminId?: string | null
    adminCode?: string | null
    name?: string | null
  }
}

export {}