import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { useCredito } from '../../../../store/creditoStore';
import { brl } from '../../../../utils/currency';

/**
 * Crédito Pessoal — Etapa 3 (Simulação).
 *
 * Mesma estrutura visual sem card branco, sobre #EFF5F9. Layout em coluna
 * usando todo o espaço horizontal:
 *   1) Título
 *   2) Sliders Valor + Prazo (full width)
 *   3) 3 cards de resultado em linha (Parcela / Juros / Total)
 *   4) Bloco de taxa de juros / CET
 *   5) CTAs Cancelar | Concordar e continuar
 *
 * Fórmula PMT: parcela = P × i / (1 − (1 + i)^−n)
 */

const VALOR_MIN  = 4250;
const VALOR_MAX  = 50000;
const VALOR_STEP = 250;

const PRAZO_MIN  = 12;
const PRAZO_MAX  = 48;
const PRAZO_STEP = 1;

const TAXA_MENSAL = 0.0199;  // 1,99% a.m.
const CET_ANUAL   = 0.2677;  // 26,77% a.a.

function calcular(valor: number, prazo: number) {
  const i        = TAXA_MENSAL;
  const parcela  = valor * i / (1 - Math.pow(1 + i, -prazo));
  const total    = parcela * prazo;
  const juros    = total - valor;
  return { parcela, total, juros };
}

export default function Simulacao() {
  const navigate     = useNavigate();
  const setSimulacao = useCredito((s) => s.setSimulacao);
  const reset        = useCredito((s) => s.reset);

  const [valor, setValor] = useState<number>(5000);
  const [prazo, setPrazo] = useState<number>(24);

  const { parcela, total, juros } = useMemo(() => calcular(valor, prazo), [valor, prazo]);

  const cancelar = () => {
    reset();
    navigate('/caixa/para-voce', { replace: true });
  };

  const concordar = () => {
    setSimulacao({
      valor, prazo,
      parcela, total, jurosTotais: juros,
      taxaMensal: TAXA_MENSAL,
      cetAnual:   CET_ANUAL,
    });
    navigate('/caixa/credito/contrato');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="h-full w-full flex flex-col"
      style={{ padding: '32px 48px', gap: 28 }}
    >
      {/* Título */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: 36, fontWeight: 700, color: '#0066B3', lineHeight: '120%' }}>
          Simulação de empréstimo pessoal
        </span>
        <span style={{ fontSize: 20, fontWeight: 400, color: '#6B7280', lineHeight: '150%' }}>
          Ajuste o valor e o prazo para visualizar sua parcela.
        </span>
      </div>

      {/* Sliders — lado a lado */}
      <div className="flex" style={{ gap: 24 }}>
        <SliderField
          label="Valor solicitado"
          value={valor}
          min={VALOR_MIN}
          max={VALOR_MAX}
          step={VALOR_STEP}
          format={(v) => brl(v)}
          onChange={setValor}
        />
        <SliderField
          label="Prazo (meses)"
          value={prazo}
          min={PRAZO_MIN}
          max={PRAZO_MAX}
          step={PRAZO_STEP}
          format={(v) => String(v)}
          onChange={setPrazo}
        />
      </div>

      {/* 3 resultados em linha — flat, sem container */}
      <div
        className="flex"
        style={{
          gap: 24,
          padding: '4px 24px',
        }}
      >
        <ResultColumn label="Parcela mensal" value={brl(parcela)} />
        <ResultColumn label="Juros totais"   value={brl(juros)} />
        <ResultColumn label="Total a pagar"  value={brl(total)} />
      </div>

      {/* Taxa / CET / DDA — texto inline, sem container */}
      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 16, color: '#374151', lineHeight: '150%' }}>
          <strong style={{ fontWeight: 700 }}>Taxa de juros:</strong>{' '}
          {(TAXA_MENSAL * 100).toFixed(2).replace('.', ',')}% a.m. (CET {(CET_ANUAL * 100).toFixed(2).replace('.', ',')}% a.a.)
        </span>
        <span style={{ fontSize: 14, color: '#6B7280', lineHeight: '150%' }}>
          O primeiro pagamento será debitado 30 dias após o desembolso via Débito Direto Autorizado (DDA).
        </span>
      </div>

      {/* CTAs */}
      <div className="flex items-center mt-auto" style={{ gap: 16 }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={cancelar}
          className="flex items-center justify-center font-semibold rounded-lg"
          style={{
            flex: 1,
            height: 80, gap: 12, padding: '0 24px',
            fontSize: 20, color: '#ED1C24',
            backgroundColor: '#FFFFFF',
            border: '2px solid #D0E0E3',
            borderRadius: 8,
          }}
        >
          <X style={{ width: 24, height: 24 }} strokeWidth={2.5} />
          Cancelar
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={concordar}
          className="flex items-center justify-center font-semibold rounded-lg"
          style={{
            flex: 2,
            height: 80, gap: 12, padding: '0 24px',
            fontSize: 20, color: '#FFFFFF',
            backgroundColor: '#00AB67',
            borderRadius: 8,
          }}
        >
          Concordar e continuar
          <ArrowRight style={{ width: 28, height: 28 }} strokeWidth={2} />
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ── SliderField ─────────────────────────────────────────────────────── */
function SliderField({
  label, value, min, max, step, format, onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const trackBg = `linear-gradient(to right, #0066B3 0%, #0066B3 ${pct}%, #D0E0E3 ${pct}%, #D0E0E3 100%)`;

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: '20px 24px',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}
    >
      <div className="flex items-baseline justify-between">
        <span style={{ fontSize: 18, fontWeight: 600, color: '#374151', lineHeight: '120%' }}>
          {label}
        </span>
        <span style={{
          fontSize: 28, fontWeight: 700, color: '#0066B3',
          fontVariantNumeric: 'tabular-nums', lineHeight: '120%',
        }}>
          {format(value)}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="kiosk-slider"
        style={{ background: trackBg }}
      />

      <div className="flex items-center justify-between">
        <span style={{ fontSize: 14, color: '#9CA3AF', fontVariantNumeric: 'tabular-nums' }}>
          {format(min)}
        </span>
        <span style={{ fontSize: 14, color: '#9CA3AF', fontVariantNumeric: 'tabular-nums' }}>
          {format(max)}
        </span>
      </div>
    </div>
  );
}

/* ── ResultColumn — coluna de resultado flat (sem container) ───────── */
function ResultColumn({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col" style={{ flex: 1, gap: 4 }}>
      <span style={{
        fontSize: 13, fontWeight: 700, color: '#6B7280',
        letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 30, fontWeight: 700, color: '#0066B3',
        fontVariantNumeric: 'tabular-nums', lineHeight: '120%',
      }}>
        {value}
      </span>
    </div>
  );
}
