import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Minus, Plus, Users, Info } from 'lucide-react';
import { getModalidade } from '../../data/modalidades';
import { useSession } from '../../../../../store/sessionStore';
import { useToastStore } from '../../../../../store/toastStore';
import { brl } from '../../../../../utils/currency';
import LotteryLogo from '../../components/LotteryLogo';

/**
 * Bolão — definição de cotas e valor por cota.
 *
 * Chega aqui depois de PickNumbers em modo bolão. Recebe via location.state:
 *   - numeros: number[]
 *   - concursos: number
 *   - teimosinha: boolean
 *
 * Nº de cotas = nº de participantes = nº de comprovantes impressos.
 * Não há prazo, não há cadastro de participantes.
 */

const COTAS_MIN = 2;
const COTAS_MAX = 50;
const VALOR_COTA_MIN = 1;
const VALOR_COTA_MAX = 100;
const VALOR_COTA_STEP = 1;

interface RouteState {
  numeros?: number[];
  concursos?: number;
  teimosinha?: boolean;
}

export default function BolaoCotas() {
  const { modalidade } = useParams<{ modalidade: string }>();
  const navigate       = useNavigate();
  const location       = useLocation();
  const m              = getModalidade(modalidade ?? '');
  const addAposta      = useSession((s) => s.addAposta);
  const cartCount      = useSession((s) => s.apostas.length);
  const showToast      = useToastStore((s) => s.show);

  const state = (location.state ?? {}) as RouteState;
  const numeros    = state.numeros ?? [];
  const concursos  = state.concursos ?? 1;
  const teimosinha = state.teimosinha ?? false;

  const [cotas,        setCotas]        = useState<number>(2);
  const [valorPorCota, setValorPorCota] = useState<number>(5);

  if (!m) return null;

  // Se não veio com números (acesso direto à URL), volta para o início.
  if (numeros.length === 0) {
    navigate(`/caixa/aposta/${m.id}/tipo`, { replace: true });
    return null;
  }

  const total = cotas * valorPorCota * concursos;

  const incCotas = () => setCotas((c) => Math.min(COTAS_MAX, c + 1));
  const decCotas = () => setCotas((c) => Math.max(COTAS_MIN, c - 1));
  const incValor = () => setValorPorCota((v) => Math.min(VALOR_COTA_MAX, v + VALOR_COTA_STEP));
  const decValor = () => setValorPorCota((v) => Math.max(VALOR_COTA_MIN, v - VALOR_COTA_STEP));

  const adicionarAoCarrinho = () => {
    addAposta({
      id: crypto.randomUUID(),
      modalidadeId:   m.id,
      modalidadeNome: m.nome,
      numeros,
      concursos,
      teimosinha,
      valor:          total,
      addedAt:        Date.now(),
      bolao:          { cotas, valorPorCota },
    });
    showToast(`Bolão adicionado: ${cotas} cotas × ${brl(valorPorCota)}`);
    navigate('/caixa/loterias/apostar');
  };

  return (
    <div
      className="h-full w-full flex flex-col overflow-hidden"
      style={{ backgroundColor: '#EFF5F9' }}
    >
      {/* ── Header azul ── */}
      <div
        className="flex items-center shrink-0"
        style={{ gap: 24, padding: 24, backgroundColor: '#0066B3' }}
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate(-1)}
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

        <div className="flex-1 flex items-center justify-center" style={{ gap: 24 }}>
          <Users style={{ width: 48, height: 48, color: '#FFFFFF', flexShrink: 0 }} strokeWidth={1.5} />
          <span className="font-semibold" style={{ fontSize: 44, color: '#FFFFFF', lineHeight: '120%' }}>
            Bolão · {m.nome}
          </span>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/caixa/loterias/carrinho')}
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{
            width: 280, height: 80,
            backgroundColor: '#004B8B',
            borderRadius: 8,
            gap: 16,
            padding: '0 24px',
          }}
        >
          <ShoppingCart style={{ width: 40, height: 40, color: '#F39200', flexShrink: 0 }} strokeWidth={2} />
          <span className="font-semibold text-white" style={{ fontSize: 20 }}>
            Carrinho
          </span>
          {cartCount > 0 && (
            <span
              className="flex items-center justify-center rounded-full font-bold text-white shrink-0"
              style={{ width: 28, height: 28, fontSize: 13, backgroundColor: '#F39200' }}
            >
              {cartCount}
            </span>
          )}
        </motion.button>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden" style={{ gap: 24, padding: 24 }}>

        {/* Coluna esquerda — steppers */}
        <div className="flex flex-col overflow-y-auto" style={{ flex: 3, gap: 16, minWidth: 0 }}>

          {/* Header */}
          <div className="bg-white rounded-lg" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 28, fontWeight: 600, color: '#005DA4', lineHeight: '120%' }}>
              Defina o bolão
            </span>
            <span style={{ fontSize: 18, fontWeight: 400, color: '#6B7280', lineHeight: '150%' }}>
              Cada cota corresponde a um participante, que recebe um comprovante impresso.
            </span>
          </div>

          {/* Stepper: número de cotas */}
          <Stepper
            label="Número de cotas"
            hint={`Mínimo ${COTAS_MIN} · máximo ${COTAS_MAX}`}
            value={cotas}
            suffix={cotas === 1 ? 'participante' : 'participantes'}
            onMinus={decCotas}
            onPlus={incCotas}
            disableMinus={cotas <= COTAS_MIN}
            disablePlus={cotas >= COTAS_MAX}
            cor={m.cor}
          />

          {/* Stepper: valor por cota */}
          <Stepper
            label="Valor por cota"
            hint={`De ${brl(VALOR_COTA_MIN)} a ${brl(VALOR_COTA_MAX)}`}
            value={valorPorCota}
            displayValue={brl(valorPorCota)}
            onMinus={decValor}
            onPlus={incValor}
            disableMinus={valorPorCota <= VALOR_COTA_MIN}
            disablePlus={valorPorCota >= VALOR_COTA_MAX}
            cor={m.cor}
          />

          {/* Info */}
          <div
            className="rounded-lg flex items-start"
            style={{ backgroundColor: '#FFFAE3', padding: 20, gap: 16 }}
          >
            <Info style={{ width: 24, height: 24, color: '#A67700', flexShrink: 0, marginTop: 2 }} strokeWidth={2} />
            <span style={{ fontSize: 18, fontWeight: 400, color: '#6B5500', lineHeight: '150%' }}>
              No bolão, <strong style={{ fontWeight: 700 }}>{cotas} comprovantes</strong> serão impressos
              no totem ao final do pagamento — um para cada participante.
            </span>
          </div>

          <div style={{ height: 4 }} />
        </div>

        {/* Coluna direita — resumo */}
        <div className="flex flex-col" style={{ flex: 1, gap: 16, minWidth: 0, overflowY: 'auto' }}>

          <div className="rounded-lg bg-white" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span style={{ fontSize: 24, fontWeight: 600, color: '#00AB67', lineHeight: '32px' }}>
              Resumo do bolão
            </span>

            <Row label="Modalidade" value={m.nome} />
            <Row label="Números" value={`${numeros.length} dezenas`} />
            <Row label="Concursos" value={String(concursos)} />
            <Row label="Cotas" value={String(cotas)} />
            <Row label="Valor por cota" value={brl(valorPorCota)} />

            <Divider />

            <div className="flex items-center justify-between">
              <span style={{ fontSize: 24, fontWeight: 600, color: '#00AB67' }}>Total</span>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#00AB67', fontVariantNumeric: 'tabular-nums' }}>
                {brl(total)}
              </span>
            </div>

            <Divider />

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={adicionarAoCarrinho}
              className="flex items-center justify-center font-semibold rounded-lg shrink-0"
              style={{
                height: 80, gap: 16, padding: '0 24px',
                fontSize: 20, lineHeight: '20px', color: '#FFFFFF',
                backgroundColor: '#00AB67', borderRadius: 8,
              }}
            >
              <ShoppingCart style={{ width: 28, height: 28, flexShrink: 0 }} strokeWidth={2} />
              Adicionar ao Carrinho
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Stepper ───────────────────────────────────────────────────────────── */
function Stepper({
  label, hint, value, displayValue, suffix, onMinus, onPlus,
  disableMinus, disablePlus, cor,
}: {
  label: string;
  hint?: string;
  value: number;
  displayValue?: string;
  suffix?: string;
  onMinus: () => void;
  onPlus: () => void;
  disableMinus?: boolean;
  disablePlus?: boolean;
  cor: string;
}) {
  return (
    <div className="bg-white rounded-lg" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="flex items-baseline justify-between" style={{ gap: 16 }}>
        <span style={{ fontSize: 24, fontWeight: 600, color: '#005DA4', lineHeight: '120%' }}>
          {label}
        </span>
        {hint && (
          <span style={{ fontSize: 16, fontWeight: 400, color: '#6B7280', lineHeight: '150%' }}>
            {hint}
          </span>
        )}
      </div>

      <div
        className="flex items-center justify-between rounded-lg"
        style={{ backgroundColor: '#FFFAE3', padding: 16, gap: 24 }}
      >
        <StepperBtn icon={<Minus />} onClick={onMinus} disabled={disableMinus} cor={cor} />

        <div className="flex flex-col items-center" style={{ gap: 4, flex: 1 }}>
          <span
            style={{
              fontSize: 56, fontWeight: 700,
              color: cor, lineHeight: '120%',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {displayValue ?? value}
          </span>
          {suffix && (
            <span style={{ fontSize: 16, fontWeight: 500, color: '#6B7280' }}>{suffix}</span>
          )}
        </div>

        <StepperBtn icon={<Plus />} onClick={onPlus} disabled={disablePlus} cor={cor} />
      </div>
    </div>
  );
}

function StepperBtn({
  icon, onClick, disabled, cor,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  cor: string;
}) {
  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.92 }}
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center rounded-lg shrink-0 transition-opacity"
      style={{
        width: 80, height: 80,
        backgroundColor: disabled ? '#F3F4F6' : '#FFFFFF',
        border: `2px solid ${disabled ? '#E5E7EB' : cor}`,
        borderRadius: 8,
        opacity: disabled ? 0.5 : 1,
        color: disabled ? '#9CA3AF' : cor,
      }}
    >
      <span style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </span>
    </motion.button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="font-medium uppercase" style={{ fontSize: 16, color: '#6B7280', opacity: 0.7 }}>
        {label}:
      </span>
      <span className="font-bold" style={{ fontSize: 20, color: '#6B7280', textAlign: 'right' }}>
        {value}
      </span>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, backgroundColor: '#000000', opacity: 0.1 }} />;
}
