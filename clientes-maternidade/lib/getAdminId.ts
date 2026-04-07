import { getServerSession } from "next-auth"
import { authOptions } from "./auth"

export async function getAdminId() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    throw new Error("Não autenticado")
  }

  // Se for ADMIN → ele mesmo
  if (session.user.role === "ADMIN") {
    return session.user.id
  }

  // Se for PARCEIRO → retorna o admin dele
  return session.user.adminId
}