import Link from "next/link"

import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { revalidatePath } from "next/cache"
import { getAdminId } from "@/lib/getAdminId"
import { FormCard } from "@/components/FormCard"

interface Props {
  params: Promise<{
    id: string
  }>
}

async function atualizarPagamento(formData: FormData) {
  "use server"

  const id = formData.get("id") as string

  const descricao = formData.get("descricao") as string
  const valor = Number(formData.get("valor"))
  const parcela = Number(formData.get("parcela"))
  const totalParcelas = Number(formData.get("totalParcelas"))

  const dataVencimento = formData.get("dataVencimento") as string
  const dataPagamento = formData.get("dataPagamento") as string

  const formaPagamento = formData.get("formaPagamento") as string
  const status = formData.get("status") as any

  const adminId = await getAdminId()
  const pagamento = await prisma.pagamento.findFirst({
    where: {
      id,
      cliente: {
        adminId: adminId
      }
    }
  })

  if (!pagamento) {
    notFound()
  }

  await prisma.pagamento.update({
    where: { id },

    data: {
      descricao,
      valor,
      parcela: parcela || null,
      totalParcelas: totalParcelas || null,
      dataVencimento: new Date(dataVencimento + "T00:00:00"),
      dataPagamento: dataPagamento
        ? new Date(dataPagamento + "T00:00:00")
        : null,
      formaPagamento,
      status
    }
  })

  revalidatePath("/financeiro")

  redirect(`/financeiro/${id}`)
}

export default async function EditarPagamento({ params }: Props) {

  const { id } = await params
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

  const dataVencimento = pagamento.dataVencimento
    .toISOString()
    .split("T")[0]

  const dataPagamento = pagamento.dataPagamento
    ? pagamento.dataPagamento.toISOString().split("T")[0]
    : ""

  return (
    <FormCard>

      <h1 className="text-2xl font-bold mb-6">
        Editar Pagamento
      </h1>

      <form
        action={atualizarPagamento}
        className="flex flex-col gap-4 max-w-md"
      >
        <input type="hidden" name="id" value={pagamento.id} />

        <div className="flex flex-col gap-1">
          <label><b>Cliente:</b> {pagamento.cliente.nomeCompleto}</label>
        </div>

        <div className="flex flex-col gap-1">
          <label>Valor</label>
          <input
            type="number"
            step="0.01"
            name="valor"
            defaultValue={pagamento.valor}
            className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>Parcela</label>
          <input
            type="number"
            name="parcela"
            defaultValue={pagamento.parcela ?? ""}
            className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>Total de parcelas</label>
          <input
            type="number"
            name="totalParcelas"
            defaultValue={pagamento.totalParcelas ?? ""}
            className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>Data de vencimento</label>
          <input
            type="date"
            name="dataVencimento"
            defaultValue={dataVencimento}
            className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>Data de pagamento</label>
          <input
            type="date"
            name="dataPagamento"
            defaultValue={dataPagamento}
            className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>Forma de pagamento</label>
          <input
            name="formaPagamento"
            defaultValue={pagamento.formaPagamento ?? ""}
            className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>Status</label>
          <select 
            name="status" 
            defaultValue={pagamento.status}
            className="border border-gray-300 rounded-lg p-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="PENDENTE">Pendente</option>
            <option value="PAGO">Pago</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label>Descrição</label>
          <textarea 
            name="observacoes" 
            rows={4}
            defaultValue={pagamento.descricao ?? ""}
            className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded"
          >
            Salvar alterações
          </button>

          <Link href={`/financeiro/${id}`}>
            <button 
              type="submit"
              className="bg-red-600 text-white p-2 rounded"
            >
              Cancelar
            </button>
          </Link>
        </div>
      </form>
    </FormCard>
  )
}