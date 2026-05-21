import { cn } from '../../lib/cn';

interface Props {
  variant?: 'default' | 'white';
  size?: 'sm' | 'md' | 'lg';
  withTagline?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { brand: 'text-base', tag: 'text-[10px]' },
  md: { brand: 'text-xl', tag: 'text-[11px]' },
  lg: { brand: 'text-3xl', tag: 'text-xs' },
};

/**
 * Wordmark institucional estilizado (não é o logo oficial).
 * Para uso em produção, substituir por SVG oficial fornecido pela Caixa.
 */
export default function CaixaBrand({
  variant = 'default',
  size = 'md',
  withTagline,
  className,
}: Props) {
  const isWhite = variant === 'white';
  const s = sizeMap[size];

  return (
    <div className={cn('inline-flex flex-col leading-none', className)}>
      <span
        className={cn(
          'font-extrabold tracking-tight',
          s.brand,
          isWhite ? 'text-white' : 'text-primary',
        )}
        style={{ letterSpacing: '0.02em' }}
      >
        CAIXA
      </span>
      {withTagline && (
        <span
          className={cn(
            'font-semibold uppercase tracking-widest mt-0.5',
            s.tag,
            isWhite ? 'text-white/80' : 'text-accent',
          )}
        >
          Econômica Federal
        </span>
      )}
    </div>
  );
}
