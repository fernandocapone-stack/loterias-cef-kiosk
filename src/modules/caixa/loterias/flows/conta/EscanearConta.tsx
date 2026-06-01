import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera } from 'lucide-react';

/**
 * Escanear código de barras — Figma (263:2239), canvas 1440×900.
 *
 * Mesma estética do fluxo "Ler Caderneta": header 280×80 + viewfinder escuro
 * com 4 cantos coloridos + linha de scan luminosa animada.
 *
 * Auto-navega para /caixa/conta/confirmar após ~2.2s.
 */

const MOCK_BARCODE = '23793381286002148000063370300011225800000018990';
const SCAN_DURATION_MS = 2200;
const ACCENT = '#F39200';

export default function EscanearConta() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = window.setTimeout(() => {
      navigate('/caixa/conta/confirmar', { state: { code: MOCK_BARCODE, source: 'scan' } });
    }, SCAN_DURATION_MS);
    return () => clearTimeout(t);
  }, [navigate]);

  const VIEWFINDER_W = 720;
  const VIEWFINDER_H = 460;

  return (
    <div className="h-full w-full flex flex-col overflow-hidden" style={{ backgroundColor: '#EFF5F9' }}>

      {/* ── Header ── */}
      <div
        className="flex items-center shrink-0"
        style={{ gap: 24, padding: 24, backgroundColor: '#0066B3' }}
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/caixa/loterias/pagar')}
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
          <span className="font-semibold text-center" style={{ fontSize: 44, color: '#FFFFFF', lineHeight: '120%' }}>
            Escanear o código de barras
          </span>
        </div>

        {/* Placeholder à direita — mesmas dimensões do Voltar para manter o título centralizado */}
        <div style={{ width: 280, height: 80, flexShrink: 0 }} />
      </div>

      {/* ── Body — viewfinder + instruções (mesmo padrão do LerCaderneta) ── */}
      <div
        className="flex-1 flex flex-col items-center justify-center"
        style={{ padding: 24, gap: 32 }}
      >
        {/* Instrução */}
        <div className="flex flex-col items-center text-center" style={{ gap: 12, maxWidth: 720 }}>
          <span style={{ fontSize: 32, fontWeight: 600, color: '#005DA4', lineHeight: '120%' }}>
            Lendo código de barras…
          </span>
          <span style={{ fontSize: 20, fontWeight: 400, color: '#6B7280', lineHeight: '150%' }}>
            Aproxime o boleto do leitor e mantenha o código de barras dentro da área marcada.
          </span>
        </div>

        {/* Viewfinder */}
        <div
          style={{
            position: 'relative',
            width: VIEWFINDER_W,
            height: VIEWFINDER_H,
            backgroundColor: '#1F2937',
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          {/* Camera placeholder pattern */}
          <div
            style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at center, #2A3848 0%, #111827 100%)',
            }}
          />

          {/* Ícone central */}
          <div
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 16,
            }}
          >
            <Camera style={{ width: 96, height: 96, color: 'rgba(255,255,255,0.25)' }} strokeWidth={1.25} />
            <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
              Boleto bancário
            </span>
          </div>

          {/* Cantos do viewfinder */}
          <CornerBrackets cor={ACCENT} />

          {/* Linha de scan — repete em loop até auto-navegar */}
          <motion.div
            animate={{ top: [0, VIEWFINDER_H - 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              left: 0, right: 0,
              height: 4,
              background: `linear-gradient(90deg, transparent 0%, ${ACCENT} 50%, transparent 100%)`,
              boxShadow: `0 0 24px 4px ${ACCENT}AA`,
              pointerEvents: 'none',
            }}
          />

          {/* Halo pulsante */}
          <motion.div
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{
              position: 'absolute', inset: 0,
              background: `radial-gradient(ellipse at center, ${ACCENT}33 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* Brackets dos 4 cantos do viewfinder */
function CornerBrackets({ cor }: { cor: string }) {
  const L = 48;
  const T = 4;
  const corner = (vert: 'top' | 'bottom', horiz: 'left' | 'right'): React.CSSProperties => ({
    position: 'absolute',
    width: L, height: L,
    [vert]: 16,
    [horiz]: 16,
    [`border${vert === 'top' ? 'Top' : 'Bottom'}`]: `${T}px solid ${cor}`,
    [`border${horiz === 'left' ? 'Left' : 'Right'}`]: `${T}px solid ${cor}`,
    borderRadius:
      vert === 'top' && horiz === 'left'  ? '8px 0 0 0' :
      vert === 'top' && horiz === 'right' ? '0 8px 0 0' :
      vert === 'bottom' && horiz === 'left'  ? '0 0 0 8px' :
                                               '0 0 8px 0',
  } as React.CSSProperties);

  return (
    <>
      <div style={corner('top', 'left')} />
      <div style={corner('top', 'right')} />
      <div style={corner('bottom', 'left')} />
      <div style={corner('bottom', 'right')} />
    </>
  );
}
