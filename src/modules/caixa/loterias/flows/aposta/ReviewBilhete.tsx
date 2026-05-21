import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowRight, Ticket, X, UserCheck, Edit2, ShoppingCart } from 'lucide-react';
import FlowLayout from '../../../../../components/primitives/FlowLayout';
import KioskButton from '../../../../../components/primitives/KioskButton';
import { useSession } from '../../../../../store/sessionStore';
import { brl } from '../../../../../utils/currency';
import { formatCpf } from '../../../../../utils/cpf';
import { MODALIDADES, getModalidade } from '../../data/modalidades';
import LotteryLogo from '../../components/LotteryLogo';

export default function ReviewBilhete() {
  const navigate      = useNavigate();
  const apostas       = useSession((s) => s.apostas);
  const removeAposta  = useSession((s) => s.removeAposta);
  const total         = useSession((s) => s.totalApostas());
  const cpf           = useSession((s) => s.cpfNaAposta);

  /* ── Empty state ── */
  if (apostas.length === 0) {
    return (
      <FlowLayout
        onBack={() => navigate('/caixa/loterias/apostar')}
        leftContent={
          <div className="flex flex-col gap-4">
            <div className="bg-white/10 rounded-xl p-4">
              <ShoppingCart className="w-8 h-8 text-white/70 mb-3" strokeWidth={1.5} />
              <div className="text-white font-bold text-kiosk-lg">Carrinho vazio</div>
              <div className="text-white/60 text-kiosk-xs mt-1">Adicione apostas para continuar</div>
            </div>
          </div>
        }
      >
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8 h-full">
          <div className="w-16 h-16 rounded-2xl bg-surface-blue flex items-center justify-center mb-4">
            <Ticket className="w-8 h-8 text-muted" />
          </div>
          <h2 className="text-kiosk-lg font-bold text-ink mb-2">Nenhuma aposta ainda</h2>
          <p className="text-kiosk-sm text-muted mb-6">Volte e escolha uma loteria para começar.</p>
          <KioskButton variant="primary" size="lg" onClick={() => navigate('/caixa/loterias/apostar')}>
            Escolher loteria
          </KioskButton>
        </div>
      </FlowLayout>
    );
  }

  return (
    <FlowLayout
      onBack={() => navigate('/caixa/loterias/apostar')}
      leftContent={
        <div className="flex flex-col gap-5">
          <div>
            <div className="text-white/60 text-kiosk-xs mb-1">
              {apostas.length} {apostas.length === 1 ? 'aposta' : 'apostas'}
            </div>
            <div className="font-bold text-white text-kiosk-xl tabular-nums">{brl(total)}</div>
          </div>

          {/* Unique lotteries */}
          <div className="flex flex-col gap-2">
            {[...new Map(apostas.map((a) => [a.modalidadeId, a])).values()].map((a) => {
              const m = getModalidade(a.modalidadeId) ?? MODALIDADES[0];
              return (
                <div key={a.modalidadeId} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: m.cor }} />
                  <span className="text-white/80 text-kiosk-xs">{m.nome}</span>
                </div>
              );
            })}
          </div>

          {cpf && (
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-white/60 text-kiosk-xs">CPF na aposta</div>
              <div className="text-white font-semibold text-kiosk-sm tabular-nums">{formatCpf(cpf)}</div>
            </div>
          )}
        </div>
      }
      rightClassName="bg-surface-blue"
    >
      <div className="p-8 flex flex-col gap-4 h-full">
        <div>
          <h1 className="font-bold text-ink text-kiosk-lg">Conferir apostas</h1>
          <p className="text-muted text-kiosk-xs mt-1">Revise antes de prosseguir ao pagamento</p>
        </div>

        {/* Apostas list */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          <AnimatePresence initial={false}>
            {apostas.map((a, idx) => {
              const m = getModalidade(a.modalidadeId) ?? MODALIDADES[0];
              return (
                <motion.div
                  key={a.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white border border-line rounded-2xl p-4"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <LotteryLogo modalidade={m} size={40} />
                    <div className="flex-1 min-w-0">
                      <div className="text-kiosk-xs text-muted">
                        Aposta {idx + 1} · Concurso {m.concursoAtual}
                      </div>
                      <div className="text-kiosk-base font-bold leading-tight truncate" style={{ color: m.cor }}>
                        {a.modalidadeNome}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-kiosk-base font-bold text-ink">{brl(a.valor)}</div>
                      <button
                        onClick={() => removeAposta(a.id)}
                        className="inline-flex items-center gap-1 text-danger text-kiosk-xs font-semibold mt-1 hover:underline"
                      >
                        <X className="w-3 h-3" /> Remover
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {a.numeros.map((n) => (
                      <span
                        key={n}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-kiosk-xs"
                        style={{ backgroundColor: m.cor }}
                      >
                        {String(n).padStart(2, '0')}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="bg-white border border-line rounded-2xl p-4 shrink-0">
          {/* CPF row */}
          <button
            onClick={() => navigate('/caixa/aposta/cpf')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-surface-blue hover:bg-line transition-colors mb-3 text-left"
          >
            <UserCheck className={`w-4 h-4 shrink-0 ${cpf ? 'text-success' : 'text-muted'}`} />
            <div className="flex-1 min-w-0">
              <div className="text-kiosk-xs text-muted leading-none">CPF na aposta</div>
              <div className={`text-kiosk-sm font-semibold mt-0.5 truncate ${cpf ? 'text-ink' : 'text-muted'}`}>
                {cpf ? formatCpf(cpf) : 'Não cadastrado · toque para adicionar'}
              </div>
            </div>
            <Edit2 className="w-4 h-4 text-muted shrink-0" />
          </button>

          <div className="flex items-baseline justify-between mb-4">
            <span className="text-kiosk-sm text-muted">Total</span>
            <span className="text-kiosk-xl font-bold text-ink tabular-nums">{brl(total)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <KioskButton variant="outline" size="lg" onClick={() => navigate('/caixa/loterias/apostar')}>
              <Plus className="w-5 h-5" /> Adicionar
            </KioskButton>
            <KioskButton variant="primary" size="lg" onClick={() => navigate('/caixa/aposta/cpf')}>
              Continuar <ArrowRight className="w-5 h-5" />
            </KioskButton>
          </div>
        </div>
      </div>
    </FlowLayout>
  );
}
