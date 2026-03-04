export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif" }}>
        <div style={{ display: "flex", height: "100vh" }}>
          
          {/* Sidebar */}
          <aside
            style={{
              width: "220px",
              background: "#f4f4f4",
              padding: "20px",
              borderRight: "1px solid #ddd"
            }}
          >
            <h2>Painel</h2>
            <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <a href="/dashboard">Dashboard</a>
              <a href="/clientes">Clientes</a>
              <a href="/financeiro">Financeiro</a>
            </nav>
          </aside>

          {/* Conteúdo principal */}
          <main style={{ flex: 1, padding: "20px" }}>
            {children}
          </main>

        </div>
      </body>
    </html>
  )
}