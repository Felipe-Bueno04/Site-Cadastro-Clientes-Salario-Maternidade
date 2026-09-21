"use client"

import { useRouter, useSearchParams } from "next/navigation"

export default function PeriodoSelect() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const periodoAtual = searchParams.get("periodo") || "ano"

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString())

    params.set("periodo", event.target.value)

    router.push(`/financeiro?${params.toString()}`)
  }

  return (
    <select
      name="periodo"
      defaultValue={periodoAtual}
      onChange={handleChange}
      style={{
        padding: "10px 14px",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        backgroundColor: "white",
        fontSize: "14px",
        cursor: "pointer",
        minWidth: "180px"
        }}
    >
      <option value="hoje">📅 Hoje</option>
      <option value="semana">📆 Essa semana</option>
      <option value="mes">📊 Este mês</option>
      <option value="ano">📈 Este ano</option>
    </select>
  )
}