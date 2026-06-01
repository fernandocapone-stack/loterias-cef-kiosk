import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Clock, Users } from 'lucide-react';
import { getModalidade, calcularPreco } from '../../data/modalidades';
import { useSession } from '../../../../../store/sessionStore';
import { useToastStore } from '../../../../../store/toastStore';
import { brl } from '../../../../../utils/currency';
import { cn } from '../../../../../lib/cn';
import LotteryLogo from '../../components/LotteryLogo';

/**
 * Seleção de Números — Figma (250:2030), canvas 1440×1288.
 *
 * Header: bg #0066B3
 *   Back 200×80 (#004B8B) | [Symbol 48px + Nome 44px SemiBold branco] | Cart 200×80 (#004B8B)
 *
 * Body (y:128, col, gap:24, padding:24):
 *   Row gap:24:
 *     LEFT  — 1038px, overflow-y-auto
 *       ┌── Card branco (col, gap:16, pad:24)
 *       │     "Assinale com quantos números..."
 *       │     Container amarelo (#FFFAE3, row, gap:34, pad:16) — chips de quantidade
 *       └── Card branco (col, gap:16, pad:24)
 *             Row: "Escolha seus números..." + [Limpar 172×48] [Completar 172×48]
 *             Grid amarelo (#FFFAE3, pad:32 24, col, gap:20)
 *     RIGHT — flex-1 (~330px), col, gap:24
 *       ┌── Info card (branco, pad:32 24, col, gap:24)
 *       │     Concurso + prêmio + encerramento + próximo
 *       ├── Resumo card (branco, pad:32 24, col, gap:16)
 *       │     Números / Concursos / Valor / Total
 *       ├── Button "Adicionar Aposta" (verde #00AB67, fill, cart icon)
 *       └── Button "Confirmar e Pagar" (#D0E0E3, fill)
 */

/* ── NumberChip ─────────────────────────────────────────────────────────────
   Unselected: transparente + brackets coloridos 0.2 opacidade
   Selected:   pill sólida na cor + brackets brancos 0.5 + texto branco
   ─────────────────────────────────────────────────────────────────────────── */
function NumberChip({ label, isSel, cor }: { label: string | number; isSel: boolean; cor: string }) {
  /* Inactive: fixed #A62A52 (caderneta física), brackets 20% opacity, transparent bg
     Active:   modal cor as solid bg, white text/brackets at 50% opacity               */
  const INACTIVE_COLOR = '#A62A52';
  const bracketColor   = isSel ? '#FFFFFF' : INACTIVE_COLOR;
  const bracketOpacity = isSel ? 0.5 : 0.2;
  const bracket = (side: 'left' | 'right') => ({
    width: 7, height: 44, flexShrink: 0 as const, opacity: bracketOpacity,
    borderTop: `2px solid ${bracketColor}`,
    borderBottom: `2px solid ${bracketColor}`,
    ...(side === 'left'
      ? { borderLeft: `2px solid ${bracketColor}`, borderRadius: '3px 0 0 3px' }
      : { borderRight: `2px solid ${bracketColor}`, borderRadius: '0 3px 3px 0' }),
  });
  return (
    <div
      className="flex items-center"
      style={{ padding: 4, borderRadius: 4, backgroundColor: isSel ? cor : 'transparent' }}
    >
      <div style={bracket('left')} />
      <span style={{
        width: 56, textAlign: 'center',
        fontSize: 24, fontWeight: 500, lineHeight: '120%',
        color: isSel ? '#FFFFFF' : INACTIVE_COLOR,
      }}>
        {typeof label === 'number' ? String(label).padStart(2, '0') : label}
      </span>
      <div style={bracket('right')} />
    </div>
  );
}

/* ── Divisor horizontal ──────────────────────────────────────────────────── */
function Divider() {
  return <div style={{ height: 1, backgroundColor: '#000000', opacity: 0.1, alignSelf: 'stretch' }} />;
}

export default function PickNumbers() {
  const { modalidade } = useParams<{ modalidade: string }>();
  const navigate       = useNavigate();
  const location       = useLocation();
  const m              = getModalidade(modalidade ?? '');
  const addAposta      = useSession((s) => s.addAposta);
  const cartCount      = useSession((s) => s.apostas.length);
  const showToast      = useToastStore((s) => s.show);

  // Modo bolão é decidido em PickApostaType e propagado via location.state.
  const isBolao = Boolean((location.state as { bolao?: boolean } | null)?.bolao);

  const [selected,   setSelected]   = useState<number[]>([]);
  const [qtd,        setQtd]        = useState<number>(0);
  const [teimosinha, setTeimosinha] = useState<number | null>(null);
  const [secsLeft,   setSecsLeft]   = useState<number>(12 * 60); // 12min countdown
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const concursos = teimosinha ?? 1;

  /* ── 12-minute countdown — starts when screen mounts ── */
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const timerMM = String(Math.floor(secsLeft / 60)).padStart(2, '0');
  const timerSS = String(secsLeft % 60).padStart(2, '0');

  if (!m) return null;

  const qtdEfetiva = qtd > 0 ? qtd : m.minNumeros;
  const enough     = selected.length >= qtdEfetiva;
  const preco      = enough ? calcularPreco(m, selected.length) : m.precoBase;
  const total      = preco * concursos;

  const toggle = (n: number) => {
    setSelected((prev) => {
      if (prev.includes(n)) return prev.filter((x) => x !== n);
      if (prev.length >= m.maxNumeros) return prev;
      return [...prev, n].sort((a, b) => a - b);
    });
  };

  const autoCompletar = () => {
    const set = new Set(selected);
    while (set.size < qtdEfetiva) set.add(1 + Math.floor(Math.random() * m.totalNumeros));
    setSelected([...set].sort((a, b) => a - b));
  };

  const limpar = () => setSelected([]);

  const buildAposta = () => ({
    id: crypto.randomUUID(),
    modalidadeId:   m.id,
    modalidadeNome: m.nome,
    numeros:        selected,
    concursos,
    teimosinha:     concursos > 1,
    valor:          total,
    addedAt:        Date.now(),
  });

  // No modo bolão, os números aqui escolhidos viram um "bolão" — o usuário
  // precisa ainda definir cotas e valor por cota em BolaoCotas antes de
  // commitar no carrinho.
  const goToBolao = () => {
    if (!enough) return;
    navigate(`/caixa/aposta/${m.id}/bolao`, {
      state: { numeros: selected, concursos, teimosinha: concursos > 1 },
    });
  };

  const adicionarAposta = () => {
    if (!enough) return;
    if (isBolao) return goToBolao();
    addAposta(buildAposta());
    showToast('Aposta adicionada ao carrinho!');
    navigate('/caixa/loterias/apostar');
  };

  const confirmarEPagar = () => {
    if (!enough) return;
    if (isBolao) return goToBolao();
    addAposta(buildAposta());
    navigate('/checkout/pagamento', { state: { valor: total } });
  };

  /* Opções de quantidade */
  const qtdOptions: number[] = [];
  for (let i = m.minNumeros; i <= Math.min(m.minNumeros + 6, m.maxNumeros); i++) qtdOptions.push(i);

  /* Grid de números */
  const perRow  = m.totalNumeros >= 50 ? 10 : m.totalNumeros >= 25 ? 9 : 7;
  const numbers = Array.from({ length: m.totalNumeros }, (_, i) => i + 1);
  const rows: number[][] = [];
  for (let i = 0; i < numbers.length; i += perRow) rows.push(numbers.slice(i, i + perRow));

  return (
    <div className="flex flex-col h-full w-full" style={{ backgroundColor: '#EFF5F9' }}>

      {/* ════════════════════════════════════════════
          HEADER — bg #0066B3
          ════════════════════════════════════════════ */}
      <div
        className="flex items-center shrink-0"
        style={{ gap: 24, padding: 24, backgroundColor: '#0066B3' }}
      >
        {/* Voltar */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate(-1)}
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 280, height: 80, backgroundColor: '#004B8B', borderRadius: 8, gap: 8, padding: '12px 24px 12px 16px' }}
        >
          <ArrowLeft style={{ width: 48, height: 48, color: '#F39200', flexShrink: 0 }} strokeWidth={2} />
          <span className="text-white" style={{ fontSize: 20, fontWeight: 500 }}>Voltar</span>
        </motion.button>

        {/* Título: Símbolo + Nome (+ badge de bolão quando aplicável) */}
        <div className="flex-1 flex items-center justify-center" style={{ gap: 24 }}>
          <LotteryLogo modalidade={{ ...m, cor: '#FFFFFF' }} size={48} />
          <span className="font-semibold" style={{ fontSize: 44, color: '#FFFFFF', lineHeight: '120%' }}>
            {m.nome}
          </span>
          {isBolao && (
            <span
              className="flex items-center"
              style={{
                gap: 8, padding: '8px 16px',
                backgroundColor: 'rgba(255,255,255,0.18)',
                borderRadius: 999,
              }}
            >
              <Users style={{ width: 24, height: 24, color: '#FFFFFF' }} strokeWidth={2} />
              <span style={{ fontSize: 20, fontWeight: 600, color: '#FFFFFF' }}>Bolão</span>
            </span>
          )}
        </div>

        {/* Carrinho */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/caixa/loterias/carrinho')}
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 280, height: 80, backgroundColor: '#004B8B', borderRadius: 8, gap: 16, padding: '0 24px' }}
        >
          <ShoppingCart style={{ width: 40, height: 40, color: '#F39200', flexShrink: 0 }} strokeWidth={2} />
          <span className="font-semibold text-white" style={{ fontSize: 20 }}>Carrinho</span>
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

      {/* ════════════════════════════════════════════
          BODY — row gap:24, pad:24
          ════════════════════════════════════════════ */}
      <div
        className="flex flex-1 overflow-hidden"
        style={{ gap: 24, padding: 24 }}
      >

        {/* ── LEFT PANEL — 3/4 of body ── */}
        <div
          className="flex flex-col overflow-y-auto"
          style={{ flex: 3, gap: 16, minWidth: 0 }}
        >

          {/* Card: Quantidade */}
          <div
            className="rounded-lg shrink-0"
            style={{ backgroundColor: '#FFFFFF', borderRadius: 8, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <span style={{ fontSize: 24, lineHeight: '120%', color: '#6B7280', fontWeight: 400 }}>
              Assinale com quantos números você quer jogar
            </span>
            {/* Chips de quantidade — fundo amarelo */}
            <div
              className="flex items-center flex-wrap rounded-lg"
              style={{ gap: 34, padding: 16, backgroundColor: '#FFFAE3' }}
            >
              {qtdOptions.map((n) => (
                <motion.button
                  key={n}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { setQtd(n); if (selected.length > n) setSelected(selected.slice(0, n)); }}
                  className="shrink-0"
                >
                  <NumberChip label={n} isSel={n === qtdEfetiva} cor={m.cor} />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Card: Grade de números */}
          <div
            className="rounded-lg shrink-0"
            style={{ backgroundColor: '#FFFFFF', borderRadius: 8, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {/* Toolbar */}
            <div className="flex items-center" style={{ gap: 24 }}>
              <span className="flex-1" style={{ fontSize: 24, lineHeight: '120%', color: '#6B7280', fontWeight: 400 }}>
                Escolha seus números e boa sorte!
              </span>
              <div className="flex items-center" style={{ gap: 16 }}>
                <button
                  onClick={limpar}
                  disabled={selected.length === 0}
                  className="flex items-center justify-center font-semibold transition-opacity disabled:opacity-40"
                  style={{ width: 172, height: 48, fontSize: 18, lineHeight: '160%', color: '#005DA4', backgroundColor: '#FFFFFF', border: '2px solid #D0E0E3', borderRadius: 8 }}
                >
                  Limpar
                </button>
                <button
                  onClick={autoCompletar}
                  className="flex items-center justify-center font-semibold"
                  style={{ width: 172, height: 48, fontSize: 18, lineHeight: '160%', color: '#005DA4', backgroundColor: '#FFFFFF', border: '2px solid #D0E0E3', borderRadius: 8 }}
                >
                  Completar
                </button>
              </div>
            </div>

            {/* Grade — fundo amarelo */}
            <div
              className="rounded-lg"
              style={{ backgroundColor: '#FFFAE3', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}
            >
              {rows.map((row, ri) => (
                <div key={ri} className="flex justify-between items-center">
                  {row.map((n) => {
                    const isSel      = selected.includes(n);
                    const isDisabled = !isSel && selected.length >= m.maxNumeros;
                    return (
                      <motion.button
                        key={n}
                        whileTap={{ scale: 0.88 }}
                        onClick={() => toggle(n)}
                        disabled={isDisabled}
                        className={cn('select-none shrink-0', isDisabled && 'opacity-30 cursor-not-allowed')}
                      >
                        <NumberChip label={n} isSel={isSel} cor={m.cor} />
                      </motion.button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Card: Teimosinha — Figma (250:2676) */}
          <div
            className="rounded-lg shrink-0"
            style={{ backgroundColor: '#FFFFFF', borderRadius: 8, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <span style={{ fontSize: 24, lineHeight: '120%', color: '#6B7280', fontWeight: 400 }}>
              Teimosinha — jogue os mesmos números por vários concursos
            </span>
            <div
              className="flex items-center flex-wrap rounded-lg"
              style={{ gap: 34, padding: 16, backgroundColor: '#FFFAE3' }}
            >
              {[2, 4, 8].map((n) => (
                <motion.button
                  key={n}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setTeimosinha((t) => (t === n ? null : n))}
                  className="shrink-0"
                >
                  <NumberChip label={n} isSel={teimosinha === n} cor={m.cor} />
                </motion.button>
              ))}
            </div>
          </div>

          <div style={{ height: 4 }} />
        </div>

        {/* ── RIGHT SIDEBAR — 1/4 of body ── */}
        <div className="flex flex-col" style={{ flex: 1, gap: 0, minWidth: 0 }}>

          {/* ── Cards scrolláveis ── */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 16 }}>

          {/* Resumo card — com os CTAs dentro, igual ao Figma */}
          <div
            className="rounded-lg bg-white shrink-0"
            style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 16, borderRadius: 8 }}
          >
            {/* Título + Timer badge na mesma linha */}
            <div className="flex items-center justify-between" style={{ alignSelf: 'stretch' }}>
              <span className="font-semibold" style={{ fontSize: 24, lineHeight: '32px', color: '#00AB67' }}>
                Resumo
              </span>
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  height: 40,
                  border: `2px solid ${secsLeft < 60 ? '#ED1C24' : '#D0E0E3'}`,
                  borderRadius: 8,
                  gap: 6,
                  padding: '0 12px',
                }}
              >
                <Clock style={{ width: 20, height: 20, color: secsLeft < 60 ? '#ED1C24' : '#005DA4', flexShrink: 0 }} strokeWidth={1.5} />
                <span style={{
                  fontSize: 18, fontWeight: 600, lineHeight: '160%',
                  color: secsLeft < 60 ? '#ED1C24' : '#005DA4',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {timerMM}:{timerSS}
                </span>
              </div>
            </div>

            {/* Números */}
            <div className="flex items-baseline justify-between" style={{ alignSelf: 'stretch' }}>
              <span className="font-medium uppercase" style={{ fontSize: 16, lineHeight: '150%', color: '#6B7280', opacity: 0.7 }}>
                Números:
              </span>
              <span className="font-bold" style={{ fontSize: 20, lineHeight: '150%', color: '#6B7280', textAlign: 'right' }}>
                {selected.length}/{qtdEfetiva}
              </span>
            </div>

            {/* Concursos — derivado da Teimosinha */}
            <div className="flex items-baseline justify-between" style={{ alignSelf: 'stretch' }}>
              <span className="font-medium uppercase" style={{ fontSize: 16, lineHeight: '150%', color: '#6B7280', opacity: 0.7 }}>
                Concursos:
              </span>
              <span className="font-bold" style={{ fontSize: 20, lineHeight: '150%', color: '#6B7280', textAlign: 'right' }}>
                {concursos}
              </span>
            </div>

            {/* Valor unitário */}
            <div className="flex items-baseline justify-between" style={{ alignSelf: 'stretch' }}>
              <span className="font-medium uppercase" style={{ fontSize: 16, lineHeight: '150%', color: '#6B7280', opacity: 0.7 }}>
                Valor unitário:
              </span>
              <span className="font-bold" style={{ fontSize: 20, lineHeight: '150%', color: '#6B7280', textAlign: 'right' }}>
                {brl(preco)}
              </span>
            </div>

            <Divider />

            {/* Total */}
            <div className="flex items-center justify-between" style={{ alignSelf: 'stretch' }}>
              <span className="font-semibold" style={{ fontSize: 24, lineHeight: '32px', color: '#00AB67' }}>
                Total:
              </span>
              <span className="font-bold" style={{ fontSize: 24, lineHeight: '32px', color: '#00AB67', textAlign: 'right' }}>
                {brl(total)}
              </span>
            </div>

            <Divider />

            {/* Botão: Adicionar Aposta */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={!enough}
              onClick={adicionarAposta}
              className="flex items-center justify-center font-semibold rounded-lg shrink-0 transition-opacity"
              style={{
                height: 64, gap: 16, padding: '0 24px',
                fontSize: 20, lineHeight: '20px', color: '#FFFFFF',
                backgroundColor: '#00AB67', borderRadius: 8,
                opacity: enough ? 1 : 0.4,
              }}
            >
              {isBolao ? (
                <Users style={{ width: 32, height: 32, flexShrink: 0 }} strokeWidth={2} />
              ) : (
                <ShoppingCart style={{ width: 32, height: 32, flexShrink: 0 }} strokeWidth={2} />
              )}
              {isBolao ? 'Definir Cotas' : 'Adicionar Aposta'}
            </motion.button>

            {/* Botão: Confirmar e Pagar */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={!enough}
              onClick={confirmarEPagar}
              className="flex items-center justify-center font-semibold rounded-lg shrink-0 transition-opacity"
              style={{
                height: 64, padding: '0 24px',
                fontSize: 20, lineHeight: '20px',
                color: enough ? '#FFFFFF' : '#9CA3AF',
                backgroundColor: enough ? '#005DA4' : '#D0E0E3',
                borderRadius: 8, opacity: enough ? 1 : 0.6,
              }}
            >
              {isBolao ? 'Definir Cotas' : 'Confirmar e Pagar'}
            </motion.button>
          </div>

          {/* Info card */}
          <div
            className="rounded-lg bg-white shrink-0"
            style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 24, borderRadius: 8 }}
          >
            {/* Concurso */}
            <div className="flex items-center" style={{ alignSelf: 'stretch' }}>
              <span style={{ fontSize: 24, lineHeight: '120%', color: '#6B7280' }}>
                Concurso <strong style={{ fontWeight: 700 }}>{m.concursoAtual}</strong>
              </span>
            </div>

            {/* Prêmio estimado */}
            <div className="flex flex-col">
              <span className="font-medium uppercase" style={{ fontSize: 16, lineHeight: '150%', color: '#6B7280', opacity: 0.7 }}>
                Prêmio estimado
              </span>
              <span className="font-bold" style={{ fontSize: 24, lineHeight: '120%', color: '#00AB67' }}>
                {brl(m.premioEstimado)}
              </span>
            </div>

            <Divider />

            {/* Encerramento */}
            <div className="flex flex-col">
              <span className="font-medium uppercase" style={{ fontSize: 16, lineHeight: '150%', color: '#6B7280', opacity: 0.7 }}>
                Encerramento das Apostas
              </span>
              <span className="font-bold" style={{ fontSize: 20, lineHeight: '150%', color: '#6B7280' }}>
                {m.proximoSorteio}
              </span>
            </div>

            <Divider />

            {/* Próximo concurso */}
            <div className="flex flex-col">
              <span className="font-medium uppercase" style={{ fontSize: 16, lineHeight: '150%', color: '#6B7280', opacity: 0.7 }}>
                Próximo Concurso
              </span>
              <span className="font-bold" style={{ fontSize: 20, lineHeight: '150%', color: '#6B7280' }}>
                {m.proximoSorteio}
              </span>
            </div>
          </div>

          </div>{/* fim dos cards scrolláveis */}
        </div>
      </div>
    </div>
  );
}
