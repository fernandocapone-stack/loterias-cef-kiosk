import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import CaixaLogo from '../ui/CaixaLogo';

/**
 * Layout reutilizável para telas de seleção landscape (Steps 1 e 2 do Figma).
 * Canvas 1440×900 — bg #0066B3.
 *
 * Estrutura fiel ao Figma:
 *   column, gap:58px, padding:20px
 *   ├── Top row: back (98×98) + CaixaLogo
 *   └── Content row (flex-1): left text | cards (fill×fill)
 */
interface Props {
  onBack: () => void;
  title: ReactNode;
  subtitle: string;
  children: ReactNode; // os dois ChoiceCards
}

export default function LandscapeChoiceLayout({ onBack, title, subtitle, children }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="h-full w-full overflow-hidden flex flex-col"
      style={{ backgroundColor: '#0066B3', padding: 20, gap: 58 }}
    >
      {/* ── Top row: back button + logo ── */}
      <div className="flex items-center shrink-0" style={{ gap: 24 }}>
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={onBack}
          aria-label="Voltar"
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 98, height: 98, backgroundColor: '#004B8B', borderRadius: 8 }}
        >
          <ArrowLeft style={{ width: 36, height: 36, color: '#F39200' }} strokeWidth={2.5} />
        </motion.button>

        <CaixaLogo width={207} height={48} />
      </div>

      {/* ── Content row: left text + cards (flex-1, fill remaining height) ── */}
      <div className="flex-1 flex min-h-0" style={{ gap: 20 }}>

        {/* Left text panel — flex-1 */}
        <div className="flex-1 flex flex-col justify-center" style={{ gap: 24 }}>
          <h1
            className="font-bold text-white leading-[1.2]"
            style={{ fontSize: 76 }}
          >
            {title}
          </h1>
          <p
            className="text-white font-normal leading-[1.6]"
            style={{ fontSize: 30, opacity: 0.8 }}
          >
            {subtitle}
          </p>
        </div>

        {/* Cards — each flex-1, stretch to full content height */}
        {children}
      </div>
    </motion.div>
  );
}
