import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Delete } from 'lucide-react';
import { formatBoleto, getMaxDigits, getTipoBoleto, isComplete } from '../../../../../utils/boleto';
import { onlyDigits } from '../../../../../utils/cpf';

/**
 * 4. Loterica - Pagar Conta - Digitar — Figma (263:2065), canvas 1440×900.
 *
 * Layout:
 *  Header: bg #0066B3 — Voltar 200×80 | "Digite o código" 44px | placeholder 200×80
 *  Body: col, items-center, gap 48, padding 56 24
 *    Card branco 684px: título + contador | input display | numpad
 *    Botão "Escolher forma de Pagamento" 684×80 (#D0E0E3 → #00AB67 quando completo)
 *  Acessibilidade no rodapé
 */
export default function BoletoInput() {
  const navigate = useNavigate();
  const [raw, setRaw] = useState('');

  const digits   = onlyDigits(raw);
  const tipo     = getTipoBoleto(digits);
  const max      = getMaxDigits(tipo);
  const complete = isComplete(digits);

  useEffect(() => {
    if (complete) {
      const t = window.setTimeout(
        () => navigate('/caixa/conta/confirmar', { state: { code: digits, source: 'digitar' } }),
        600,
      );
      return () => clearTimeout(t);
    }
  }, [complete, digits, navigate]);

  const handleKey       = (k: string) => { if (digits.length < max) setRaw(digits + k); };
  const handleBackspace = () => setRaw(digits.slice(0, -1));
  const handleClear     = () => setRaw('');

  const keys = [
    { label: '1', type: 'num'   }, { label: '2', type: 'num'   }, { label: '3', type: 'num'   },
    { label: '4', type: 'num'   }, { label: '5', type: 'num'   }, { label: '6', type: 'num'   },
    { label: '7', type: 'num'   }, { label: '8', type: 'num'   }, { label: '9', type: 'num'   },
    { label: 'C', type: 'clear' }, { label: '0', type: 'num'   }, { label: '⌫', type: 'back'  },
  ] as const;

  return (
    <div className="flex flex-col h-full w-full" style={{ backgroundColor: '#EFF5F9' }}>

      {/* ── Header — Figma (263:2076) ── */}
      <div
        className="flex items-center shrink-0"
        style={{ gap: 24, padding: 24, backgroundColor: '#0066B3' }}
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/caixa/loterias/pagar')}
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 200, height: 80, backgroundColor: '#004B8B', borderRadius: 8, gap: 8, padding: '12px 24px 12px 16px' }}
        >
          <ArrowLeft style={{ width: 48, height: 48, color: '#F39200', flexShrink: 0 }} strokeWidth={2} />
          <span className="text-white" style={{ fontSize: 20, fontWeight: 500, lineHeight: '120%' }}>Voltar</span>
        </motion.button>

        <div className="flex-1 flex items-center justify-center">
          <span className="font-semibold text-center" style={{ fontSize: 44, color: '#FFFFFF', lineHeight: '120%' }}>
            Digite o código
          </span>
        </div>

        <div style={{ width: 200, height: 80, flexShrink: 0 }} />
      </div>

      {/* ── Body — Figma (263:2067) col center gap:48 pad:56 24 ── */}
      <div
        className="flex-1 overflow-y-auto flex flex-col items-center"
        style={{ gap: 24, padding: '56px 24px' }}
      >

        {/* Card 684px — Figma (263:2174) */}
        <div style={{ width: 684, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Título + contador — Figma (263:2208) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'stretch' }}>
            <span style={{ fontSize: 32, fontWeight: 600, color: '#0066B3', lineHeight: '32px' }}>
              Código de barras
            </span>
            <span style={{ fontSize: 24, fontWeight: 400, color: '#364153', lineHeight: '150%', opacity: 0.7 }}>
              {digits.length} / {max}
            </span>
          </div>

          {/* Input display — Figma (263:2178) bg #EFF5F9, border #D0E0E3 */}
          <div
            style={{
              display: 'flex', alignItems: 'center',
              padding: '26px 24px 24px',
              backgroundColor: '#EFF5F9',
              border: `1px solid ${complete ? '#00AB67' : '#D0E0E3'}`,
              borderRadius: 8,
              transition: 'border-color 0.2s',
              alignSelf: 'stretch',
            }}
          >
            <span style={{
              width: '100%',
              fontSize: 24, fontWeight: 400, lineHeight: '28px',
              color: digits ? '#364153' : '#D0E0E3',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.02em',
              wordBreak: 'break-all',
            }}>
              {digits ? formatBoleto(digits) : '00000.00000.00000.00000'}
            </span>
          </div>
        </div>

        {/* Numpad — mesma estética do CPF (kartão numérico inline) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 144px)', gap: 8 }}>
          {keys.map(({ label, type }) => (
            <motion.button
              key={label}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                if (type === 'back') return handleBackspace();
                if (type === 'clear') return handleClear();
                handleKey(label);
              }}
              style={{
                width: 144, height: 80,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #D0E0E3', borderRadius: 4,
                backgroundColor: '#FFFFFF', cursor: 'pointer',
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

        {/* Botão "Escolher forma de Pagamento" — Figma (263:2233) 684×80 */}
        <motion.button
          whileTap={complete ? { scale: 0.97 } : {}}
          disabled={!complete}
          onClick={() => {
            if (complete) navigate('/caixa/conta/confirmar', { state: { code: digits, source: 'digitar' } });
          }}
          style={{
            width: 684, height: 80,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 600, color: '#FFFFFF',
            backgroundColor: complete ? '#00AB67' : '#D0E0E3',
            borderRadius: 8, border: 'none',
            transition: 'background-color 0.25s',
          }}
        >
          Escolher forma de Pagamento
        </motion.button>

      </div>
    </div>
  );
}
