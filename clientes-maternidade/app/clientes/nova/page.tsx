"use client"

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
      origemParceira: (form.origemParceira as HTMLInputElement).value,
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
    <div>
      <h1>Nova Cliente</h1>

      <form onSubmit={handleSubmit}>
        <h2>Dados pessoais</h2>
        <input name="nomeCompleto" placeholder="Nome Completo" required />
        <br />

        <input name="cpf" placeholder="CPF" required />
        <br />

        <input name="telefone" placeholder="Telefone" required />
        <br />

        <input name="email" placeholder="Email" />
        <br />

        <input name="instagram" placeholder="Instagram" />
        <br />

        <input name="origemParceira" placeholder="Origem parceira" />
        <br />

        <label>Recebe Bolsa Família</label>
        <select name="recebeBolsaFamilia">
          <option value="false">Não</option>
          <option value="true">Sim</option>
        </select>
        <br />

        <h2>Gestação</h2>
        <label>Data provável do parto</label>
        <input type="date" name="dataProvavelParto" />
        <br />

        <input
          name="tempoGestacaoSemanas"
          placeholder="Semanas de gestação"
          type="number"
        />
        <br />

        <h2>Acesso GOV</h2>
        <label>Possui senha GOV?</label>
        <select name="possuiSenhaGov">
          <option value="false">Não</option>
          <option value="true">Sim</option>
        </select>
        <br />

        <input name="senhaGov" placeholder="Senha GOV" />
        <br />

        <h2>Status do processo</h2>
        <label>Status Cliente</label>
        <select name="statusCliente">
          <option value="ATIVA">Ativa</option>
          <option value="INATIVA">Inativa</option>
          <option value="FINALIZADA">Finalizada</option>
          <option value="CANCELADA">Cancelada</option>
        </select>
        <br />

        <label>Fase Processo</label>
          <select name="faseProcesso">
            <option value="CADASTRO">Cadastro</option>
            <option value="ANALISE_DOCUMENTOS">Análise documentos</option>
            <option value="CONTRATO_ENVIADO">Contrato enviado</option>
            <option value="AGUARDANDO_ASSINATURA">Aguardando assinatura</option>
            <option value="PROCESSO_ENVIADO_INSS">Processo enviado ao INSS</option>
            <option value="PROCESSO_FINALIZADO">Processo finalizado</option>
          </select>
        <br />

        <label>Status Contrato</label>
        <select name="statusContrato">
          <option value="NAO_ENVIADO">Não enviado</option>
          <option value="ENVIADO">Enviado</option>
          <option value="ASSINADO">Assinado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
        <br />

        <label>Status Nascimento</label>
        <select name="statusNascimento">
          <option value="AGUARDANDO">Aguardando</option>
          <option value="NASCEU">Nasceu</option>
          <option value="NAO_INFORMADO">Não informado</option>
        </select>
        <br />

        <h2>Observações</h2>
        
        <textarea name="observacoes" rows={4} />
        <br />

        <button type="submit">Salvar</button>
      </form>
    </div>
  )
}