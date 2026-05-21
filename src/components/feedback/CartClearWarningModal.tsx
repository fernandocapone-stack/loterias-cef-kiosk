import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

/**
 * Modal de aviso ao trocar de módulo com carrinho preenchido.
 * Mesmo padrão visual do IdleModal.
 *
 * targetModule: módulo para o qual o usuário quer ir.
 *   'loja'     → saindo da Lotérica (apostas serão perdidas)
 *   'loterica' → saindo da Conveniência (produtos serão perdidos)
 */
interface Props {
  targetModule: 'loja' | 'loterica';
  onConfirm: () => void;
  onCancel:  () => void;
}

export default function CartClearWarningModal({ targetModule, onConfirm, onCancel }: Props) {
  const destName  = targetModule === 'loja' ? 'Conveniência' : 'Lotérica';
  const lostItems = targetModule === 'loja'  ? 'apostas'     : 'produtos';

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ zIndex: 50, backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.18 }}
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #D0E0E3',
          borderRadius: 16,
          padding: '40px 48px',
          width: 520,
          textAlign: 'center',
        }}
      >
        {/* Ícone */}
        <div style={{
          width: 72, height: 72, borderRadius: 20, margin: '0 auto 20px',
          backgroundColor: 'rgba(243,146,0,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ShoppingCart style={{ width: 36, height: 36, color: '#C57600' }} strokeWidth={2} />
        </div>

        {/* Título */}
        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1F2937', marginBottom: 12, lineHeight: '130%' }}>
          Carrinho será esvaziado
        </h2>

        {/* Corpo */}
        <p style={{ fontSize: 18, color: '#6B7280', lineHeight: '160%', marginBottom: 32 }}>
          Ao acessar <strong style={{ color: '#364153' }}>{destName}</strong>, os{' '}
          <strong style={{ color: '#364153' }}>{lostItems}</strong> do seu carrinho atual serão{' '}
          removidos. Deseja continuar?
        </p>

        {/* Botões */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onConfirm}
            style={{
              height: 72, width: '100%',
              backgroundColor: '#00AB67', color: '#FFFFFF',
              fontSize: 20, fontWeight: 600,
              borderRadius: 8, border: 'none', cursor: 'pointer',
            }}
          >
            Sim, continuar
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onCancel}
            style={{
              height: 60, width: '100%',
              backgroundColor: 'transparent', color: '#6B7280',
              fontSize: 18, fontWeight: 500,
              borderRadius: 8, border: '1.5px solid #D0E0E3', cursor: 'pointer',
            }}
          >
            Cancelar
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
