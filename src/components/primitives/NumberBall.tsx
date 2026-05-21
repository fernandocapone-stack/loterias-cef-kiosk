import { motion } from 'framer-motion';

interface Props {
  number: number;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-16 h-16 text-kiosk-xs',
  md: 'w-24 h-24 text-kiosk-base',
  lg: 'w-28 h-28 text-kiosk-lg',
};

export default function NumberBall({
  number,
  selected,
  disabled,
  onClick,
  color = '#005CA9',
  size = 'md',
}: Props) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.12 }}
      className={[
        'rounded-full font-extrabold flex items-center justify-center',
        'transition-all duration-150 border-4',
        'disabled:opacity-30 disabled:pointer-events-none',
        sizeClasses[size],
        selected
          ? 'text-white shadow-card-hover scale-105'
          : 'bg-white text-ink border-surface hover:border-primary/30',
      ].join(' ')}
      style={{
        backgroundColor: selected ? color : undefined,
        borderColor: selected ? color : undefined,
      }}
    >
      {String(number).padStart(2, '0')}
    </motion.button>
  );
}
