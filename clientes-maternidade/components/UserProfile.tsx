"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"

export default function UserProfile() {
  const { data: session } = useSession()
  const [aberto, setAberto] = useState(false)

  if (!session?.user) {
    return null
  }

  const primeiroNome = session.user.name?.split(" ")[0] || "Usuário"
  const inicial = primeiroNome.charAt(0).toUpperCase()

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAberto(!aberto)}
        className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700 hover:bg-gray-300 transition cursor-pointer"
        aria-label="Abrir perfil"
      >
        {inicial}
      </button>

      {aberto && (
        <div className="absolute right-0 top-12 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
          <div className="pb-4 border-b border-gray-200">
            <p className="font-semibold text-gray-900">
              {session.user.name || "Usuário"}
            </p>

            <p className="text-sm text-gray-500 mt-1 break-all">
              {session.user.email}
            </p>

            {session.user.role === "ADMIN" && session.user.adminCode && (
              <p className="text-sm text-gray-500 mt-2">
                Código Admin: {session.user.adminCode}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full mt-4 text-left text-red-600 hover:text-red-700 cursor-pointer"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  )
}