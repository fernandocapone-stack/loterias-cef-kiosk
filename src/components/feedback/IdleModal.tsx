import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import KioskButton from '../primitives/KioskButton';
import { useSession } from '../../store/sessionStore';

interface Props {
  seconds: number;
  onStay: () => void;
}

export default function IdleModal({ seconds, onStay }: Props) {
  const navigate = useNavigate();
  const reset = useSession((s) => s.reset);

  const cancel = () => {
    reset();
    navigate('/', { replace: true });
  };

  return (
    <div className="absolute inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-center justify-center px-6">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white border border-line rounded-2xl p-6 max-w-md w-full text-center"
      >
        <div className="w-12 h-12 rounded-2xl bg-warning/15 mx-auto flex items-center justify-center mb-4">
          <Clock className="w-6 h-6 text-warning" />
        </div>
        <h2 className="text-kiosk-base font-bold text-ink mb-2">
          Você ainda está aí?
        </h2>
        <p className="text-kiosk-sm text-muted mb-6">
          Volto à tela inicial em {seconds}s
        </p>
        <div className="space-y-2">
          <KioskButton variant="primary" size="lg" fullWidth onClick={onStay}>
            Estou aqui
          </KioskButton>
          <KioskButton variant="ghost" size="md" fullWidth onClick={cancel}>
            Cancelar
          </KioskButton>
        </div>
      </motion.div>
    </div>
  );
}
