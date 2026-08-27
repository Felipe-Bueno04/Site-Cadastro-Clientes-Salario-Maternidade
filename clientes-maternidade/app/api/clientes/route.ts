import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic" // 🔥 evita cache

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return new Response("Não autorizado", { status: 401 })
  }

  const adminId =
    session.user.role === "ADMIN"
      ? session.user.id
      : session.user.adminId

  if (!adminId) {
    return new Response("AdminId inválido", { status: 400 })
  }

  const clientes = await prisma.cliente.findMany({
    where: {
      adminId: adminId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return NextResponse.json(clientes)
}

export async function POST(request: Request) {
  const body = await request.json()

  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return new Response("Não autorizado!", { status: 401 })
  }

  const adminId =
    session.user.role === "ADMIN"
      ? session.user.id
      : session.user.adminId

  if (!adminId) {
    return new Response("Admin não encontrado!", { status: 400 })
  }

  await prisma.cliente.create({
    data: {
      nomeCompleto: body.nomeCompleto,
      cpf: body.cpf,
      telefone: body.telefone,
      email: body.email,
      instagram: body.instagram,
      recebeBolsaFamilia: body.recebeBolsaFamilia,
      tempoGestacaoSemanas: body.tempoGestacaoSemanas,
      possuiSenhaGov: body.possuiSenhaGov,
      senhaGov: body.senhaGov,
      statusCliente: body.statusCliente,
      faseProcesso: body.faseProcesso,
      statusContrato: body.statusContrato,
      statusNascimento: body.statusNascimento,
      observacoes: body.observacoes,

      dataProvavelParto: new Date(body.dataProvavelParto),

      adminId: adminId,
      criadoPor: session.user.name,
      dataCadastro: new Date(),
    }
  })

  return Response.json({ success: true })
}