import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';

/**
 * Escanear código de barras — Figma (263:2239), canvas 1440×900.
 *
 * Layout:
 *  Header: bg #0066B3 — Voltar 200×80 | "Escanear o código de barras" | placeholder 200×80
 *  Body: fullscreen scanner animation
 *    Após ~2.2s → navega para /caixa/conta/confirmar com { code, source: 'scan' }
 */

const MOCK_BARCODE = '23793381286002148000063370300011225800000018990';

export default function EscanearConta() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = window.setTimeout(() => {
      navigate('/caixa/conta/confirmar', { state: { code: MOCK_BARCODE, source: 'scan' } });
    }, 2200);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="h-full w-full flex flex-col" style={{ backgroundColor: '#EFF5F9' }}>

      {/* ── Header ── */}
      <div
        className="flex items-center shrink-0"
        style={{ gap: 24, padding: 24, backgroundColor: '#0066B3' }}
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/caixa/loterias/pagar')}
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 200, height: 80, backgroundColor: '#004B8B', borderRadius: 8, gap: 8, padding: '12px 24px 12px 16px' }}
        >
          <ArrowLeft style={{ width: 48, height: 48, color: '#F39200', flexShrink: 0 }} strokeWidth={2} />
          <span className="text-white" style={{ fontSize: 20, fontWeight: 500, lineHeight: '120%' }}>Voltar</span>
        </motion.button>

        <div className="flex-1 flex items-center justify-center">
          <span className="font-semibold text-center" style={{ fontSize: 44, color: '#FFFFFF', lineHeight: '120%' }}>
            Escanear o código de barras
          </span>
        </div>

        <div style={{ width: 200, height: 80, flexShrink: 0 }} />
      </div>

      {/* ── Scanner ── */}
      <div className="flex-1 flex flex-col items-center justify-center" style={{ gap: 32 }}>
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          className="rounded-2xl bg-white flex items-center justify-center relative overflow-hidden"
          style={{ width: 480, height: 320, boxShadow: '0px 4px 24px rgba(0,0,0,0.12)' }}
        >
          <FileText style={{ width: 80, height: 80, color: '#0066B3' }} strokeWidth={1.5} />
          <motion.div
            animate={{ y: [-120, 120] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-x-0 h-0.5 bg-[#F39200]"
            style={{ boxShadow: '0 0 12px rgba(243,146,0,0.6)' }}
          />
        </motion.div>

        <div className="text-center">
          <p className="font-bold" style={{ fontSize: 28, color: '#1F2937', marginBottom: 8 }}>
            Aproxime o boleto do leitor
          </p>
          <p style={{ fontSize: 20, color: '#6B7280' }}>
            Posicione o código de barras na frente do scanner
          </p>
        </div>
      </div>
    </div>
  );
}
