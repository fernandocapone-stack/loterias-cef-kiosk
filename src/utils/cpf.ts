export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function formatCpf(raw: string): string {
  const d = onlyDigits(raw).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export function maskCpfForDisplay(raw: string): string {
  const d = onlyDigits(raw);
  if (d.length !== 11) return formatCpf(raw);
  return `***.${d.slice(3, 6)}.${d.slice(6, 9)}-**`;
}

export function isValidCpf(raw: string): boolean {
  const d = onlyDigits(raw);
  if (d.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(d)) return false;

  const calcDigit = (slice: string, factor: number): number => {
    let sum = 0;
    for (let i = 0; i < slice.length; i++) {
      sum += parseInt(slice[i], 10) * (factor - i);
    }
    const rem = (sum * 10) % 11;
    return rem === 10 ? 0 : rem;
  };

  const dv1 = calcDigit(d.slice(0, 9), 10);
  if (dv1 !== parseInt(d[9], 10)) return false;
  const dv2 = calcDigit(d.slice(0, 10), 11);
  return dv2 === parseInt(d[10], 10);
}
