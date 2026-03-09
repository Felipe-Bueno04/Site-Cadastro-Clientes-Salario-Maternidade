export function getAlertaParto(dataProvavelParto?: Date | null) {
 if (!dataProvavelParto) return null

 const hoje = new Date()

 const diff = dataProvavelParto.getTime() - hoje.getTime()

 const dias = Math.ceil(diff / (1000 * 60 * 60 * 24))

 if (dias < 0) {
  return {
    tipo: "atrasado",
    dias,
    cor: "#fecaca",
    texto: "⚠️ Data de parto já passou",
  }
 }

 if (dias <= 15 && dias >= 0) {
   return {
     tipo: "15",
     dias,
     cor: "#fee2e2",
     texto: "🔴 Parto em até 15 dias",
   }
 }

 if (dias <= 30 && dias > 15) {
   return {
     tipo: "30",
     dias,
     cor: "#fef9c3",
     texto: "🟡 Parto em até 30 dias",
   }
 }

 return null
}

export function calcularResumoAlertas(clientes: any[]) {

 let parto15 = 0
 let parto30 = 0
 let atrasados = 0

 clientes.forEach((cliente) => {

   const alerta = getAlertaParto(cliente.dataProvavelParto)

   if (alerta?.tipo === "15") parto15++
   if (alerta?.tipo === "30") parto30++
   if (alerta?.tipo === "atrasado") atrasados++

 })

 return {
   parto15,
   parto30,
   atrasados
 }
}