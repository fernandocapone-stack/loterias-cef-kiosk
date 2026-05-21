import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useLojaStore } from '../../store/lojaStore';
import { useToastStore } from '../../store/toastStore';
import { getCategoria } from './data/categorias';
import { getProdutosByCategoria, type Produto } from './data/produtos';
import { brl } from '../../utils/currency';

/**
 * Categoria Expandida — Figma (355:1648), canvas 1440×1440.
 *
 * Header: bg #0066B3
 *   Back 280×80 | título da categoria 44px | Carrinho 280×80
 *
 * Body: flex-wrap, gap 24px, padding 24px
 *   Cada card 330px:
 *     Topo  — 330×252, white, radius 8 8 0 0 (área de imagem)
 *     Rodapé — white, radius 0 0 8 8, padding 40 32, col gap 24:
 *       Row: [nome (fill) + preço]
 *       Stepper: [−] fill [+] (bg #EFF5F9)
 *       Botão "Adicionar" (#00AB67)
 */

/* ── Placeholder de imagem por categoria ─────────────────── */
const CATEGORY_COLORS: Record<string, string> = {
  bebidas:        '#DBEAFE',
  revistas:       '#FEF9C3',
  'doces-snacks': '#FCE7F3',
  cigarros:       '#F3F4F6',
  comidas:        '#FEF3C7',
  outros:         '#E0E7FF',
};

function ProductCard({ produto }: { produto: Produto }) {
  const addItem    = useLojaStore((s) => s.addItem);
  const setQtd     = useLojaStore((s) => s.setQuantidade);
  const itens      = useLojaStore((s) => s.itens);
  const showToast  = useToastStore((s) => s.show);
  const item       = itens.find((i) => i.id === produto.id);
  const quantidade = item?.quantidade ?? 0;
  const bgColor    = CATEGORY_COLORS[produto.categoriaId] ?? '#F3F4F6';

  const handleAdd = () => {
    if (quantidade === 0) {
      addItem({ id: produto.id, nome: produto.nome, codigo: produto.codigo, preco: produto.preco, categoriaId: produto.categoriaId });
    } else {
      setQtd(produto.id, quantidade + 1);
    }
    showToast('Produto adicionado ao carrinho!');
  };

  const handleMinus = () => setQtd(produto.id, quantidade - 1);

  return (
    <div
      className="flex flex-col rounded-lg overflow-hidden"
      style={{ width: '100%', height: '100%', boxShadow: '0px 2px 4px rgba(0,0,0,0.08)' }}
    >
      {/* ── Topo: imagem (placeholder colorido) ── */}
      <div
        style={{
          width: '100%',
          height: 220,
          backgroundColor: bgColor,
          borderRadius: '8px 8px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <ShoppingCart
          style={{ width: 80, height: 80, color: 'rgba(0,0,0,0.12)' }}
          strokeWidth={1}
        />
      </div>

      {/* ── Rodapé: info + stepper + botão ── */}
      <div
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: '0 0 8px 8px',
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Nome + preço */}
        <div className="flex items-start justify-between" style={{ gap: 16, alignSelf: 'stretch' }}>
          <div className="flex flex-col" style={{ gap: 6, flex: 1 }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: '#374151', lineHeight: '130%' }}>
              {produto.nome}
            </span>
            <span style={{ fontSize: 14, fontWeight: 400, color: '#6B7280', lineHeight: '150%', opacity: 0.8 }}>
              {produto.codigo}
            </span>
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#0066B3', lineHeight: '120%', flexShrink: 0 }}>
            {brl(produto.preco)}
          </span>
        </div>

        {/* Stepper — bg #EFF5F9 */}
        <div
          className="flex items-center rounded-lg"
          style={{ backgroundColor: '#EFF5F9', alignSelf: 'stretch', gap: 8 }}
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleMinus}
            disabled={quantidade === 0}
            style={{
              width: 80, height: 80, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D0E0E3',
              borderRadius: 4,
              opacity: quantidade === 0 ? 0.4 : 1,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19" stroke="#0066B3" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </motion.button>

          <span style={{
            flex: 1, textAlign: 'center',
            fontSize: 20, fontWeight: 400, lineHeight: '20px',
            color: '#6B7280',
          }}>
            {quantidade}
          </span>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAdd}
            style={{
              width: 80, height: 80, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D0E0E3',
              borderRadius: 4,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="#0066B3" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </motion.button>
        </div>

        {/* Botão Adicionar — empurrado para o fundo */}
        <div style={{ flex: 1 }} />
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleAdd}
          className="flex items-center justify-center rounded-lg"
          style={{
            alignSelf: 'stretch',
            height: 80,
            gap: 12,
            padding: '0 16px',
            backgroundColor: '#00AB67',
            borderRadius: 8,
            border: 'none',
          }}
        >
          <ShoppingCart style={{ width: 32, height: 32, color: '#FFFFFF', flexShrink: 0 }} strokeWidth={2} />
          <span style={{ fontSize: 20, fontWeight: 600, color: '#FFFFFF', lineHeight: '20px' }}>
            Adicionar
          </span>
        </motion.button>
      </div>
    </div>
  );
}

export default function CategoriaExpandidaScreen() {
  const { id }     = useParams<{ id: string }>();
  const navigate   = useNavigate();
  const totalItens = useLojaStore((s) => s.totalItens());

  const categoria = getCategoria(id ?? '');
  const produtos  = getProdutosByCategoria(id ?? '');

  if (!categoria) return null;

  return (
    <div className="flex flex-col h-full w-full" style={{ backgroundColor: '#EFF5F9' }}>

      {/* ── Header ── */}
      <div className="flex items-center shrink-0" style={{ gap: 24, padding: 24, backgroundColor: '#0066B3' }}>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate(-1)}
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 280, height: 80, backgroundColor: '#004B8B', borderRadius: 8, gap: 8, padding: '12px 24px 12px 16px' }}
        >
          <ArrowLeft style={{ width: 48, height: 48, color: '#F39200', flexShrink: 0 }} strokeWidth={2} />
          <span className="text-white" style={{ fontSize: 20, fontWeight: 500, lineHeight: '120%' }}>Voltar</span>
        </motion.button>

        <div className="flex-1 flex items-center justify-center">
          <span className="font-semibold text-center" style={{ fontSize: 44, color: '#FFFFFF', lineHeight: '120%' }}>
            {categoria.nome}
          </span>
        </div>

        {/* Carrinho */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/loja/carrinho')}
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 280, height: 80, backgroundColor: '#004B8B', borderRadius: 8, gap: 16, padding: '0 24px' }}
        >
          <ShoppingCart style={{ width: 40, height: 40, color: '#F39200', flexShrink: 0 }} strokeWidth={2} />
          <span className="font-semibold text-white" style={{ fontSize: 20 }}>Carrinho</span>
          {totalItens > 0 && (
            <span
              className="flex items-center justify-center rounded-full font-bold text-white shrink-0"
              style={{ width: 28, height: 28, fontSize: 13, backgroundColor: '#F39200' }}
            >
              {totalItens}
            </span>
          )}
        </motion.button>
      </div>

      {/* ── Body: product grid (CSS grid, max 5 cols, equal height) ── */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ padding: 24 }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 24,
            alignItems: 'stretch',
          }}
        >
          {produtos.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.2 }}
              style={{ display: 'flex' }}
            >
              <ProductCard produto={p} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
