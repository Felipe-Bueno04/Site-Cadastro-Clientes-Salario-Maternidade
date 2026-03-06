import { prisma } from "@/lib/prisma"
import { Prisma, StatusCliente, FaseProcesso } from "@prisma/client"
import Link from "next/link"
import StatusFilter from "./[id]/components/StatusFilter"
import FaseFilter from "./[id]/components/FaseFilter"

export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<{
    busca?: string
    page?: string
    status?: StatusCliente
    fase?: FaseProcesso
    direction?: "asc" | "desc"
  }>
}

export default async function Clientes({ searchParams }: PageProps) {
  const params = await searchParams

  const busca = params?.busca
  const page = params?.page
  const status = params?.status
  const fase = params?.fase
  const direction = params?.direction

  const paginaAtual = Number(page) || 1
  const itensPorPagina = 10
  const skip = (paginaAtual - 1) * itensPorPagina

  const direcaoOrdenacao: Prisma.SortOrder =
    direction === "asc" ? "asc" : "desc"

  const where: Prisma.ClienteWhereInput = {
    ...(busca && {
      OR: [
        {
          nomeCompleto: {
            contains: busca,
            mode: "insensitive",
          },
        },
        {
          cpf: {
            contains: busca,
          },
        },
      ],
    }),

    ...(status && {
      statusCliente: status,
    }),

    ...(fase && {
      faseProcesso: fase,
    }),
  }

  const totalClientes = await prisma.cliente.count({ where })

  const clientes = await prisma.cliente.findMany({
    where,
    orderBy: {
      nomeCompleto: direcaoOrdenacao,
    },
    take: itensPorPagina,
    skip,
  })

  const totalPaginas = Math.ceil(totalClientes / itensPorPagina)

  function gerarLinkPagina(p: number) {
    return `/clientes?page=${p}${
      busca ? `&busca=${busca}` : ""
    }${status ? `&status=${status}` : ""}${
      fase ? `&fase=${fase}` : ""
    }&direction=${direcaoOrdenacao}`
  }

  function gerarLinkOrdenacao() {
    const novaDirecao = direcaoOrdenacao === "asc" ? "desc" : "asc"

    return `/clientes?${
      busca ? `busca=${busca}&` : ""
    }${status ? `status=${status}&` : ""}${
      fase ? `fase=${fase}&` : ""
    }direction=${novaDirecao}`
  }

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
        <h1 style={{ fontSize: "28px", fontWeight: 600 }}>Clientes</h1>

        <Link href="/clientes/nova">
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
            + Novo Cliente
          </button>
        </Link>
      </div>

      {/* FILTROS */}
      <form
        method="GET"
        style={{
          marginTop: "30px",
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          name="busca"
          placeholder="Buscar por nome ou CPF..."
          defaultValue={busca ?? ""}
          style={{
            padding: "10px",
            width: "250px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
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
              <th style={thStyle}>
                <Link href={gerarLinkOrdenacao()}>
                  Nome {direcaoOrdenacao === "asc" ? "↑" : "↓"}
                </Link>
              </th>

              <th style={thStyle}>CPF</th>
              <th style={thStyle}>Telefone</th>

              <th style={thStyle}>
                <StatusFilter />
              </th>

              <th style={thStyle}>
                <FaseFilter />
              </th>
            </tr>
          </thead>

          <tbody>
            {clientes.map((cliente) => (
              <tr
                key={cliente.idCliente}
                style={{ borderTop: "1px solid #f1f5f9" }}
              >
                <td style={tdStyle}>
                  <Link
                    href={`/clientes/${cliente.idCliente}`}
                    style={{
                      color: "#2563eb",
                      fontWeight: 500,
                      textDecoration: "none",
                    }}
                  >
                    {cliente.nomeCompleto}
                  </Link>
                </td>

                <td style={tdStyle}>{cliente.cpf}</td>
                <td style={tdStyle}>{cliente.telefone}</td>

                <td style={tdStyle}>{cliente.statusCliente}</td>
                <td style={tdStyle}>{cliente.faseProcesso}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINAÇÃO */}
      {totalPaginas > 1 && (
        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          {paginaAtual > 1 && (
            <Link href={gerarLinkPagina(paginaAtual - 1)}>← Anterior</Link>
          )}

          <span>
            Página {paginaAtual} de {totalPaginas}
          </span>

          {paginaAtual < totalPaginas && (
            <Link href={gerarLinkPagina(paginaAtual + 1)}>Próxima →</Link>
          )}
        </div>
      )}
    </div>
  )
}