import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { generateAdminCode } from "@/lib/generateAdminCode"

export async function POST(req: Request) {
  const body = await req.json()

  const { name, email, password, role, adminCode } = body

  // Verificar se email já existe
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return new Response("Email já cadastrado!", { status: 400 })
  }

  const hashedPassword = await hash(password, 10)

  // 👑 ADMIN
  if (role === "ADMIN") {
    const newAdminCode = generateAdminCode()

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
        adminCode: newAdminCode,
      },
    })

    return Response.json(user)
  }

  // 🤝 PARCEIRO
  if (role === "PARCEIRO") {
    const admin = await prisma.user.findUnique({
      where: { adminCode },
    })

    if (!admin || admin.role !== "ADMIN") {
      return new Response("Código de admin inválido!", { status: 400 })
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "PARCEIRO",
        adminId: admin.id,
      },
    })

    return Response.json(user)
  }

  return new Response("Tipo de usuário inválido!", { status: 400 })
}