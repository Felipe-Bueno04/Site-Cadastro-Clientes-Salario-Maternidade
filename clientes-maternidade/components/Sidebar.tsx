"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export default function Sidebar() {
  const { data: session } = useSession()

  return (
    <aside className="w-56 bg-gray-100 p-5 border-r border-gray-300">
      <h2 className="text-2xl font-bold mb-6">Painel</h2>

      <nav className="flex flex-col gap-3">
        <Link href="/dashboard" className="hover:text-blue-600">
          Dashboard
        </Link>

        <Link href="/clientes" className="hover:text-blue-600">
          Clientes
        </Link>

        {session?.user?.role === "ADMIN" && (
          <Link href="/financeiro" className="hover:text-blue-600">
            Financeiro
          </Link>
        )}
      </nav>

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded mt-6 transition"
      >
        Sair
      </button>
    </aside>
  )
}