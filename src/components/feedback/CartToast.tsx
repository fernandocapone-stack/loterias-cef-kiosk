import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';

/**
 * Toast global de carrinho — renderizado no KioskShell.
 * Qualquer tela dispara via: useToastStore.getState().show('mensagem')
 */
export default function CartToast() {
  const { visible, message } = useToastStore();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cart-toast"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            bottom: 56,
            left: '50%',
            x: '-50%',
            zIndex: 60,
            backgroundColor: '#F39200',
            borderRadius: 16,
            padding: '22px 40px',
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            boxShadow: '0px 12px 40px rgba(243,146,0,0.45)',
            pointerEvents: 'none',
          }}
        >
          <CheckCircle2
            style={{ width: 40, height: 40, color: '#FFFFFF', flexShrink: 0 }}
            strokeWidth={2.5}
          />
          <span style={{ fontSize: 24, fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
