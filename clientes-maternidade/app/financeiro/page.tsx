import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import Link from "next/link"
import { revalidatePath } from "next/cache"

async function marcarComoPago(formData: FormData) {
  "use server"

  const pagamentoId = formData.get("pagamentoId") as string

  await prisma.pagamento.update({
    where: {
      id: pagamentoId
    },
    data: {
      status: "PAGO",
      dataPagamento: new Date()
    }
  })

  revalidatePath("/financeiro")
}

export default async function FinanceiroPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string
    cliente?: string
    alerta?: string
  }>
}) {

  const params = await searchParams
  
  const status = params?.status
  const clienteBusca = params?.cliente
  const alerta = params?.alerta

  const hoje = new Date()
  hoje.setHours(0,0,0,0)

  const where: Prisma.PagamentoWhereInput = {}

  if (clienteBusca) {
    where.OR = [
      {
        cliente: {
          nomeCompleto: {
            contains: clienteBusca,
            mode: "insensitive"
          }
        }
      },
      {
        cliente: {
          cpf: {
            contains: clienteBusca
          }
        }
      }
    ]
  }

  if (alerta === "atrasados") {

    where.status = {
      not: "PAGO"
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

  const pagamentos = await prisma.pagamento.findMany({
    where,
    include: {
      cliente: true
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
      }
    }
  })

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

              let corLinha = "transparent"

              if (pagamento.status === "PAGO") {
                corLinha = "#96eeb5" // verde claro
              }

              if (atrasado) {
                corLinha = "#f1adad" // vermelho claro
              }

              return (
                <tr
                  key={pagamento.id}
                  style={{
                    borderTop: "1px solid #f1f5f9",
                    backgroundColor: corLinha,
                  }}
                  className={atrasado ? "bg-red-200" : ""}
                >
                  <td style={tdStyle}>
                    <Link
                      href={`/financeiro/${pagamento.id}`}
                      style={{
                        color: "#2563eb",
                        fontWeight: 500,
                        textDecoration: "none",
                      }}
                    >
                      {pagamento.cliente.nomeCompleto}
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
                          value={pagamento.id}
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