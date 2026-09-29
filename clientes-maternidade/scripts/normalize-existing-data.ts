// scripts/normalize-existing-data.ts
import { prisma } from "@/lib/prisma"
import { formatCPF, formatTelefone, validateTelefone } from "@/lib/formatters"

async function normalizeData() {
  const clientes = await prisma.cliente.findMany()

  for (const cliente of clientes) {
    const updates: Record<string, string | null> = {}

    // Normalize email to lowercase
    if (cliente.email && cliente.email !== cliente.email.toLowerCase()) {
      updates.email = cliente.email.toLowerCase()
    }

    // Normalize CPF
    if (cliente.cpf && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cliente.cpf)) {
        const raw = cliente.cpf.replace(/\D/g, "")
        if (raw.length === 11) {
            updates.cpf = formatCPF(raw)  // Force format regardless of validation
        }
    }

    // Normalize Telefone
    if (cliente.telefone && !/^\(\d{2}\)\d{5}-\d{4}$/.test(cliente.telefone)) {
      const formatted = formatTelefone(cliente.telefone)
      if (validateTelefone(formatted)) {
        updates.telefone = formatted
      }
    }

    if (Object.keys(updates).length > 0) {
      await prisma.cliente.update({
        where: { idCliente: cliente.idCliente },
        data: updates,
      })
      console.log(`Updated ${cliente.idCliente}:`, updates)
    }
  }

  console.log("Normalization complete")
}

normalizeData()
  .catch(console.error)
  .finally(() => prisma.$disconnect())