"use client"

import { useRouter } from "next/navigation"

type Props = {
  id: string
}

export default function ExcluirCliente({ id }: Props) {
  const router = useRouter()

  async function handleDelete() {
    const confirmacao = confirm(
      "Tem certeza que deseja excluir este cliente? Essa ação não pode ser desfeita."
    )

    if (!confirmacao) return

    const response = await fetch(`/api/clientes/${id}`, {
      method: "DELETE",
    })

    if (response.ok) {
      router.push("/clientes")
      router.refresh()
    } else {
      alert("Erro ao excluir cliente.")
    }
  }

  return (
    <button
      onClick={handleDelete}
      style={{
        backgroundColor: "#dc2626",
        color: "white",
        padding: "8px 16px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
      }}
    >
      Excluir
    </button>
  )
}