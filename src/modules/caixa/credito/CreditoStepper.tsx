import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

/**
 * Stepper vertical (lateral esquerda) — 4 etapas do fluxo de Crédito Pessoal.
 *
 *   1. Identificação   (acesso + verificação OTP)
 *   2. Seus dados      (confirmação dos dados)
 *   3. Simulação       (valor + prazo)
 *   4. Contrato        (leitura + assinatura AES)
 *
 * Estados visuais:
 *   - completed: círculo laranja #F39200 com check branco
 *   - active:    círculo azul #0066B3 com número branco
 *   - future:    borda 2px cinza #D0E0E3, número cinza
 *
 * Conector vertical entre círculos: laranja se a etapa anterior foi
 * concluída, cinza caso contrário.
 */

export type CreditoStep = 1 | 2 | 3 | 4;

const STEP_LABELS: Record<CreditoStep, string> = {
  1: 'Identificação',
  2: 'Seus dados',
  3: 'Simulação',
  4: 'Contrato',
};

const STEP_HINTS: Record<CreditoStep, string> = {
  1: 'CPF e código por WhatsApp',
  2: 'Confirme suas informações',
  3: 'Valor e prazo do empréstimo',
  4: 'Leia e assine eletronicamente',
};

export default function CreditoStepper({ current }: { current: CreditoStep }) {
  const steps: CreditoStep[] = [1, 2, 3, 4];

  return (
    <aside
      className="shrink-0 flex flex-col"
      style={{
        width: 320,
        backgroundColor: 'transparent',
        padding: '40px 32px',
        gap: 0,
      }}
    >
      {steps.map((step, idx) => {
        const isCompleted = step < current;
        const isActive    = step === current;
        const isFuture    = step > current;
        const isLast      = idx === steps.length - 1;

        return (
          <div key={step} className="flex" style={{ gap: 16 }}>
            {/* Coluna do círculo + conector */}
            <div className="flex flex-col items-center" style={{ width: 40 }}>
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted ? '#F39200' : isActive ? '#0066B3' : '#FFFFFF',
                  borderColor:     isFuture ? '#D0E0E3' : 'transparent',
                }}
                transition={{ duration: 0.25 }}
                className="flex items-center justify-center rounded-full shrink-0"
                style={{
                  width: 40, height: 40,
                  border: '2px solid transparent',
                  borderRadius: '50%',
                }}
              >
                {isCompleted ? (
                  <Check style={{ width: 22, height: 22, color: '#FFFFFF' }} strokeWidth={3} />
                ) : (
                  <span style={{
                    fontSize: 18, fontWeight: 700,
                    color: isActive ? '#FFFFFF' : '#9CA3AF',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {step}
                  </span>
                )}
              </motion.div>

              {/* Conector vertical (não desenhado depois do último item) */}
              {!isLast && (
                <div
                  style={{
                    width: 2,
                    flex: 1,
                    minHeight: 48,
                    backgroundColor: isCompleted ? '#F39200' : '#D0E0E3',
                    transition: 'background-color 0.25s',
                    margin: '8px 0',
                  }}
                />
              )}
            </div>

            {/* Coluna do texto */}
            <div
              className="flex flex-col"
              style={{
                gap: 4,
                paddingTop: 6,
                paddingBottom: isLast ? 0 : 32,
                flex: 1,
              }}
            >
              <span style={{
                fontSize: 20,
                fontWeight: isActive ? 700 : 500,
                color: isFuture ? '#9CA3AF' : isActive ? '#0066B3' : '#374151',
                lineHeight: '120%',
              }}>
                {STEP_LABELS[step]}
              </span>
              <span style={{
                fontSize: 14,
                fontWeight: 400,
                color: isFuture ? '#D0E0E3' : '#6B7280',
                lineHeight: '140%',
              }}>
                {STEP_HINTS[step]}
              </span>
            </div>
          </div>
        );
      })}
    </aside>
  );
}
