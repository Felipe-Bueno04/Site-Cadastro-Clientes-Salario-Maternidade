import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return new Response("Não autorizado", { status: 401 })
  }

  const adminId =
    session.user.role === "ADMIN"
      ? session.user.id
      : session.user.adminId

  if (!adminId) {
    return new Response("Admin não encontrado", { status: 400 })
  }

  const { id } = params
  const formData = await request.formData()

  const nomeCompleto = formData.get("nomeCompleto") as string
  const cpf = formData.get("cpf") as string
  const telefone = formData.get("telefone") as string
  const email = formData.get("email") as string

  await prisma.cliente.updateMany({
    where: {
      idCliente: id,
      adminId: adminId,
    },
    data: {
      nomeCompleto,
      cpf,
      telefone,
      email: email?.trim() || null,
    },
  })

  return NextResponse.redirect(
    new URL(`/clientes/${id}`, request.url)
  )
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return new Response("Não autorizado", { status: 401 })
  }

  const adminId =
    session.user.role === "ADMIN"
      ? session.user.id
      : session.user.adminId

  if (!adminId) {
    return new Response("Admin não encontrado", { status: 400 })
  }

  const { id } = params

  await prisma.cliente.deleteMany({
    where: {
      idCliente: id,
      adminId: adminId,
    },
  })

  return NextResponse.json({ success: true })
}