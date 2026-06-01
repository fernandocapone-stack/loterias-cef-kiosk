import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onStay}
            style={{
              height: 80, width: '100%',
              backgroundColor: '#F39200', color: '#FFFFFF',
              fontSize: 20, fontWeight: 600,
              borderRadius: 8, border: 'none', cursor: 'pointer',
            }}
          >
            Estou aqui
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={cancel}
            style={{
              height: 80, width: '100%',
              backgroundColor: '#9CA3AF', color: '#FFFFFF',
              fontSize: 20, fontWeight: 600,
              borderRadius: 8, border: 'none', cursor: 'pointer',
            }}
          >
            Voltar ao início
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
