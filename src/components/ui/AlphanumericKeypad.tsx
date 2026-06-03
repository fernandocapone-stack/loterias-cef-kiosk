import { motion } from 'framer-motion';
import { Delete } from 'lucide-react';

/**
 * Keypad alfanumérico para o totem — usado na confirmação de assinatura AES.
 *
 * Layout 6 colunas × 7 linhas:
 *   Linha 1: 1-6
 *   Linha 2: 7 8 9 0 ⌫ C
 *   Linhas 3-7: A-Z em ordem alfabética (com Y/Z na última linha centralizadas)
 *
 * Teclas: 76×56, gap 4. Largura total: 476px.
 */
export default function AlphanumericKeypad({
  onPress, onBackspace, onClear,
}: {
  onPress: (key: string) => void;
  onBackspace: () => void;
  onClear: () => void;
}) {
  const rows: (string | 'C' | '⌫' | null)[][] = [
    ['1','2','3','4','5','6'],
    ['7','8','9','0','⌫','C'],
    ['A','B','C','D','E','F'],
    ['G','H','I','J','K','L'],
    ['M','N','O','P','Q','R'],
    ['S','T','U','V','W','X'],
    [null,null,'Y','Z',null,null],
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 76px)', gap: 4 }}>
          {row.map((key, ci) => {
            if (key === null) {
              return <div key={ci} style={{ width: 76, height: 56 }} />;
            }
            const isClear = key === 'C' && ri === 1;
            const isBack  = key === '⌫';
            return (
              <motion.button
                key={ci}
                whileTap={{ scale: 0.94 }}
                onClick={() => {
                  if (isBack)  return onBackspace();
                  if (isClear) return onClear();
                  onPress(key);
                }}
                style={{
                  width: 76, height: 56,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid #D0E0E3',
                  borderRadius: 4,
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                {isBack ? (
                  <Delete style={{ width: 24, height: 24, color: '#0066B3' }} strokeWidth={1.5} />
                ) : (
                  <span style={{
                    fontSize: 22, fontWeight: 500, lineHeight: '120%',
                    color: isClear ? '#ED1C24' : '#0066B3',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {key}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
