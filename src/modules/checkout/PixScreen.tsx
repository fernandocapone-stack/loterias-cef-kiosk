import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Smartphone, ShieldCheck } from 'lucide-react';
import FlowLayout from '../../components/primitives/FlowLayout';
import KioskButton from '../../components/primitives/KioskButton';
import { brl } from '../../utils/currency';

export default function PixScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const valor    = (location.state as { valor?: number } | null)?.valor ?? 0;
  const [seconds, setSeconds] = useState(300);

  // Stable QR grid (not re-rendered on each tick)
  const qrCells = useMemo(
    () => Array.from({ length: 144 }, () => Math.random() > 0.45),
    [],
  );

  useEffect(() => {
    const tick = window.setInterval(() => setSeconds((s) => s - 1), 1000);
    const paid = window.setTimeout(
      () => navigate('/checkout/processando', { state: { valor, method: 'pix' } }),
      8000 + Math.random() * 6000,
    );
    return () => { clearInterval(tick); clearTimeout(paid); };
  }, [navigate, valor]);

  useEffect(() => {
    if (seconds <= 0) navigate('/checkout/erro', { state: { reason: 'expired', valor } });
  }, [seconds, navigate, valor]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  const pct = (seconds / 300) * 100;

  return (
    <FlowLayout
      onBack={() => navigate(-1)}
      leftContent={
        <div className="flex flex-col gap-5">
          <div>
            <div className="text-white/60 text-kiosk-xs mb-1">Total a pagar</div>
            <div className="font-bold text-white text-kiosk-xl tabular-nums">{brl(valor)}</div>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <Smartphone className="w-7 h-7 text-white/70 mb-2" strokeWidth={1.5} />
            <div className="font-bold text-white text-kiosk-base leading-snug">
              Abra o app do seu banco e escaneie o QR Code ao lado
            </div>
          </div>

          {/* Countdown */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-white/60 text-kiosk-xs">Expira em</span>
              <span className={`font-bold tabular-nums text-kiosk-base ${seconds < 60 ? 'text-warning' : 'text-white'}`}>
                {mm}:{ss}
              </span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full transition-colors ${seconds < 60 ? 'bg-warning' : 'bg-white'}`}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: 'linear' }}
              />
            </div>
          </div>

          <div className="flex items-start gap-2 text-white/50 text-kiosk-xs">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-white/60" />
            <p>Transação segura. O código expira automaticamente se não for pago.</p>
          </div>
        </div>
      }
    >
      <div className="p-8 flex flex-col items-center justify-center h-full gap-5">
        <div className="text-center">
          <h1 className="font-bold text-ink text-kiosk-lg">Pague com Pix</h1>
          <p className="text-muted text-kiosk-xs mt-1">Escaneie o QR Code com o app do seu banco</p>
        </div>

        {/* QR Code */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="bg-white rounded-2xl p-5 shadow-card"
        >
          <div className="grid grid-cols-12 grid-rows-12 gap-[2px]"
            style={{ width: 'clamp(200px, 18vw, 260px)', height: 'clamp(200px, 18vw, 260px)' }}>
            {qrCells.map((filled, i) => (
              <div key={i} className={filled ? 'bg-ink' : 'bg-white'} />
            ))}
          </div>
        </motion.div>

        {/* Waiting indicator */}
        <div className="flex items-center gap-2 text-muted">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span className="text-kiosk-xs font-medium">Aguardando confirmação do pagamento...</span>
        </div>

        <KioskButton
          variant="ghost"
          size="md"
          onClick={() => navigate('/checkout/erro', { state: { reason: 'cancelled' } })}
        >
          Cancelar
        </KioskButton>
      </div>
    </FlowLayout>
  );
}
