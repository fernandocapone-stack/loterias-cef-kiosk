import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ChevronUp } from 'lucide-react';
import { useSession } from '../../../../store/sessionStore';
import { brl } from '../../../../utils/currency';

export default function CartBar() {
  const apostas    = useSession((s) => s.apostas);
  const setCartOpen = useSession((s) => s.setCartOpen);
  const total      = useSession((s) => s.totalApostas());

  const count  = apostas.length;
  // Nomes únicos — máx 3 exibidos
  const unique = [...new Set(apostas.map((a) => a.modalidadeNome))];
  const label  = unique.slice(0, 3).join(' · ') + (unique.length > 3 ? ' +' : '');

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          key="cart-bar"
          initial={{ y: 110 }}
          animate={{ y: 0 }}
          exit={{ y: 110 }}
          transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          className="fixed bottom-0 inset-x-0 z-40"
        >
          <button
            onClick={() => setCartOpen(true)}
            className="w-full flex items-center gap-5 px-6 h-24 rounded-t-2xl"
            style={{
              backgroundColor: '#F39200',
              boxShadow: '0 -4px 20px rgba(189, 113, 0, 0.35)',
            }}
          >
            {/* Ícone + badge de contagem */}
            <div className="flex items-center gap-3 shrink-0">
              <ShoppingCart className="w-7 h-7 text-white" strokeWidth={2} />
              <span
                className="px-3 py-1 rounded-full text-white font-semibold text-sm tabular-nums"
                style={{ backgroundColor: 'rgba(0,0,0,0.18)' }}
              >
                {count} {count === 1 ? 'aposta' : 'apostas'}
              </span>
            </div>

            {/* Nomes das loterias */}
            <div className="flex-1 min-w-0 text-left">
              <div className="text-white/70 text-xs leading-none mb-0.5">Seu carrinho</div>
              <div className="text-white font-semibold text-sm truncate leading-tight">
                {label}
              </div>
            </div>

            {/* Total + indicador de expansão */}
            <div className="shrink-0 flex items-center gap-3">
              <div className="text-right">
                <div className="text-white/70 text-xs leading-none mb-0.5">Total</div>
                <div className="text-white font-bold text-base tabular-nums leading-tight">
                  {brl(total)}
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 transition-colors rounded-xl px-4 py-2">
                <span className="text-white font-bold text-sm">Ver carrinho</span>
                <ChevronUp className="w-4 h-4 text-white" />
              </div>
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
