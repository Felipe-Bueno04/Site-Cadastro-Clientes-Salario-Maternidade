"use client"

export default function criarCliente() {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget

    const data = {
      nomeCompleto: (form.nomeCompleto as HTMLInputElement).value,
      cpf: (form.cpf as HTMLInputElement).value,
      telefone: (form.telefone as HTMLInputElement).value,
      email: (form.email as HTMLInputElement).value,
    }

    await fetch("/api/clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    form.reset() // Limpa o formulário após o envio
  }

  return (
    <div>
      <h1>Nova Cliente</h1>

      <form onSubmit={handleSubmit}>
        <input name="nomeCompleto" placeholder="Nome Completo" required />
        <br />

        <input name="cpf" placeholder="CPF" required />
        <br />

        <input name="telefone" placeholder="Telefone" required />
        <br />

        <input name="email" placeholder="Email" />
        <br />

        <button type="submit">Salvar</button>
      </form>
    </div>
  )
}