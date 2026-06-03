import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useCredito } from '../../../../store/creditoStore';

const AUTO_HOME_SECONDS = 30;

/**
 * Conclusão do fluxo de Crédito Pessoal.
 *
 * Tela fora do stepper — mesmo padrão visual do SuccessScreen das apostas.
 * Limpa o estado do crédito ao sair.
 */
export default function Conclusao() {
  const navigate = useNavigate();
  const reset    = useCredito((s) => s.reset);
  const [seconds, setSeconds] = useState(AUTO_HOME_SECONDS);

  useEffect(() => {
    const t = window.setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (seconds === 0) { reset(); navigate('/', { replace: true }); }
  }, [seconds, reset, navigate]);

  const sair = () => { reset(); navigate('/', { replace: true }); };

  return (
    <div
      className="h-full w-full flex items-center justify-center overflow-auto"
      style={{ backgroundColor: '#EFF5F9', padding: 24 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center"
        style={{ width: 684, gap: 32 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20, delay: 0.1 }}
          className="flex items-center justify-center rounded-full"
          style={{ width: 136, height: 136, border: '8px solid #0066B3', backgroundColor: 'transparent' }}
        >
          <Check style={{ width: 72, height: 72, color: '#0066B3' }} strokeWidth={3} />
        </motion.div>

        <div className="flex flex-col items-center" style={{ gap: 12 }}>
          <span className="font-bold text-center" style={{ fontSize: 48, color: '#0066B3', lineHeight: '120%' }}>
            Obrigado!
          </span>
          <span className="text-center font-normal" style={{ fontSize: 20, color: '#6B7280', lineHeight: '150%', maxWidth: 560 }}>
            Os valores serão depositados em sua conta Caixa e estarão disponíveis em até 1 hora.
          </span>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={sair}
          className="flex items-center justify-center font-semibold rounded-lg"
          style={{
            height: 80, padding: '0 88px',
            fontSize: 20, color: '#FFFFFF',
            backgroundColor: '#00AB67', borderRadius: 8,
          }}
        >
          Confirmar
        </motion.button>

        <span className="text-center" style={{ fontSize: 16, color: '#6B7280' }}>
          Retornando ao início em <strong style={{ fontWeight: 700 }}>{seconds}</strong> segundos…
        </span>
      </motion.div>
    </div>
  );
}
