import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * Stub genérico das sub-telas do fluxo de crédito (Fase B).
 * Substituído nas próximas fases por cada tela específica.
 */
export default function StepStub({
  title, description, nextLabel = 'Avançar', nextTo,
}: {
  title: string;
  description: string;
  nextLabel?: string;
  nextTo: string;
}) {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center justify-center"
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
          display: 'flex', flexDirection: 'column', gap: 24,
          boxShadow: '0px 2px 4px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 32, fontWeight: 700, color: '#0066B3', lineHeight: '120%' }}>
            {title}
          </span>
          <span style={{ fontSize: 20, fontWeight: 400, color: '#6B7280', lineHeight: '150%' }}>
            {description}
          </span>
        </div>

        <div
          className="rounded-lg"
          style={{
            backgroundColor: '#FFFAE3',
            padding: 20,
            border: '1px dashed #F39200',
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 600, color: '#A67700', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Em construção
          </span>
          <div style={{ height: 4 }} />
          <span style={{ fontSize: 16, fontWeight: 400, color: '#6B5500', lineHeight: '150%' }}>
            Conteúdo desta etapa será implementado na próxima fase. Use o botão abaixo
            para navegar pelo esqueleto do fluxo.
          </span>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(nextTo)}
          className="flex items-center justify-center font-semibold rounded-lg"
          style={{
            height: 80, gap: 16, padding: '0 32px',
            fontSize: 20, color: '#FFFFFF',
            backgroundColor: '#00AB67', borderRadius: 8,
          }}
        >
          {nextLabel}
          <ArrowRight style={{ width: 28, height: 28 }} strokeWidth={2} />
        </motion.button>

        <span style={{ fontSize: 14, color: '#9CA3AF', textAlign: 'center' }}>
          Demonstração — dados fictícios
        </span>
      </motion.div>
    </div>
  );
}
