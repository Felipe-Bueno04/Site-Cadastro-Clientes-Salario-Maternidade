import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return new Response("Não autorizado", { status: 401 })
  }

  const body = await request.json()

  const adminId =
    session.user.role === "ADMIN"
      ? session.user.id
      : session.user.adminId

  if (!adminId) {
    return new Response("Admin não encontrado", { status: 400 })
  }

  await prisma.cliente.create({
    data: {
      ...body,
      dataCadastro: new Date(),
      adminId: adminId,
    },
  })

  return Response.json({ success: true })
}