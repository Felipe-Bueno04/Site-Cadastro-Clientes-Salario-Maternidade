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
      instagram: data.instagram || null,
      origemParceira: data.origemParceira || null,

      recebeBolsaFamilia: data.recebeBolsaFamilia ?? false,

      dataProvavelParto: data.dataProvavelParto
        ? new Date(data.dataProvavelParto)
        : null,

      tempoGestacaoSemanas: data.tempoGestacaoSemanas || null,

      possuiSenhaGov: data.possuiSenhaGov ?? false,
      senhaGov: data.senhaGov || null,

      statusCliente: data.statusCliente || "ATIVA",
      faseProcesso: data.faseProcesso || "CADASTRO",
      statusContrato: data.statusContrato || "NAO_ENVIADO",
      statusNascimento: data.statusNascimento || "AGUARDANDO",

      observacoes: data.observacoes || null,

      dataCadastro: new Date(),
    },
  })

  return NextResponse.json(cliente)
}