import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const formData = await request.formData()

  const nomeCompleto = formData.get("nomeCompleto") as string
  const cpf = formData.get("cpf") as string
  const telefone = formData.get("telefone") as string
  const email = formData.get("email") as string

  await prisma.cliente.update({
    where: {
      idCliente: id,
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
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  await prisma.cliente.delete({
    where: {
      idCliente: id,
    },
  })

  return NextResponse.json({ success: true })
}