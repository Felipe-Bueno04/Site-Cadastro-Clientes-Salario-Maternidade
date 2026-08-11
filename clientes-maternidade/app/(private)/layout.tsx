import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Sidebar from "@/components/Sidebar"

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  const firstName = session.user.name?.split(" ")[0] || "Usuário"
  const email = session.user.email || ""

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1">
        <div className="border-b border-gray-200 bg-white px-8 py-5">
          <div>
            <p className="text-base font-semibold text-gray-900">
              {firstName}
            </p>

            <p className="text-sm text-gray-500">
              {email}
            </p>
          </div>
        </div>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}