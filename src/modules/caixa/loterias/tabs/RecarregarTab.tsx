import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Delete } from 'lucide-react';
import { useSession } from '../../../../store/sessionStore';
import { brl } from '../../../../utils/currency';

/**
 * Recarga Celular — Figma (263:4927 / 263:5166), canvas 1440×900.
 *
 * Fluxo (2 passos):
 *  1. Digite o número — numpad inline 3×4, operadora identificada pelo DDD ao digitar
 *  2. Escolha o valor — grade 4×2 de valores, header direito mostra operadora + número
 *     → clicar num valor navega direto para /checkout/pagamento
 *
 * Sem etapa de "escolha a operadora" — identificação automática.
 */

/* ── Dados ───────────────────────────────────────────── */
const OPERADORAS = [
  { id: 'vivo',  nome: 'Vivo',  cor: '#660099' },
  { id: 'claro', nome: 'Claro', cor: '#E2231A' },
  { id: 'tim',   nome: 'TIM',   cor: '#003399' },
  { id: 'oi',    nome: 'Oi',    cor: '#B58900' },
];

const VALORES = [10, 15, 20, 25, 30, 40, 50, 100];

/* ── Helpers ─────────────────────────────────────────── */
function formatPhone(raw: string): string {
  if (raw.length === 0) return '';
  if (raw.length <= 2)  return `(${raw}`;
  if (raw.length <= 6)  return `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
  if (raw.length <= 10) return `(${raw.slice(0, 2)}) ${raw.slice(2, 6)}-${raw.slice(6)}`;
  return `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7, 11)}`;
}

/** Mock: identifica operadora pelo DDD (seed determinístico) */
function detectarOperadora(digits: string) {
  if (digits.length < 2) return null;
  const ddd = parseInt(digits.slice(0, 2), 10);
  return OPERADORAS[ddd % OPERADORAS.length];
}

/* ── Teclado numérico ────────────────────────────────── */
const KEYS = [
  { label: '1', type: 'num'   }, { label: '2', type: 'num'   }, { label: '3', type: 'num'   },
  { label: '4', type: 'num'   }, { label: '5', type: 'num'   }, { label: '6', type: 'num'   },
  { label: '7', type: 'num'   }, { label: '8', type: 'num'   }, { label: '9', type: 'num'   },
  { label: 'C', type: 'clear' }, { label: '0', type: 'num'   }, { label: '⌫', type: 'back'  },
] as const;

type Step = 'numero' | 'valor';

/* ─────────────────────────────────────────────────────── */
export default function RecarregarTab() {
  const navigate            = useNavigate();
  const setPendingOperation = useSession((s) => s.setPendingOperation);

  const [step,   setStep]   = useState<Step>('numero');
  const [numero, setNumero] = useState('');

  const complete  = numero.length === 11;
  const operadora = detectarOperadora(numero);

  /* ── Handlers teclado ── */
  const pressKey  = (k: string) => { if (numero.length < 11) setNumero((n) => n + k); };
  const backspace = ()           => setNumero((n) => n.slice(0, -1));
  const clear     = ()           => setNumero('');

  /* ── Ir para pagamento ── */
  const goToPayment = (valor: number) => {
    if (!operadora) return;
    setPendingOperation({
      type:   'recarga',
      total:  valor,
      recarga: { operadoraId: operadora.id, operadoraNome: operadora.nome, numero, valor },
    });
    navigate('/checkout/pagamento', { state: { valor } });
  };

  /* ══════════════════════════════════════════════════════
     PASSO 1 — Digite o número
  ══════════════════════════════════════════════════════ */
  if (step === 'numero') {
    return (
      <div className="flex flex-col h-full w-full" style={{ backgroundColor: '#EFF5F9' }}>

        {/* Header */}
        <div className="flex items-center shrink-0" style={{ gap: 24, padding: 24, backgroundColor: '#0066B3' }}>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/caixa/loterias')}
            className="flex items-center justify-center rounded-lg shrink-0"
            style={{ width: 200, height: 80, backgroundColor: '#004B8B', borderRadius: 8, gap: 8, padding: '12px 24px 12px 16px' }}
          >
            <ArrowLeft style={{ width: 48, height: 48, color: '#F39200', flexShrink: 0 }} strokeWidth={2} />
            <span className="text-white" style={{ fontSize: 20, fontWeight: 500, lineHeight: '120%' }}>Voltar</span>
          </motion.button>

          <div className="flex-1 flex items-center justify-center">
            <span className="font-semibold text-center" style={{ fontSize: 44, color: '#FFFFFF', lineHeight: '120%' }}>
              Recarga Celular
            </span>
          </div>

          <div style={{ width: 200, height: 80, flexShrink: 0 }} />
        </div>

        {/* Body */}
        <div
          className="flex-1 overflow-y-auto flex flex-col items-center"
          style={{ gap: 24, padding: '56px 24px' }}
        >

          {/* Card 684px */}
          <div style={{ width: 684, display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Título + contador */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 32, fontWeight: 600, color: '#0066B3', lineHeight: '32px' }}>
                Digite o número do celular
              </span>
              <span style={{ fontSize: 24, fontWeight: 400, color: '#364153', lineHeight: '150%', opacity: 0.7 }}>
                {numero.length} / 11
              </span>
            </div>

            {/* Display */}
            <div style={{
              display: 'flex', alignItems: 'center',
              padding: '26px 24px 24px',
              backgroundColor: '#EFF5F9',
              border: `1px solid ${complete ? '#00AB67' : '#D0E0E3'}`,
              borderRadius: 8,
              transition: 'border-color 0.2s',
            }}>
              <span style={{
                width: '100%',
                fontSize: 24, fontWeight: 400, lineHeight: '28px',
                color: numero ? '#364153' : '#D0E0E3',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '0.04em',
              }}>
                {numero ? formatPhone(numero) : '(00) 00000-0000'}
              </span>
            </div>

            {/* Badge de operadora identificada */}
            <AnimatePresence>
              {operadora && (
                <motion.div
                  key={operadora.id}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px', borderRadius: 8,
                    backgroundColor: '#FFFFFF',
                    border: `1.5px solid ${operadora.cor}40`,
                    alignSelf: 'flex-start',
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                    backgroundColor: operadora.cor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF' }}>
                      {operadora.nome[0]}
                    </span>
                  </div>
                  <span style={{ fontSize: 18, fontWeight: 500, color: '#364153' }}>
                    Operadora identificada:&nbsp;
                    <strong style={{ color: operadora.cor }}>{operadora.nome}</strong>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Teclado numérico */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 144px)', gap: 8 }}>
            {KEYS.map(({ label, type }) => (
              <motion.button
                key={label}
                whileTap={{ scale: 0.94 }}
                onClick={() => {
                  if (type === 'back')  return backspace();
                  if (type === 'clear') return clear();
                  pressKey(label);
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

          {/* Botão Continuar */}
          <motion.button
            whileTap={complete ? { scale: 0.97 } : {}}
            disabled={!complete}
            onClick={() => { if (complete) setStep('valor'); }}
            style={{
              width: 684, height: 80,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 600, color: '#FFFFFF',
              backgroundColor: complete ? '#00AB67' : '#D0E0E3',
              borderRadius: 8, border: 'none',
              transition: 'background-color 0.25s',
              cursor: complete ? 'pointer' : 'default',
            }}
          >
            Continuar
          </motion.button>

        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════
     PASSO 2 — Escolha o valor
  ══════════════════════════════════════════════════════ */
  return (
    <div className="flex flex-col h-full w-full" style={{ backgroundColor: '#EFF5F9' }}>

      {/* Header com operadora + número à direita */}
      <div className="flex items-center shrink-0" style={{ gap: 24, padding: 24, backgroundColor: '#0066B3' }}>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setStep('numero')}
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 200, height: 80, backgroundColor: '#004B8B', borderRadius: 8, gap: 8, padding: '12px 24px 12px 16px' }}
        >
          <ArrowLeft style={{ width: 48, height: 48, color: '#F39200', flexShrink: 0 }} strokeWidth={2} />
          <span className="text-white" style={{ fontSize: 20, fontWeight: 500, lineHeight: '120%' }}>Voltar</span>
        </motion.button>

        <div className="flex-1 flex items-center justify-center">
          <span className="font-semibold text-center" style={{ fontSize: 44, color: '#FFFFFF', lineHeight: '120%' }}>
            Escolha o valor
          </span>
        </div>

        {/* Slot direito: operadora + número */}
        <div
          className="flex flex-col items-end justify-center shrink-0"
          style={{ width: 200, height: 80, padding: '0 4px' }}
        >
          {operadora && (
            <span style={{ fontSize: 20, fontWeight: 400, color: 'rgba(255,255,255,0.7)', lineHeight: '150%' }}>
              {operadora.nome}
            </span>
          )}
          <span style={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF', lineHeight: '130%', fontVariantNumeric: 'tabular-nums' }}>
            {formatPhone(numero)}
          </span>
        </div>
      </div>

      {/* Body: grade 4×2 + acessibilidade */}
      <div className="flex flex-col flex-1" style={{ padding: 24, gap: 24 }}>

        {/* Grade de valores */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          gap: 24,
        }}>
          {VALORES.map((v, idx) => (
            <motion.button
              key={v}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.2 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => goToPayment(v)}
              className="flex flex-col rounded-lg text-left bg-white"
              style={{
                borderRadius: 8,
                padding: '40px 24px',
                justifyContent: 'flex-end',
                boxShadow: '0px 2px 4px rgba(0,0,0,0.08)',
              }}
            >
              <span className="font-semibold" style={{ fontSize: 32, color: '#0066B3', lineHeight: '120%' }}>
                {brl(v)}
              </span>
            </motion.button>
          ))}
        </div>

      </div>
    </div>
  );
}
