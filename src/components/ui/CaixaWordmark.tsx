import CaixaXIcon from './CaixaXIcon';
import { cn } from '../../lib/cn';

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: { text: 'text-[20px]', icon: 16, gap: 'gap-[1px]' },
  md: { text: 'text-[36px]', icon: 28, gap: 'gap-[2px]' },
  lg: { text: 'text-[64px]', icon: 50, gap: 'gap-[3px]' },
  xl: { text: 'text-[88px]', icon: 70, gap: 'gap-[4px]' },
};

/**
 * Wordmark CAIXA — composição "CAI" + glifo X + "A".
 * Placeholder estilizado; substituir por SVG oficial quando fornecido.
 */
export default function CaixaWordmark({ size = 'md', className }: Props) {
  const s = sizeMap[size];
  return (
    <div className={cn('inline-flex items-center leading-none', s.gap, className)}>
      <span
        className={cn('font-black text-white tracking-tight', s.text)}
        style={{ letterSpacing: '-0.02em' }}
      >
        CAI
      </span>
      <CaixaXIcon size={s.icon} />
      <span
        className={cn('font-black text-white tracking-tight', s.text)}
        style={{ letterSpacing: '-0.02em' }}
      >
        A
      </span>
    </div>
  );
}
