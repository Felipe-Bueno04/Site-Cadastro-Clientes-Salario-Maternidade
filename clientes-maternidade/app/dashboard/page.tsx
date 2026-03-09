import { prisma } from "@/lib/prisma"

export default async function Dashboard() {
  const hoje = new Date()

  const seteDias = new Date()
  seteDias.setDate(hoje.getDate() + 7)

  // partos nesta semana
  const partosSemana = await prisma.cliente.count({
    where: {
      dataProvavelParto: {
        gte: hoje,
        lte: seteDias,
      },
    },
  })

  // processos em análise
  const processosAnalise = await prisma.cliente.count({
    where: {
      faseProcesso: "ANALISE_DOCUMENTOS",
    },
  })

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <div
          style={{
            background: "#f2f2f2",
            padding: 20,
            borderRadius: 10,
            width: 220,
          }}
        >
          <h3>📅 {partosSemana} partos nesta semana</h3>
        </div>

        <div
          style={{
            background: "#f2f2f2",
            padding: 20,
            borderRadius: 10,
            width: 220,
          }}
        >
          <h3>🏥 {processosAnalise} processos em análise</h3>
        </div>
      </div>
    </div>
  )
}