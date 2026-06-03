import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Edit3 } from 'lucide-react';
import { useCredito } from '../../../../store/creditoStore';
import { formatCpf } from '../../../../utils/cpf';
import { brl } from '../../../../utils/currency';

/**
 * Crédito Pessoal — Etapa 2 (Seus dados).
 *
 * Sem card branco: preenche todo o espaço horizontal do viewport, mesmo
 * padrão visual de Acesso/Verificação/Simulação.
 *
 * Botões:
 *   - Dados incorretos: limpa a sessão e volta para o início do fluxo
 *   - Confirmar:        marca dadosConfirmados=true e avança para Simulação
 */

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
      style={{ padding: '40px 48px', gap: 32 }}
    >
      {/* Título */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: 36, fontWeight: 700, color: '#0066B3', lineHeight: '120%' }}>
          Confirme seus dados
        </span>
        <span style={{ fontSize: 20, fontWeight: 400, color: '#6B7280', lineHeight: '150%' }}>
          Estas são as informações que a Caixa tem em seus registros.
        </span>
      </div>

      {/* Tabela ocupando todo o espaço horizontal */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
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

      {/* Ações */}
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
