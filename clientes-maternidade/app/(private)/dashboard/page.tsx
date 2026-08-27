import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { getAdminId } from "@/lib/getAdminId"
import { calcularResumoAlertas } from "@/lib/alertaParto"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  const adminId = await getAdminId()

  const clientes = await prisma.cliente.findMany({
    where: {
      adminId: adminId,
    }
  })

  const resumoClientes = calcularResumoAlertas(clientes)

  const hoje = new Date()
  hoje.setHours(0,0,0,0)

  // Semana atual
  const inicioSemana = new Date(hoje)
  inicioSemana.setDate(hoje.getDate() - hoje.getDay())

  const fimSemana = new Date(inicioSemana)
  fimSemana.setDate(inicioSemana.getDate() + 7)
  fimSemana.setHours(23,59,59,999)

  const totalAtrasados = await prisma.pagamento.count({
    // 🔴 Atrasados
    where: {
      cliente: {
        adminId: adminId
      },
      status: { not: "PAGO" },
      dataVencimento: { lt: hoje } // lt = less than
    }
  }) 
  const totalPendentes = await prisma.pagamento.count({
    // 🟡 Pendentes
    where: {
      cliente: {
        adminId: adminId,
      },
      status: { not: "PAGO" },
      dataVencimento: { gte: hoje } // gte = greater than or equal
    }
  })
  const totalPagos = await prisma.pagamento.count({
    // 🟢 Pagos
    where: {
      cliente: {
        adminId: adminId
      },
      status: "PAGO"
    }
  })
  const totalProcessosAnalise = await prisma.cliente.count({
    // 🏥 Processos em Análise
    where: {
      adminId: adminId,
      faseProcesso: "ANALISE_DOCUMENTOS"
    }
  })
  const totalPartosSemana = await prisma.cliente.count({
    // 📅 Partos nesta semana
    where: {
      adminId: adminId,
      dataProvavelParto: { gte: inicioSemana, lte: fimSemana } // gte = greater than or equal, lte = less than or equal
    }
  })

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
          📅 {totalPartosSemana} partos nesta semana
        </Link>

        <Link
          href="/clientes?fase=ANALISE_DOCUMENTOS"
          style={{ ...cardStyle, background: "#e0f2fe" }}
        >
          🏥 {totalProcessosAnalise} processos em análise
        </Link>

      </div>

      {/* FINANCEIRO */}

      {session?.user?.role === "ADMIN" && (
        <>
          <h2 style={{ marginTop: "40px" }}>
          Alertas Financeiros
        </h2>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>

          <Link
            href="/financeiro?alerta=atrasados"
            style={{ ...cardStyle, background: "#fecaca" }}
          >
            ⚠️ {totalAtrasados} pagamentos atrasados
          </Link>

          <Link
            href="/financeiro?alerta=pendentes"
            style={{ ...cardStyle, background: "#fef9c3" }}
          >
            🟡 {totalPendentes} pagamentos pendentes
          </Link>

          <Link
            href="/financeiro?status=PAGO"
            style={{ ...cardStyle, background: "#dcfce7" }}
          >
            🟢 {totalPagos} pagamentos pagos
          </Link>
      </div>
        </>
      )}
    </div>
  )
}