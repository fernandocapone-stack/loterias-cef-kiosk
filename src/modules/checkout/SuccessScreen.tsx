import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useSession } from '../../store/sessionStore';
import { brl } from '../../utils/currency';

const AUTO_HOME_SECONDS = 30;

/**
 * Conclusão — Figma (263:2779), canvas 1440×900, bg #EFF5F9.
 *
 * Centered card (684px wide) with:
 *  - Check icon circle (136×136)
 *  - "Transação Concluída!" 48px Bold #0066B3
 *  - Subtitle 20px Regular #6B7280
 *  - Receipt card (white, pad 24, br 8):
 *      rows: Protocolo | Data/Hora | Valor | Pagamento
 *  - 2 buttons (row): "Voltar ao Início" (#00AB67) | "Nova Aposta" (#D0E0E3)
 *  - Countdown text
 */
export default function SuccessScreen() {
  const navigate      = useNavigate();
  const reset         = useSession((s) => s.reset);
  const operation     = useSession((s) => s.lastOperation);
  const [seconds, setSeconds] = useState(AUTO_HOME_SECONDS);

  useEffect(() => {
    const t = window.setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (seconds === 0) { reset(); navigate('/', { replace: true }); }
  }, [seconds, reset, navigate]);

  const goHome = () => { reset(); navigate('/', { replace: true }); };
  const novaAposta = () => { navigate('/caixa/loterias/apostar'); };

  /* Protocol / date */
  const protocol = `${Math.random().toString(36).slice(2, 11).toUpperCase()}`;
  const now      = new Date().toLocaleString('pt-BR');
  const valor    = operation?.total ?? 0;
  const method   = 'Pix';

  // Quando há bolão, somam-se as cotas (cada cota = 1 comprovante impresso).
  const apostas = operation?.apostas ?? [];
  const comprovantes = apostas.reduce(
    (sum, a) => sum + (a.bolao ? a.bolao.cotas : 1),
    0,
  );
  const temBolao = apostas.some((a) => a.bolao);

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
        style={{ width: 684, gap: 40 }}
      >

        {/* ── Icon + title ── */}
        <div className="flex flex-col items-center" style={{ gap: 16 }}>
          {/* Check circle */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 20, delay: 0.1 }}
            className="flex items-center justify-center rounded-full"
            style={{
              width: 136, height: 136,
              border: `8px solid #0066B3`,
              backgroundColor: 'transparent',
            }}
          >
            <Check
              style={{ width: 72, height: 72, color: '#0066B3' }}
              strokeWidth={3}
            />
          </motion.div>

          {/* Title */}
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="font-bold text-center"
            style={{ fontSize: 48, color: '#0066B3', lineHeight: '150%' }}
          >
            Transação Concluída!
          </motion.span>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-center font-normal"
            style={{ fontSize: 20, color: '#6B7280', lineHeight: '150%' }}
          >
            Sua transação foi processada com sucesso
          </motion.span>
        </div>

        {/* ── Receipt card ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full flex flex-col rounded-lg bg-white"
          style={{ padding: 24, gap: 16 }}
        >
          {[
            { label: 'Protocolo:', value: protocol, valueStyle: { fontWeight: 500, color: '#374151' } },
            { label: 'Data/Hora:', value: now,      valueStyle: { fontWeight: 500, color: '#374151' } },
            { label: 'Valor:',     value: brl(valor), valueStyle: { fontWeight: 700, color: '#00A63E' } },
            { label: 'Pagamento:', value: method,   valueStyle: { fontWeight: 500, color: '#374151', textTransform: 'capitalize' as const } },
            ...(temBolao
              ? [{
                  label: 'Comprovantes:',
                  value: `${comprovantes} impressos`,
                  valueStyle: { fontWeight: 700, color: '#0066B3' } as const,
                }]
              : []),
          ].map((row, i, arr) => (
            <div key={row.label}>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 20, color: '#6B7280', opacity: 0.7, lineHeight: '150%' }}>
                  {row.label}
                </span>
                <span style={{ fontSize: 20, lineHeight: '150%', ...row.valueStyle }}>
                  {row.value}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div style={{ height: 1, backgroundColor: '#000000', opacity: 0.1, marginTop: 16 }} />
              )}
            </div>
          ))}
        </motion.div>

        {/* ── Buttons ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full flex"
          style={{ gap: 24 }}
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={goHome}
            className="flex-1 flex items-center justify-center font-semibold rounded-lg"
            style={{ height: 80, fontSize: 20, color: '#FFFFFF', backgroundColor: '#00AB67', borderRadius: 8 }}
          >
            Voltar ao Início
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={novaAposta}
            className="flex-1 flex items-center justify-center font-semibold rounded-lg"
            style={{ height: 80, fontSize: 20, color: '#FFFFFF', backgroundColor: '#D0E0E3', borderRadius: 8 }}
          >
            Nova Aposta
          </motion.button>
        </motion.div>

        {/* ── Countdown ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
          style={{ fontSize: 20, color: '#6B7280', lineHeight: '150%' }}
        >
          Retornando ao início em{' '}
          <strong style={{ fontWeight: 700 }}>{seconds} segundos</strong>
          ...
        </motion.p>
      </motion.div>
    </div>
  );
}
