import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Ticket, Home } from 'lucide-react';
import KioskButton from '../../../components/primitives/KioskButton';

const items = [
  'Saque e extrato',
  'FGTS',
  'Benefícios sociais',
  'Segunda via de cartão',
  'Comprovantes e segundas vias',
];

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="flex h-full w-full bg-primary overflow-hidden">
      {/* Left */}
      <div className="flex flex-col shrink-0 px-8 py-10 justify-center gap-6"
        style={{ width: 'clamp(280px, 36vw, 520px)' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center"
        >
          <Clock className="w-8 h-8 text-white" strokeWidth={1.5} />
        </motion.div>
        <div>
          <h1 className="font-bold text-white text-kiosk-lg leading-tight">Em breve, mais serviços</h1>
          <p className="text-white/60 text-kiosk-xs mt-2">
            Por enquanto, use o atendimento de Lotéricas para acessar os serviços Caixa.
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 bg-surface-blue flex flex-col justify-center px-12 py-10 gap-6">
        <div>
          <h2 className="font-bold text-ink text-kiosk-base mb-1">Estamos preparando para você:</h2>
          <p className="text-muted text-kiosk-xs">Esses serviços estarão disponíveis em breve.</p>
        </div>

        <ul className="space-y-2 max-w-md">
          {items.map((it, i) => (
            <motion.li
              key={it}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-line text-kiosk-sm font-medium text-ink shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
              {it}
            </motion.li>
          ))}
        </ul>

        <div className="space-y-2 max-w-md">
          <KioskButton variant="primary" size="lg" fullWidth onClick={() => navigate('/caixa/loterias')}>
            <Ticket className="w-5 h-5" /> Ir para Lotéricas
          </KioskButton>
          <KioskButton variant="ghost" size="md" fullWidth onClick={() => navigate('/')}>
            <Home className="w-4 h-4" /> Voltar ao início
          </KioskButton>
        </div>
      </div>
    </div>
  );
}
