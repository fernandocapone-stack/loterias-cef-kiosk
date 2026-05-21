import { create } from 'zustand';

export interface LojaItem {
  id: string;
  nome: string;
  codigo: string;
  preco: number;
  categoriaId: string;
  quantidade: number;
}

interface LojaState {
  itens: LojaItem[];
  addItem: (item: Omit<LojaItem, 'quantidade'>) => void;
  removeItem: (id: string) => void;
  setQuantidade: (id: string, quantidade: number) => void;
  totalItens: () => number;
  totalValor: () => number;
  clear: () => void;
}

export const useLojaStore = create<LojaState>((set, get) => ({
  itens: [],

  addItem: (item) =>
    set((s) => {
      const existing = s.itens.find((i) => i.id === item.id);
      if (existing) {
        return { itens: s.itens.map((i) => i.id === item.id ? { ...i, quantidade: i.quantidade + 1 } : i) };
      }
      return { itens: [...s.itens, { ...item, quantidade: 1 }] };
    }),

  removeItem: (id) =>
    set((s) => ({ itens: s.itens.filter((i) => i.id !== id) })),

  setQuantidade: (id, quantidade) =>
    set((s) => {
      if (quantidade <= 0) return { itens: s.itens.filter((i) => i.id !== id) };
      return { itens: s.itens.map((i) => i.id === id ? { ...i, quantidade } : i) };
    }),

  totalItens: () => get().itens.reduce((sum, i) => sum + i.quantidade, 0),

  totalValor: () => get().itens.reduce((sum, i) => sum + i.preco * i.quantidade, 0),

  clear: () => set({ itens: [] }),
}));
