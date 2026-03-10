import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

async function criarPagamento(formData: FormData) {
  "use server"

  const clienteId = formData.get("clienteId") as string
  const valor = Number(formData.get("valor"))
  const dataVencimento = formData.get("dataVencimento") as string

  await prisma.pagamento.create({
    data: {
      clienteId,
      valor,
      dataVencimento: new Date(dataVencimento),
      status: "PENDENTE"
    }
  })

  revalidatePath("/financeiro")

  redirect("/financeiro")
}

export default async function NovoPagamentoPage() {

  const clientes = await prisma.cliente.findMany({
    orderBy: {
      nomeCompleto: "asc"
    }
  })

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Novo Pagamento
      </h1>

      <form action={criarPagamento} className="flex flex-col gap-4 max-w-md">

        <label>
          Cliente
        </label>

        <select
          name="clienteId"
          required
          className="border p-2"
        >
          <option value="">Selecione um cliente</option>

          {clientes.map((cliente) => (
            <option
              key={cliente.idCliente}
              value={cliente.idCliente}
            >
              {cliente.nomeCompleto}
            </option>
          ))}
        </select>

        <label>
          Valor
        </label>

        <input
          type="number"
          name="valor"
          step="0.01"
          required
          className="border p-2"
        />

        <label>
          Data de vencimento
        </label>

        <input
          type="date"
          name="dataVencimento"
          required
          className="border p-2"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded"
        >
          Salvar pagamento
        </button>

      </form>

    </div>
  )
}