import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

async function atualizarPagamento(formData: FormData) {
  "use server"

  const id = formData.get("id") as string
  const valor = Number(formData.get("valor"))
  const dataVencimento = formData.get("dataVencimento") as string
  const status = formData.get("status") as any

  await prisma.pagamento.update({
    where: {
      id
    },
    data: {
      valor,
      dataVencimento: new Date(dataVencimento + "T00:00:00"),
      status
    }
  })

  revalidatePath("/financeiro")

  redirect("/financeiro")
}

async function excluirPagamento(formData: FormData) {
  "use server"

  const id = formData.get("id") as string

  await prisma.pagamento.delete({
    where: {
      id
    }
  })

  revalidatePath("/financeiro")

  redirect("/financeiro")
}

export default async function EditarPagamentoPage({
  params
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = await params

  const pagamento = await prisma.pagamento.findUnique({
    where: {
      id: id
    },
    include: {
      cliente: true
    }
  })

  if (!pagamento) {
    return <div>Pagamento não encontrado</div>
  }

  return (
    <div style={{ padding: "40px" }}>

      <h1 style={{ fontSize: "26px", marginBottom: "20px" }}>
        Editar pagamento
      </h1>

      <form 
        action={atualizarPagamento} 
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "500px",
        }}
      >
        <input type="hidden" name="id" value={pagamento.id} />

        <div>
          <label>Cliente</label>
          <div className="border p-2 bg-gray-100">
            {pagamento.cliente.nomeCompleto}
          </div>
        </div>

        <div>
          <label>Valor</label>
          <input
            name="valor"
            type="number"
            step="0.01"
            defaultValue={pagamento.valor}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label>Data vencimento</label>
          <input
            type="date"
            name="dataVencimento"
            defaultValue={
              pagamento.dataVencimento
                .toISOString()
                .split("T")[0]
            }
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label>Status</label>
          <select
            name="status"
            defaultValue={pagamento.status}
            className="border p-2 w-full"
          >
            <option value="PENDENTE">PENDENTE</option>
            <option value="PAGO">PAGO</option>
            <option value="ATRASADO">ATRASADO</option>
            <option value="CANCELADO">CANCELADO</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded"
        >
          Salvar alterações
        </button>

      </form>

      <form action={excluirPagamento} className="mt-4">

        <input type="hidden" name="id" value={pagamento.id} />

        <button
          type="submit"
          className="bg-red-600 text-white p-2 rounded"
        >
          Excluir pagamento
        </button>

      </form>

    </div>
  )
}