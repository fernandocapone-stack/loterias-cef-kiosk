import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, RotateCcw, X, Home } from 'lucide-react';
import KioskButton from '../../components/primitives/KioskButton';
import { useSession } from '../../store/sessionStore';

type Reason = 'declined' | 'expired' | 'cancelled' | 'unknown';

const messages: Record<Reason, { title: string; desc: string; hint: string }> = {
  declined:  {
    title: 'Pagamento não aprovado',
    desc:  'Não conseguimos aprovar seu pagamento.',
    hint:  'Você não foi cobrado.',
  },
  expired:   {
    title: 'Tempo expirado',
    desc:  'O código Pix expirou.',
    hint:  'Você não foi cobrado.',
  },
  cancelled: {
    title: 'Operação cancelada',
    desc:  'Você cancelou esta operação.',
    hint:  'Nada foi cobrado.',
  },
  unknown:   {
    title: 'Algo deu errado',
    desc:  'Ocorreu um erro inesperado.',
    hint:  'Tente de novo ou peça ajuda a um atendente.',
  },
};

export default function ErrorScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const reset    = useSession((s) => s.reset);
  const reason   = ((location.state as { reason?: Reason } | null)?.reason ?? 'unknown') as Reason;
  const msg      = messages[reason];
  const isCancel = reason === 'cancelled';

  return (
    <div className="flex h-full w-full bg-primary overflow-hidden">
      {/* Left — icon + message */}
      <div className="flex flex-col shrink-0 items-center justify-center px-8 py-8 gap-6"
        style={{ width: 'clamp(280px, 36vw, 520px)' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="w-24 h-24 rounded-full bg-white/15 flex items-center justify-center"
        >
          {isCancel
            ? <X className="w-12 h-12 text-white" strokeWidth={2.5} />
            : <AlertCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
          }
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-center"
        >
          <h1 className="text-kiosk-lg font-bold text-white mb-2">{msg.title}</h1>
          <p className="text-kiosk-sm text-white/70">{msg.desc}</p>
        </motion.div>
      </div>

      {/* Right — actions */}
      <div className="flex-1 bg-surface-blue flex flex-col items-center justify-center px-12 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="w-full max-w-sm space-y-4"
        >
          <div className="bg-white border border-line rounded-xl p-5 text-center">
            <p className="text-kiosk-base font-bold text-ink mb-1">{msg.title}</p>
            <p className="text-kiosk-xs text-muted">{msg.hint}</p>
          </div>

          {!isCancel && (
            <KioskButton variant="primary" size="lg" fullWidth onClick={() => navigate('/checkout/pagamento')}>
              <RotateCcw className="w-5 h-5" />
              Tentar de novo
            </KioskButton>
          )}
          <KioskButton
            variant="ghost"
            size="md"
            fullWidth
            onClick={() => { reset(); navigate('/', { replace: true }); }}
          >
            <Home className="w-4 h-4" />
            Voltar ao início
          </KioskButton>
        </motion.div>
      </div>
    </div>
  );
}
