import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { StatusCliente, FaseProcesso } from "@prisma/client"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

async function atualizarCliente(formData: FormData) {
  "use server"

  const id = formData.get("id") as string

  const nomeCompleto = formData.get("nomeCompleto") as string
  const cpf = formData.get("cpf") as string
  const telefone = formData.get("telefone") as string
  const statusCliente = formData.get("statusCliente") as StatusCliente
  const faseProcesso = formData.get("faseProcesso") as FaseProcesso

  console.log(faseProcesso)
  await prisma.cliente.update({
    where: { idCliente: id },
    data: {
      nomeCompleto: nomeCompleto as string,
      cpf: cpf as string,
      telefone: telefone as string,
      statusCliente: statusCliente as StatusCliente,
      faseProcesso: faseProcesso as FaseProcesso,
    },
  })

  revalidatePath("/clientes")
  redirect(`/clientes/${id}`)
}

export default async function EditarCliente({ params }: Props) {
  const { id } = await params

  const cliente = await prisma.cliente.findUnique({
    where: {
      idCliente: id,
    },
  })

  if (!cliente) {
    notFound()
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ fontSize: "26px", marginBottom: "20px" }}>
        Editar Cliente
      </h1>

      <form action={atualizarCliente} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
        <input type="hidden" name="id" value={cliente.idCliente} />

        <label>Nome Completo</label>
        <input name="nomeCompleto" defaultValue={cliente.nomeCompleto} required />

        <label>CPF</label>
        <input name="cpf" defaultValue={cliente.cpf} required />

        <label>Telefone</label>
        <input name="telefone" defaultValue={cliente.telefone} required />

        <label>Status</label>
        <select name="statusCliente" defaultValue={cliente.statusCliente}>
          <option value="ATIVA">ATIVA</option>
          <option value="INATIVA">INATIVA</option>
          <option value="FINALIZADA">FINALIZADA</option>
          <option value="CANCELADA">CANCELADA</option>
        </select>

        <label>Fase</label>
        <select name="faseProcesso" defaultValue={cliente.faseProcesso}>
          <option value="CADASTRO">CADASTRO</option>
          <option value="ANALISE_DOCUMENTOS">ANÁLISE DOCUMENTOS</option>
          <option value="AGUARDANDO_CONTRATO">AGUARDANDO CONTRATO</option>
          <option value="CONTRATO_ENVIADO">CONTRATO ENVIADO</option>
          <option value="AGUARDANDO_ASSINATURA">AGUARDANDO ASSINATURA</option>
          <option value="PROCESSO_FINALIZADO">PROCESSO FINALIZADO</option>
        </select>

        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
          <button type="submit">Salvar Alterações</button>

          <a href={`/clientes/${cliente.idCliente}`}>
            <button type="button">Cancelar</button>
          </a>
        </div>
      </form>
    </div>
  )
}