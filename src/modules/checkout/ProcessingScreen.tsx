import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useSession } from '../../store/sessionStore';

export default function ProcessingScreen() {
  const navigate          = useNavigate();
  const location          = useLocation();
  const finalizeOperation = useSession((s) => s.finalizeOperation);
  const state             = (location.state as { valor?: number; method?: string } | null) ?? {};

  useEffect(() => {
    const t = window.setTimeout(() => {
      const fail = Math.random() < 0.1;
      if (fail) {
        navigate('/checkout/erro', { state: { reason: 'declined', ...state } });
      } else {
        finalizeOperation(state.method ?? 'pix');
        navigate('/checkout/sucesso', { state, replace: true });
      }
    }, 2200);
    return () => clearTimeout(t);
  }, [navigate, state, finalizeOperation]);

  return (
    <div className="flex h-full w-full items-center justify-center bg-primary">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center text-center px-8"
      >
        {/* Animated rings */}
        <div className="relative mb-8">
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-white/20"
          />
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            className="absolute inset-0 rounded-full bg-white/15"
          />
          <div className="relative w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-white animate-spin" strokeWidth={2} />
          </div>
        </div>

        <h2 className="text-kiosk-lg font-bold text-white mb-2">Processando pagamento</h2>
        <p className="text-kiosk-xs text-white/70 max-w-xs">
          Não retire o cartão. Aguarde a confirmação.
        </p>
      </motion.div>
    </div>
  );
}
