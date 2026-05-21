export interface Produto {
  id: string;
  nome: string;
  codigo: string;
  preco: number;
  categoriaId: string;
}

export const produtos: Produto[] = [
  // ── Bebidas ─────────────────────────────────────────────
  { id: 'beb-01', nome: 'Água Mineral 500ml',        codigo: 'COD 33343444434', preco:  5.90, categoriaId: 'bebidas' },
  { id: 'beb-02', nome: 'Refrigerante Lata 350ml',   codigo: 'COD 33343444435', preco:  7.50, categoriaId: 'bebidas' },
  { id: 'beb-03', nome: 'Suco de Laranja 300ml',     codigo: 'COD 33343444436', preco:  8.90, categoriaId: 'bebidas' },
  { id: 'beb-04', nome: 'Energético 473ml',          codigo: 'COD 33343444437', preco: 12.90, categoriaId: 'bebidas' },
  { id: 'beb-05', nome: 'Café Expresso',             codigo: 'COD 33343444438', preco:  5.00, categoriaId: 'bebidas' },
  { id: 'beb-06', nome: 'Achocolatado 200ml',        codigo: 'COD 33343444439', preco:  6.50, categoriaId: 'bebidas' },
  { id: 'beb-07', nome: 'Cerveja Lata 350ml',        codigo: 'COD 33343444440', preco:  9.90, categoriaId: 'bebidas' },
  { id: 'beb-08', nome: 'Água com Gás 500ml',        codigo: 'COD 33343444441', preco:  6.90, categoriaId: 'bebidas' },

  // ── Revistas ─────────────────────────────────────────────
  { id: 'rev-01', nome: 'Revista Semanal Ed. 142',   codigo: 'COD 44451234001', preco: 14.90, categoriaId: 'revistas' },
  { id: 'rev-02', nome: 'Jornal Diário',             codigo: 'COD 44451234002', preco:  5.00, categoriaId: 'revistas' },
  { id: 'rev-03', nome: 'Revista de Esportes',       codigo: 'COD 44451234003', preco: 18.90, categoriaId: 'revistas' },
  { id: 'rev-04', nome: 'HQ Edição Especial',        codigo: 'COD 44451234004', preco: 29.90, categoriaId: 'revistas' },
  { id: 'rev-05', nome: 'Revista de Variedades',     codigo: 'COD 44451234005', preco: 12.90, categoriaId: 'revistas' },
  { id: 'rev-06', nome: 'Revista Crossword',         codigo: 'COD 44451234006', preco:  9.90, categoriaId: 'revistas' },

  // ── Doces e Snacks ───────────────────────────────────────
  { id: 'doc-01', nome: 'Chocolate ao Leite 100g',   codigo: 'COD 55562345001', preco:  8.90, categoriaId: 'doces-snacks' },
  { id: 'doc-02', nome: 'Barra de Cereal',           codigo: 'COD 55562345002', preco:  4.50, categoriaId: 'doces-snacks' },
  { id: 'doc-03', nome: 'Salgadinho Pacote 50g',     codigo: 'COD 55562345003', preco:  5.90, categoriaId: 'doces-snacks' },
  { id: 'doc-04', nome: 'Biscoito Recheado 140g',    codigo: 'COD 55562345004', preco:  6.90, categoriaId: 'doces-snacks' },
  { id: 'doc-05', nome: 'Amendoim Torrado 100g',     codigo: 'COD 55562345005', preco:  7.50, categoriaId: 'doces-snacks' },
  { id: 'doc-06', nome: 'Pipoca Micro-ondas',        codigo: 'COD 55562345006', preco:  5.00, categoriaId: 'doces-snacks' },
  { id: 'doc-07', nome: 'Goma de Mascar',            codigo: 'COD 55562345007', preco:  3.90, categoriaId: 'doces-snacks' },
  { id: 'doc-08', nome: 'Bolo Embalado Individual',  codigo: 'COD 55562345008', preco:  7.90, categoriaId: 'doces-snacks' },

  // ── Cigarros ─────────────────────────────────────────────
  { id: 'cig-01', nome: 'Cigarro Maço Tradicional',  codigo: 'COD 66673456001', preco: 14.00, categoriaId: 'cigarros' },
  { id: 'cig-02', nome: 'Cigarro Maço Light',        codigo: 'COD 66673456002', preco: 14.00, categoriaId: 'cigarros' },
  { id: 'cig-03', nome: 'Cigarro Menthol',           codigo: 'COD 66673456003', preco: 15.00, categoriaId: 'cigarros' },
  { id: 'cig-04', nome: 'Isqueiro Descartável',      codigo: 'COD 66673456004', preco:  4.90, categoriaId: 'cigarros' },

  // ── Comidas ──────────────────────────────────────────────
  { id: 'hig-01', nome: 'Pão de Queijo 3un',         codigo: 'COD 77784567001', preco:  8.90, categoriaId: 'comidas' },
  { id: 'hig-02', nome: 'Sanduíche Natural',         codigo: 'COD 77784567002', preco: 14.90, categoriaId: 'comidas' },
  { id: 'hig-03', nome: 'Pastel de Frango',          codigo: 'COD 77784567003', preco: 10.90, categoriaId: 'comidas' },
  { id: 'hig-04', nome: 'Tapioca Recheada',          codigo: 'COD 77784567004', preco: 12.90, categoriaId: 'comidas' },
  { id: 'hig-05', nome: 'Coxinha 2un',               codigo: 'COD 77784567005', preco:  9.90, categoriaId: 'comidas' },
  { id: 'hig-06', nome: 'Misto Quente',              codigo: 'COD 77784567006', preco: 11.90, categoriaId: 'comidas' },

  // ── Outros ───────────────────────────────────────────────
  { id: 'out-01', nome: 'Carregador USB Portátil',   codigo: 'COD 88895678001', preco: 49.90, categoriaId: 'outros' },
  { id: 'out-02', nome: 'Fone de Ouvido P2',         codigo: 'COD 88895678002', preco: 24.90, categoriaId: 'outros' },
  { id: 'out-03', nome: 'Caneta Esferográfica',       codigo: 'COD 88895678003', preco:  3.50, categoriaId: 'outros' },
  { id: 'out-04', nome: 'Bloco de Notas',            codigo: 'COD 88895678004', preco:  8.90, categoriaId: 'outros' },
  { id: 'out-05', nome: 'Envelope Branco 10un',      codigo: 'COD 88895678005', preco:  5.90, categoriaId: 'outros' },
  { id: 'out-06', nome: 'Pilha AA par',              codigo: 'COD 88895678006', preco: 11.90, categoriaId: 'outros' },
];

export function getProdutosByCategoria(categoriaId: string): Produto[] {
  return produtos.filter((p) => p.categoriaId === categoriaId);
}
