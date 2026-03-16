import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { revalidatePath } from "next/cache"

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

  const pagamento = await prisma.pagamento.findUnique({

    where: { id: id },
    include: { cliente: true }
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
    <div style={{ padding: "40px", fontFamily: "Inter, sans-serif" }}>

      <h1 style={{ fontSize: "28px", fontWeight: 600 }}>
        Editar Pagamento
      </h1>

      <form
        action={atualizarPagamento}
        style={{
          marginTop: "30px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          maxWidth: "500px"
        }}
      >

        <input type="hidden" name="id" value={pagamento.id} />

        <label>Cliente</label>
        <input value={pagamento.cliente.nomeCompleto} disabled />

        <label>Descrição</label>
        <input name="descricao" defaultValue={pagamento.descricao ?? ""} />

        <label>Valor</label>
        <input
          type="number"
          step="0.01"
          name="valor"
          defaultValue={pagamento.valor}
        />

        <label>Parcela</label>
        <input
          type="number"
          name="parcela"
          defaultValue={pagamento.parcela ?? ""}
        />

        <label>Total de parcelas</label>
        <input
          type="number"
          name="totalParcelas"
          defaultValue={pagamento.totalParcelas ?? ""}
        />

        <label>Data de vencimento</label>
        <input
          type="date"
          name="dataVencimento"
          defaultValue={dataVencimento}
        />

        <label>Data de pagamento</label>
        <input
          type="date"
          name="dataPagamento"
          defaultValue={dataPagamento}
        />

        <label>Forma de pagamento</label>
        <input
          name="formaPagamento"
          defaultValue={pagamento.formaPagamento ?? ""}
        />

        <label>Status</label>
        <select name="status" defaultValue={pagamento.status}>
          <option value="PENDENTE">Pendente</option>
          <option value="PAGO">Pago</option>
        </select>

        <button
          type="submit"
          style={{
            marginTop: "10px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Salvar alterações
        </button>

      </form>

    </div>
  )
}