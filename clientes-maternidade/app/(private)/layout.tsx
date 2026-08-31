import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Sidebar from "@/components/Sidebar"
import UserProfile from "@/components/UserProfile"

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1">
        <div className="border-b border-gray-200 bg-white px-8 py-3 flex justify-end items-center">
          <UserProfile />
        </div>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}