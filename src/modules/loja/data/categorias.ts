export interface Categoria {
  id: string;
  nome: string;
  imagem?: string; // caminho relativo a /images/categorias/
}

export const categorias: Categoria[] = [
  { id: 'bebidas',      nome: 'Bebidas',        imagem: '/images/categorias/bebidas.png' },
  { id: 'revistas',     nome: 'Revistas',       imagem: '/images/categorias/revistas.png' },
  { id: 'doces-snacks', nome: 'Doces e Snacks', imagem: '/images/categorias/doces-snacks.png' },
  { id: 'cigarros',     nome: 'Cigarros',       imagem: '/images/categorias/cigarros.png' },
  { id: 'comidas',      nome: 'Comidas',        imagem: '/images/categorias/comidas.png' },
  { id: 'outros',       nome: 'Outros',         imagem: '/images/categorias/outros.png' },
];

export function getCategoria(id: string): Categoria | undefined {
  return categorias.find((c) => c.id === id);
}
