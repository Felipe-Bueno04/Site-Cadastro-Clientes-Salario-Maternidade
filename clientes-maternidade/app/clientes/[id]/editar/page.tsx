import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
  StatusCliente,
  FaseProcesso,
  StatusContrato,
  StatusNascimento,
} from "@prisma/client"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

async function atualizarCliente(formData: FormData) {
  "use server"

  const id = formData.get("id") as string

  await prisma.cliente.update({
    where: { idCliente: id },
    data: {
      nomeCompleto: formData.get("nomeCompleto") as string,
      cpf: formData.get("cpf") as string,
      telefone: formData.get("telefone") as string,
      email: (formData.get("email") as string) || null,
      instagram: (formData.get("instagram") as string) || null,
      origemParceira: (formData.get("origemParceira") as string) || null,

      recebeBolsaFamilia:
        (formData.get("recebeBolsaFamilia") as string) === "true",

      dataProvavelParto: formData.get("dataProvavelParto")
        ? new Date(formData.get("dataProvavelParto") as string)
        : null,

      tempoGestacaoSemanas: formData.get("tempoGestacaoSemanas")
        ? Number(formData.get("tempoGestacaoSemanas"))
        : null,

      possuiSenhaGov: (formData.get("possuiSenhaGov") as string) === "true",

      senhaGov: (formData.get("senhaGov") as string) || null,

      statusCliente: formData.get("statusCliente") as StatusCliente,
      faseProcesso: formData.get("faseProcesso") as FaseProcesso,
      statusContrato: formData.get("statusContrato") as StatusContrato,
      statusNascimento: formData.get("statusNascimento") as StatusNascimento,

      observacoes: (formData.get("observacoes") as string) || null,
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

      <form
        action={atualizarCliente}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "500px",
        }}
      >
        <input type="hidden" name="id" value={cliente.idCliente} />

        <h3>Dados pessoais</h3>

        <label>Nome Completo</label>
        <input name="nomeCompleto" defaultValue={cliente.nomeCompleto} required />

        <label>CPF</label>
        <input name="cpf" defaultValue={cliente.cpf} required />

        <label>Telefone</label>
        <input name="telefone" defaultValue={cliente.telefone} required />

        <label>Email</label>
        <input name="email" defaultValue={cliente.email ?? ""} />

        <label>Instagram</label>
        <input name="instagram" defaultValue={cliente.instagram ?? ""} />

        <label>Origem parceira</label>
        <input name="origemParceira" defaultValue={cliente.origemParceira ?? ""} />

        <label>Recebe Bolsa Família</label>
        <select
          name="recebeBolsaFamilia"
          defaultValue={String(cliente.recebeBolsaFamilia)}
        >
          <option value="false">Não</option>
          <option value="true">Sim</option>
        </select>

        <h3>Gestação</h3>

        <label>Data provável do parto</label>
        <input
          type="date"
          name="dataProvavelParto"
          defaultValue={
            cliente.dataProvavelParto
              ? cliente.dataProvavelParto.toISOString().split("T")[0]
              : ""
          }
        />

        <label>Semanas de gestação</label>
        <input
          type="number"
          name="tempoGestacaoSemanas"
          defaultValue={cliente.tempoGestacaoSemanas ?? ""}
        />

        <h3>Acesso GOV</h3>

        <label>Possui senha GOV?</label>
        <select
          name="possuiSenhaGov"
          defaultValue={String(cliente.possuiSenhaGov)}
        >
          <option value="false">Não</option>
          <option value="true">Sim</option>
        </select>

        <label>Senha GOV</label>
        <input name="senhaGov" defaultValue={cliente.senhaGov ?? ""} />

        <h3>Status do processo</h3>

        <label>Status Cliente</label>
        <select name="statusCliente" defaultValue={cliente.statusCliente}>
          <option value="ATIVA">ATIVA</option>
          <option value="INATIVA">INATIVA</option>
          <option value="FINALIZADA">FINALIZADA</option>
          <option value="CANCELADA">CANCELADA</option>
        </select>

        <label>Fase Processo</label>
        <select name="faseProcesso" defaultValue={cliente.faseProcesso}>
          <option value="CADASTRO">Cadastro</option>
          <option value="ANALISE_DOCUMENTOS">Análise documentos</option>
          <option value="CONTRATO_ENVIADO">Contrato enviado</option>
          <option value="AGUARDANDO_ASSINATURA">Aguardando assinatura</option>
          <option value="PROCESSO_ENVIADO_INSS">Processo enviado ao INSS</option>
          <option value="PROCESSO_FINALIZADO">Processo finalizado</option>
        </select>

        <label>Status Contrato</label>
        <select name="statusContrato" defaultValue={cliente.statusContrato}>
          <option value="NAO_ENVIADO">Não enviado</option>
          <option value="ENVIADO">Enviado</option>
          <option value="ASSINADO">Assinado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>

        <label>Status Nascimento</label>
        <select name="statusNascimento" defaultValue={cliente.statusNascimento}>
          <option value="AGUARDANDO">Aguardando</option>
          <option value="NASCEU">Nasceu</option>
          <option value="NAO_INFORMADO">Não informado</option>
        </select>

        <h3>Observações</h3>

        <textarea
          name="observacoes"
          rows={4}
          defaultValue={cliente.observacoes ?? ""}
        />

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