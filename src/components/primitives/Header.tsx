import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import CaixaXIcon from '../ui/CaixaXIcon';
import DateTimeWidget from '../ui/DateTimeWidget';
import { cn } from '../../lib/cn';

interface Props {
  showBack?: boolean;
  onBack?: () => void;
  variant?: 'light' | 'dark';
  rightSlot?: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

/**
 * Header para telas de fluxo (PickNumbers, BoletoInput, etc.).
 * Calibrado para canvas 1440×900 landscape.
 */
export default function Header({
  showBack = true,
  onBack,
  variant = 'light',
  rightSlot,
  title,
  subtitle,
  className,
}: Props) {
  const navigate = useNavigate();

  return (
    <>
      <header
        className={cn(
          'relative w-full flex items-center justify-between',
          'pt-[2%] pb-[1.5%] px-[3.5%] gap-3',
          className,
        )}
      >
        {/* Voltar — landscape: clamp(44px, 4.5vw, 64px) */}
        <div className="flex-shrink-0">
          {showBack ? (
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={onBack ?? (() => navigate(-1))}
              aria-label="Voltar"
              className={cn(
                'rounded-lg flex items-center justify-center transition-opacity hover:opacity-90',
                variant === 'light' ? 'bg-black/20' : 'bg-primary',
                'w-[clamp(44px,4.5vw,64px)] h-[clamp(44px,4.5vw,64px)]',
              )}
            >
              <ArrowLeft
                style={{ width: 'clamp(18px, 2vw, 28px)', height: 'auto', color: '#F39200' }}
                strokeWidth={2.5}
              />
            </motion.button>
          ) : null}
        </div>

        {/* Ícone X centralizado */}
        <div className="flex-1 flex justify-center">
          <CaixaXIcon
            size={48}
            className="w-[clamp(32px,4.5vw,56px)] h-auto"
          />
        </div>

        {/* Datetime / slot direito */}
        <div className="flex-shrink-0 flex justify-end">
          {rightSlot ?? <DateTimeWidget variant={variant} />}
        </div>
      </header>

      {title && (
        <div className="px-[3.5%] pt-1 pb-3">
          <h1
            className={cn(
              'font-semibold tracking-tight leading-tight text-kiosk-lg',
              variant === 'light' ? 'text-white' : 'text-ink',
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <p className={cn('text-kiosk-xs mt-1', variant === 'light' ? 'text-white/80' : 'text-muted')}>
              {subtitle}
            </p>
          )}
        </div>
      )}
    </>
  );
}
