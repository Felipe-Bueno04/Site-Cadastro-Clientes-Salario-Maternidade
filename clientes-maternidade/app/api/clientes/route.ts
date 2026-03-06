import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const data = await req.json()

  const cliente = await prisma.cliente.create({
    data: {
      nomeCompleto: data.nomeCompleto,
      cpf: data.cpf,
      telefone: data.telefone,
      email: data.email || null,
      recebeBolsaFamilia: false,
      possuiSenhaGov: false,
      statusCliente: "ATIVA",
      faseProcesso: "CADASTRO",
      statusContrato: "NAO_ENVIADO",
      statusNascimento: "AGUARDANDO",
      dataCadastro: new Date(),
    },
  })

  return NextResponse.json(cliente)
}