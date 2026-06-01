import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { MODALIDADES } from '../data/modalidades';
import { brlCompact } from '../../../../utils/currency';
import { useSession } from '../../../../store/sessionStore';
import LotteryLogo from '../components/LotteryLogo';

/**
 * Fazer Apostas — Figma (250:1692), canvas 1440×900.
 *
 * Header: bg #0066B3, row gap:24 pad:24
 *   Back 200×80 (#004B8B) | "Fazer Apostas" 44px SemiBold branco | Cart 200×80 (#004B8B)
 *
 * Content: padding 16px 24px 24px, gap 24px
 *   5 colunas × ~259px — max 5 por linha, 2 linhas para 9 produtos
 *
 * Card 259px wide:
 *   col, gap:32, padding: 32px 24px, bg white, br:8, shadow
 *   - LotteryLogo 56px
 *   - Nome 28px SemiBold, cor
 *   - Concurso + data 16px Regular #6B7280
 *   - Chip prêmio 18px Bold, cor
 */
export default function ApostarTab() {
  const navigate  = useNavigate();
  const cartCount = useSession((s) => s.apostas.length);

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
        {/* Voltar */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/caixa/loterias')}
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

        {/* Título */}
        <div className="flex-1 flex items-center justify-center">
          <span className="font-semibold text-center" style={{ fontSize: 44, color: '#FFFFFF', lineHeight: '120%' }}>
            Fazer Apostas
          </span>
        </div>

        {/* Carrinho */}
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
          <ShoppingCart
            style={{ width: 40, height: 40, color: '#F39200', flexShrink: 0 }}
            strokeWidth={2}
          />
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

      {/* ── Grid 5 colunas ── */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ padding: 24 }}
      >
        <div className="flex flex-wrap" style={{ gap: 24 }}>
          {MODALIDADES.map((m, idx) => (
            <motion.button
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03, duration: 0.2 }}
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -4, boxShadow: '0px 6px 16px rgba(0,0,0,0.14)' }}
              onClick={() => navigate(`/caixa/aposta/${m.id}/tipo`)}
              className="text-left flex flex-col bg-white shrink-0"
              style={{
                width: 'calc((100% - 4 * 24px) / 5)',
                padding: '32px 24px',
                gap: 32,
                boxShadow: '0px 2px 2px 0px rgba(0,0,0,0.09)',
                borderRadius: 8,
              }}
            >
              {/* Símbolo */}
              <LotteryLogo modalidade={m} size={56} />

              {/* Nome + info */}
              <div className="flex flex-col" style={{ gap: 12, flex: 1 }}>
                <div
                  className="font-semibold leading-tight"
                  style={{ fontSize: 28, color: m.cor, fontWeight: 600 }}
                >
                  {m.nome}
                </div>
                <div className="flex flex-col" style={{ gap: 0 }}>
                  <span style={{ fontSize: 16, lineHeight: '150%', color: '#6B7280', fontWeight: 400 }}>
                    Concurso {m.concursoAtual}
                  </span>
                  <span style={{ fontSize: 16, lineHeight: '150%', color: '#6B7280', fontWeight: 400 }}>
                    {m.proximoSorteio}
                  </span>
                </div>
              </div>

              {/* Chip prêmio */}
              <div
                className="self-start font-bold"
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: m.cor,
                  backgroundColor: `${m.cor}33`,
                  padding: '4px 14px',
                  borderRadius: 8,
                  whiteSpace: 'nowrap',
                }}
              >
                {brlCompact(m.premioEstimado)}
              </div>
            </motion.button>
          ))}
        </div>
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}
