import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertCircle, Check } from 'lucide-react';
import FlowLayout from '../../../../../components/primitives/FlowLayout';
import KioskButton from '../../../../../components/primitives/KioskButton';
import NumPad from '../../../../../components/primitives/NumPad';
import { formatCpf, isValidCpf, onlyDigits } from '../../../../../utils/cpf';
import { useSession } from '../../../../../store/sessionStore';
import { brl } from '../../../../../utils/currency';

export default function CpfInput() {
  const navigate            = useNavigate();
  const setCpf              = useSession((s) => s.setCpf);
  const setPendingOperation = useSession((s) => s.setPendingOperation);
  const apostas             = useSession((s) => s.apostas);
  const total               = useSession((s) => s.totalApostas());
  const [raw, setRaw]       = useState('');

  const digits     = onlyDigits(raw);
  const isComplete = digits.length === 11;
  const isValid    = isComplete && isValidCpf(digits);

  const handleKey       = (k: string) => { if (digits.length < 11) setRaw((r) => onlyDigits(r) + k); };
  const handleBackspace = () => setRaw((r) => onlyDigits(r).slice(0, -1));
  const handleClear     = () => setRaw('');

  const handleConfirm = () => {
    if (!isValid) return;
    setCpf(digits);
    setPendingOperation({ type: 'aposta', total, apostas, cpf: digits });
    navigate('/checkout/pagamento');
  };

  const handleSkip = () => {
    setCpf(null);
    setPendingOperation({ type: 'aposta', total, apostas, cpf: null });
    navigate('/checkout/pagamento');
  };

  return (
    <FlowLayout
      onBack={() => navigate('/caixa/aposta/cpf')}
      leftContent={
        <div className="flex flex-col gap-5">
          <div>
            <div className="text-white/60 text-kiosk-xs mb-1">Total da compra</div>
            <div className="font-bold text-white text-kiosk-xl tabular-nums">{brl(total)}</div>
          </div>
          <div className="flex items-start gap-2 text-white/50 text-kiosk-xs">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-white/60" />
            <p className="text-white/70 leading-relaxed">
              CPF aparece só no bilhete impresso. Não fica salvo no totem.
            </p>
          </div>
        </div>
      }
    >
      <div className="p-8 flex flex-col gap-5 h-full">
        <div>
          <h1 className="font-bold text-ink text-kiosk-lg">Digite o CPF</h1>
          <p className="text-muted text-kiosk-xs mt-1">Use o teclado abaixo</p>
        </div>

        {/* Display do CPF */}
        <div
          className={`bg-surface-blue border-2 rounded-xl p-5 text-center transition-colors ${
            isComplete && !isValid ? 'border-danger' : isValid ? 'border-success' : 'border-line'
          }`}
        >
          <div className="text-kiosk-xs text-muted uppercase tracking-wider mb-1">CPF</div>
          <div className="text-kiosk-xl font-bold text-ink tracking-widest tabular-nums">
            {raw ? formatCpf(raw) : '___.___.___-__'}
          </div>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-2 inline-flex items-center gap-1.5 text-kiosk-xs font-semibold ${isValid ? 'text-success' : 'text-danger'}`}
            >
              {isValid
                ? <><Check className="w-4 h-4" /> CPF válido</>
                : <><AlertCircle className="w-4 h-4" /> CPF inválido — confira os números</>
              }
            </motion.div>
          )}
        </div>

        {/* NumPad */}
        <NumPad onPress={handleKey} onBackspace={handleBackspace} onClear={handleClear} />

        {/* Ações */}
        <div className="space-y-2 mt-auto">
          <KioskButton variant="primary" size="lg" fullWidth disabled={!isValid} onClick={handleConfirm}>
            <Check className="w-5 h-5" />
            Confirmar e ir ao pagamento
          </KioskButton>
          <KioskButton variant="ghost" size="md" fullWidth onClick={handleSkip}>
            Apostar sem CPF
          </KioskButton>
        </div>
      </div>
    </FlowLayout>
  );
}
