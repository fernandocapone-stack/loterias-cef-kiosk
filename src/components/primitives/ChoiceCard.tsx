import { motion } from 'framer-motion';
import { ReactNode } from 'react';

/**
 * Card de seleção landscape — Figma Step 1/2.
 * Fundo branco, conteúdo no rodapé, título azul, desc cinza.
 * Preenche a altura do container pai via flex.
 */
interface Props {
  title: string;
  description: string;
  icon?: ReactNode;
  badge?: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function ChoiceCard({ title, description, icon, badge, onClick, disabled }: Props) {
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      whileHover={{ y: disabled ? 0 : -4 }}
      onClick={disabled ? undefined : onClick}
      className="flex-1 bg-white rounded-lg flex flex-col justify-end text-left shadow-card hover:shadow-card-hover transition-shadow relative overflow-hidden"
      style={{ padding: '40px 24px', gap: 16 }}
    >
      {/* Badge opcional */}
      {badge && (
        <span className="absolute top-5 right-5 text-kiosk-xs font-semibold px-3 py-1 rounded-full bg-accent/15 text-accent-dark">
          {badge}
        </span>
      )}

      {/* Ícone opcional */}
      {icon && (
        <div className="mb-4 text-primary opacity-30">
          {icon}
        </div>
      )}

      {/* Texto — alinhado no rodapé */}
      <div className="flex flex-col" style={{ gap: 16 }}>
        <h2
          className="font-semibold text-primary leading-tight"
          style={{ fontSize: 32, color: '#0066B3' }}
        >
          {title}
        </h2>
        <p
          className="font-normal leading-[1.5]"
          style={{ fontSize: 20, color: '#6B7280' }}
        >
          {description}
        </p>
      </div>

      {/* Indicador disabled */}
      {disabled && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-lg">
          <span className="text-kiosk-xs font-semibold text-muted bg-white px-3 py-1 rounded-full border border-line">
            Em breve
          </span>
        </div>
      )}
    </motion.button>
  );
}
