import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Plus, XCircle, Delete, CheckCircle2, Clock } from 'lucide-react';
import { useSession } from '../../../store/sessionStore';
import { brl } from '../../../utils/currency';
import { getModalidade } from './data/modalidades';
import { formatCpf, isValidCpf } from '../../../utils/cpf';
import LotteryClover from '../../../components/ui/LotteryClover';

/**
 * Cart Page — Figma (258:4020 / 299:2076), canvas 1440×900.
 * CPF Drawer — Figma (299:1857), 497×900.
 *
 * Body columns: flex 3 (products) + flex 1 (sidebar) — same 3:1 ratio as PickNumbers.
 */

/* ── NumberChip display-only — cart compact style (Figma 351:896) ───────────
   60×40px fixed, bg #EFF5F9, brackets #0066B3 opacity 0.5, text #0066B3 20px
   ─────────────────────────────────────────────────────────────────────────── */
const CART_CHIP_COLOR = '#0066B3';
function NumberChipDisplay({ n }: { n: number }) {
  const bracket = (side: 'left' | 'right') => ({
    width: 6.73, height: 35.32, flexShrink: 0 as const, opacity: 0.5,
    borderTop: `2px solid ${CART_CHIP_COLOR}`,
    borderBottom: `2px solid ${CART_CHIP_COLOR}`,
    ...(side === 'left'
      ? { borderLeft: `2px solid ${CART_CHIP_COLOR}`, borderRadius: '3px 0 0 3px' }
      : { borderRight: `2px solid ${CART_CHIP_COLOR}`, borderRadius: '0 3px 3px 0' }),
  });
  return (
    <div
      className="flex items-center justify-center"
      style={{ width: 60, height: 40, padding: 4, borderRadius: 4, backgroundColor: '#EFF5F9', flexShrink: 0 }}
    >
      <div style={bracket('left')} />
      <span style={{
        width: 40, textAlign: 'center',
        fontSize: 20, fontWeight: 500, lineHeight: '120%',
        color: CART_CHIP_COLOR, fontVariantNumeric: 'tabular-nums',
      }}>
        {String(n).padStart(2, '0')}
      </span>
      <div style={bracket('right')} />
    </div>
  );
}

/* ── Timer badge — shared style (Figma 351:916) ─────────────────────────────
   126×40px, border 2px #D0E0E3, radius 8, clock icon + MM:SS
   ─────────────────────────────────────────────────────────────────────────── */
const TIMER_TOTAL_MS = 12 * 60 * 1000;
function TimerBadge({ addedAt }: { addedAt: number }) {
  const calc = () => Math.max(0, Math.ceil((addedAt + TIMER_TOTAL_MS - Date.now()) / 1000));
  const [secsLeft, setSecsLeft] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setSecsLeft(calc()), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addedAt]);
  const mm  = String(Math.floor(secsLeft / 60)).padStart(2, '0');
  const ss  = String(secsLeft % 60).padStart(2, '0');
  const red = secsLeft < 60;
  return (
    <div
      className="flex items-center justify-center shrink-0"
      style={{
        width: 126, height: 40,
        border: `2px solid ${red ? '#ED1C24' : '#D0E0E3'}`,
        borderRadius: 8, gap: 8, padding: '0 16px',
      }}
    >
      <Clock style={{ width: 24, height: 24, color: red ? '#ED1C24' : '#005DA4', flexShrink: 0 }} strokeWidth={1.5} />
      <span style={{
        fontSize: 20, fontWeight: 600, lineHeight: '160%',
        color: red ? '#ED1C24' : '#005DA4',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {mm}:{ss}
      </span>
    </div>
  );
}

/* ── CPF Numpad (Figma 299:2038) ────────────────────────────────────────────
   Botões 144×80, borda 2px #D0E0E3, borderRadius 4px, texto Medium 32px.
   Números: #0066B3 | C: #ED1C24 | ⌫: ícone Delete
   ─────────────────────────────────────────────────────────────────────────── */
function CpfNumpad({
  onPress,
  onBackspace,
  onClear,
}: {
  onPress: (k: string) => void;
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

/* ── CartPage ────────────────────────────────────────────────────────────────── */
export default function CartPage() {
  const navigate     = useNavigate();
  const apostas      = useSession((s) => s.apostas);
  const removeAposta = useSession((s) => s.removeAposta);
  const total        = useSession((s) => s.totalApostas());
  const setPendingOp = useSession((s) => s.setPendingOperation);
  const storeCpf     = useSession((s) => s.cpfNaAposta);
  const setCpfStore  = useSession((s) => s.setCpf);

  const [cpf, setCpf]           = useState<string>(storeCpf ?? '');
  const [drawerOpen, setDrawer] = useState(false);

  const cpfValid = isValidCpf(cpf);
  const hasItems = apostas.length > 0;

  const confirmCpf = () => {
    if (!cpfValid) return;
    setCpfStore(cpf);
    setDrawer(false);
  };

  const handleFinalizar = () => {
    if (!cpfValid || !hasItems) return;
    setPendingOp({ type: 'aposta', total, apostas, cpf });
    navigate('/checkout/pagamento', { state: { valor: total } });
  };

  return (
    <div
      className="relative h-full w-full flex flex-col overflow-hidden"
      style={{ backgroundColor: '#EFF5F9' }}
    >

      {/* ══════════════════════════════════════════
          HEADER — bg #0066B3
          ══════════════════════════════════════════ */}
      <div
        className="flex items-center shrink-0"
        style={{ gap: 24, padding: 24, backgroundColor: '#0066B3' }}
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate(-1)}
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 280, height: 80, backgroundColor: '#004B8B', borderRadius: 8, gap: 8, padding: '12px 24px 12px 16px' }}
        >
          <ArrowLeft style={{ width: 48, height: 48, color: '#F39200', flexShrink: 0 }} strokeWidth={2} />
          <span className="text-white" style={{ fontSize: 20, fontWeight: 500 }}>Voltar</span>
        </motion.button>

        <div className="flex-1 flex items-center justify-center">
          <span className="font-semibold text-center" style={{ fontSize: 44, color: '#FFFFFF', lineHeight: '120%' }}>
            Carrinho de Apostas
          </span>
        </div>

        <div style={{ width: 280, height: 80, flexShrink: 0 }} />
      </div>

      {/* ══════════════════════════════════════════
          BODY — flex 3 + flex 1 (same ratio as PickNumbers)
          ══════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden" style={{ gap: 24, padding: 24 }}>

        {/* ── Left: product list (flex 3) ── */}
        <div
          className="overflow-y-auto rounded-lg bg-white"
          style={{ flex: 3, minWidth: 0, padding: 20 }}
        >
          {/* Table header — Figma (351:883) */}
          {hasItems && (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 24, padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
              <span style={{ width: 200, fontSize: 16, fontWeight: 500, color: '#6B7280', textTransform: 'uppercase', opacity: 0.7, flexShrink: 0 }}>Modalidade</span>
              <span style={{ flex: 1, fontSize: 16, fontWeight: 500, color: '#6B7280', textTransform: 'uppercase', opacity: 0.7 }}>Números</span>
              <span style={{ width: 126, fontSize: 16, fontWeight: 500, color: '#6B7280', textTransform: 'uppercase', opacity: 0.7, flexShrink: 0 }}>Tempo</span>
              <span style={{ width: 120, fontSize: 16, fontWeight: 500, color: '#6B7280', textTransform: 'uppercase', opacity: 0.7, flexShrink: 0 }}>Valor</span>
              <span style={{ width: 40, flexShrink: 0 }} />
            </div>
          )}

          {!hasItems ? (
            <div className="h-full flex flex-col items-center justify-center" style={{ gap: 20 }}>
              <ShoppingCart style={{ width: 80, height: 80, color: '#D1D5DB' }} strokeWidth={1.5} />
              <span style={{ fontSize: 24, color: '#9CA3AF', fontWeight: 500 }}>
                Nenhuma aposta no carrinho
              </span>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/caixa/loterias/apostar')}
                className="flex items-center gap-3 font-semibold text-white"
                style={{ height: 64, padding: '0 32px', backgroundColor: '#0066B3', borderRadius: 8, fontSize: 20 }}
              >
                <Plus style={{ width: 20, height: 20 }} />
                Fazer uma aposta
              </motion.button>
            </div>
          ) : (
            <AnimatePresence>
              {apostas.map((a, idx) => {
                const m = getModalidade(a.modalidadeId);
                if (!m) return null;
                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.04 }}
                    layout
                  >
                    {idx > 0 && (
                      <div style={{ height: 1, backgroundColor: '#000000', opacity: 0.1 }} />
                    )}
                    {/* Row: Modalidade | Números | Tempo | Valor | Remover — Figma (351:889) */}
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 24, padding: '24px 0' }}>

                      {/* Col 1 — Modalidade: symbol + nome + concurso — Figma style_7S6CW7 / style_983P4L */}
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20, flexShrink: 0, width: 210 }}>
                        <LotteryClover color={m.cor} size={40} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <span style={{ fontSize: 20, fontWeight: 600, color: '#005DA4', lineHeight: '120%' }}>
                            {m.nome}
                          </span>
                          <span style={{ fontSize: 20, fontWeight: 400, color: '#6B7280', lineHeight: '120%' }}>
                            Concurso <strong style={{ fontWeight: 700 }}>{m.concursoAtual}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Col 2 — Números (flex 1, nowrap) */}
                      <div style={{ flex: 1, display: 'flex', flexWrap: 'nowrap', gap: 6, alignItems: 'center', overflow: 'hidden', minWidth: 0 }}>
                        {a.numeros.map((n) => (
                          <NumberChipDisplay key={n} n={n} />
                        ))}
                      </div>

                      {/* Col 3 — Timer badge (126×40) */}
                      <div style={{ flexShrink: 0 }}>
                        <TimerBadge addedAt={a.addedAt} />
                      </div>

                      {/* Col 4 — Valor */}
                      <div style={{ width: 120, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexShrink: 0 }}>
                        <span style={{ fontSize: 20, fontWeight: 700, color: '#6B7280', fontVariantNumeric: 'tabular-nums' }}>
                          {brl(a.valor)}
                        </span>
                      </div>

                      {/* Col 5 — Remover (X com círculo, Figma icon/close) */}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeAposta(a.id)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, flexShrink: 0, marginLeft: 'auto' }}
                      >
                        <XCircle style={{ width: 28, height: 28, color: '#9CA3AF' }} strokeWidth={1.5} />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* ── Right sidebar (flex 1 = 1/4 of body) ── */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>

          {/* CPF card — no topo */}
          <div className="rounded-lg bg-white" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, flexShrink: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 24, fontWeight: 600, color: '#0066B3', lineHeight: '32px' }}>CPF</span>
              <span style={{ fontSize: 18, fontWeight: 400, color: '#6B7280', lineHeight: '28px' }}>
                Informe seu CPF para finalizar
              </span>
            </div>

            {/* Tappable CPF field */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setDrawer(true)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                alignSelf: 'stretch',
                padding: '20px 24px',
                backgroundColor: '#EFF5F9',
                border: `1px solid ${cpfValid ? '#00AB67' : cpf.length === 11 ? '#ED1C24' : '#D0E0E3'}`,
                borderRadius: 8,
                transition: 'border-color 0.2s',
              }}
            >
              <span style={{
                fontSize: 24, fontWeight: 400, lineHeight: '28px',
                color: cpf ? '#0066B3' : '#D0E0E3',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: cpf ? '0.04em' : undefined,
              }}>
                {cpf ? formatCpf(cpf) : '000.000.000-00'}
              </span>
              {cpfValid && (
                <CheckCircle2 style={{ width: 24, height: 24, color: '#00AB67', flexShrink: 0 }} />
              )}
            </motion.button>

            {!cpf && (
              <span style={{ fontSize: 14, color: '#6B7280', lineHeight: '28px' }}>Campo obrigatório</span>
            )}
          </div>

          {/* Resumo card — abaixo do CPF, com os CTAs dentro */}
          {hasItems && (
            <div className="rounded-lg bg-white" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, flexShrink: 0 }}>
              <span style={{ fontSize: 24, fontWeight: 600, color: '#00AB67', lineHeight: '32px' }}>Resumo</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 16, fontWeight: 500, color: '#6B7280', textTransform: 'uppercase' as const }}>Apostas:</span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: '#6B7280' }}>{apostas.length}</span>
                </div>
                <div style={{ height: 1, backgroundColor: '#000000', opacity: 0.1 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 24, fontWeight: 600, color: '#00AB67' }}>Total:</span>
                  <span style={{ fontSize: 24, fontWeight: 700, color: '#00AB67', fontVariantNumeric: 'tabular-nums' }}>
                    {brl(total)}
                  </span>
                </div>
              </div>

              {/* Divisor */}
              <div style={{ height: 1, backgroundColor: '#000000', opacity: 0.08 }} />

              {/* Adicionar mais apostas */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/caixa/loterias/apostar')}
                style={{
                  height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 600, color: '#00AB67',
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #00AB67',
                  borderRadius: 8,
                }}
              >
                Adicionar mais Apostas
              </motion.button>

              {/* Finalizar e Pagar */}
              <motion.button
                whileTap={cpfValid && hasItems ? { scale: 0.97 } : {}}
                disabled={!cpfValid || !hasItems}
                onClick={handleFinalizar}
                style={{
                  height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
                  fontSize: 20, fontWeight: 600, color: '#FFFFFF',
                  backgroundColor: cpfValid && hasItems ? '#00AB67' : '#D0E0E3',
                  borderRadius: 8, border: 'none',
                  transition: 'background-color 0.25s',
                }}
              >
                <ShoppingCart style={{ width: 24, height: 24 }} />
                Finalizar e Pagar
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          CPF DRAWER — Figma (299:1857), 497×900
          ══════════════════════════════════════════ */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="cpf-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDrawer(false)}
              className="absolute inset-0"
              style={{ backgroundColor: 'rgba(0,0,0,0.35)', zIndex: 40 }}
            />

            {/* Drawer panel — 497px, full-height */}
            <motion.div
              key="cpf-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="absolute right-0 top-0 h-full flex flex-col overflow-hidden"
              style={{
                width: 497,
                backgroundColor: '#FFFFFF',
                boxShadow: '0px 4px 60px 0px rgba(0,0,0,0.25)',
                borderRadius: 8,
                zIndex: 50,
              }}
            >

              {/* Header — bg #EFF5F9 */}
              <div
                style={{
                  display: 'flex', flexDirection: 'row',
                  alignItems: 'center',
                  gap: 20,
                  padding: 24,
                  backgroundColor: '#EFF5F9',
                  flexShrink: 0,
                }}
              >
                <span style={{ flex: 1, fontSize: 44, fontWeight: 700, color: '#0066B3', lineHeight: '120%' }}>
                  Digite o CPF
                </span>
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setDrawer(false)}
                  style={{
                    width: 56, height: 56, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: 'transparent', border: 'none',
                  }}
                >
                  {/* X icon — close (icon/close is a custom component, using inline SVG) */}
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4L24 24M24 4L4 24" stroke="#0066B3" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </motion.button>
              </div>

              {/* Body — fills remaining height */}
              <div
                style={{
                  flex: 1,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'stretch',
                  gap: 24,
                  padding: 24,
                  overflowY: 'auto',
                  borderTop: '1px solid #EFF5F9',
                }}
              >
                {/* Label + input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <span style={{ fontSize: 24, fontWeight: 400, color: '#6B7280', lineHeight: '150%' }}>
                    Use o teclado abaixo
                  </span>

                  {/* CPF input display */}
                  <div
                    style={{
                      display: 'flex', flexDirection: 'row',
                      justifyContent: 'center', alignItems: 'center',
                      alignSelf: 'stretch',
                      gap: 8,
                      padding: '26px 24px 24px',
                      backgroundColor: '#EFF5F9',
                      border: `1px solid ${cpfValid ? '#00AB67' : cpf.length === 11 ? '#ED1C24' : '#D0E0E3'}`,
                      borderRadius: 8,
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <span style={{
                      flex: 1, textAlign: 'center',
                      fontSize: 32, fontWeight: 400, lineHeight: '28px',
                      color: cpf ? '#0066B3' : '#D0E0E3',
                      fontVariantNumeric: 'tabular-nums',
                      letterSpacing: cpf ? '0.08em' : '0.04em',
                    }}>
                      {cpf ? formatCpf(cpf) : '000.000.000-00'}
                    </span>
                    {cpfValid && (
                      <CheckCircle2 style={{ width: 24, height: 24, color: '#00AB67', flexShrink: 0 }} />
                    )}
                  </div>
                </div>

                {/* Feedback de CPF inválido */}
                {cpf.length === 11 && !cpfValid && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 16px',
                      backgroundColor: 'rgba(237,28,36,0.08)',
                      borderRadius: 8,
                      border: '1px solid rgba(237,28,36,0.25)',
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 7V10M10 13H10.01M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z" stroke="#ED1C24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ fontSize: 18, fontWeight: 500, color: '#ED1C24', lineHeight: '150%' }}>
                      CPF inválido. Verifique os números e tente novamente.
                    </span>
                  </motion.div>
                )}

                {/* Numpad */}
                <CpfNumpad
                  onPress={(k) => setCpf((c) => (c.length < 11 ? c + k : c))}
                  onBackspace={() => setCpf((c) => c.slice(0, -1))}
                  onClear={() => setCpf('')}
                />

                {/* Privacy note */}
                <span style={{ fontSize: 18, fontWeight: 400, color: '#6B7280', lineHeight: '150%' }}>
                  Seu CPF aparece apenas no bilhete. O totem não cria conta nem armazena seus dados após a operação.
                </span>
              </div>

              {/* Bottom Nav — Confirmar */}
              <div
                style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'stretch',
                  gap: 20,
                  padding: 24,
                  flexShrink: 0,
                  backgroundColor: '#FFFFFF',
                }}
              >
                <motion.button
                  whileTap={cpfValid ? { scale: 0.97 } : {}}
                  disabled={!cpfValid}
                  onClick={confirmCpf}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 16,
                    padding: '0 88px',
                    height: 80,
                    backgroundColor: cpfValid ? '#00AB67' : '#D0E0E3',
                    borderRadius: 8, border: 'none',
                    fontSize: 24, fontWeight: 700, color: '#FFFFFF',
                    lineHeight: '160%',
                    transition: 'background-color 0.2s',
                  }}
                >
                  Confirmar
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
