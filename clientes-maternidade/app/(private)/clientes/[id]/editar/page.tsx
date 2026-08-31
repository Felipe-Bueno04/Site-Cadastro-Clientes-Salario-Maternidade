import Link from "next/link"

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
import { getAdminId } from "@/lib/getAdminId"
import { FormCard } from "@/components/FormCard"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ id: string }>
}

async function atualizarCliente(formData: FormData) {
  "use server"

  const id = formData.get("id") as string
  const adminId = await getAdminId()

  const cliente = await prisma.cliente.findFirst({
    where: {
      idCliente: id,
      adminId: adminId,
    },
  })

  if (!cliente) {
    notFound()
  }

  await prisma.cliente.update({
    where: { idCliente: id },
    data: {
      nomeCompleto: formData.get("nomeCompleto") as string,
      cpf: formData.get("cpf") as string,
      telefone: formData.get("telefone") as string,
      email: (formData.get("email") as string) || null,
      instagram: (formData.get("instagram") as string) || null,
      criadoPor: (formData.get("origemParceira") as string) || null,

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
  const adminId = await getAdminId()

  const cliente = await prisma.cliente.findFirst({
    where: {
      idCliente: id,
      adminId: adminId,
    },
  })

  if (!cliente) {
    notFound()
  }

  return (
    <FormCard>
      <h1 className="text-2xl font-bold mb-6">
        Editar Cliente
      </h1>

      <form
        action={atualizarCliente}
        className="flex flex-col gap-4 max-w-md"
      >
        <input type="hidden" name="id" value={cliente.idCliente} />

        <h2 className="text-base font-semibold mt-4 mb-2">Dados pessoais</h2>

        <div className="flex flex-col gap-1">
          <label>Nome Completo</label>
          <input 
            name="nomeCompleto" 
            placeholder="Nome Completo"
            defaultValue={cliente.nomeCompleto} 
            required
            className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>CPF</label>
          <input 
            name="cpf"
            defaultValue={cliente.cpf}
            placeholder="CPF" 
            required
            className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>Telefone</label>
          <input 
            name="telefone"
            defaultValue={cliente.telefone}
            placeholder="Telefone" 
            required
            className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>Email</label>
          <input 
            name="email"
            defaultValue={cliente.email ?? ""} 
            placeholder="Email" 
            required
            className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>Instagram</label>
          <input 
            name="instagram"
            defaultValue={cliente.instagram ?? ""} 
            placeholder="@perfil" 
            className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>Recebe Bolsa Família</label>
          <select 
            name="recebeBolsaFamilia"
            defaultValue={String(cliente.recebeBolsaFamilia)}
            className="border border-gray-300 rounded-lg p-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="false">Não</option>
            <option value="true">Sim</option>
          </select>
        </div>

        <h2 className="text-base font-semibold mt-4 mb-2">Gestação</h2>

        <div className="flex flex-col gap-1">
          <label>Data provável do parto</label>
          <input 
            type="date" 
            name="dataProvavelParto"
            defaultValue={
              cliente.dataProvavelParto
                ? cliente.dataProvavelParto.toISOString().split("T")[0]
                : ""
            }
            className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"            
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <label>Semanas de gestação</label>
          <input
            name="tempoGestacaoSemanas"
            defaultValue={cliente.tempoGestacaoSemanas ?? ""}
            placeholder="Semanas de gestação"
            type="number"
            className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"            
          />
        </div>

        <h2 className="text-base font-semibold mt-4 mb-2">
          Acesso GOV
        </h2>
        
        <div className="flex flex-col gap-1">
          <label>Possui senha GOV?</label>
          <select 
            name="possuiSenhaGov"
            defaultValue={String(cliente.possuiSenhaGov)}
            className="border border-gray-300 rounded-lg p-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="false">Não</option>
            <option value="true">Sim</option>
          </select>
        </div>
        
        <div className="flex flex-col gap-1">
          <label>Senha GOV</label>
          <input 
            name="senhaGov"
            defaultValue={cliente.senhaGov ?? ""}
            placeholder="Senha GOV" 
            className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <h2 className="text-base font-semibold mt-4 mb-2">
          Status do processo
        </h2>
        
        <div className="flex flex-col gap-1">
          <label>Status Cliente</label>
          <select 
            name="statusCliente"
            defaultValue={cliente.statusCliente}
            className="border border-gray-300 rounded-lg p-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ATIVA">Ativa</option>
            <option value="INATIVA">Inativa</option>
            <option value="FINALIZADA">Finalizada</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
        </div>
        
        <div className="flex flex-col gap-1">
          <label>Fase Processo</label>
          <select 
            name="faseProcesso"
            defaultValue={cliente.faseProcesso}
            className="border border-gray-300 rounded-lg p-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="CADASTRO">Cadastro</option>
            <option value="ANALISE_DOCUMENTOS">Análise documentos</option>
            <option value="CONTRATO_ENVIADO">Contrato enviado</option>
            <option value="AGUARDANDO_ASSINATURA">Aguardando assinatura</option>
            <option value="PROCESSO_ENVIADO_INSS">Processo enviado ao INSS</option>
            <option value="PROCESSO_FINALIZADO">Processo finalizado</option>
          </select>
        </div>
        
        <div className="flex flex-col gap-1">
          <label>Status Contrato</label>
          <select 
            name="statusContrato"
            defaultValue={cliente.statusContrato}
            className="border border-gray-300 rounded-lg p-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="NAO_ENVIADO">Não enviado</option>
            <option value="ENVIADO">Enviado</option>
            <option value="ASSINADO">Assinado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>
        
        <div className="flex flex-col gap-1">
          <label>Status Nascimento</label>
          <select 
            name="statusNascimento"
            defaultValue={cliente.statusNascimento}
            className="border border-gray-300 rounded-lg p-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="AGUARDANDO">Aguardando</option>
            <option value="NASCEU">Nasceu</option>
            <option value="NAO_INFORMADO">Não informado</option>
          </select>
        </div>

        <h2 className="text-base font-semibold mt-4 mb-2">
          Observações
        </h2>
        
        <div className="flex flex-col gap-1">
          <textarea 
            name="observacoes" 
            rows={4}
            defaultValue={cliente.observacoes ?? ""}
            className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>Cadastrado por: {cliente.criadoPor ?? ""}</label>
        </div>

        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
          <button 
            type="submit"
            className="bg-blue-600 text-white p-2 rounded"
          >
            Salvar Alterações
          </button>

          <Link href={`/clientes/${cliente.idCliente}`}>
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