export function brl(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function brlCompact(value: number): string {
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(0)} milhões`;
  if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(0)} mil`;
  return brl(value);
}
