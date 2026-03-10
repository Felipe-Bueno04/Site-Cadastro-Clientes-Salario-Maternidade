import { prisma } from "@/lib/prisma"
import Link from "next/link"

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
}

export default async function Financeiro() {

  const pagamentos = await prisma.pagamento.findMany({
    include: {
      cliente: true
    },
    orderBy: {
      dataVencimento: "asc"
    }
  })

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Financeiro
        </h1>

        <Link
          href="/financeiro/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Novo Pagamento
        </Link>
      </div>

      <table className="w-full border border-gray-300">

        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Cliente</th>
            <th className="p-2 border">Valor</th>
            <th className="p-2 border">Vencimento</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Ação</th>
          </tr>
        </thead>

        <tbody>

          {pagamentos.map((pagamento) => (

            <tr key={pagamento.id}>

              <td className="p-2 border">
                {pagamento.cliente.nomeCompleto}
              </td>

              <td className="p-2 border">
                R$ {pagamento.valor.toFixed(2)}
              </td>

              <td className="p-2 border">
                {new Date(pagamento.dataVencimento).toLocaleDateString()}
              </td>

              <td className="p-2 border">
                {pagamento.status}
              </td>

              <td className="p-2 border">

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

          ))}

        </tbody>

      </table>

    </div>
  )
}