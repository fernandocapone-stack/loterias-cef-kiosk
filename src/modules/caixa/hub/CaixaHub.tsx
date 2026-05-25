import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

/**
 * Caixa — canvas 1440×900.
 *
 * 3 tiles:
 *  - Para você         → /caixa/para-voce    (em breve)
 *  - Para a sua empresa → /caixa/empresa      (em breve)
 *  - Poder público     → /caixa/poder-publico (em breve)
 */
export default function CaixaHub() {
  const navigate = useNavigate();

  const tiles = [
    {
      title: 'Para você',
      desc: 'Produtos e serviços\npara pessoa física.',
      imagem: undefined as string | undefined,
      disabled: true,
      onClick: () => {},
    },
    {
      title: 'Para a sua empresa',
      desc: 'Soluções para\npessoa jurídica.',
      imagem: undefined as string | undefined,
      disabled: true,
      onClick: () => {},
    },
    {
      title: 'Poder público',
      desc: 'Serviços para\nórgãos públicos.',
      imagem: undefined as string | undefined,
      disabled: true,
      onClick: () => {},
    },
  ];

  return (
    <div className="h-full w-full flex flex-col overflow-hidden" style={{ backgroundColor: '#EFF5F9' }}>

      {/* ── Header ── */}
      <div className="flex items-center shrink-0" style={{ gap: 24, padding: 24, backgroundColor: '#0066B3' }}>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/escolha')}
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 280, height: 80, backgroundColor: '#004B8B', borderRadius: 8, gap: 8, padding: '12px 24px 12px 16px' }}
        >
          <ArrowLeft style={{ width: 48, height: 48, color: '#F39200', flexShrink: 0 }} strokeWidth={2} />
          <span className="text-white" style={{ fontSize: 20, fontWeight: 500, lineHeight: '120%' }}>Voltar</span>
        </motion.button>

        <div className="flex-1 flex items-center justify-center">
          <span className="text-white font-semibold text-center" style={{ fontSize: 44, lineHeight: '120%' }}>
            Caixa
          </span>
        </div>

        <div style={{ width: 280, height: 80, flexShrink: 0 }} />
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1" style={{ padding: 24, gap: 32 }}>
        <div className="flex flex-1" style={{ gap: 24 }}>
          {tiles.map((tile, idx) => (
            <motion.button
              key={tile.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.2 }}
              whileTap={tile.disabled ? {} : { scale: 0.985 }}
              disabled={tile.disabled}
              onClick={tile.disabled ? undefined : tile.onClick}
              className="flex-1 rounded-lg text-left"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 8,
                opacity: tile.disabled ? 0.5 : 1,
                cursor: tile.disabled ? 'default' : 'pointer',
                boxShadow: '0px 2px 4px rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'stretch',
                padding: '40px 24px',
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
                <span className="font-normal" style={{ fontSize: 24, color: '#6B7280', lineHeight: '150%', whiteSpace: 'pre-line' }}>
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
