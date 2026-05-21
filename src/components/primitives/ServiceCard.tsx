import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface Props {
  title: string;
  description?: string;
  illustration?: ReactNode;
  onClick?: () => void;
  comingSoon?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Card de seleção de módulo — Figma 154:213.
 * 308×368px, rounded-lg (16px), padding 40px 32px.
 * Título: Poppins Semibold, #0066B3. Descrição: #6B7280.
 */
export default function ServiceCard({
  title, description, illustration,
  onClick, comingSoon, disabled, className,
}: Props) {
  const isDisabled = disabled || comingSoon;

  return (
    <motion.button
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className={cn(
        'relative bg-white text-left flex flex-col',
        'rounded-lg',
        'px-[4.4vw] pt-[3.1vw] pb-[3.1vw]',
        'shadow-sm hover:shadow-card transition-shadow duration-150',
        isDisabled && 'opacity-60 cursor-not-allowed',
        className,
      )}
      style={{ aspectRatio: '308 / 368' }}
    >
      {comingSoon && (
        <span className="absolute top-3 right-3 bg-accent text-white text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wide uppercase">
          Em breve
        </span>
      )}

      {/* Topo — ilustração */}
      <div className="flex-1 flex items-center justify-center">{illustration}</div>

      {/* Bottom — título + descrição */}
      <div className="mt-auto">
        <h3
          className="font-semibold leading-tight tracking-tight text-primary"
          style={{ fontSize: 'clamp(18px, 4.44vw, 44px)' }}
        >
          {title}
        </h3>
        {description && (
          <p
            className="mt-1 text-[#6B7280] leading-snug font-normal"
            style={{ fontSize: 'clamp(11px, 1.94vw, 20px)' }}
          >
            {description}
          </p>
        )}
      </div>
    </motion.button>
  );
}
