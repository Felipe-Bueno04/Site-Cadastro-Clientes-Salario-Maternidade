"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { StatusCliente } from "@prisma/client"

export default function StatusFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => { 
    function handleClickOutside(event: MouseEvent) { 
      if ( dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) 
      ) { 
        setOpen(false) 
      } 
    } 
    
    document.addEventListener("mousedown", handleClickOutside) 
    
    return () => { 
      document.removeEventListener("mousedown", handleClickOutside) 
    } 
  }, [])

  function atualizarFiltro(valor: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (valor) {
      params.set("status", valor)
    } else {
      params.delete("status")
    }

    params.delete("page")
    router.push(`/clientes?${params.toString()}`)
  }

  return (
    <div 
      ref={dropdownRef}
      style={{ 
        position: "relative" 
      }}
    >
      <span
        style={{ cursor: "pointer", fontWeight: 600 }}
        onClick={() => setOpen(!open)}
      >
        Status
      </span>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "28px",
            left: 0,
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "6px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            zIndex: 10,
            minWidth: "140px",
          }}
        >
          {Object.values(StatusCliente).map((s) => (
            <div
              key={s}
              style={{
                padding: "6px",
                cursor: "pointer",
              }}
              onClick={() => atualizarFiltro(s)}
            >
              {s}
            </div>
          ))}

          <div
            style={{
              padding: "6px",
              cursor: "pointer",
              borderTop: "1px solid #f1f5f9",
              marginTop: "4px",
            }}
            onClick={() => atualizarFiltro("")}
          >
            Limpar filtro
          </div>
        </div>
      )}
    </div>
  )
}