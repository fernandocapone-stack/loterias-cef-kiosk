import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Camera, RefreshCw, CheckCircle2, ScanLine } from 'lucide-react';
import { getModalidade, calcularPreco } from '../../data/modalidades';
import { useSession } from '../../../../../store/sessionStore';
import { useToastStore } from '../../../../../store/toastStore';
import { brl } from '../../../../../utils/currency';
import LotteryLogo from '../../components/LotteryLogo';

/**
 * Ler Caderneta — leitura simulada da caderneta física no totem.
 *
 * Três estágios internos:
 *   - 'capture'   : viewfinder + CTA "Capturar"
 *   - 'scanning'  : viewfinder com linha de scan animada (1.5s)
 *   - 'preview'   : números detectados + CTAs Refazer / Adicionar
 *
 * Simulação: ao capturar, gera uma surpresinha válida para a modalidade.
 * Não há câmera real nem OCR — apenas UX.
 */

const SCAN_DURATION_MS = 1500;

export default function LerCaderneta() {
  const { modalidade } = useParams<{ modalidade: string }>();
  const navigate       = useNavigate();
  const m              = getModalidade(modalidade ?? '');
  const addAposta      = useSession((s) => s.addAposta);
  const cartCount      = useSession((s) => s.apostas.length);
  const showToast      = useToastStore((s) => s.show);

  const [stage,   setStage]   = useState<'capture' | 'scanning' | 'preview'>('capture');
  const [numeros, setNumeros] = useState<number[]>([]);

  if (!m) return null;

  const valor = calcularPreco(m, m.minNumeros);

  const capturar = () => {
    setStage('scanning');
    window.setTimeout(() => {
      // Surpresinha: gera m.minNumeros números aleatórios distintos.
      const set = new Set<number>();
      while (set.size < m.minNumeros) {
        set.add(1 + Math.floor(Math.random() * m.totalNumeros));
      }
      setNumeros([...set].sort((a, b) => a - b));
      setStage('preview');
    }, SCAN_DURATION_MS);
  };

  const refazer = () => {
    setNumeros([]);
    setStage('capture');
  };

  const adicionar = () => {
    addAposta({
      id:             crypto.randomUUID(),
      modalidadeId:   m.id,
      modalidadeNome: m.nome,
      numeros,
      concursos:      1,
      teimosinha:     false,
      valor,
      addedAt:        Date.now(),
    });
    showToast('Aposta da caderneta adicionada ao carrinho!');
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
          <LotteryLogo modalidade={{ ...m, cor: '#FFFFFF' }} size={48} />
          <span className="font-semibold" style={{ fontSize: 44, color: '#FFFFFF', lineHeight: '120%' }}>
            {stage === 'preview' ? 'Conferir Leitura' : 'Ler Caderneta'} · {m.nome}
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
      <AnimatePresence mode="wait">
        {stage !== 'preview' ? (
          <CaptureView
            key="capture"
            cor={m.cor}
            scanning={stage === 'scanning'}
            onCapturar={capturar}
          />
        ) : (
          <PreviewView
            key="preview"
            m={m}
            numeros={numeros}
            valor={valor}
            onRefazer={refazer}
            onAdicionar={adicionar}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   CAPTURE VIEW — viewfinder + scan line
   ────────────────────────────────────────────────────────────────────────── */
function CaptureView({
  cor, scanning, onCapturar,
}: {
  cor: string;
  scanning: boolean;
  onCapturar: () => void;
}) {
  const VIEWFINDER_W = 720;
  const VIEWFINDER_H = 460;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex-1 flex flex-col items-center justify-center"
      style={{ padding: 24, gap: 32 }}
    >
      {/* Instrução */}
      <div className="flex flex-col items-center text-center" style={{ gap: 12, maxWidth: 720 }}>
        <span style={{ fontSize: 32, fontWeight: 600, color: '#005DA4', lineHeight: '120%' }}>
          {scanning ? 'Lendo caderneta…' : 'Posicione a caderneta'}
        </span>
        <span style={{ fontSize: 20, fontWeight: 400, color: '#6B7280', lineHeight: '150%' }}>
          {scanning
            ? 'Mantenha a caderneta parada enquanto reconhecemos os números.'
            : 'Encaixe sua caderneta dentro da área marcada e pressione Capturar.'}
        </span>
      </div>

      {/* Viewfinder */}
      <div
        style={{
          position: 'relative',
          width: VIEWFINDER_W,
          height: VIEWFINDER_H,
          backgroundColor: '#1F2937',
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        {/* Camera placeholder pattern — gradiente sutil para parecer feed escuro */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, #2A3848 0%, #111827 100%)',
          }}
        />

        {/* Ícone central — desaparece durante scan */}
        {!scanning && (
          <div
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 16,
            }}
          >
            <Camera style={{ width: 96, height: 96, color: 'rgba(255,255,255,0.25)' }} strokeWidth={1.25} />
            <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
              Caderneta física da {/* color name visual */}
            </span>
          </div>
        )}

        {/* Cantos do viewfinder — 4 brackets */}
        <CornerBrackets cor={cor} />

        {/* Linha de scan — só durante 'scanning' */}
        {scanning && (
          <motion.div
            initial={{ top: 0 }}
            animate={{ top: VIEWFINDER_H - 4 }}
            transition={{ duration: SCAN_DURATION_MS / 1000, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              left: 0, right: 0,
              height: 4,
              background: `linear-gradient(90deg, transparent 0%, ${cor} 50%, transparent 100%)`,
              boxShadow: `0 0 24px 4px ${cor}AA`,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Halo sutil durante scan */}
        {scanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{
              position: 'absolute', inset: 0,
              background: `radial-gradient(ellipse at center, ${cor}33 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {/* CTA Capturar */}
      <motion.button
        whileTap={scanning ? {} : { scale: 0.97 }}
        disabled={scanning}
        onClick={onCapturar}
        className="flex items-center justify-center font-semibold rounded-lg"
        style={{
          height: 80, gap: 16, padding: '0 48px',
          fontSize: 20, color: '#FFFFFF',
          backgroundColor: scanning ? '#9CA3AF' : '#00AB67',
          borderRadius: 8,
          minWidth: 320,
          opacity: scanning ? 0.7 : 1,
          transition: 'background-color 0.2s, opacity 0.2s',
        }}
      >
        {scanning ? (
          <>
            <ScanLine style={{ width: 32, height: 32 }} strokeWidth={2} />
            Lendo…
          </>
        ) : (
          <>
            <Camera style={{ width: 32, height: 32 }} strokeWidth={2} />
            Capturar
          </>
        )}
      </motion.button>
    </motion.div>
  );
}

/* Brackets dos 4 cantos do viewfinder */
function CornerBrackets({ cor }: { cor: string }) {
  const L = 48;       // tamanho do braço
  const T = 4;        // espessura
  const corner = (vert: 'top' | 'bottom', horiz: 'left' | 'right'): React.CSSProperties => ({
    position: 'absolute',
    width: L, height: L,
    [vert]: 16,
    [horiz]: 16,
    [`border${vert === 'top' ? 'Top' : 'Bottom'}`]: `${T}px solid ${cor}`,
    [`border${horiz === 'left' ? 'Left' : 'Right'}`]: `${T}px solid ${cor}`,
    borderRadius:
      vert === 'top' && horiz === 'left'  ? '8px 0 0 0' :
      vert === 'top' && horiz === 'right' ? '0 8px 0 0' :
      vert === 'bottom' && horiz === 'left'  ? '0 0 0 8px' :
                                               '0 0 8px 0',
  } as React.CSSProperties);

  return (
    <>
      <div style={corner('top', 'left')} />
      <div style={corner('top', 'right')} />
      <div style={corner('bottom', 'left')} />
      <div style={corner('bottom', 'right')} />
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   PREVIEW VIEW — números detectados + ações
   ────────────────────────────────────────────────────────────────────────── */
function PreviewView({
  m, numeros, valor, onRefazer, onAdicionar,
}: {
  m: ReturnType<typeof getModalidade> & {};
  numeros: number[];
  valor: number;
  onRefazer: () => void;
  onAdicionar: () => void;
}) {
  if (!m) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-1 overflow-hidden"
      style={{ gap: 24, padding: 24 }}
    >
      {/* Esquerda — números detectados */}
      <div className="flex flex-col overflow-y-auto" style={{ flex: 3, gap: 16, minWidth: 0 }}>
        <div className="bg-white rounded-lg" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="flex items-center" style={{ gap: 12 }}>
            <CheckCircle2 style={{ width: 32, height: 32, color: '#00AB67' }} strokeWidth={2} />
            <span style={{ fontSize: 28, fontWeight: 600, color: '#005DA4', lineHeight: '120%' }}>
              Leitura concluída
            </span>
          </div>
          <span style={{ fontSize: 18, fontWeight: 400, color: '#6B7280', lineHeight: '150%' }}>
            Confira os números detectados na sua caderneta antes de adicionar ao carrinho.
          </span>
        </div>

        <div className="bg-white rounded-lg" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={{ fontSize: 20, fontWeight: 600, color: '#005DA4' }}>
            Números detectados ({numeros.length})
          </span>
          <div
            className="rounded-lg"
            style={{ backgroundColor: '#FFFAE3', padding: 24, display: 'flex', flexWrap: 'wrap', gap: 16 }}
          >
            {numeros.map((n) => (
              <NumberPill key={n} n={n} cor={m.cor} />
            ))}
          </div>
        </div>
      </div>

      {/* Direita — resumo + CTAs */}
      <div className="flex flex-col" style={{ flex: 1, gap: 16, minWidth: 0, overflowY: 'auto' }}>
        <div className="rounded-lg bg-white" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={{ fontSize: 24, fontWeight: 600, color: '#00AB67', lineHeight: '32px' }}>
            Resumo
          </span>

          <Row label="Modalidade" value={m.nome} />
          <Row label="Concurso"   value={String(m.concursoAtual)} />
          <Row label="Números"    value={`${numeros.length} dezenas`} />

          <Divider />

          <div className="flex items-center justify-between">
            <span style={{ fontSize: 24, fontWeight: 600, color: '#00AB67' }}>Total</span>
            <span style={{ fontSize: 24, fontWeight: 700, color: '#00AB67', fontVariantNumeric: 'tabular-nums' }}>
              {brl(valor)}
            </span>
          </div>

          <Divider />

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onAdicionar}
            className="flex items-center justify-center font-semibold rounded-lg shrink-0"
            style={{
              height: 80, gap: 16, padding: '0 24px',
              fontSize: 20, color: '#FFFFFF',
              backgroundColor: '#00AB67', borderRadius: 8,
            }}
          >
            <ShoppingCart style={{ width: 28, height: 28 }} strokeWidth={2} />
            Adicionar ao Carrinho
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onRefazer}
            className="flex items-center justify-center font-semibold rounded-lg shrink-0"
            style={{
              height: 80, gap: 16, padding: '0 24px',
              fontSize: 20, color: '#005DA4',
              backgroundColor: '#FFFFFF',
              border: '2px solid #D0E0E3',
              borderRadius: 8,
            }}
          >
            <RefreshCw style={{ width: 28, height: 28 }} strokeWidth={2} />
            Refazer Leitura
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── helpers visuais ──────────────────────────────────────────────────── */
function NumberPill({ n, cor }: { n: number; cor: string }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: 72, height: 72,
        borderRadius: '50%',
        backgroundColor: cor,
        color: '#FFFFFF',
        fontSize: 28, fontWeight: 700,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {String(n).padStart(2, '0')}
    </div>
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
