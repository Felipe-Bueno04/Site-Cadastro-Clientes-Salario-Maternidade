export function getSemanaAtual() {
  const hoje = new Date()

  const inicioSemana = new Date(hoje)

  const diaSemana = inicioSemana.getDay()

  const diferencaParaSegunda =
    diaSemana === 0 ? 6 : diaSemana - 1

  inicioSemana.setDate(
    inicioSemana.getDate() - diferencaParaSegunda
  )

  inicioSemana.setHours(0, 0, 0, 0)

  const inicioProximaSemana = new Date(inicioSemana)

  inicioProximaSemana.setDate(
    inicioProximaSemana.getDate() + 7
  )

  return {
    inicioSemana,
    inicioProximaSemana,
  }
}