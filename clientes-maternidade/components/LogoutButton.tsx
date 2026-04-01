"use client"

import { signOut } from "next-auth/react"

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="bg-red-500 text-white p-2 rounded mt-4 transition"
    >
      Sair
    </button>
  )
}