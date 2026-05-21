import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useLojaStore } from '../../store/lojaStore';
import { categorias } from './data/categorias';

/**
 * 3. Conveniência — Categorias — Figma (355:1461), canvas 1440×900.
 *
 * Header: bg #0066B3
 *   Back 280×80 | "Categorias de produtos" | Carrinho 280×80
 *
 * Body: grid 3×2 de tiles, cada tile com imagem 3D no canto superior direito
 * e nome da categoria no canto inferior esquerdo.
 * Categorias: Bebidas, Revistas, Doces e Snacks, Cigarros, Comidas, Outros
 */
export default function CategoriasScreen() {
  const navigate    = useNavigate();
  const totalItens  = useLojaStore((s) => s.totalItens());

  return (
    <div className="h-full w-full flex flex-col overflow-hidden" style={{ backgroundColor: '#EFF5F9' }}>

      {/* ── Header ── */}
      <div className="flex items-center shrink-0" style={{ gap: 24, padding: 24, backgroundColor: '#0066B3' }}>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/loja')}
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 280, height: 80, backgroundColor: '#004B8B', borderRadius: 8, gap: 8, padding: '12px 24px 12px 16px' }}
        >
          <ArrowLeft style={{ width: 48, height: 48, color: '#F39200', flexShrink: 0 }} strokeWidth={2} />
          <span className="text-white" style={{ fontSize: 20, fontWeight: 500, lineHeight: '120%' }}>Voltar</span>
        </motion.button>

        <div className="flex-1 flex items-center justify-center">
          <span className="font-semibold text-center" style={{ fontSize: 44, color: '#FFFFFF', lineHeight: '120%' }}>
            Categorias de produtos
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

      {/* ── Body ── */}
      <div className="flex flex-col flex-1" style={{ padding: 24, gap: 24, overflow: 'hidden' }}>

        {/* Grid de categorias — ocupa toda a altura disponível */}
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(2, 1fr)',
            gap: 24,
          }}
        >
          {categorias.map((cat, idx) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.2 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => navigate(`/loja/categorias/${cat.id}`)}
              className="rounded-lg text-left"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 8,
                boxShadow: '0px 2px 4px rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '40px 32px',
              }}
            >
              {/* Zona da imagem — círculo + ilustração 3D */}
              <div
                style={{
                  position: 'relative',
                  width: 222,
                  height: 222,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {/* Círculo de fundo */}
                <div
                  style={{
                    position: 'absolute',
                    width: 160,
                    height: 160,
                    borderRadius: '50%',
                    backgroundColor: '#EFF5F9',
                  }}
                />
                {/* Ilustração 3D */}
                {cat.imagem && (
                  <img
                    src={cat.imagem}
                    alt=""
                    draggable={false}
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      pointerEvents: 'none',
                      userSelect: 'none',
                    }}
                  />
                )}
              </div>

              {/* Nome — alinhado à esquerda */}
              <span
                className="font-semibold"
                style={{ fontSize: 32, color: '#0066B3', lineHeight: '120%', alignSelf: 'flex-start' }}
              >
                {cat.nome}
              </span>
            </motion.button>
          ))}
        </div>


      </div>
    </div>
  );
}
