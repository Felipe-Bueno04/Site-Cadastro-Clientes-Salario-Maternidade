import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getAdminId } from "@/lib/getAdminId"

interface Props {
  params: { id: string }
}

export default async function DetalhesPagamento({ params }: Props) {

  const { id } = params
  const adminId = await getAdminId()

  const pagamento = await prisma.pagamento.findFirst({
    where: {
      id: id,

      cliente: {
        adminId: adminId
      }
    },
    include: {
      cliente: true
    }
  })

  if (!pagamento) {
    notFound()
  }

  const dataVencimento = new Date(pagamento.dataVencimento)

  const dataPagamento = pagamento.dataPagamento
    ? new Date(pagamento.dataPagamento)
    : null

  return (
    <div style={{ padding: "40px", fontFamily: "Inter, sans-serif" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

        <h1 style={{ fontSize: "28px", fontWeight: 600 }}>
          Detalhes do Pagamento
        </h1>

        <Link href={`/financeiro/${pagamento.id}/editar`}>
          <button
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Editar pagamento
          </button>
        </Link>

      </div>

      <div
        style={{
          marginTop: "30px",
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          maxWidth: "700px"
        }}
      >

        <p><strong>Cliente:</strong> {pagamento.cliente.nomeCompleto}</p>

        <p><strong>Valor:</strong> R$ {pagamento.valor.toFixed(2)}</p>

        <p><strong>Descrição:</strong> {pagamento.descricao ?? "-"}</p>

        <p>
          <strong>Parcela:</strong>{" "}
          {pagamento.parcela
            ? `${pagamento.parcela} / ${pagamento.totalParcelas}`
            : "-"}
        </p>

        <p>
          <strong>Data de vencimento:</strong>{" "}
          {dataVencimento.toLocaleDateString("pt-BR", { timeZone: "UTC" })}
        </p>

        <p>
          <strong>Data de pagamento:</strong>{" "}
          {dataPagamento
            ? dataPagamento.toLocaleDateString("pt-BR", { timeZone: "UTC" })
            : "-"}
        </p>

        <p><strong>Forma de pagamento:</strong> {pagamento.formaPagamento ?? "-"}</p>

        <p><strong>Status:</strong> {pagamento.status}</p>

        <p>
          <strong>Criado em:</strong>{" "}
          {new Date(pagamento.createdAt).toLocaleDateString("pt-BR")}
        </p>

      </div>

    </div>
  )
}