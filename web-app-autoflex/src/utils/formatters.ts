export const formatCurrencyBRL = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

export const formatNumberBR = (value: number) => value.toLocaleString('pt-BR')
