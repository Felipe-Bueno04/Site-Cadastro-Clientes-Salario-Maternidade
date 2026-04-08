import { getServerSession } from "next-auth"
import { authOptions } from "./auth"

export async function getAdminId(): Promise<string> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    throw new Error("Não autenticado")
  }

  // ADMIN → usa o próprio id
  if (session.user.role === "ADMIN") {
    return session.user.id
  }

  // PARCEIRO → precisa ter adminId
  if (!session.user.adminId) {
    throw new Error("Parceiro sem admin vinculado")
  }

  return session.user.adminId
}