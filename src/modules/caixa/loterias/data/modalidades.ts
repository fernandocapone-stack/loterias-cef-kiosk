export interface Modalidade {
  id: string;
  nome: string;
  cor: string;
  corClara: string;
  monograma: string;
  minNumeros: number;
  maxNumeros: number;
  totalNumeros: number;
  precoBase: number;
  concursoAtual: number;
  premioEstimado: number;
  proximoSorteio: string;
}

// Cores oficiais — extraídas do Figma (250:1692)
export const MODALIDADES: Modalidade[] = [
  {
    id: 'mega-sena',
    nome: 'Mega-Sena',
    cor: '#00AB67',
    corClara: '#4DD4A0',
    monograma: 'M',
    minNumeros: 6,
    maxNumeros: 15,
    totalNumeros: 60,
    precoBase: 5,
    concursoAtual: 2789,
    premioEstimado: 90_000_000,
    proximoSorteio: 'Quarta, 20:00',
  },
  {
    id: 'lotofacil',
    nome: 'Lotofácil',
    cor: '#803594',
    corClara: '#B470C4',
    monograma: 'LF',
    minNumeros: 15,
    maxNumeros: 20,
    totalNumeros: 25,
    precoBase: 3,
    concursoAtual: 3215,
    premioEstimado: 5_000_000,
    proximoSorteio: 'Hoje, 20:00',
  },
  {
    id: 'quina',
    nome: 'Quina',
    cor: '#005DA4',
    corClara: '#4A8FCC',
    monograma: 'Q',
    minNumeros: 5,
    maxNumeros: 15,
    totalNumeros: 80,
    precoBase: 2.5,
    concursoAtual: 6512,
    premioEstimado: 7_200_000,
    proximoSorteio: 'Hoje, 20:00',
  },
  {
    id: 'lotomania',
    nome: 'Lotomania',
    cor: '#F99D1C',
    corClara: '#FBBD60',
    monograma: 'LM',
    minNumeros: 50,
    maxNumeros: 50,
    totalNumeros: 100,
    precoBase: 3,
    concursoAtual: 2640,
    premioEstimado: 6_000_000,
    proximoSorteio: 'Sexta, 20:00',
  },
  {
    id: 'timemania',
    nome: 'Timemania',
    cor: '#13EA95',
    corClara: '#5CF0B8',
    monograma: 'T',
    minNumeros: 10,
    maxNumeros: 10,
    totalNumeros: 80,
    precoBase: 3.5,
    concursoAtual: 2105,
    premioEstimado: 14_500_000,
    proximoSorteio: 'Terça, 20:00',
  },
  {
    id: 'duplasena',
    nome: 'Dupla Sena',
    cor: '#A62A52',
    corClara: '#D46A8A',
    monograma: 'DS',
    minNumeros: 6,
    maxNumeros: 15,
    totalNumeros: 50,
    precoBase: 2.5,
    concursoAtual: 2780,
    premioEstimado: 1_300_000,
    proximoSorteio: 'Sábado, 20:00',
  },
  {
    id: 'milionaria',
    nome: '+Milionária',
    cor: '#00BDF2',
    corClara: '#4DD3F8',
    monograma: '+M',
    minNumeros: 6,
    maxNumeros: 12,
    totalNumeros: 50,
    precoBase: 6,
    concursoAtual: 165,
    premioEstimado: 110_000_000,
    proximoSorteio: 'Sábado, 20:00',
  },
  {
    id: 'loteca',
    nome: 'Loteca',
    cor: '#ED1C24',
    corClara: '#F36870',
    monograma: 'L',
    minNumeros: 14,
    maxNumeros: 14,
    totalNumeros: 14,
    precoBase: 3,
    concursoAtual: 1095,
    premioEstimado: 1_200_000,
    proximoSorteio: 'Domingo, 20:00',
  },
  {
    id: 'diaDesorte',
    nome: 'Dia de Sorte',
    cor: '#54BBAB',
    corClara: '#8DD6CB',
    monograma: 'DS',
    minNumeros: 7,
    maxNumeros: 14,
    totalNumeros: 31,
    precoBase: 1.5,
    concursoAtual: 972,
    premioEstimado: 1_800_000,
    proximoSorteio: 'Quinta, 20:00',
  },
];

export function getModalidade(id: string): Modalidade | undefined {
  return MODALIDADES.find((m) => m.id === id);
}

export function calcularPreco(m: Modalidade, qtd: number): number {
  if (qtd === m.minNumeros) return m.precoBase;
  const ratio = Math.pow(qtd / m.minNumeros, 2.4);
  return Math.round(m.precoBase * ratio * 100) / 100;
}
