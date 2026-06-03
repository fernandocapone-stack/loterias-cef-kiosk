import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import CpfNumpad from '../../../../components/ui/CpfNumpad';
import { formatCpf, isValidCpf } from '../../../../utils/cpf';
import { useCredito } from '../../../../store/creditoStore';

/**
 * Crédito Pessoal — Etapa 1.A (Acesso).
 *
 * Equivalente ao "Acesso" da Ezbob, simplificado:
 *   - Sem radios PF/PJ/Governo (já decidido em "Para você")
 *   - Sem certificado digital (totem não tem leitor)
 *
 * Layout: card central com display de CPF + numpad + CTA Continuar.
 */
export default function Acesso() {
  const navigate    = useNavigate();
  const storeCpf    = useCredito((s) => s.cpf);
  const setStoreCpf = useCredito((s) => s.setCpf);

  const [cpf, setCpf] = useState<string>(storeCpf ?? '');

  // Sincroniza com store se voltar pra cá depois (sem perder o CPF digitado).
  useEffect(() => {
    if (storeCpf && !cpf) setCpf(storeCpf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeCpf]);

  const cpfValid = isValidCpf(cpf);

  const continuar = () => {
    if (!cpfValid) return;
    setStoreCpf(cpf);
    navigate('/caixa/credito/verificacao');
  };

  return (
    <div
      className="flex flex-col items-center"
      style={{ minHeight: '100%', padding: 24, gap: 24 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-lg"
        style={{
          width: '100%', maxWidth: 720,
          padding: 40,
          display: 'flex', flexDirection: 'column', gap: 32,
          boxShadow: '0px 2px 4px rgba(0,0,0,0.06)',
        }}
      >
        {/* Título */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 32, fontWeight: 700, color: '#0066B3', lineHeight: '120%' }}>
            Informe seu CPF
          </span>
          <span style={{ fontSize: 20, fontWeight: 400, color: '#6B7280', lineHeight: '150%' }}>
            Use o teclado abaixo para iniciar a solicitação de crédito pessoal.
          </span>
        </div>

        {/* CPF display */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '26px 24px',
            backgroundColor: '#EFF5F9',
            border: `1px solid ${cpfValid ? '#00AB67' : cpf.length === 11 ? '#ED1C24' : '#D0E0E3'}`,
            borderRadius: 8,
            gap: 12,
            transition: 'border-color 0.2s',
          }}
        >
          <span style={{
            flex: 1, textAlign: 'center',
            fontSize: 32, fontWeight: 400, lineHeight: '28px',
            color: cpf ? '#0066B3' : '#D0E0E3',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: cpf ? '0.08em' : '0.04em',
          }}>
            {cpf ? formatCpf(cpf) : '000.000.000-00'}
          </span>
          {cpfValid && (
            <CheckCircle2 style={{ width: 24, height: 24, color: '#00AB67', flexShrink: 0 }} />
          )}
        </div>

        {/* Feedback de inválido */}
        {cpf.length === 11 && !cpfValid && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 16px',
              backgroundColor: 'rgba(237,28,36,0.08)',
              borderRadius: 8,
              border: '1px solid rgba(237,28,36,0.25)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 7V10M10 13H10.01M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z" stroke="#ED1C24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: 18, fontWeight: 500, color: '#ED1C24', lineHeight: '150%' }}>
              CPF inválido. Verifique os números e tente novamente.
            </span>
          </motion.div>
        )}

        {/* Numpad — centralizado */}
        <div className="flex justify-center">
          <CpfNumpad
            onPress={(k) => setCpf((c) => (c.length < 11 ? c + k : c))}
            onBackspace={() => setCpf((c) => c.slice(0, -1))}
            onClear={() => setCpf('')}
          />
        </div>

        {/* CTA Continuar */}
        <motion.button
          whileTap={cpfValid ? { scale: 0.97 } : {}}
          disabled={!cpfValid}
          onClick={continuar}
          className="flex items-center justify-center font-semibold rounded-lg"
          style={{
            height: 80, gap: 16, padding: '0 32px',
            fontSize: 20, color: '#FFFFFF',
            backgroundColor: cpfValid ? '#00AB67' : '#D0E0E3',
            borderRadius: 8,
            transition: 'background-color 0.25s',
          }}
        >
          Continuar
          <ArrowRight style={{ width: 28, height: 28 }} strokeWidth={2} />
        </motion.button>

        {/* Nota de demonstração */}
        <span style={{ fontSize: 14, color: '#9CA3AF', textAlign: 'center' }}>
          Demonstração — dados fictícios. O totem não armazena seu CPF após a operação.
        </span>
      </motion.div>
    </div>
  );
}
