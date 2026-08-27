import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { FormCard } from "@/components/FormCard"
import { getAdminId } from "@/lib/getAdminId"

async function criarPagamento(formData: FormData) {
  "use server"

  const clienteId = formData.get("clienteId") as string
  const valor = Number(formData.get("valor"))
  const dataVencimento = formData.get("dataVencimento") as string

  const adminId = await getAdminId()

  const cliente = await prisma.cliente.findFirst({
    where: {
      idCliente: clienteId,
      adminId: adminId,
    }
  })

  if(!cliente) {
    throw new Error("Cliente não pertence a este usuário!")
  }

  await prisma.pagamento.create({
    data: {
      clienteId,
      valor,
      dataVencimento: new Date(dataVencimento + "T00:00:00"),
      status: "PENDENTE"
    }
  })

  revalidatePath("/financeiro")

  redirect("/financeiro")
}

export default async function NovoPagamentoPage() {
  const adminId = await getAdminId()

  const clientes = await prisma.cliente.findMany({
    where: {
      adminId: adminId,
    },
    orderBy: {
      nomeCompleto: "asc"
    }
  })

  return (
    <FormCard>
        <h1 className="text-2xl font-bold mb-6">
          Novo Pagamento
        </h1>

        <form action={criarPagamento} className="flex flex-col gap-4 max-w-md">
          
          <div className="flex flex-col gap-1">
            <label>Cliente</label>            
            <select
              name="clienteId"
              required
              className="border p-2"
              defaultValue="Selecione um cliente"
            >
              <option
                disabled
                hidden
              >
                Selecione um cliente
              </option>

              {clientes.map((cliente) => (
                <option
                  key={cliente.idCliente}
                  value={cliente.idCliente}
                >
                  {cliente.nomeCompleto}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col gap-1">
            <label>Valor</label>
            <input
              type="number"
              name="valor"
              placeholder="R$ 0.00"
              step="0.01"
              required
              className="border p-2"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label>Data de vencimento</label>
            <input
              type="date"
              name="dataVencimento"
              required
              className="border p-2"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded"
          >
            Salvar pagamento
          </button>

        </form>
      </FormCard>
  )
}