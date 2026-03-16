import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { calcularResumoAlertas } from "@/lib/alertaParto"

export const dynamic = "force-dynamic"

export default async function Dashboard() {

  const clientes = await prisma.cliente.findMany()

  const pagamentos = await prisma.pagamento.findMany()

  const resumoClientes = calcularResumoAlertas(clientes)

  const hoje = new Date()

  const semana = new Date()
  semana.setDate(hoje.getDate() + 7)

  const partosSemana = clientes.filter((c) => {

    if (!c.dataProvavelParto) return false

    const parto = new Date(c.dataProvavelParto)

    return parto >= hoje && parto <= semana
  })

  const processosAnalise = clientes.filter(
    (c) => c.faseProcesso === "ANALISE_DOCUMENTOS"
  )

  const pagamentosAtrasados = pagamentos.filter(
    (p) =>
      p.status !== "PAGO" &&
      new Date(p.dataVencimento) < hoje
  )

  const pagamentosPendentes = pagamentos.filter(
    (p) => p.status === "PENDENTE"
  )

  const pagamentosPagos = pagamentos.filter(
    (p) => p.status === "PAGO"
  )

  const cardStyle = {
    padding: "16px 20px",
    borderRadius: "10px",
    fontWeight: 600,
    textDecoration: "none",
    color: "#111",
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Inter, sans-serif" }}>

      <h1 style={{ fontSize: "28px", fontWeight: 600 }}>
        Dashboard
      </h1>

      {/* CLIENTES */}

      <h2 style={{ marginTop: "30px" }}>
        Alertas de Clientes
      </h2>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>

        <Link
          href="/clientes?alerta=15dias"
          style={{ ...cardStyle, background: "#fee2e2" }}
        >
          🔴 {resumoClientes.parto15} partos em até 15 dias
        </Link>

        <Link
          href="/clientes?alerta=30dias"
          style={{ ...cardStyle, background: "#fef9c3" }}
        >
          🟡 {resumoClientes.parto30} partos em até 30 dias
        </Link>

        <Link
          href="/clientes?alerta=atrasado"
          style={{ ...cardStyle, background: "#fecaca" }}
        >
          ⚠️ {resumoClientes.atrasados} partos atrasados
        </Link>

        <Link
          href="/clientes?alerta=semana"
          style={{ ...cardStyle, background: "#dbeafe" }}
        >
          📅 {partosSemana.length} partos nesta semana
        </Link>

        <Link
          href="/clientes?fase=ANALISE_DOCUMENTOS"
          style={{ ...cardStyle, background: "#e0f2fe" }}
        >
          🏥 {processosAnalise.length} processos em análise
        </Link>

      </div>

      {/* FINANCEIRO */}

      <h2 style={{ marginTop: "40px" }}>
        Alertas Financeiros
      </h2>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>

        <Link
          href="/financeiro?status=ATRASADO"
          style={{ ...cardStyle, background: "#fecaca" }}
        >
          ⚠️ {pagamentosAtrasados.length} pagamentos atrasados
        </Link>

        <Link
          href="/financeiro?status=PENDENTE"
          style={{ ...cardStyle, background: "#fef9c3" }}
        >
          🟡 {pagamentosPendentes.length} pagamentos pendentes
        </Link>

        <Link
          href="/financeiro?status=PAGO"
          style={{ ...cardStyle, background: "#dcfce7" }}
        >
          🟢 {pagamentosPagos.length} pagamentos pagos
        </Link>

      </div>

    </div>
  )
}