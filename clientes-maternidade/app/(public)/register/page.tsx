"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { validateEmail } from "@/lib/formatters"

export default function RegisterPage() {
    const [role, setRole] = useState("ADMIN")
    const [error, setError] = useState("")

    const router = useRouter()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError("")

        const formData = new FormData(e.currentTarget)

        const email = formData.get("email") as string

        if (!validateEmail(email)) {
            setError("E-mail inválido. Use um formato válido (ex: usuario@gmail.com)")
            return
        }

        const data = {
            name: formData.get("name") as string,
            email: email.toLowerCase(),
            password: formData.get("password") as string,
            role,
            adminCode: formData.get("adminCode") as string | null,
        }

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

        if (!res.ok) {
            const errorText = await res.text()
            setError(errorText)
            return
        }

        alert("Cadastro realizado com sucesso!")

        router.push("/login")
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form 
                onSubmit={handleSubmit} 
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
            >
                <h1 className="text-2xl font-semibold text-center">
                    Criar Conta
                </h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                        {error}
                    </div>
                )}

                <input 
                    name="name" 
                    placeholder="Nome" 
                    required
                    autoComplete="off"
                    className="w-full border p-2 rounded"
                />

                <input 
                    name="email" 
                    placeholder="usuario@gmail.com" 
                    required
                    type="email"
                    autoComplete="off"
                    className="w-full border p-2 rounded"
                />
                
                <input 
                    name="password" 
                    placeholder="Senha" 
                    required
                    autoComplete="off"
                    className="w-full border p-2 rounded"
                />

                <select 
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border p-2 rounded"
                >
                    <option value="ADMIN">Admin</option>
                    <option value="PARCEIRO">Parceiro</option>
                </select>

                {role === "PARCEIRO" && (
                    <input 
                        name="adminCode" 
                        placeholder="Código do Admin" 
                        required
                        autoComplete="off"
                        className="w-full border p-2 rounded"    
                    />
                )}

                <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                >
                    Cadastrar
                </button>
            </form>
        </div>
    )
}