import { motion } from 'framer-motion';
import { Delete } from 'lucide-react';
import { cn } from '../../lib/cn';

interface Props {
  onPress: (key: string) => void;
  onBackspace: () => void;
  onClear?: () => void;
}

const keys: Array<{ k: string; label?: React.ReactNode; type?: 'clear' | 'back' | 'num' }> = [
  { k: '1' }, { k: '2' }, { k: '3' },
  { k: '4' }, { k: '5' }, { k: '6' },
  { k: '7' }, { k: '8' }, { k: '9' },
  { k: 'C', type: 'clear' },
  { k: '0' },
  { k: '⌫', label: <Delete className="w-5 h-5" />, type: 'back' },
];

export default function NumPad({ onPress, onBackspace, onClear }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2 max-w-md mx-auto w-full">
      {keys.map(({ k, label, type }) => (
        <motion.button
          key={k}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (type === 'back') return onBackspace();
            if (type === 'clear') return onClear?.();
            onPress(k);
          }}
          className={cn(
            'h-14 sm:h-16 rounded-xl text-kiosk-base font-bold border transition-colors',
            'inline-flex items-center justify-center',
            type === 'back'
              ? 'bg-white text-danger border-line hover:bg-danger/5'
              : type === 'clear'
                ? 'bg-white text-warning border-line hover:bg-warning/10'
                : 'bg-white text-ink border-line hover:bg-surface',
          )}
        >
          {label ?? k}
        </motion.button>
      ))}
    </div>
  );
}
