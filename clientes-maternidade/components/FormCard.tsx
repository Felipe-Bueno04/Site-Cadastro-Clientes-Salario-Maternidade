export function FormCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-left items-start min-h-screen p-6">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6">
        {children}
      </div>
    </div>
  )
}