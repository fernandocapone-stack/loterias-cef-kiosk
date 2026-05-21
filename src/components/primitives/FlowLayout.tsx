import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import CaixaLogo from '../ui/CaixaLogo';

/**
 * Layout two-panel para telas de fluxo (CPF, checkout, boleto, Pix…).
 * Canvas 1440×900.
 *
 *  ┌──────────────────────┬───────────────────────────────────┐
 *  │  Painel esquerdo     │  Painel direito                   │
 *  │  36%  bg-primary     │  64%  bg-white (ou customizável)  │
 *  │  ─ back button       │  ─ conteúdo principal scrollável  │
 *  │  ─ logo CEF          │                                   │
 *  │  ─ leftContent slot  │                                   │
 *  └──────────────────────┴───────────────────────────────────┘
 */
interface Props {
  onBack?: () => void;
  leftContent: ReactNode;
  children: ReactNode;
  rightClassName?: string;
}

export default function FlowLayout({ onBack, leftContent, children, rightClassName }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="flex h-full w-full overflow-hidden"
    >
      {/* ── Painel esquerdo — 520px, touch-friendly para kiosk 1440px ── */}
      <div
        className="flex flex-col shrink-0 bg-primary px-8 py-8 relative"
        style={{ width: 520 }}
      >
        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="absolute top-6 left-6 rounded-lg flex items-center justify-center bg-primary-dark hover:bg-primary-darker transition-colors"
            style={{
              width:  'clamp(44px, 4.5vw, 64px)',
              height: 'clamp(44px, 4.5vw, 64px)',
            }}
          >
            <ArrowLeft
              style={{ width: 'clamp(18px, 2vw, 28px)', height: 'auto', color: '#F39200' }}
              strokeWidth={2.5}
            />
          </button>
        )}

        {/* Logo */}
        <div className="mt-16 mb-8">
          <CaixaLogo width="clamp(100px, 10vw, 145px)" height="auto" />
        </div>

        {/* Conteúdo contextual */}
        <div className="flex-1 flex flex-col justify-center">
          {leftContent}
        </div>
      </div>

      {/* ── Painel direito ── */}
      <div className={`flex-1 overflow-y-auto ${rightClassName ?? 'bg-white'}`}>
        {children}
      </div>
    </motion.div>
  );
}
