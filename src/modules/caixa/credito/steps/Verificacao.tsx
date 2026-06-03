import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import CpfNumpad from '../../../../components/ui/CpfNumpad';
import { useCredito } from '../../../../store/creditoStore';

/**
 * Crédito Pessoal — Etapa 1.B (Verificação por WhatsApp).
 *
 * Equivalente ao slide "Verificação" da Ezbob. Como é demo, o código simulado
 * é exibido no próprio totem dentro de um box destacado.
 *
 * - 6 caixas grandes mostrando os dígitos digitados
 * - Box "Código simulado" com o código gerado para a sessão
 * - Numpad para digitar
 * - Reenviar (regenera) | Verificar (avança se igual)
 */

function gerarCodigo6(): string {
  let s = '';
  for (let i = 0; i < 6; i++) s += Math.floor(Math.random() * 10);
  return s;
}

/* Telefone fictício derivado do CPF — primeiros e últimos dígitos */
function telefoneMock(cpf: string): string {
  const last4 = cpf.slice(-4) || '1234';
  return `(11) ••••-${last4}`;
}

export default function Verificacao() {
  const navigate         = useNavigate();
  const cpf              = useCredito((s) => s.cpf);
  const setOtpVerificado = useCredito((s) => s.setOtpVerificado);

  const [esperado, setEsperado] = useState<string>(() => gerarCodigo6());
  const [digitado, setDigitado] = useState<string>('');
  const [erro, setErro]         = useState<boolean>(false);

  const telefone = useMemo(() => telefoneMock(cpf), [cpf]);

  const completo = digitado.length === 6;
  const valido   = completo && digitado === esperado;

  const onPress = (k: string) => {
    setErro(false);
    setDigitado((c) => (c.length < 6 ? c + k : c));
  };
  const onBack  = () => { setErro(false); setDigitado((c) => c.slice(0, -1)); };
  const onClear = () => { setErro(false); setDigitado(''); };

  const reenviar = () => {
    setEsperado(gerarCodigo6());
    setDigitado('');
    setErro(false);
  };

  const verificar = () => {
    if (!completo) return;
    if (!valido) { setErro(true); return; }
    setOtpVerificado(true);
    navigate('/caixa/credito/dados');
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
            Verificação por WhatsApp
          </span>
          <span style={{ fontSize: 20, fontWeight: 400, color: '#6B7280', lineHeight: '150%' }}>
            Enviamos um código de 6 dígitos para o seu WhatsApp cadastrado{' '}
            <strong style={{ color: '#374151', fontWeight: 600 }}>{telefone}</strong>.
          </span>
        </div>

        {/* 6 caixas com os dígitos */}
        <div className="flex justify-center" style={{ gap: 12 }}>
          {Array.from({ length: 6 }).map((_, i) => {
            const ch       = digitado[i] ?? '';
            const filled   = ch !== '';
            const errorCol = erro && completo;
            return (
              <div
                key={i}
                className="flex items-center justify-center"
                style={{
                  width: 80, height: 96,
                  borderRadius: 8,
                  border: `2px solid ${errorCol ? '#ED1C24' : filled ? '#0066B3' : '#D0E0E3'}`,
                  backgroundColor: '#FFFFFF',
                  transition: 'border-color 0.18s',
                }}
              >
                <span style={{
                  fontSize: 40, fontWeight: 700,
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

        {/* Feedback de erro */}
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
            <span style={{ fontSize: 18, fontWeight: 500, color: '#ED1C24', lineHeight: '150%' }}>
              Código incorreto. Tente novamente.
            </span>
          </motion.div>
        )}

        {/* Box do código simulado (demo) */}
        <div
          style={{
            padding: '20px 24px',
            backgroundColor: '#FFFAE3',
            border: '1px dashed #F39200',
            borderRadius: 8,
            display: 'flex', flexDirection: 'column', gap: 8,
          }}
        >
          <span style={{
            fontSize: 14, fontWeight: 700, color: '#A67700',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            Demonstração — código simulado
          </span>
          <span style={{
            fontSize: 32, fontWeight: 700, color: '#6B5500',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '0.3em',
          }}>
            {esperado.split('').join(' ')}
          </span>
        </div>

        {/* Numpad */}
        <div className="flex justify-center">
          <CpfNumpad onPress={onPress} onBackspace={onBack} onClear={onClear} />
        </div>

        {/* Ações: Reenviar (esquerda) + Verificar (direita) */}
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
            Reenviar código
          </motion.button>

          <motion.button
            whileTap={completo ? { scale: 0.97 } : {}}
            disabled={!completo}
            onClick={verificar}
            className="flex items-center justify-center font-semibold rounded-lg"
            style={{
              flex: 1,
              height: 80, padding: '0 24px',
              fontSize: 20, color: '#FFFFFF',
              backgroundColor: completo ? '#00AB67' : '#D0E0E3',
              borderRadius: 8,
              transition: 'background-color 0.25s',
            }}
          >
            Verificar
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
