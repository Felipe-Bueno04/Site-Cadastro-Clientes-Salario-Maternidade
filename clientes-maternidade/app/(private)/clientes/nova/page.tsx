"use client"

import { FormCard } from "@/components/FormCard"

export default function CriarCliente() {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget

    const data = {
      nomeCompleto: (form.nomeCompleto as HTMLInputElement).value,
      cpf: (form.cpf as HTMLInputElement).value,
      telefone: (form.telefone as HTMLInputElement).value,
      email: (form.email as HTMLInputElement).value,
      instagram: (form.instagram as HTMLInputElement).value,
      recebeBolsaFamilia:
        (form.recebeBolsaFamilia as HTMLSelectElement).value === "true",
      dataProvavelParto: (form.dataProvavelParto as HTMLInputElement).value,
      tempoGestacaoSemanas: Number(
        (form.tempoGestacaoSemanas as HTMLInputElement).value
      ),
      possuiSenhaGov:
        (form.possuiSenhaGov as HTMLSelectElement).value === "true",
      senhaGov: (form.senhaGov as HTMLInputElement).value,
      statusCliente: (form.statusCliente as HTMLSelectElement).value,
      faseProcesso: (form.faseProcesso as HTMLSelectElement).value,
      statusContrato: (form.statusContrato as HTMLSelectElement).value,
      statusNascimento: (form.statusNascimento as HTMLSelectElement).value,
      observacoes: (form.observacoes as HTMLTextAreaElement).value,
    }

    await fetch("/api/clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    form.reset()
  }

  return (
    <FormCard>
      <h1 className="text-2xl font-bold mb-6">
        Nova Cliente
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        
        <h2 className="text-base font-semibold mt-4 mb-2">
          Dados pessoais
        </h2>

        <div className="flex flex-col gap-1">
          <label>Nome Completo</label>
          <input 
            name="nomeCompleto" 
            placeholder="Nome Completo" 
            required
            className="border p-2" 
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>CPF</label>
          <input 
            name="cpf" 
            placeholder="CPF" 
            required
            className="border p-2" 
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>Telefone</label>
          <input 
            name="telefone" 
            placeholder="Telefone" 
            required
            className="border p-2" 
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>Email</label>
          <input 
            name="email" 
            placeholder="Email" 
            required
            className="border p-2" 
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>Instagram</label>
          <input 
            name="instagram" 
            placeholder="@perfil" 
            className="border p-2" 
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>Recebe Bolsa Família</label>
          <select 
            name="recebeBolsaFamilia"
            className="border p-2"
          >
            <option value="false">Não</option>
            <option value="true">Sim</option>
          </select>
        </div>

        <h2 className="text-base font-semibold mt-4 mb-2">
          Gestação
        </h2>

        <div className="flex flex-col gap-1">
          <label>Data provável do parto</label>
          <input 
            type="date" 
            name="dataProvavelParto"
            className="border p-2"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>Semanas de gestação</label>
          <input
            name="tempoGestacaoSemanas"
            placeholder="Semanas de gestação"
            type="number"
            className="border p-2"
          />
        </div>

        <h2 className="text-base font-semibold mt-4 mb-2">
          Acesso GOV
        </h2>

        <div className="flex flex-col gap-1">
          <label>Possui senha GOV?</label>
          <select 
            name="possuiSenhaGov"
            className="border p-2"
          >
            <option value="false">Não</option>
            <option value="true">Sim</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label>Senha GOV</label>
          <input 
            name="senhaGov" 
            placeholder="Senha GOV" 
            className="border p-2"
          />
        </div>

        <h2 className="text-base font-semibold mt-4 mb-2">
          Status do processo
        </h2>

        <div className="flex flex-col gap-1">
          <label>Status Cliente</label>
          <select 
            name="statusCliente"
            className="border p-2"
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
            className="border p-2"
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
            className="border p-2"
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
            className="border p-2"
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
            className="border p-2"
          />
        </div>

        <button 
          type="submit"
          className="bg-blue-600 text-white p-2 rounded"  
        >
          Salvar cliente
        </button>
      </form>
    </FormCard>
  )
}