import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, FileSignature, ArrowDownCircle } from 'lucide-react';
import { useCredito } from '../../../../store/creditoStore';
import { brl } from '../../../../utils/currency';

/**
 * Crédito Pessoal — Etapa 4.A (Contrato).
 *
 * Documento scrollável (área branca dentro da página flat) com 7 cláusulas +
 * cronograma de parcelas. O CTA "Assinar contrato" só habilita depois que o
 * usuário rola até o final do documento.
 *
 * Mesma estrutura visual sem card global, ocupando todo o espaço horizontal.
 */

const SCROLL_END_THRESHOLD = 12; // px de tolerância

/* ── Gera o cronograma de parcelas a partir da data atual ─────────────── */
function gerarCronograma(parcela: number, prazo: number) {
  const out: { num: number; venc: string; valor: number }[] = [];
  const hoje = new Date();
  // Primeiro vencimento: 30 dias após hoje. Demais: mensalmente.
  for (let i = 1; i <= prazo; i++) {
    const d = new Date(hoje);
    d.setDate(d.getDate() + 30);
    d.setMonth(d.getMonth() + (i - 1));
    out.push({
      num:   i,
      venc:  d.toLocaleDateString('pt-BR'),
      valor: parcela,
    });
  }
  return out;
}

export default function Contrato() {
  const navigate         = useNavigate();
  const simulacao        = useCredito((s) => s.simulacao);
  const setContratoLido  = useCredito((s) => s.setContratoLido);
  const contratoLido     = useCredito((s) => s.contratoLido);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [habilitado, setHabilitado] = useState<boolean>(contratoLido);

  // Se simulação não estiver no store (acesso direto à URL), volta pra simulação.
  useEffect(() => {
    if (!simulacao) navigate('/caixa/credito/simulacao', { replace: true });
  }, [simulacao, navigate]);

  const cronograma = useMemo(
    () => (simulacao ? gerarCronograma(simulacao.parcela, simulacao.prazo) : []),
    [simulacao],
  );

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const atEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - SCROLL_END_THRESHOLD;
    if (atEnd && !habilitado) {
      setHabilitado(true);
      setContratoLido(true);
    }
  };

  const assinar = () => {
    if (!habilitado) return;
    navigate('/caixa/credito/assinatura');
  };

  if (!simulacao) return null;

  const txMensal = (simulacao.taxaMensal * 100).toFixed(2).replace('.', ',');
  const txAnual  = (simulacao.cetAnual   * 100).toFixed(2).replace('.', ',');

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
          Contrato de empréstimo pessoal
        </span>
        <span style={{ fontSize: 18, fontWeight: 400, color: '#6B7280', lineHeight: '150%' }}>
          Role até o final para habilitar a assinatura eletrônica.
        </span>
      </div>

      {/* Documento scrollável (com indicador visual se ainda não chegou ao fim) */}
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
            padding: '24px 32px',
          }}
        >
          {/* Chips de resumo */}
          <div className="flex" style={{ gap: 12, marginBottom: 24 }}>
            <Chip label="Valor solicitado" value={brl(simulacao.valor)} />
            <Chip label="Prazo (meses)"   value={String(simulacao.prazo)} />
          </div>

          {/* Cláusulas */}
          <Clause num={1} title="Objeto">
            A CAIXA ECONÔMICA FEDERAL concede ao(à) CONTRATANTE o presente empréstimo
            pessoal sem garantia, nos valores e prazos selecionados na simulação.
          </Clause>
          <Clause num={2} title="Encargos e Custo Efetivo Total (CET)">
            Taxa de juros nominal de {txMensal}% ao mês. O Custo Efetivo Total (CET)
            considera juros, IOF e tarifas eventualmente aplicáveis, totalizando{' '}
            {txAnual}% ao ano.
          </Clause>
          <Clause num={3} title="Forma de Pagamento (DDA)">
            As parcelas serão cobradas mensalmente, por Débito Direto Autorizado
            (DDA), em conta corrente Caixa de titularidade do(a) CONTRATANTE. A
            primeira parcela vencerá 30 (trinta) dias após o desembolso.
          </Clause>
          <Clause num={4} title="Atraso e Encargos Moratórios">
            Em caso de atraso, incidirão multa de 2%, juros de mora de 1% ao mês e
            correção monetária pelo IPCA, sem prejuízo das medidas extrajudiciais e
            judiciais cabíveis.
          </Clause>
          <Clause num={5} title="Direito de Arrependimento">
            Nos termos do art. 49 do Código de Defesa do Consumidor, o(a) CONTRATANTE
            poderá desistir da contratação no prazo de 7 (sete) dias corridos,
            contados da assinatura, com devolução integral dos valores recebidos.
          </Clause>
          <Clause num={6} title="Tratamento de Dados (LGPD)">
            Os dados pessoais coletados serão tratados conforme a Lei nº 13.709/2018
            (LGPD), exclusivamente para a execução deste contrato e cumprimento de
            obrigações legais e regulatórias.
          </Clause>
          <Clause num={7} title="Assinatura Eletrônica Avançada (AES)">
            Este instrumento é assinado eletronicamente conforme a Lei nº
            14.063/2020, mediante envio de código alfanumérico ao WhatsApp
            cadastrado, garantindo vinculação única ao(à) signatário(a).
          </Clause>

          {/* Cronograma */}
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#0066B3', marginBottom: 12 }}>
              Cronograma de pagamentos
            </div>
            <div
              style={{
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 8,
                overflow: 'hidden',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
                <thead>
                  <tr style={{ backgroundColor: '#EFF5F9' }}>
                    <th style={thStyle}>Parcela</th>
                    <th style={thStyle}>Vencimento</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {cronograma.map((p, i) => (
                    <tr
                      key={p.num}
                      style={{
                        backgroundColor: i % 2 === 1 ? '#FAFBFC' : '#FFFFFF',
                      }}
                    >
                      <td style={tdStyle}>{p.num}</td>
                      <td style={tdStyle}>{p.venc}</td>
                      <td style={{ ...tdStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                        {brl(p.valor)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Hint de scroll quando ainda não chegou ao fim */}
        {!habilitado && (
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
              Role até o final
            </span>
          </motion.div>
        )}
      </div>

      {/* CTA Assinar */}
      <div className="flex flex-col" style={{ gap: 6 }}>
        <motion.button
          whileTap={habilitado ? { scale: 0.97 } : {}}
          disabled={!habilitado}
          onClick={assinar}
          className="flex items-center justify-center font-semibold rounded-lg"
          style={{
            height: 80, gap: 12, padding: '0 24px',
            fontSize: 20, color: '#FFFFFF',
            backgroundColor: habilitado ? '#00AB67' : '#D0E0E3',
            borderRadius: 8,
            transition: 'background-color 0.25s',
          }}
        >
          <FileSignature style={{ width: 28, height: 28 }} strokeWidth={2} />
          Assinar contrato
          <ArrowRight style={{ width: 28, height: 28 }} strokeWidth={2} />
        </motion.button>
        <span style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center' }}>
          Assinatura eletrônica avançada — Lei nº 14.063/2020
        </span>
      </div>
    </motion.div>
  );
}

/* ── Subcomponentes do documento ──────────────────────────────────────── */
function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex items-center"
      style={{
        padding: '8px 16px',
        backgroundColor: '#EFF5F9',
        borderRadius: 999,
        gap: 8,
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 500, color: '#6B7280' }}>{label}:</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: '#0066B3', fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </span>
    </div>
  );
}

function Clause({
  num, title, children,
}: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
        {num}. {title}
      </div>
      <div style={{ fontSize: 15, color: '#4B5563', lineHeight: '160%' }}>
        {children}
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 16px',
  fontSize: 13,
  fontWeight: 700,
  color: '#6B7280',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  borderBottom: '1px solid rgba(0,0,0,0.08)',
};

const tdStyle: React.CSSProperties = {
  padding: '8px 16px',
  fontSize: 15,
  color: '#374151',
  lineHeight: '150%',
};
