import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RefreshCw, ArrowRight } from 'lucide-react';
import { useCredito } from '../../../../store/creditoStore';

/**
 * Crédito Pessoal — Etapa 1.B (Verificação por WhatsApp).
 *
 * Mesma estrutura visual do Acesso (2 colunas, sem card, sobre #EFF5F9) —
 * mantém os CTAs sempre visíveis sem scroll.
 *
 * Como é demonstração:
 *   - O código de 6 dígitos é gerado por sessão e exibido pré-preenchido nas
 *     caixas, sem necessidade de digitação.
 *   - Sem numpad. Sem feedback de erro.
 *   - Reenviar regenera o código pré-preenchido; Verificar avança.
 */

function gerarCodigo6(): string {
  let s = '';
  for (let i = 0; i < 6; i++) s += Math.floor(Math.random() * 10);
  return s;
}

function telefoneMock(cpf: string): string {
  const last4 = cpf.slice(-4) || '1234';
  return `(11) ••••-${last4}`;
}

export default function Verificacao() {
  const navigate         = useNavigate();
  const cpf              = useCredito((s) => s.cpf);
  const setOtpVerificado = useCredito((s) => s.setOtpVerificado);

  const [codigo, setCodigo] = useState<string>(() => gerarCodigo6());
  const telefone = useMemo(() => telefoneMock(cpf), [cpf]);

  const reenviar = () => setCodigo(gerarCodigo6());

  const verificar = () => {
    setOtpVerificado(true);
    navigate('/caixa/credito/dados');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="h-full w-full flex items-center"
      style={{ padding: '40px 48px', gap: 64 }}
    >
      {/* ── Coluna esquerda — texto + CTAs ── */}
      <div className="flex flex-col" style={{ flex: 1, gap: 32, minWidth: 0, maxWidth: 560 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 36, fontWeight: 700, color: '#0066B3', lineHeight: '120%' }}>
            Verificação por WhatsApp
          </span>
          <span style={{ fontSize: 20, fontWeight: 400, color: '#6B7280', lineHeight: '150%' }}>
            Enviamos um código de 6 dígitos para o seu WhatsApp cadastrado{' '}
            <strong style={{ color: '#374151', fontWeight: 600 }}>{telefone}</strong>.
          </span>
        </div>

        {/* Hint de demo */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#FFFAE3',
            border: '1px dashed #F39200',
            borderRadius: 8,
            display: 'flex', flexDirection: 'column', gap: 4,
          }}
        >
          <span style={{
            fontSize: 14, fontWeight: 700, color: '#A67700',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            Demonstração
          </span>
          <span style={{ fontSize: 16, color: '#6B5500', lineHeight: '150%' }}>
            O código simulado aparece preenchido automaticamente. Em produção,
            o usuário digitaria o código recebido no WhatsApp.
          </span>
        </div>

        {/* Ações */}
        <div className="flex items-center" style={{ gap: 16 }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={reenviar}
            className="flex items-center justify-center font-semibold rounded-lg"
            style={{
              flex: 1,
              height: 80, gap: 12, padding: '0 24px',
              fontSize: 20, color: '#005DA4',
              backgroundColor: '#FFFFFF',
              border: '2px solid #D0E0E3',
              borderRadius: 8,
            }}
          >
            <RefreshCw style={{ width: 24, height: 24 }} strokeWidth={2} />
            Reenviar
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={verificar}
            className="flex items-center justify-center font-semibold rounded-lg"
            style={{
              flex: 1,
              height: 80, gap: 12, padding: '0 24px',
              fontSize: 20, color: '#FFFFFF',
              backgroundColor: '#00AB67',
              borderRadius: 8,
            }}
          >
            Verificar
            <ArrowRight style={{ width: 28, height: 28 }} strokeWidth={2} />
          </motion.button>
        </div>
      </div>

      {/* ── Coluna direita — 6 caixas pré-preenchidas ── */}
      <div className="flex flex-col items-center" style={{ flex: '0 0 auto', gap: 16 }}>
        <div className="flex" style={{ gap: 12 }}>
          {codigo.split('').map((ch, i) => (
            <motion.div
              key={`${codigo}-${i}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.2 }}
              className="flex items-center justify-center"
              style={{
                width: 88, height: 112,
                borderRadius: 8,
                border: '2px solid #0066B3',
                backgroundColor: '#FFFFFF',
              }}
            >
              <span style={{
                fontSize: 48, fontWeight: 700,
                color: '#0066B3',
                fontVariantNumeric: 'tabular-nums',
                lineHeight: '120%',
              }}>
                {ch}
              </span>
            </motion.div>
          ))}
        </div>

        <span style={{
          fontSize: 14, fontWeight: 600, color: '#9CA3AF',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          Código simulado
        </span>
      </div>
    </motion.div>
  );
}
