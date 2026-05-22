import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

/**
 * 4. Lotérica — Figma (250:1662), canvas 1440×900.
 *
 * Same blue-tile layout with 4 tiles in a single row:
 *  - "Fazer Apostas"    → /caixa/loterias/apostar
 *  - "Pagar Conta"      → /caixa/loterias/pagar
 *  - "Recarga Celular"  → /caixa/loterias/recarregar
 *  - "Ver Resultados"   → /caixa/loterias/resultados
 *
 * Each tile: col, justifyEnd, gap:16, padding:40px 24px, bg white, radius 8
 *   - title: 32px SemiBold, #0066B3 (newlines in original kept as <br>)
 *   - desc:  24px Regular,  #6B7280
 */
export default function LotericaHome() {
  const navigate = useNavigate();

  const tiles = [
    {
      title: 'Fazer Apostas',
      desc: 'Loterias da Caixa.',
      imagem: '/images/servicos/loterica-apostas.png',
      onClick: () => navigate('/caixa/loterias/apostar'),
    },
    {
      title: 'Pagar Conta',
      desc: 'Contas e boletos.',
      imagem: '/images/servicos/loterica-pagarconta-62f038.png',
      onClick: () => navigate('/caixa/loterias/pagar'),
    },
    {
      title: 'Recarga Celular',
      desc: 'Recarregue seu celular.',
      imagem: '/images/servicos/loterica-recarga.png',
      onClick: () => navigate('/caixa/loterias/recarregar'),
    },
    {
      title: 'Ver Resultados',
      desc: 'Sorteios recentes',
      imagem: '/images/servicos/loterica-resultados.png',
      onClick: () => navigate('/caixa/loterias/resultados'),
    },
  ];

  return (
    <div
      className="h-full w-full flex flex-col overflow-hidden"
      style={{ backgroundColor: '#EFF5F9' }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center shrink-0"
        style={{ gap: 24, padding: 24, backgroundColor: '#0066B3' }}
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/escolha')}
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{
            width: 280, height: 80,
            backgroundColor: '#004B8B',
            borderRadius: 8,
            gap: 8,
            padding: '12px 24px 12px 16px',
          }}
        >
          <ArrowLeft style={{ width: 48, height: 48, color: '#F39200', flexShrink: 0 }} strokeWidth={2} />
          <span className="text-white" style={{ fontSize: 20, fontWeight: 500, lineHeight: '120%' }}>
            Voltar
          </span>
        </motion.button>

        <div className="flex-1 flex items-center justify-center">
          <span className="text-white font-semibold text-center" style={{ fontSize: 44, lineHeight: '120%' }}>
            Lotérica
          </span>
        </div>

        <div style={{ width: 280, height: 80, flexShrink: 0 }} />
      </div>

      {/* ── Content ── */}
      <div
        className="flex flex-col flex-1"
        style={{ padding: 24, gap: 32 }}
      >
        {/* 4-tile row */}
        <div className="flex flex-1" style={{ gap: 24 }}>
          {tiles.map((tile, idx) => (
            <motion.button
              key={tile.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.2 }}
              whileTap={{ scale: 0.985 }}
              onClick={tile.onClick}
              className="flex-1 rounded-lg text-left"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 8,
                padding: '40px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'stretch',
                overflow: 'hidden',
              }}
            >
              {/* Zona da imagem — círculo + ilustração 3D */}
              <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', width: 262, height: 262, borderRadius: '50%', backgroundColor: '#EFF5F9' }} />
                {tile.imagem && (
                  <img
                    src={tile.imagem}
                    alt=""
                    draggable={false}
                    style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none', userSelect: 'none' }}
                  />
                )}
              </div>

              {/* Texto */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 32 }}>
                <span className="font-semibold" style={{ fontSize: 32, color: '#0066B3', lineHeight: '120%' }}>
                  {tile.title}
                </span>
                <span className="font-normal" style={{ fontSize: 24, color: '#6B7280', lineHeight: '150%' }}>
                  {tile.desc}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

      </div>
    </div>
  );
}
