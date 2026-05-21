import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import KioskButton from '../../components/primitives/KioskButton';

export default function LojaPlaceholder() {
  const navigate = useNavigate();

  return (
    <div className="flex h-full w-full items-center justify-center bg-surface-blue px-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-line rounded-2xl p-10 max-w-md w-full text-center shadow-card"
      >
        <div className="w-16 h-16 rounded-2xl bg-accent/15 mx-auto flex items-center justify-center mb-5">
          <ShoppingBag className="w-8 h-8 text-accent-dark" strokeWidth={1.5} />
        </div>
        <h2 className="text-kiosk-lg font-bold text-ink mb-2">Módulo da Loja</h2>
        <p className="text-kiosk-sm text-muted mb-6">
          Este módulo está fora do escopo do projeto atual e será implementado em uma próxima fase.
        </p>
        <KioskButton variant="primary" size="lg" fullWidth onClick={() => navigate('/escolha')}>
          <ArrowLeft className="w-5 h-5" /> Voltar
        </KioskButton>
      </motion.div>
    </div>
  );
}
