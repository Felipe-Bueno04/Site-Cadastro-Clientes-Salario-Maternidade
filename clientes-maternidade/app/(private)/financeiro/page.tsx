import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import Link from "next/link"
import { revalidatePath } from "next/cache"
import { getAdminId } from "@/lib/getAdminId"
import { notFound } from "next/navigation"
import PeriodoSelect from "./components/PeriodoSelect"

async function marcarComoPago(formData: FormData) {
  "use server"

  const adminId = await getAdminId()

  const pagamentoId = formData.get("pagamentoId") as string

  const pagamento = await prisma.pagamento.findFirst({
    where: {
      idPagamento: pagamentoId,
      cliente: {
        adminId: adminId
      },
    },
  })

  if (!pagamento) {
    notFound()
  }

  await prisma.pagamento.update({
    where: {
      idPagamento: pagamentoId,
    },
    data: {
      status: "PAGO",
      dataPagamento: new Date(),
    },
  })

  revalidatePath("/financeiro")
}

const meses = [
  { valor: "1", nome: "Janeiro" },
  { valor: "2", nome: "Fevereiro" },
  { valor: "3", nome: "Março" },
  { valor: "4", nome: "Abril" },
  { valor: "5", nome: "Maio" },
  { valor: "6", nome: "Junho" },
  { valor: "7", nome: "Julho" },
  { valor: "8", nome: "Agosto" },
  { valor: "9", nome: "Setembro" },
  { valor: "10", nome: "Outubro" },
  { valor: "11", nome: "Novembro" },
  { valor: "12", nome: "Dezembro" },
]

export default async function FinanceiroPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string
    cliente?: string
    alerta?: string
    mesPagamento?: string
    periodo?: "hoje" | "semana" | "mes" | "ano"
  }>
}) {
  const adminId = await getAdminId()

  const params = await searchParams
  
  const status = params?.status
  const clienteBusca = params?.cliente
  const alerta = params?.alerta
  const mesPagamento = params?.mesPagamento

  const hoje = new Date()
  hoje.setHours(0,0,0,0)

  function getPeriodoRange(periodo: string) {
    const inicio = new Date(hoje)
    const fim = new Date(hoje)
    fim.setHours(23, 59, 59, 999)

    switch (periodo) {
      case "hoje":
        return { inicio, fim }
      case "semana": {
        const diaSemana = hoje.getDay() // 0=Dom, 6=Sáb
        const diff = diaSemana === 0 ? 6 : diaSemana - 1 // Segunda=0
        inicio.setDate(hoje.getDate() - diff)
        inicio.setHours(0, 0, 0, 0)
        fim.setDate(inicio.getDate() + 6)
        fim.setHours(23, 59, 59, 999)
        return { inicio, fim }
      }
      case "mes": {
        inicio.setDate(1)
        inicio.setHours(0, 0, 0, 0)
        fim.setMonth(hoje.getMonth() + 1, 0) // último dia do mês
        fim.setHours(23, 59, 59, 999)
        return { inicio, fim }
      }
      case "ano": {
        inicio.setMonth(0, 1)
        inicio.setHours(0, 0, 0, 0)
        fim.setMonth(11, 31)
        fim.setHours(23, 59, 59, 999)
        return { inicio, fim }
      }
      default:
        return { inicio, fim }
    }
  }

  const periodo = params?.periodo || "hoje"  // DEFAULT: "hoje"
  const { inicio: periodoInicio, fim: periodoFim } = getPeriodoRange(periodo)

  const where: Prisma.PagamentoWhereInput = {}

  if (clienteBusca) {
    where.OR = [
      {
        cliente: {
          nomeCompleto: {
            contains: clienteBusca,
            mode: "insensitive"
          },
        },
      },
      {
        cliente: {
          cpf: {
            contains: clienteBusca
          },
        },
      },
    ]
  }

  if (alerta === "atrasados") {
    where.status = {
      not: "PAGO",
    }
    where.dataVencimento = {
      // lt = less than 
      lt: hoje
    }
  }

  if (alerta === "pendentes") {
    where.status = {
      not: "PAGO"
    }
    where.dataVencimento = {
      // gte = greater than or equal
      gte: hoje
    }
  }

  if (status === "PAGO") {
    where.status = "PAGO"
  }

   /*
   * FILTRO POR MÊS DO PAGAMENTO
   *
   * Considera apenas o mês de dataPagamento,
   * independentemente do ano.
   *
   * Exemplo:
   * Janeiro → pagamentos realizados em janeiro de qualquer ano.
   */
  if (mesPagamento) {
    const mes = Number(mesPagamento)

    if (mes >= 1 && mes <= 12) {
      const pagamentosDoMes = await prisma.$queryRaw<{ idPagamento: string }[]>`
        SELECT "idPagamento"
        FROM "Pagamento"
        WHERE "dataPagamento" IS NOT NULL
          AND EXTRACT(MONTH FROM "dataPagamento") = ${mes}
          AND "clienteId" IN (
            SELECT "idCliente"
            FROM "Cliente"
            WHERE "adminId" = ${adminId}
          )
      `

      const ids = pagamentosDoMes.map(
        (pagamento) => pagamento.idPagamento
      )

      where.idPagamento = {
        in: ids,
      }
    }
  }

  const pagamentos = await prisma.pagamento.findMany({
    where: {
      ...where,
      cliente: {
        adminId: adminId
      }
    },
    include: {
      cliente: {
        select: {
          idCliente: true,
          nomeCompleto: true,
          statusCliente: true
        }
      }
    },
    orderBy: {
      dataVencimento: "asc"
    }
  })

  const totalAtrasados = await prisma.pagamento.count({
    where: {
      status: {
        not: "PAGO"
      },
      dataVencimento: {
        // lt = less than 
        lt: hoje
      },
      cliente: {
        adminId: adminId
      }
    }
  })

  const faturamento = await prisma.pagamento.aggregate({
    where: {
      status: "PAGO",
      dataPagamento: {
        gte: periodoInicio,
        lte: periodoFim,
      },
      cliente: {
        adminId: adminId,
      },
    },
    _sum: {
      valor: true,
    },
  })

  const totalFaturamento = faturamento._sum.valor || 0

  const thStyle = {
    textAlign: "left" as const,
    padding: "14px 16px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
  }

  const tdStyle = {
    padding: "14px 16px",
    fontSize: "14px",
    color: "#111827",
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Inter, sans-serif" }}>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: "28px", fontWeight: 600 }}>Financeiro</h1>

        <Link href="/financeiro/novo">
          <button
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            + Novo Pagamento
          </button>
        </Link>
      </div>

      {/* ALERTAS */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >

        <Link
          href="/financeiro?alerta=atrasados"
          style={{ textDecoration: "none" }}
        >
          <div
            style={{
              background: "#fecaca",
              padding: "12px 16px",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            ⚠️ {totalAtrasados} pagamentos atrasados
          </div>
        </Link>
      </div>
      
      {/* PERÍODO DE FATURAMENTO */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontWeight: 500, color: "#374151" }}>Período:</span>
        
        <form method="GET" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {/* Preservar outros filtros */}
          <input type="hidden" name="status" value={status || ""} />
          <input type="hidden" name="alerta" value={alerta || ""} />
          <input type="hidden" name="cliente" value={clienteBusca || ""} />
          <input type="hidden" name="mesPagamento" value={mesPagamento || ""} />
          
          <PeriodoSelect></PeriodoSelect>
        </form>

        {/* CARD FATURAMENTO */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
            color: "white",
            padding: "16px 24px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(30, 58, 138, 0.3)",
            minWidth: "220px",
          }}
        >
          <div style={{ fontSize: "12px", opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Faturamento ({periodo === "hoje" ? "Hoje" : periodo === "semana" ? "Essa semana" : periodo === "mes" ? "Este mês" : "Este ano"})
          </div>
          <div style={{ fontSize: "28px", fontWeight: 700, marginTop: "4px" }}>
            R$ {totalFaturamento.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* FILTROS */}
      <form
        method="GET"
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >

        <input type="hidden" name="status" value={status || ""} />
        <input type="hidden" name="alerta" value={alerta || ""} />

        <input
          type="text"
          name="cliente"
          placeholder="Buscar por nome ou CPF..."
          defaultValue={clienteBusca || ""}
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            width: "300px",
            fontSize: "14px",
          }}
        />

        <select
          name="mesPagamento"
          defaultValue={mesPagamento || ""}
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            backgroundColor: "white",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          <option value="" disabled hidden>Mês do pagamento</option>

          {meses.map((mes) => (
            <option key={mes.valor} value={mes.valor}>
              {mes.nome}
            </option>
          ))}
        </select>

        <button
          type="submit"
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#111827",
            color: "white",
            cursor: "pointer",
          }}
        >
          Buscar
        </button>
      </form>

      {/* TABELA */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#f9fafb" }}>
            <tr>
              <th style={thStyle}>Cliente</th>
              <th style={thStyle}>Valor</th>
              <th style={thStyle}>Vencimento</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Ação</th>
            </tr>
          </thead>

          <tbody>
            {pagamentos.map((pagamento) => {
              const vencimento = new Date(pagamento.dataVencimento)

              const atrasado =
                pagamento.status !== "PAGO" &&
                new Date(pagamento.dataVencimento) < hoje

              const isInactive = pagamento.cliente?.statusCliente === "INATIVA";
              let corLinha = "transparent"

              if (pagamento.status === "PAGO") {
                corLinha = "#96eeb5" // verde claro
              } else if (atrasado) {
                corLinha = "#f1adad" // vermelho claro
              }

              if (isInactive) {
                corLinha = "#e5e7eb"; // gray-100
              }

              return (
                <tr
                  key={pagamento.idPagamento}
                  style={{
                    borderTop: "1px solid #f1f5f9",
                    backgroundColor: corLinha,
                  }}
                  className={atrasado ? "bg-red-200" : ""}
                >
                  <td style={tdStyle}>
                    <Link
                      href={`/financeiro/${pagamento.idPagamento}`}
                      style={{
                        color: "#2563eb",
                        fontWeight: 500,
                        textDecoration: "none",
                      }}
                    >
                      {pagamento.cliente?.nomeCompleto}
                    </Link>

                  </td>

                  <td style={tdStyle}>
                    R$ {pagamento.valor.toFixed(2)}
                  </td>

                  <td style={tdStyle}>
                    {vencimento.toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                  </td>

                  <td style={tdStyle}>
                    {pagamento.status}
                  </td>

                  <td style={tdStyle}>
                    {pagamento.status !== "PAGO" && (
                      <form action={marcarComoPago}>
                        <input
                          type="hidden"
                          name="pagamentoId"
                          value={pagamento.idPagamento}
                        />
                          <button
                            type="submit"
                            className="bg-green-600 text-white px-3 py-1 rounded"
                          >
                            Marcar como pago
                          </button>
                      </form>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}