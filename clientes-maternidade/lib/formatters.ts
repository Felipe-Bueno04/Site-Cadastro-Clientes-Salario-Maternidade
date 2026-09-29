export function formatCPF(cpf: string): string {
  const numbers = cpf.replace(/\D/g, "")
  if (numbers.length !== 11) return cpf
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}

export function formatTelefone(telefone: string): string {
  const numbers = telefone.replace(/\D/g, "")
  if (numbers.length !== 11) return telefone
  return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1)$2-$3")
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateCPF(cpf: string): boolean {
  const numbers = cpf.replace(/\D/g, "")
  if (numbers.length !== 11) return false
  if (/^(\d)\1{10}$/.test(numbers)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(numbers.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(numbers.charAt(10))) return false

  return true
}

export function validateTelefone(telefone: string): boolean {
  const numbers = telefone.replace(/\D/g, "")
  return numbers.length === 11
}

export function unformatCPF(cpf: string): string {
  return cpf.replace(/\D/g, "")
}

export function unformatTelefone(telefone: string): string {
  return telefone.replace(/\D/g, "")
}