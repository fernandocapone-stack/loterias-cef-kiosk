import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileSignature } from 'lucide-react';
import CpfNumpad from '../../../../components/ui/CpfNumpad';
import { useCredito } from '../../../../store/creditoStore';

/**
 * Crédito Pessoal — Etapa 4.B (Assinatura Eletrônica Avançada — AES).
 *
 * Mesma estrutura do Acesso/Verificação (2 colunas, sem card, sobre #EFF5F9):
 *   ESQUERDA: título + subtítulo + 6 caixas (display) + hint do código simulado
 *             + erro + CTA "Confirmar assinatura" + nota
 *   DIREITA:  AlphanumericKeypad
 *
 * Código de 6 dígitos numéricos, gerado por sessão para demonstração.
 * (Originalmente alfanumérico no Ezbob — simplificado para totem.)
 */

function gerarCodigoAES(): string {
  let s = '';
  for (let i = 0; i < 6; i++) s += Math.floor(Math.random() * 10);
  return s;
}

export default function Assinatura() {
  const navigate                = useNavigate();
  const setAssinaturaConfirmada = useCredito((s) => s.setAssinaturaConfirmada);

  const [esperado, setEsperado] = useState<string>(() => gerarCodigoAES());
  const [digitado, setDigitado] = useState<string>('');
  const [erro,     setErro]     = useState<boolean>(false);

  const completo = digitado.length === 6;
  const valido   = completo && digitado === esperado;

  const onPress = (k: string) => {
    setErro(false);
    setDigitado((c) => (c.length < 6 ? c + k : c));
  };
  const onBack  = () => { setErro(false); setDigitado((c) => c.slice(0, -1)); };
  const onClear = () => { setErro(false); setDigitado(''); };

  const reenviar = () => {
    setEsperado(gerarCodigoAES());
    setDigitado('');
    setErro(false);
  };

  const confirmar = () => {
    if (!completo) return;
    if (!valido) { setErro(true); return; }
    setAssinaturaConfirmada(true);
    navigate('/caixa/credito/conclusao');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="h-full w-full flex items-center"
      style={{ padding: '32px 48px', gap: 48 }}
    >
      {/* ── Coluna esquerda — conteúdo + display + CTA ── */}
      <div className="flex flex-col" style={{ flex: 1, gap: 20, minWidth: 0, maxWidth: 560 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 32, fontWeight: 700, color: '#0066B3', lineHeight: '120%' }}>
            Assinatura eletrônica
          </span>
          <span style={{ fontSize: 18, fontWeight: 400, color: '#6B7280', lineHeight: '150%' }}>
            Enviamos um código de 6 dígitos pelo WhatsApp para confirmar
            sua assinatura.
          </span>
        </div>

        {/* 6 caixas */}
        <div className="flex" style={{ gap: 10, alignSelf: 'stretch' }}>
          {Array.from({ length: 6 }).map((_, i) => {
            const ch       = digitado[i] ?? '';
            const filled   = ch !== '';
            const errorCol = erro && completo;
            return (
              <div
                key={i}
                className="flex items-center justify-center"
                style={{
                  flex: 1, height: 88,
                  borderRadius: 8,
                  border: `2px solid ${errorCol ? '#ED1C24' : filled ? '#0066B3' : '#D0E0E3'}`,
                  backgroundColor: '#FFFFFF',
                  transition: 'border-color 0.18s',
                }}
              >
                <span style={{
                  fontSize: 32, fontWeight: 700,
                  color: errorCol ? '#ED1C24' : '#0066B3',
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: '120%',
                }}>
                  {ch}
                </span>
              </div>
            );
          })}
        </div>

        {/* Hint do código simulado + reenviar */}
        <div className="flex items-center" style={{ gap: 8 }}>
          <span style={{
            fontSize: 13, fontWeight: 700, color: '#A67700',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            Demonstração — código:
          </span>
          <span style={{
            fontSize: 15, fontWeight: 700, color: '#6B5500',
            fontVariantNumeric: 'tabular-nums', letterSpacing: '0.2em',
          }}>
            {esperado}
          </span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={reenviar}
            style={{
              marginLeft: 'auto',
              fontSize: 13, fontWeight: 600, color: '#005DA4',
              background: 'none', border: 'none', padding: 0,
              textDecoration: 'underline',
            }}
          >
            Reenviar código
          </motion.button>
        </div>

        {/* Erro */}
        {erro && (
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
            <span style={{ fontSize: 16, fontWeight: 500, color: '#ED1C24', lineHeight: '150%' }}>
              Código incorreto. Tente novamente.
            </span>
          </motion.div>
        )}

        {/* CTA Confirmar assinatura */}
        <motion.button
          whileTap={completo ? { scale: 0.97 } : {}}
          disabled={!completo}
          onClick={confirmar}
          className="flex items-center justify-center font-semibold rounded-lg"
          style={{
            height: 80, gap: 12, padding: '0 32px',
            fontSize: 20, color: '#FFFFFF',
            backgroundColor: completo ? '#00AB67' : '#D0E0E3',
            borderRadius: 8,
            transition: 'background-color 0.25s',
          }}
        >
          <FileSignature style={{ width: 28, height: 28 }} strokeWidth={2} />
          Confirmar assinatura
        </motion.button>

        <span style={{ fontSize: 13, color: '#9CA3AF' }}>
          Assinatura eletrônica avançada — Lei nº 14.063/2020
        </span>
      </div>

      {/* ── Coluna direita — numpad ── */}
      <div className="flex justify-center items-center" style={{ flex: '0 0 auto' }}>
        <CpfNumpad onPress={onPress} onBackspace={onBack} onClear={onClear} />
      </div>
    </motion.div>
  );
}
