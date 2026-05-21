import { onlyDigits } from './cpf';

export type BoletoTipo = 'bancario' | 'arrecadacao';

/**
 * Linha digitável:
 * - Bancário (47 dígitos): bancos, financeiras
 * - Arrecadação (48 dígitos): concessionárias (luz, água, gás, telefone, tributos)
 *   começa com 8.
 */
export function getTipoBoleto(raw: string): BoletoTipo {
  const d = onlyDigits(raw);
  if (d.startsWith('8')) return 'arrecadacao';
  return 'bancario';
}

export function getMaxDigits(tipo: BoletoTipo): number {
  return tipo === 'arrecadacao' ? 48 : 47;
}

/**
 * Formata a linha digitável para exibição em grupos.
 * Bancário: 5.5 5.6 5.6 1 14
 * Arrecadação: 11 11 11 11 (4 grupos de 12 com último dígito separado em cada)
 */
export function formatBoleto(raw: string): string {
  const d = onlyDigits(raw);
  const tipo = getTipoBoleto(d);

  if (tipo === 'arrecadacao') {
    const groups = [
      d.slice(0, 11),
      d.slice(11, 22),
      d.slice(22, 33),
      d.slice(33, 44),
    ].filter(Boolean);
    return groups.join(' ');
  }

  // Bancário 47 dígitos: 5.5 5.6 5.6 1 14
  const a = d.slice(0, 5);
  const b = d.slice(5, 10);
  const c = d.slice(10, 15);
  const dd = d.slice(15, 21);
  const e = d.slice(21, 26);
  const f = d.slice(26, 32);
  const g = d.slice(32, 33);
  const h = d.slice(33, 47);

  let out = '';
  if (a) out += a;
  if (b) out += '.' + b;
  if (c) out += '  ' + c;
  if (dd) out += '.' + dd;
  if (e) out += '  ' + e;
  if (f) out += '.' + f;
  if (g) out += '  ' + g;
  if (h) out += '  ' + h;
  return out;
}

export function placeholderBoleto(tipo: BoletoTipo): string {
  if (tipo === 'arrecadacao') {
    return '___________  ___________  ___________  ___________';
  }
  return '_____._____  _____.______  _____.______  _  ______________';
}

export interface BoletoLookup {
  cedente: string;
  cnpj: string;
  descricao: string;
  vencimento: Date;
  valorOriginal: number;
  multa: number;
  juros: number;
  total: number;
  vencido: boolean;
  diasVencido: number;
  tipo: BoletoTipo;
  pagavelAte: string;
  linhaDigitavel: string;
}

const cedentesMock: Record<BoletoTipo, Array<{ nome: string; cnpj: string; desc: string }>> = {
  bancario: [
    { nome: 'Banco Itaú S.A.', cnpj: '60.701.190/0001-04', desc: 'Fatura de cartão de crédito' },
    { nome: 'Vivo Telefônica Brasil', cnpj: '02.558.157/0001-62', desc: 'Plano pós-pago' },
    { nome: 'Editora Globo S.A.', cnpj: '04.067.191/0001-60', desc: 'Assinatura mensal' },
  ],
  arrecadacao: [
    { nome: 'CEMIG Distribuição S.A.', cnpj: '06.981.180/0001-16', desc: 'Conta de energia elétrica' },
    { nome: 'SABESP', cnpj: '43.776.517/0001-80', desc: 'Conta de água e esgoto' },
    { nome: 'Comgás', cnpj: '61.856.571/0001-17', desc: 'Conta de gás canalizado' },
  ],
};

/**
 * Mock de lookup do boleto. Em produção isso seria uma chamada à API
 * de consulta de títulos da Caixa, retornando os dados oficiais.
 */
export function lookupBoleto(raw: string): BoletoLookup {
  const d = onlyDigits(raw);
  const tipo = getTipoBoleto(d);
  const seed = parseInt(d.slice(-6) || '100000', 10);

  const cedentes = cedentesMock[tipo];
  const cedente = cedentes[seed % cedentes.length];

  // Valor: deriva dos últimos 8 dígitos (centavos)
  const rawValor = parseInt(d.slice(-8) || '5499', 10);
  const valorOriginal = Math.max(20, (rawValor % 50000) / 100);

  // Vencimento: aleatório entre -10 e +15 dias
  const offsetDays = (seed % 26) - 10;
  const vencimento = new Date();
  vencimento.setDate(vencimento.getDate() + offsetDays);
  vencimento.setHours(23, 59, 59);

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const venc0 = new Date(vencimento);
  venc0.setHours(0, 0, 0, 0);
  const diff = Math.floor((hoje.getTime() - venc0.getTime()) / (1000 * 60 * 60 * 24));
  const vencido = diff > 0;
  const diasVencido = vencido ? diff : 0;

  // Multa: 2% se vencido, juros: 0,033% ao dia
  const multa = vencido ? valorOriginal * 0.02 : 0;
  const juros = vencido ? valorOriginal * 0.00033 * diasVencido : 0;
  const total = +(valorOriginal + multa + juros).toFixed(2);

  const pagavelAte = vencido
    ? formatDate(vencimento)
    : 'Pagável até o vencimento';

  return {
    cedente: cedente.nome,
    cnpj: cedente.cnpj,
    descricao: cedente.desc,
    vencimento,
    valorOriginal: +valorOriginal.toFixed(2),
    multa: +multa.toFixed(2),
    juros: +juros.toFixed(2),
    total,
    vencido,
    diasVencido,
    tipo,
    pagavelAte,
    linhaDigitavel: d,
  };
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function isComplete(raw: string): boolean {
  const d = onlyDigits(raw);
  const tipo = getTipoBoleto(d);
  return d.length === getMaxDigits(tipo);
}
