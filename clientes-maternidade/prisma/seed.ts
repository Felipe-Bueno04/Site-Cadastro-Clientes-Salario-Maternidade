import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

async function main() {
  const passwordHash = await bcrypt.hash("$ioPj5", 10)

  await prisma.user.create({
    data: {
      email: "admin@email.com",
      name: "Admin",
      password: passwordHash,
      role: "ADMIN",
    },
  })

  console.log("Admin criado com sucesso!")
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })