import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { NextAuthOptions } from "next-auth"

type AuthUser = {
        id: string
        email: string
        name?: string | null
        role: "ADMIN" | "PARCEIRO"
        adminId?: string | null
        adminCode?: string | null
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
    maxAge: 5 * 60, // 5 minutos
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Senha", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) return null

        const isValid = await compare(
          credentials.password,
          user.password
        )

        if (!isValid) return null

        const authUser: AuthUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          adminId: user.adminId,
          adminCode: user.adminCode
        }

        return authUser
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.adminId = user.adminId ?? null
        token.adminCode = user.adminCode ?? null
        token.name = user.name
      }
      return token
    },

    async session({ session, token }) {
      if(session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as "ADMIN" | "PARCEIRO"
        session.user.adminId = token.adminId ?? null
        session.user.adminCode = token.adminCode ?? null
        session.user.name = token.name
      }

      return session
    }
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
}