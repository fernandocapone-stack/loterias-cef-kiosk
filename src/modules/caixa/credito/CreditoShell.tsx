import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import CreditoStepper, { CreditoStep } from './CreditoStepper';

/**
 * Shell do fluxo de Crédito Pessoal.
 *
 *   Header azul padrão (Voltar 280×80 + título 44px + placeholder 280×80)
 *   + Stepper horizontal (4 etapas)
 *   + Outlet (corpo da sub-rota)
 *
 * O título do header é fixo ("Crédito Pessoal"); cada sub-tela escreve sua
 * própria pergunta/título dentro do card do body — mesmo padrão do Ezbob.
 *
 * Mapeamento sub-rota → etapa do stepper:
 *   /acesso, /verificacao        → 1 (Identificação)
 *   /dados                       → 2
 *   /simulacao                   → 3
 *   /contrato, /assinatura       → 4
 *   /conclusao                   → tela fora do stepper (success)
 */

function getStep(pathname: string): CreditoStep | null {
  if (pathname.includes('/acesso') || pathname.includes('/verificacao')) return 1;
  if (pathname.includes('/dados')) return 2;
  if (pathname.includes('/simulacao')) return 3;
  if (pathname.includes('/contrato') || pathname.includes('/assinatura')) return 4;
  return null; // conclusão ou rota desconhecida
}

export default function CreditoShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const step     = getStep(location.pathname);

  /* Voltar:
     - se for a primeira tela (acesso), volta para Para Você
     - caso contrário, volta uma etapa no histórico  */
  const onBack = () => {
    if (location.pathname.endsWith('/acesso')) {
      navigate('/caixa/para-voce');
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden" style={{ backgroundColor: '#EFF5F9' }}>
      {/* ── Header ── */}
      <div className="flex items-center shrink-0" style={{ gap: 24, padding: 24, backgroundColor: '#0066B3' }}>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onBack}
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{
            width: 280, height: 80,
            backgroundColor: '#004B8B',
            borderRadius: 8,
            gap: 8,
            padding: '12px 24px 12px 16px',
          }}
        >
          <ArrowLeft style={{ width: 48, height: 48, color: '#F39200', flexShrink: 0 }} strokeWidth={2} />
          <span className="text-white" style={{ fontSize: 20, fontWeight: 500, lineHeight: '120%' }}>
            Voltar
          </span>
        </motion.button>

        <div className="flex-1 flex items-center justify-center">
          <span className="font-semibold text-center" style={{ fontSize: 44, color: '#FFFFFF', lineHeight: '120%' }}>
            Crédito Pessoal
          </span>
        </div>

        <div style={{ width: 280, height: 80, flexShrink: 0 }} />
      </div>

      {/* ── Row: stepper lateral + body ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Stepper vertical (oculto na conclusão) */}
        {step && <CreditoStepper current={step} />}

        {/* Body — rolável independente */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
