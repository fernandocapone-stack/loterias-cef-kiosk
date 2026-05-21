import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

/**
 * Pagar Conta — Figma (263:1949), canvas 1440×900.
 *
 * Entry view: 2-tile layout
 *   - Tile "Escanear" → /caixa/conta/escanear
 *   - Tile "Digitar"  → /caixa/conta/digitar
 */
export default function PagarTab() {
  const navigate = useNavigate();

  const tiles = [
    {
      title: 'Escanear',
      desc: 'Leia o código de barras.',
      onClick: () => navigate('/caixa/conta/escanear'),
    },
    {
      title: 'Digitar',
      desc: 'Digite o código manualmente.',
      onClick: () => navigate('/caixa/conta/digitar'),
    },
  ];

  return (
    <div
      className="h-full w-full flex flex-col overflow-hidden"
      style={{ backgroundColor: '#EFF5F9' }}
    >
      {/* ── Header ── */}
      <div className="flex items-center shrink-0" style={{ gap: 24, padding: 24, backgroundColor: '#0066B3' }}>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/caixa/loterias')}
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 280, height: 80, backgroundColor: '#004B8B', borderRadius: 8, gap: 8, padding: '12px 24px 12px 16px' }}
        >
          <ArrowLeft style={{ width: 48, height: 48, color: '#F39200', flexShrink: 0 }} strokeWidth={2} />
          <span className="text-white" style={{ fontSize: 20, fontWeight: 500 }}>Voltar</span>
        </motion.button>

        <div className="flex-1 flex items-center justify-center">
          <span className="font-semibold text-center" style={{ fontSize: 44, color: '#FFFFFF', lineHeight: '120%' }}>
            Pagar Conta
          </span>
        </div>

        <div style={{ width: 280, height: 80, flexShrink: 0 }} />
      </div>

      {/* ── Content: 2 tiles + acessibilidade ── */}
      <div className="flex flex-col flex-1" style={{ padding: 24, gap: 32 }}>
        <div className="flex flex-1" style={{ gap: 24 }}>
          {tiles.map((tile, idx) => (
            <motion.button
              key={tile.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.2 }}
              whileTap={{ scale: 0.985 }}
              onClick={tile.onClick}
              className="flex-1 flex flex-col rounded-lg text-left bg-white"
              style={{ borderRadius: 8, padding: '40px 24px', gap: 16, justifyContent: 'flex-end' }}
            >
              <span className="font-semibold" style={{ fontSize: 32, color: '#0066B3', lineHeight: '120%' }}>
                {tile.title}
              </span>
              <span className="font-normal" style={{ fontSize: 24, color: '#6B7280', lineHeight: '150%' }}>
                {tile.desc}
              </span>
            </motion.button>
          ))}
        </div>

      </div>
    </div>
  );
}
