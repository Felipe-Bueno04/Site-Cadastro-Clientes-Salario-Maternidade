import { prisma } from "@/lib/prisma"
import Link from "next/link"
import ExcluirCliente from "./components/BotaoExcluir"
import { getAdminId } from "@/lib/getAdminId"

export const dynamic = "force-dynamic"
export const revalidate = 0

type Props = {
  params: { id: string }
}

export default async function DetalheCliente({ params }: Props) {
  
  const adminId = await getAdminId()

  const { id } = await params

  const cliente = await prisma.cliente.findFirst({
    where: {
      idCliente: id,
      adminId: adminId,
    },
  })

  if (!cliente) {
    return <div>Cliente não encontrado</div>
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ fontSize: "26px", marginBottom: "20px" }}>
        Detalhes do Cliente
      </h1>

      <div style={{ marginBottom: "10px" }}>
        <strong>Nome:</strong> {cliente.nomeCompleto}
      </div>

      <div style={{ marginBottom: "10px" }}>
        <strong>CPF:</strong> {cliente.cpf}
      </div>

      <div style={{ marginBottom: "10px" }}>
        <strong>Telefone:</strong> {cliente.telefone}
      </div>

      <div style={{ marginBottom: "10px" }}>
        <strong>Status:</strong> {cliente.statusCliente}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <strong>Fase:</strong> {cliente.faseProcesso}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <Link href={`/clientes/${cliente.idCliente}/editar`}>
          <button>Editar</button>
        </Link>
        
        <ExcluirCliente id={cliente.idCliente} />

        <Link href="/clientes">
          <button>Voltar</button>
        </Link>
      </div>
    </div>
  )
}