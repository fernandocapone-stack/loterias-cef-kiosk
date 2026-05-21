import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Smartphone, CreditCard, Wallet } from 'lucide-react';
import { useSession } from '../../store/sessionStore';
import { brl } from '../../utils/currency';

/**
 * Forma de Pagamento — Figma (263:2367 / 263:2746), canvas 1440×900.
 *
 * Layout (bg #EFF5F9):
 *  - Header: Back 200×80 | "Forma de Pagamento" 44px | Total display 200×80
 *  - Content: 3 tiles in a single row (same pattern as other screens)
 *      Pix | Cartão de Débito | Cartão de Crédito
 */
const methods = [
  {
    id: 'pix',
    icon: Smartphone,
    label: 'Pix',
    desc: 'Aprovação imediata pelo app do banco',
    badge: 'mais rápido',
    path: '/checkout/pix',
  },
  {
    id: 'debito',
    icon: CreditCard,
    label: 'Cartão de Débito',
    desc: 'Insira o cartão no leitor',
    badge: null,
    path: '/checkout/processando',
  },
  {
    id: 'credito',
    icon: Wallet,
    label: 'Cartão de Crédito',
    desc: 'À vista no crédito',
    badge: null,
    path: '/checkout/processando',
  },
];

export default function PaymentMethod() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const apostasTotal = useSession((s) => s.totalApostas());
  const stateValor   = (location.state as { valor?: number } | null)?.valor ?? 0;
  // Valor explicitamente passado no estado de navegação tem prioridade (boleto, recarga, etc.)
  // Fallback para totalApostas() quando vindo do fluxo de apostas sem valor no estado
  const valorFinal   = stateValor > 0 ? stateValor : apostasTotal;

  /* Right slot: total display (white text — lives on blue header) */
  const TotalSlot = (
    <div
      className="flex flex-col items-end justify-center shrink-0"
      style={{ width: 280, height: 80, padding: '0 4px' }}
    >
      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: '150%' }}>Total a pagar</span>
      <span className="font-bold tabular-nums" style={{ fontSize: 26, color: '#FFFFFF', lineHeight: '120%' }}>
        {brl(valorFinal)}
      </span>
    </div>
  );

  return (
    <div
      className="h-full w-full flex flex-col overflow-hidden"
      style={{ backgroundColor: '#EFF5F9' }}
    >
      {/* ── Header ── */}
      <div className="flex items-center shrink-0" style={{ gap: 24, padding: 24, backgroundColor: '#0066B3' }}>
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
            Forma de Pagamento
          </span>
        </div>

        {TotalSlot}
      </div>

      {/* ── 3-tile body ── */}
      <div
        className="flex-1 flex"
        style={{ padding: 24, gap: 24 }}
      >
        {methods.map((m, idx) => {
          const Icon = m.icon;
          return (
            <motion.button
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.2 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => navigate(m.path, { state: { valor: valorFinal, method: m.id } })}
              className="flex-1 flex flex-col rounded-lg bg-white text-left"
              style={{
                borderRadius: 8,
                padding: '40px 32px',
                gap: 32,
                justifyContent: 'flex-end',
                boxShadow: '0px 2px 4px rgba(0,0,0,0.08)',
              }}
            >
              {/* Icon */}
              <div
                className="self-start flex items-center justify-center rounded-2xl"
                style={{ width: 80, height: 80, backgroundColor: '#EFF5F9' }}
              >
                <Icon style={{ width: 40, height: 40, color: '#0066B3' }} strokeWidth={1.75} />
              </div>

              {/* Text */}
              <div className="flex flex-col" style={{ gap: 8 }}>
                <span className="font-semibold" style={{ fontSize: 32, color: '#0066B3', lineHeight: '120%' }}>
                  {m.label}
                </span>
                <span className="font-normal" style={{ fontSize: 24, color: '#6B7280', lineHeight: '150%' }}>
                  {m.desc}
                </span>
              </div>

              {m.badge && (
                <span
                  className="self-start font-semibold rounded-full"
                  style={{ fontSize: 16, padding: '4px 16px', backgroundColor: 'rgba(243,146,0,0.15)', color: '#C57600' }}
                >
                  {m.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
