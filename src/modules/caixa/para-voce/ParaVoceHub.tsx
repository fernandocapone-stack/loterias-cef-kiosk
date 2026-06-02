import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

/**
 * Para você — hub interno de produtos PF da Caixa.
 *
 * Header padrão: Voltar 280×80 | "Para você" 44px | placeholder 280×80
 * Body: grid 3 colunas × 2 linhas (6 cards). Cada card segue o mesmo padrão
 * do CaixaHub / LotericaHome (círculo placeholder + título + descrição).
 *
 * Apenas "Crédito Pessoal" está ativo nesta fase. Os demais ficam com
 * opacidade reduzida e cursor default (em breve).
 */
export default function ParaVoceHub() {
  const navigate = useNavigate();

  const tiles = [
    {
      title: 'Crédito Pessoal',
      desc: 'Empréstimo rápido \ndireto no totem.',
      onClick: () => navigate('/caixa/credito'),
      disabled: false,
    },
    {
      title: 'Cartão de Crédito',
      desc: 'Solicite seu \ncartão Caixa.',
      onClick: () => {},
      disabled: true,
    },
    {
      title: 'Financiamento Imobiliário',
      desc: 'Realize o sonho \nda casa própria.',
      onClick: () => {},
      disabled: true,
    },
    {
      title: 'Empréstimo Consignado',
      desc: 'Crédito com \ndesconto em folha.',
      onClick: () => {},
      disabled: true,
    },
    {
      title: 'Abrir Conta',
      desc: 'Conta corrente \nou poupança Caixa.',
      onClick: () => {},
      disabled: true,
    },
    {
      title: 'Caixa Tem',
      desc: 'Banco digital \nda Caixa.',
      onClick: () => {},
      disabled: true,
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
          onClick={() => navigate('/caixa')}
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
            Para você
          </span>
        </div>

        <div style={{ width: 280, height: 80, flexShrink: 0 }} />
      </div>

      {/* ── Grid 3×2 ── */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ padding: 24 }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridAutoRows: '1fr',
            gap: 24,
            minHeight: '100%',
          }}
        >
          {tiles.map((tile, idx) => (
            <motion.button
              key={tile.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: tile.disabled ? 0.5 : 1, y: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.2 }}
              whileTap={tile.disabled ? {} : { scale: 0.985 }}
              whileHover={tile.disabled ? {} : { y: -4, boxShadow: '0px 6px 16px rgba(0,0,0,0.14)' }}
              disabled={tile.disabled}
              onClick={tile.disabled ? undefined : tile.onClick}
              className="rounded-lg text-left bg-white"
              style={{
                borderRadius: 8,
                padding: '40px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'stretch',
                gap: 32,
                cursor: tile.disabled ? 'default' : 'pointer',
                boxShadow: '0px 2px 4px rgba(0,0,0,0.08)',
                overflow: 'hidden',
              }}
            >
              {/* Zona do círculo (placeholder até receber ilustrações) */}
              <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 180 }}>
                <div style={{ width: 220, height: 220, borderRadius: '50%', backgroundColor: '#EFF5F9' }} />
              </div>

              {/* Texto */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span className="font-semibold" style={{ fontSize: 28, color: '#0066B3', lineHeight: '120%' }}>
                  {tile.title}
                </span>
                <span className="font-normal" style={{ fontSize: 20, color: '#6B7280', lineHeight: '150%', whiteSpace: 'pre-line' }}>
                  {tile.desc}
                </span>
                {tile.disabled && (
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>
                    Em breve
                  </span>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
