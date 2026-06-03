import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Edit3, ArrowDownCircle } from 'lucide-react';
import { useCredito } from '../../../../store/creditoStore';
import { formatCpf } from '../../../../utils/cpf';
import { brl } from '../../../../utils/currency';

/**
 * Crédito Pessoal — Etapa 2 (Seus dados).
 *
 * Layout flat full-width. CTAs sempre fixos no rodapé; a tabela rola
 * internamente quando o conteúdo extrapola a altura. Pill "Role até o final"
 * aparece no canto inferior direito da área scrollável quando há overflow
 * (mesmo padrão do Contrato).
 */

const SCROLL_END_THRESHOLD = 8;

const MOCK = {
  nome:        'João da Silva Santos',
  endereco:    'Av. Paulista, 1578, Apto 142 — Bela Vista, São Paulo / SP, 01310-200',
  tempo:       '6 anos e 4 meses',
  contas:      '2',
  saldo:       18430.75,
  rendaMensal: 8500.00,
};

export default function Dados() {
  const navigate            = useNavigate();
  const cpf                 = useCredito((s) => s.cpf);
  const setDadosConfirmados = useCredito((s) => s.setDadosConfirmados);
  const reset               = useCredito((s) => s.reset);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [overflow,  setOverflow]  = useState(false);
  const [atEnd,     setAtEnd]     = useState(false);

  // Checa overflow no mount e em resize do container
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => {
      const over = el.scrollHeight > el.clientHeight + 1;
      setOverflow(over);
      if (!over) setAtEnd(true);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    setAtEnd(el.scrollTop + el.clientHeight >= el.scrollHeight - SCROLL_END_THRESHOLD);
  };

  const dadosIncorretos = () => {
    reset();
    navigate('/caixa/credito/acesso', { replace: true });
  };

  const confirmar = () => {
    setDadosConfirmados(true);
    navigate('/caixa/credito/simulacao');
  };

  const rows: { label: string; value: string }[] = [
    { label: 'Nome',                value: MOCK.nome },
    { label: 'CPF',                 value: cpf ? formatCpf(cpf) : '—' },
    { label: 'Endereço',            value: MOCK.endereco },
    { label: 'Tempo no endereço',   value: MOCK.tempo },
    { label: 'Contas Caixa',        value: MOCK.contas },
    { label: 'Saldo total',         value: brl(MOCK.saldo) },
    { label: 'Renda mensal total',  value: brl(MOCK.rendaMensal) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="h-full w-full flex flex-col"
      style={{ padding: '32px 48px', gap: 20 }}
    >
      {/* Título */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 36, fontWeight: 700, color: '#0066B3', lineHeight: '120%' }}>
          Confirme seus dados
        </span>
        <span style={{ fontSize: 18, fontWeight: 400, color: '#6B7280', lineHeight: '150%' }}>
          Estas são as informações que a Caixa tem em seus registros.
        </span>
      </div>

      {/* Tabela scrollável dentro do container branco */}
      <div className="relative" style={{ flex: 1, minHeight: 0 }}>
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="overflow-y-auto"
          style={{
            height: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: 8,
            border: '1px solid rgba(0,0,0,0.08)',
            padding: '8px 32px',
          }}
        >
          {rows.map((row, i) => (
            <div
              key={row.label}
              style={{
                display: 'grid',
                gridTemplateColumns: '280px 1fr',
                gap: 32,
                padding: '20px 0',
                borderTop: i === 0 ? 'none' : '1px solid rgba(0,0,0,0.08)',
                alignItems: 'baseline',
              }}
            >
              <span style={{
                fontSize: 16, fontWeight: 600, color: '#6B7280',
                textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: '150%',
              }}>
                {row.label}
              </span>
              <span style={{
                fontSize: 22, fontWeight: 600, color: '#374151', lineHeight: '150%',
              }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* Pill flutuante — só aparece se houver overflow E não estiver no fim */}
        {overflow && !atEnd && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              position: 'absolute',
              right: 16, bottom: 16,
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 14px',
              backgroundColor: 'rgba(0,102,179,0.92)',
              borderRadius: 999,
              pointerEvents: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <ArrowDownCircle style={{ width: 18, height: 18, color: '#FFFFFF' }} strokeWidth={2} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>
              Role para ver mais
            </span>
          </motion.div>
        )}
      </div>

      {/* CTAs fixos */}
      <div className="flex items-center" style={{ gap: 16 }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={dadosIncorretos}
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
          <Edit3 style={{ width: 24, height: 24 }} strokeWidth={2} />
          Dados incorretos
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={confirmar}
          className="flex items-center justify-center font-semibold rounded-lg"
          style={{
            flex: 2,
            height: 80, gap: 12, padding: '0 24px',
            fontSize: 20, color: '#FFFFFF',
            backgroundColor: '#00AB67',
            borderRadius: 8,
          }}
        >
          Confirmar
          <ArrowRight style={{ width: 28, height: 28 }} strokeWidth={2} />
        </motion.button>
      </div>
    </motion.div>
  );
}
