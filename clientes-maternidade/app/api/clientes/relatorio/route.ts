import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import ExcelJS from "exceljs"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
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

  const { searchParams } = new URL(request.url)
  const mesParto = searchParams.get("mesParto")

  if (!mesParto) {
    return new Response("Mês do parto é obrigatório", { status: 400 })
  }

  const mes = Number(mesParto)

  if (mes < 1 || mes > 12) {
    return new Response("Mês inválido", { status: 400 })
  }

  const clientesDoMes = await prisma.$queryRaw<{ idCliente: string }[]>`
    SELECT "idCliente"
    FROM "Cliente"
    WHERE "adminId" = ${adminId}
      AND "dataProvavelParto" IS NOT NULL
      AND EXTRACT(MONTH FROM "dataProvavelParto") = ${mes}
  `

  const ids = clientesDoMes.map((cliente) => cliente.idCliente)

  const clientes = await prisma.cliente.findMany({
    where: {
      idCliente: {
        in: ids,
      },
    },
    orderBy: {
      dataProvavelParto: "asc",
    },
  })

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Relatório de Nascimentos")

  worksheet.columns = [
    { header: "Nome", key: "nomeCompleto", width: 30 },
    { header: "CPF", key: "cpf", width: 20 },
    { header: "Telefone", key: "telefone", width: 20 },
    { header: "Data Provável Parto", key: "dataProvavelParto", width: 20 },
    { header: "Status", key: "statusCliente", width: 15 },
    { header: "Fase", key: "faseProcesso", width: 15 },
    { header: "Status Nascimento", key: "statusNascimento", width: 20 },
  ]

  clientes.forEach((cliente) => {
    worksheet.addRow({
      nomeCompleto: cliente.nomeCompleto,
      cpf: cliente.cpf,
      telefone: cliente.telefone,
      dataProvavelParto: cliente.dataProvavelParto
        ? new Date(cliente.dataProvavelParto).toLocaleDateString("pt-BR")
        : "",
      statusCliente: cliente.statusCliente,
      faseProcesso: cliente.faseProcesso,
      statusNascimento: cliente.statusNascimento,
    })
  })

  const headerRow = worksheet.getRow(1)
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } }
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF374151" },
  }

  const totalRow = worksheet.addRow({
    nomeCompleto: `Total: ${clientes.length} nascimentos`,
  })
  totalRow.font = { bold: true }

  const buffer = await workbook.xlsx.writeBuffer()

  const mesNomes = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ]

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="relatorio-nascimentos-${mesNomes[mes - 1]}.xlsx"`,
    },
  })
}