import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

/**
 * Stepper horizontal — 4 etapas do fluxo de Crédito Pessoal.
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
 * Conector: linha 2px entre os círculos. Laranja se a etapa anterior já foi
 * concluída, cinza caso contrário.
 */

export type CreditoStep = 1 | 2 | 3 | 4;

const STEP_LABELS: Record<CreditoStep, string> = {
  1: 'Identificação',
  2: 'Seus dados',
  3: 'Simulação',
  4: 'Contrato',
};

export default function CreditoStepper({ current }: { current: CreditoStep }) {
  const steps: CreditoStep[] = [1, 2, 3, 4];

  return (
    <div
      className="shrink-0"
      style={{
        backgroundColor: '#FFFFFF',
        padding: '24px 48px',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <div className="flex items-center" style={{ gap: 0 }}>
        {steps.map((step, idx) => {
          const isCompleted = step < current;
          const isActive    = step === current;
          const isFuture    = step > current;

          return (
            <div
              key={step}
              className="flex items-center"
              style={{ flex: idx === steps.length - 1 ? '0 0 auto' : 1 }}
            >
              {/* Círculo + label */}
              <div className="flex items-center" style={{ gap: 16 }}>
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: isCompleted ? '#F39200' : isActive ? '#0066B3' : '#FFFFFF',
                    borderColor:      isFuture ? '#D0E0E3' : 'transparent',
                  }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center justify-center shrink-0 rounded-full"
                  style={{
                    width: 40, height: 40,
                    border: '2px solid transparent',
                    borderRadius: '50%',
                  }}
                >
                  {isCompleted ? (
                    <Check style={{ width: 22, height: 22, color: '#FFFFFF' }} strokeWidth={3} />
                  ) : (
                    <span
                      style={{
                        fontSize: 18, fontWeight: 700,
                        color: isActive ? '#FFFFFF' : '#9CA3AF',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {step}
                    </span>
                  )}
                </motion.div>

                <span
                  style={{
                    fontSize: 20,
                    fontWeight: isActive ? 700 : 500,
                    color: isFuture ? '#9CA3AF' : isActive ? '#0066B3' : '#374151',
                    lineHeight: '120%',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {STEP_LABELS[step]}
                </span>
              </div>

              {/* Conector */}
              {idx < steps.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    backgroundColor: isCompleted ? '#F39200' : '#D0E0E3',
                    margin: '0 24px',
                    transition: 'background-color 0.25s',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
