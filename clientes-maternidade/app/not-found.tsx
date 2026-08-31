export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">
          404
        </h1>


        <p className="mt-4 text-xl text-gray-600">
          Página não encontrada
        </p>


        <p className="mt-2 text-gray-500">
          A página ou informação que você está tentando acessar não existe
          ou não está disponível.
        </p>


        <a
          href="/dashboard"
          className="inline-block mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
        >
          Voltar ao Dashboard
        </a>
      </div>
    </div>
  )
}