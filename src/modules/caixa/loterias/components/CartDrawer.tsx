import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, ArrowRight, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../../../store/sessionStore';
import { brl } from '../../../../utils/currency';
import { getModalidade } from '../data/modalidades';

export default function CartDrawer() {
  const navigate            = useNavigate();
  const apostas             = useSession((s) => s.apostas);
  const removeAposta        = useSession((s) => s.removeAposta);
  const total               = useSession((s) => s.totalApostas());
  const cartOpen            = useSession((s) => s.cartOpen);
  const setCartOpen         = useSession((s) => s.setCartOpen);
  const setPendingOperation = useSession((s) => s.setPendingOperation);

  const handleFinalizar = () => {
    setPendingOperation({ type: 'aposta', total, apostas });
    setCartOpen(false);
    navigate('/caixa/aposta/cpf');
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
            onClick={() => setCartOpen(false)}
          />

          {/* Painel lateral direito — 520px, touch-scale */}
          <motion.div
            key="cart-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 bg-white flex flex-col"
            style={{ width: 520 }}
          >
            {/* ── Header do drawer — 98px, mesma escala do botão Voltar ── */}
            <div
              className="flex items-center justify-between shrink-0"
              style={{
                height: 98,
                padding: '0 32px',
                borderBottom: '1px solid #EFF5F9',
              }}
            >
              <div className="flex items-center" style={{ gap: 12 }}>
                <span className="font-bold" style={{ fontSize: 28, color: '#1F2937' }}>
                  Carrinho
                </span>
                {apostas.length > 0 && (
                  <span
                    className="font-semibold"
                    style={{ fontSize: 18, color: '#6B7280' }}
                  >
                    {apostas.length} {apostas.length === 1 ? 'aposta' : 'apostas'}
                  </span>
                )}
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="flex items-center justify-center rounded-lg transition-colors"
                style={{ width: 64, height: 64, backgroundColor: '#EFF5F9' }}
              >
                <X style={{ width: 28, height: 28, color: '#6B7280' }} />
              </button>
            </div>

            {/* ── Lista de apostas ── */}
            <div
              className="flex-1 overflow-y-auto flex flex-col"
              style={{ padding: '24px 32px', gap: 16 }}
            >
              {apostas.length === 0 ? (
                <div
                  className="flex-1 flex flex-col items-center justify-center"
                  style={{ gap: 16, color: '#9CA3AF' }}
                >
                  <span style={{ fontSize: 64 }}>🛒</span>
                  <span style={{ fontSize: 20 }}>Nenhuma aposta ainda</span>
                </div>
              ) : (
                apostas.map((a, idx) => {
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
                      style={{
                        border: '1px solid #EFF5F9',
                        borderRadius: 12,
                        padding: 24,
                        display: 'flex',
                        gap: 16,
                        alignItems: 'flex-start',
                      }}
                    >
                      {/* Barra de cor */}
                      <div
                        className="shrink-0 rounded-full"
                        style={{ width: 5, alignSelf: 'stretch', backgroundColor: m.cor }}
                      />

                      <div className="flex-1 min-w-0" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {/* Nome + concurso */}
                        <div className="flex items-baseline" style={{ gap: 10 }}>
                          <span className="font-bold" style={{ fontSize: 20, color: m.cor }}>
                            {a.modalidadeNome}
                          </span>
                          <span style={{ fontSize: 15, color: '#9CA3AF' }}>
                            Concurso {m.concursoAtual}
                          </span>
                        </div>

                        {/* Números */}
                        <div className="flex flex-wrap" style={{ gap: 8 }}>
                          {a.numeros.map((n) => (
                            <span
                              key={n}
                              className="flex items-center justify-center rounded-full font-bold text-white"
                              style={{
                                width: 40, height: 40,
                                fontSize: 13,
                                backgroundColor: m.cor,
                              }}
                            >
                              {String(n).padStart(2, '0')}
                            </span>
                          ))}
                        </div>

                        {/* Teimosinha badge */}
                        {a.teimosinha && (
                          <span
                            className="inline-block self-start rounded-full font-semibold"
                            style={{
                              padding: '4px 14px',
                              fontSize: 13,
                              color: m.cor,
                              backgroundColor: `${m.cor}1A`,
                            }}
                          >
                            Teimosinha · {a.concursos} concursos
                          </span>
                        )}
                      </div>

                      {/* Valor + remover */}
                      <div className="shrink-0 flex flex-col items-end" style={{ gap: 12 }}>
                        <span className="font-bold" style={{ fontSize: 20, color: '#1F2937' }}>
                          {brl(a.valor)}
                        </span>
                        <button
                          onClick={() => removeAposta(a.id)}
                          className="flex items-center justify-center rounded-lg transition-opacity hover:opacity-70"
                          style={{
                            gap: 6,
                            padding: '8px 14px',
                            fontSize: 14,
                            fontWeight: 600,
                            color: '#EF4444',
                            backgroundColor: '#FEE2E2',
                            border: 'none',
                          }}
                        >
                          <Trash2 style={{ width: 16, height: 16 }} />
                          Remover
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* ── Rodapé — só aparece com itens ── */}
            {apostas.length > 0 && (
              <div
                className="shrink-0"
                style={{
                  padding: '24px 32px 32px',
                  borderTop: '1px solid #EFF5F9',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                }}
              >
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 18, color: '#6B7280' }}>Total das apostas</span>
                  <span className="font-bold tabular-nums" style={{ fontSize: 28, color: '#1F2937' }}>
                    {brl(total)}
                  </span>
                </div>

                <div className="flex" style={{ gap: 16 }}>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="flex items-center justify-center font-semibold rounded-lg transition-colors"
                    style={{
                      flex: 1, height: 72,
                      fontSize: 18,
                      color: '#6B7280',
                      backgroundColor: '#EFF5F9',
                      border: 'none',
                      gap: 10,
                    }}
                  >
                    <Plus style={{ width: 20, height: 20 }} />
                    Adicionar mais
                  </button>
                  <button
                    onClick={handleFinalizar}
                    className="flex items-center justify-center font-bold rounded-lg transition-colors"
                    style={{
                      flex: 1, height: 72,
                      fontSize: 18,
                      color: '#FFFFFF',
                      backgroundColor: '#00AB67',
                      border: 'none',
                      gap: 10,
                    }}
                  >
                    Finalizar
                    <ArrowRight style={{ width: 20, height: 20 }} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
