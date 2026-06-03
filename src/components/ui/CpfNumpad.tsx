import { motion } from 'framer-motion';
import { Delete } from 'lucide-react';

/**
 * Numpad compartilhado para entrada de CPF — botões 144×80, borda 2px
 * #D0E0E3, br 4. Mesmo desenho usado no Carrinho de Apostas (CartPage).
 *
 * - Números: cor #0066B3
 * - "C" (clear): cor #ED1C24
 * - "⌫" (backspace): ícone Delete em #0066B3
 */
export default function CpfNumpad({
  onPress, onBackspace, onClear,
}: {
  onPress: (key: string) => void;
  onBackspace: () => void;
  onClear: () => void;
}) {
  const keys = [
    { label: '1', type: 'num' },  { label: '2', type: 'num' },  { label: '3', type: 'num' },
    { label: '4', type: 'num' },  { label: '5', type: 'num' },  { label: '6', type: 'num' },
    { label: '7', type: 'num' },  { label: '8', type: 'num' },  { label: '9', type: 'num' },
    { label: 'C', type: 'clear' }, { label: '0', type: 'num' }, { label: '⌫', type: 'back' },
  ] as const;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 144px)', gap: 8 }}>
      {keys.map(({ label, type }) => (
        <motion.button
          key={label}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            if (type === 'back') return onBackspace();
            if (type === 'clear') return onClear();
            onPress(label);
          }}
          style={{
            width: 144, height: 80,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #D0E0E3',
            borderRadius: 4,
            backgroundColor: '#FFFFFF',
            cursor: 'pointer',
          }}
        >
          {type === 'back' ? (
            <Delete style={{ width: 32, height: 32, color: '#0066B3' }} strokeWidth={1.5} />
          ) : (
            <span style={{
              fontSize: 32, fontWeight: 500, lineHeight: '120%',
              color: type === 'clear' ? '#ED1C24' : '#0066B3',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {label}
            </span>
          )}
        </motion.button>
      ))}
    </div>
  );
}
