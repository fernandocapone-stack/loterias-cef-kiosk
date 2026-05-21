import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Plus } from 'lucide-react';
import { useLojaStore } from '../../store/lojaStore';
import { useSession } from '../../store/sessionStore';
import { brl } from '../../utils/currency';

/**
 * Carrinho da Loja de Conveniência — /loja/carrinho
 *
 * Layout: header #0066B3 + body (cols: flex-3 lista | flex-1 sidebar)
 * Segue o mesmo padrão visual de CartPage das loterias.
 */
export default function LojaCarrinhoScreen() {
  const navigate         = useNavigate();
  const itens            = useLojaStore((s) => s.itens);
  const setQtd           = useLojaStore((s) => s.setQuantidade);
  const removeItem       = useLojaStore((s) => s.removeItem);
  const total            = useLojaStore((s) => s.totalValor());
  const setPendingOp     = useSession((s) => s.setPendingOperation);

  const hasItems = itens.length > 0;

  const handleFinalizar = () => {
    if (!hasItems) return;
    setPendingOp({ type: 'loja', total });
    navigate('/checkout/pagamento', { state: { valor: total } });
  };

  return (
    <div
      className="relative h-full w-full flex flex-col overflow-hidden"
      style={{ backgroundColor: '#EFF5F9' }}
    >

      {/* ── Header ── */}
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
          <span className="text-white" style={{ fontSize: 20, fontWeight: 500, lineHeight: '120%' }}>Voltar</span>
        </motion.button>

        <div className="flex-1 flex items-center justify-center">
          <span className="font-semibold text-center" style={{ fontSize: 44, color: '#FFFFFF', lineHeight: '120%' }}>
            Carrinho
          </span>
        </div>

        <div style={{ width: 280, height: 80, flexShrink: 0 }} />
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden" style={{ gap: 24, padding: 24 }}>

        {/* ── Coluna esquerda: lista de itens (flex 3) ── */}
        <div
          className="overflow-y-auto rounded-lg bg-white"
          style={{ flex: 3, minWidth: 0, padding: 20 }}
        >
          {!hasItems ? (
            /* Estado vazio */
            <div className="h-full flex flex-col items-center justify-center" style={{ gap: 20 }}>
              <ShoppingCart style={{ width: 80, height: 80, color: '#D1D5DB' }} strokeWidth={1.5} />
              <span style={{ fontSize: 24, color: '#9CA3AF', fontWeight: 500 }}>
                Nenhum produto no carrinho
              </span>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/loja/categorias')}
                className="flex items-center gap-3 font-semibold text-white"
                style={{ height: 64, padding: '0 32px', backgroundColor: '#0066B3', borderRadius: 8, fontSize: 20 }}
              >
                <Plus style={{ width: 20, height: 20 }} />
                Adicionar produtos
              </motion.button>
            </div>
          ) : (
            <>
              {/* Cabeçalho da tabela */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <span style={{ flex: 1, fontSize: 16, fontWeight: 500, color: '#6B7280', textTransform: 'uppercase', opacity: 0.7 }}>Produto</span>
                <span style={{ width: 200, fontSize: 16, fontWeight: 500, color: '#6B7280', textTransform: 'uppercase', opacity: 0.7, textAlign: 'center', flexShrink: 0 }}>Quantidade</span>
                <span style={{ width: 120, fontSize: 16, fontWeight: 500, color: '#6B7280', textTransform: 'uppercase', opacity: 0.7, textAlign: 'right', flexShrink: 0 }}>Subtotal</span>
                <span style={{ width: 40, flexShrink: 0 }} />
              </div>

              <AnimatePresence>
                {itens.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.04 }}
                    layout
                  >
                    {idx > 0 && (
                      <div style={{ height: 1, backgroundColor: '#000000', opacity: 0.08 }} />
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 0' }}>

                      {/* Nome + código */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                        <span style={{ fontSize: 20, fontWeight: 600, color: '#374151', lineHeight: '130%' }}>
                          {item.nome}
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 400, color: '#6B7280', lineHeight: '150%' }}>
                          {item.codigo} · {brl(item.preco)} /un
                        </span>
                      </div>

                      {/* Stepper inline */}
                      <div
                        className="flex items-center rounded-lg shrink-0"
                        style={{ width: 200, backgroundColor: '#EFF5F9', gap: 8 }}
                      >
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setQtd(item.id, item.quantidade - 1)}
                          style={{
                            width: 56, height: 56, flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #D0E0E3',
                            borderRadius: 4,
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12H19" stroke="#0066B3" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </motion.button>

                        <span style={{
                          flex: 1, textAlign: 'center',
                          fontSize: 20, fontWeight: 600, lineHeight: '20px',
                          color: '#374151',
                          fontVariantNumeric: 'tabular-nums',
                        }}>
                          {item.quantidade}
                        </span>

                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setQtd(item.id, item.quantidade + 1)}
                          style={{
                            width: 56, height: 56, flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #D0E0E3',
                            borderRadius: 4,
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5V19M5 12H19" stroke="#0066B3" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </motion.button>
                      </div>

                      {/* Subtotal */}
                      <span style={{
                        width: 120, textAlign: 'right', flexShrink: 0,
                        fontSize: 20, fontWeight: 700, color: '#0066B3',
                        fontVariantNumeric: 'tabular-nums',
                      }}>
                        {brl(item.preco * item.quantidade)}
                      </span>

                      {/* Remover */}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeItem(item.id)}
                        style={{
                          width: 40, height: 40, flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="#9CA3AF" strokeWidth="1.5" />
                          <path d="M8 8L16 16M16 8L8 16" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </>
          )}
        </div>

        {/* ── Sidebar direita: resumo + CTA (flex 1) ── */}
        {hasItems && (
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="rounded-lg bg-white" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>

              <span style={{ fontSize: 24, fontWeight: 600, color: '#00AB67', lineHeight: '32px' }}>Resumo</span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 16, fontWeight: 500, color: '#6B7280', textTransform: 'uppercase' }}>
                    Itens:
                  </span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: '#6B7280' }}>
                    {itens.reduce((s, i) => s + i.quantidade, 0)}
                  </span>
                </div>
                <div style={{ height: 1, backgroundColor: '#000000', opacity: 0.08 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 24, fontWeight: 600, color: '#00AB67' }}>Total:</span>
                  <span style={{ fontSize: 24, fontWeight: 700, color: '#00AB67', fontVariantNumeric: 'tabular-nums' }}>
                    {brl(total)}
                  </span>
                </div>
              </div>

              <div style={{ height: 1, backgroundColor: '#000000', opacity: 0.08 }} />

              {/* Adicionar mais produtos */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/loja/categorias')}
                style={{
                  height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 600, color: '#00AB67',
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #00AB67',
                  borderRadius: 8,
                }}
              >
                Adicionar mais produtos
              </motion.button>

              {/* Finalizar e Pagar */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleFinalizar}
                style={{
                  height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
                  fontSize: 20, fontWeight: 600, color: '#FFFFFF',
                  backgroundColor: '#00AB67',
                  borderRadius: 8, border: 'none',
                }}
              >
                <ShoppingCart style={{ width: 24, height: 24 }} />
                Finalizar e Pagar
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
