import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy } from 'lucide-react';
import { MODALIDADES, getModalidade } from '../data/modalidades';
import { brl, brlCompact } from '../../../../utils/currency';
import LotteryLogo from '../components/LotteryLogo';

/**
 * Resultados — 4-col grid with own header, same visual pattern as ApostarTab.
 * Clicking a card shows the ResultadoDetalhe view (no navigation change needed).
 */
export default function ResultadosTab() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const m = selected ? getModalidade(selected) : null;

  if (m) {
    return (
      <ResultadoDetalhe
        modalidadeId={selected!}
        onBack={() => setSelected(null)}
        onBackToHome={() => navigate('/caixa/loterias')}
      />
    );
  }

  return (
    <div
      className="h-full w-full flex flex-col overflow-hidden"
      style={{ backgroundColor: '#EFF5F9' }}
    >
      {/* ── Header azul ── */}
      <div className="flex items-center shrink-0" style={{ gap: 24, padding: 24, backgroundColor: '#0066B3' }}>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/caixa/loterias')}
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 280, height: 80, backgroundColor: '#004B8B', borderRadius: 8, gap: 8, padding: '12px 24px 12px 16px' }}
        >
          <ArrowLeft style={{ width: 48, height: 48, color: '#F39200', flexShrink: 0 }} strokeWidth={2} />
          <span className="text-white" style={{ fontSize: 20, fontWeight: 500 }}>Voltar</span>
        </motion.button>

        <div className="flex-1 flex items-center justify-center">
          <span className="font-semibold text-center" style={{ fontSize: 44, color: '#FFFFFF', lineHeight: '120%' }}>
            Ver Resultados
          </span>
        </div>

        <div style={{ width: 280, height: 80, flexShrink: 0 }} />
      </div>

      {/* ── 4-col grid ── */}
      <div className="flex-1 overflow-y-auto" style={{ padding: 24 }}>
        <div className="flex flex-wrap" style={{ gap: 24 }}>
          {MODALIDADES.map((mod, idx) => (
            <motion.button
              key={mod.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03, duration: 0.2 }}
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -4, boxShadow: '0px 6px 16px rgba(0,0,0,0.14)' }}
              onClick={() => setSelected(mod.id)}
              className="text-left flex flex-col bg-white shrink-0"
              style={{
                width: 330,
                padding: '40px 32px',
                gap: 40,
                boxShadow: '0px 2px 2px 0px rgba(0,0,0,0.09)',
                borderRadius: 8,
              }}
            >
              <LotteryLogo modalidade={mod} size={64} />

              <div className="flex flex-col" style={{ gap: 16, flex: 1 }}>
                <div className="font-semibold leading-tight" style={{ fontSize: 32, color: mod.cor, fontWeight: 600 }}>
                  {mod.nome}
                </div>
                <div className="flex flex-col" style={{ gap: 0 }}>
                  <span style={{ fontSize: 18, lineHeight: '150%', color: '#6B7280', fontWeight: 400 }}>
                    Concurso {mod.concursoAtual}
                  </span>
                  <span style={{ fontSize: 18, lineHeight: '150%', color: '#6B7280', fontWeight: 400 }}>
                    {mod.proximoSorteio}
                  </span>
                </div>
              </div>

              <div
                className="self-start font-bold"
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: mod.cor,
                  backgroundColor: `${mod.cor}33`,
                  padding: '4px 16px',
                  borderRadius: 8,
                  whiteSpace: 'nowrap',
                }}
              >
                {brlCompact(mod.premioEstimado)}
              </div>
            </motion.button>
          ))}
        </div>
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

/* ── Resultado detail view ── */
function ResultadoDetalhe({
  modalidadeId,
  onBack,
  onBackToHome,
}: {
  modalidadeId: string;
  onBack: () => void;
  onBackToHome: () => void;
}) {
  const m = getModalidade(modalidadeId)!;

  const sorteio = useMemo(() => {
    const nums: number[] = [];
    const seen = new Set<number>();
    let seed = modalidadeId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    while (nums.length < m.minNumeros) {
      seed = (seed * 1664525 + 1013904223) & 0x7fffffff;
      const n = 1 + (seed % m.totalNumeros);
      if (!seen.has(n)) { seen.add(n); nums.push(n); }
    }
    return nums.sort((a, b) => a - b);
  }, [modalidadeId, m.minNumeros, m.totalNumeros]);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden" style={{ backgroundColor: '#EFF5F9' }}>
      {/* Header */}
      <div className="flex items-center shrink-0" style={{ gap: 24, padding: 24 }}>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onBack}
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 280, height: 80, backgroundColor: '#004B8B', borderRadius: 8, gap: 8, padding: '12px 24px 12px 16px' }}
        >
          <ArrowLeft style={{ width: 48, height: 48, color: '#F39200', flexShrink: 0 }} strokeWidth={2} />
          <span className="text-white" style={{ fontSize: 20, fontWeight: 500 }}>Voltar</span>
        </motion.button>
        <div className="flex-1 flex items-center justify-center">
          <span className="font-semibold text-center" style={{ fontSize: 44, color: '#0066B3', lineHeight: '120%' }}>
            {m.nome}
          </span>
        </div>
        <div style={{ width: 280, height: 80, flexShrink: 0 }} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" style={{ padding: 24 }}>
        <div
          className="flex flex-col rounded-lg bg-white"
          style={{ padding: 32, gap: 40, boxShadow: '0px 2px 8px rgba(0,0,0,0.08)' }}
        >
          {/* Banner */}
          <div
            className="flex items-center rounded-lg"
            style={{ backgroundColor: m.cor, padding: 40, gap: 40 }}
          >
            <img src="/images/loterias-symbol-negative.svg" alt="" style={{ width: 56, height: 56, flexShrink: 0 }} draggable={false} />
            <div className="flex flex-col flex-1" style={{ gap: 4 }}>
              <span className="text-white font-normal uppercase tracking-wide" style={{ fontSize: 22, lineHeight: '150%' }}>
                Prêmio estimado próximo concurso
              </span>
              <span className="text-white font-bold" style={{ fontSize: 44, lineHeight: '120%' }}>
                {brl(m.premioEstimado)}
              </span>
            </div>
            <div style={{ width: 1, alignSelf: 'stretch', backgroundColor: 'rgba(0,75,139,0.5)' }} />
            <div className="flex flex-col" style={{ gap: 4 }}>
              <span className="text-white font-normal" style={{ fontSize: 18, lineHeight: '150%', opacity: 0.9 }}>
                Próximo sorteio
              </span>
              <span className="text-white font-bold" style={{ fontSize: 24, lineHeight: '150%' }}>
                {m.proximoSorteio}
              </span>
            </div>
          </div>

          {/* Sorteio */}
          <div className="flex flex-col" style={{ gap: 20 }}>
            <div className="flex items-center gap-3">
              <Trophy style={{ width: 28, height: 28, color: m.cor }} />
              <span className="font-semibold" style={{ fontSize: 32, color: m.cor, lineHeight: '120%' }}>
                Números sorteados
              </span>
            </div>
            <div
              className="rounded-lg flex flex-wrap"
              style={{ backgroundColor: '#FAF5E2', padding: 24, gap: 12 }}
            >
              {sorteio.map((n, i) => (
                <motion.div
                  key={n}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.07, type: 'spring', stiffness: 260, damping: 18 }}
                  className="flex items-center justify-center rounded-full text-white font-bold"
                  style={{
                    width: 88, height: 88,
                    backgroundColor: m.cor,
                    fontSize: 28,
                    boxShadow: `0 2px 8px ${m.cor}66`,
                  }}
                >
                  {String(n).padStart(2, '0')}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
