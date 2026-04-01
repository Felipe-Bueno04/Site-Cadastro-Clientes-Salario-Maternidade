import Providers from "@/components/Providers"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif" }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}