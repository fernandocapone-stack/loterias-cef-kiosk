import { create } from 'zustand';

export interface BolaoInfo {
  cotas: number;        // nº de participantes = nº de comprovantes impressos
  valorPorCota: number; // R$ por cota
}

export interface ApostaItem {
  id: string;
  modalidadeId: string;
  modalidadeNome: string;
  numeros: number[];
  concursos: number;
  teimosinha: boolean;
  valor: number;        // total da aposta (no bolão = cotas * valorPorCota)
  addedAt: number;      // Date.now() when aposta was added to cart
  bolao?: BolaoInfo;    // presente apenas em apostas do tipo bolão
}

export interface BoletoSnapshot {
  cedente: string;
  cnpj: string;
  descricao: string;
  vencimentoIso: string;
  valorOriginal: number;
  multa: number;
  juros: number;
  total: number;
  vencido: boolean;
  diasVencido: number;
  tipo: 'bancario' | 'arrecadacao';
  linhaDigitavel: string;
}

export interface RecargaSnapshot {
  operadoraId: string;
  operadoraNome: string;
  numero: string;
  valor: number;
}

export type OperationType = 'aposta' | 'boleto' | 'recarga' | 'loja';

export interface PendingOperation {
  type: OperationType;
  total: number;
  apostas?: ApostaItem[];
  cpf?: string | null;
  boleto?: BoletoSnapshot;
  recarga?: RecargaSnapshot;
}

export interface LastOperation extends PendingOperation {
  timestampIso: string;
  paymentMethod: string;
  authCode: string;
  nsu: string;
  bilheteNumeros?: string[]; // um número de bilhete por aposta
}

interface SessionState {
  apostas: ApostaItem[];
  cpfNaAposta: string | null;
  pendingOperation: PendingOperation | null;
  lastOperation: LastOperation | null;
  cartOpen: boolean;
  addAposta: (a: ApostaItem) => void;
  removeAposta: (id: string) => void;
  setCpf: (cpf: string | null) => void;
  totalApostas: () => number;
  setCartOpen: (open: boolean) => void;
  setPendingOperation: (op: PendingOperation) => void;
  finalizeOperation: (paymentMethod: string) => LastOperation | null;
  clearLastOperation: () => void;
  reset: () => void;
}

function generateAuthCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 10; i++) {
    s += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return s;
}

function generateNsu(): string {
  return String(Math.floor(Math.random() * 900_000_000) + 100_000_000);
}

function generateBilheteNumero(): string {
  let s = '';
  for (let i = 0; i < 14; i++) s += Math.floor(Math.random() * 10);
  return s.replace(/(\d{4})(\d{6})(\d{4})/, '$1 $2 $3');
}

export const useSession = create<SessionState>((set, get) => ({
  apostas: [],
  cpfNaAposta: null,
  pendingOperation: null,
  lastOperation: null,
  cartOpen: false,
  addAposta: (a) => set((s) => ({ apostas: [...s.apostas, { ...a, addedAt: a.addedAt ?? Date.now() }] })),
  removeAposta: (id) =>
    set((s) => ({ apostas: s.apostas.filter((x) => x.id !== id) })),
  setCpf: (cpf) => set({ cpfNaAposta: cpf }),
  totalApostas: () => get().apostas.reduce((sum, a) => sum + a.valor, 0),
  setCartOpen: (open) => set({ cartOpen: open }),
  setPendingOperation: (op) => set({ pendingOperation: op }),
  finalizeOperation: (paymentMethod) => {
    const pending = get().pendingOperation;
    if (!pending) return null;
    const last: LastOperation = {
      ...pending,
      timestampIso: new Date().toISOString(),
      paymentMethod,
      authCode: generateAuthCode(),
      nsu: generateNsu(),
      // Em bolão imprime-se 1 comprovante por cota; demais apostas, 1 por aposta.
      bilheteNumeros: pending.apostas?.flatMap((a) => {
        const qtd = a.bolao ? a.bolao.cotas : 1;
        return Array.from({ length: qtd }, () => generateBilheteNumero());
      }),
    };
    set({ lastOperation: last, pendingOperation: null });
    return last;
  },
  clearLastOperation: () => set({ lastOperation: null }),
  reset: () =>
    set({
      apostas: [],
      cpfNaAposta: null,
      pendingOperation: null,
      lastOperation: null,
      cartOpen: false,
    }),
}));
