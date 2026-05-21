import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import CaixaLogo from '../../components/ui/CaixaLogo';

/**
 * Splash / Idle — Figma "1. Splash Screen" (193:215), canvas 1440×900.
 *
 * Frame 296:546: width 720, vertical fill, column, space-between, padding 24px
 *  - Logo CEF:     top 172×40
 *  - Content:      col gap 24 — título 68px/120% · subtítulo 24px/160% · CTA
 *  - Acessib.:     bottom row gap 20
 *
 * Interação: toque em qualquer parte da tela navega para /escolha.
 * CTA:       pulse scale loop para chamar atenção.
 */
export default function HomeScreen() {
  const navigate = useNavigate();
  const goNext = () => navigate('/escolha');

  return (
    <div
      className="relative h-full w-full overflow-hidden cursor-pointer"
      style={{ backgroundColor: '#0066B3' }}
      onClick={goNext}
    >
      {/* ── Background full-bleed ── */}
      <img
        src="/images/splash-bg.png"
        alt=""
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ objectFit: 'cover', objectPosition: 'center' }}
        draggable={false}
      />

      {/* ── Frame 296:546 — 720px, full height, space-between, padding 24 ── */}
      <div
        className="absolute inset-y-0 left-0 z-20 flex flex-col"
        style={{ width: 720, padding: 24, justifyContent: 'space-between' }}
      >
        {/* Logo CEF — top */}
        <CaixaLogo width={172} height={40} />

        {/* Content block — col gap 24 */}
        <div className="flex flex-col" style={{ gap: 24 }}>
          {/* Título — 68px Bold white, lineHeight 120% */}
          <h1 className="font-bold text-white" style={{ fontSize: 68, lineHeight: '120%' }}>
            Bem-vindo ao Sistema de Auto Atendimento
          </h1>

          {/* Subtítulo — 24px Regular white 80%, lineHeight 160% */}
          <p className="text-white font-normal" style={{ fontSize: 24, lineHeight: '160%', opacity: 0.8 }}>
            Apostas, pagamentos, recargas e outros serviços.
          </p>

          {/* CTA — pulsa suavemente para chamar atenção */}
          <motion.button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center justify-center self-start"
            style={{
              height: 80,
              padding: '12px 32px 12px 24px',
              gap: 8,
              backgroundColor: '#FFFFFF',
              borderRadius: 8,
            }}
          >
            <span style={{ fontSize: 20, fontWeight: 500, lineHeight: '120%', color: '#0066B3' }}>
              Toque para Iniciar
            </span>
            <ArrowRight
              style={{ width: 48, height: 48, color: '#F39200', flexShrink: 0 }}
              strokeWidth={2}
            />
          </motion.button>
        </div>

        {/* Spacer — mantém o layout space-between sem o bloco de acessibilidade */}
        <div style={{ height: 64 }} />
      </div>

      {/* Acessibilidade — canto inferior direito, mesmo alinhamento do FAB nas demais telas */}
      <div
        className="absolute z-20 flex items-center"
        style={{ bottom: 24, right: 24, gap: 20 }}
      >
        <span className="text-white font-semibold" style={{ fontSize: 20, lineHeight: '120%' }}>
          Acessibilidade
        </span>
        <div
          className="flex items-center justify-center shrink-0"
          style={{ width: 64, height: 64, backgroundColor: '#004B8B', borderRadius: 128 }}
        >
          <img
            src="/images/icon-acessibilidade.svg"
            alt=""
            style={{ width: 48, height: 48 }}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
