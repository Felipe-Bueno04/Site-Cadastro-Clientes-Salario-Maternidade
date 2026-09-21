"use client"

import { useRouter } from "next/navigation"

type Props = {
  id: string
  nomeCompleto: string
  statusAtual: string
}

export default function InativarCliente({ id, nomeCompleto, statusAtual }: Props) {
  const router = useRouter()

  const isInactive = statusAtual === "INATIVA"
  const acao = isInactive ? "reativar" : "inativar"
  const label = isInactive ? "Reativar" : "Inativar"
  const bgColor = isInactive ? "#16a34a" : "#dc2626" // green / red

  async function handleToggle() {
    const confirmacao = confirm(
      `Tem certeza que deseja ${acao} "${nomeCompleto}"?`
    )

    if (!confirmacao) return

    const response = await fetch(`/api/clientes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statusCliente: isInactive ? "ATIVA" : "INATIVA" }),
    })

    if (response.ok) {
      router.refresh()
    } else {
      alert(`Erro ao ${acao} cliente.`)
    }
  }

  return (
    <button
      onClick={handleToggle}
      style={{
        backgroundColor: bgColor,
        color: "white",
        padding: "8px 16px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  )
}