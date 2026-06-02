import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { getModalidade } from '../../data/modalidades';
import { useSession } from '../../../../../store/sessionStore';

/**
 * 4. Lotérica — Escolha o tipo de aposta — Figma (578:847), canvas 1440×900.
 *
 * Header: bg #0066B3 — Voltar 280×80 | "Escolha o tipo de aposta" 44px | Carrinho 280×80
 *   (padronizado em 280 conforme demais headers do projeto; Figma usa 200)
 *
 * Body: row gap:24 padding:24
 *   3 cards stretch (Individual / Bolão / Ler Caderneta)
 *   Cada card: col padding 40px 24px, bg white, br:8
 *     - Zona da imagem (flex 1) — círculo #EFF5F9 262×262 + ilustração 3D
 *     - Bloco texto (col gap:16):
 *         · Título 32px SemiBold #0066B3
 *         · Descrição 24px Regular #6B7280
 */
export default function PickApostaType() {
  const { modalidade } = useParams<{ modalidade: string }>();
  const navigate       = useNavigate();
  const m              = getModalidade(modalidade ?? '');
  const cartCount      = useSession((s) => s.apostas.length);

  if (!m) return null;

  const goIndividual = () =>
    navigate(`/caixa/aposta/${m.id}/numeros`);

  const goBolao = () =>
    navigate(`/caixa/aposta/${m.id}/numeros`, { state: { bolao: true } });

  const goCaderneta = () =>
    navigate(`/caixa/aposta/${m.id}/caderneta`);

  const options = [
    {
      id: 'individual',
      title: 'Aposta Individual',
      desc: 'Você joga sozinho e o comprovante fica no seu nome.',
      imagem: '/images/servicos/loterica-aposta-individual-1680d4.png',
      onClick: goIndividual,
    },
    {
      id: 'bolao',
      title: 'Bolão',
      desc: 'Divida a aposta em cotas com mais pessoas.',
      imagem: '/images/servicos/loterica-aposta-bolao-4a893f.png',
      onClick: goBolao,
    },
    {
      id: 'caderneta',
      title: 'Ler Caderneta',
      desc: 'Use a câmera do totem para ler a sua caderneta física.',
      imagem: '/images/servicos/loterica-aposta-caderneta-306443.png',
      onClick: goCaderneta,
    },
  ];

  return (
    <div
      className="h-full w-full flex flex-col overflow-hidden"
      style={{ backgroundColor: '#EFF5F9' }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center shrink-0"
        style={{ gap: 24, padding: 24, backgroundColor: '#0066B3' }}
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/caixa/loterias/apostar')}
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

        <div className="flex-1 flex items-center justify-center">
          <span className="font-semibold text-center" style={{ fontSize: 44, color: '#FFFFFF', lineHeight: '120%' }}>
            Escolha o tipo de aposta
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

      {/* ── Body — 3 cards lado a lado ── */}
      <div
        className="flex flex-1 overflow-hidden"
        style={{ padding: 24, gap: 24 }}
      >
        {options.map((opt, idx) => (
          <motion.button
            key={opt.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.2 }}
            whileTap={{ scale: 0.985 }}
            whileHover={{ y: -4, boxShadow: '0px 6px 16px rgba(0,0,0,0.14)' }}
            onClick={opt.onClick}
            className="flex-1 rounded-lg text-left bg-white"
            style={{
              padding: '40px 24px',
              borderRadius: 8,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'stretch',
              overflow: 'hidden',
              boxShadow: '0px 2px 2px 0px rgba(0,0,0,0.09)',
            }}
          >
            {/* Zona da imagem — círculo + ilustração 3D (mesmo padrão do LotericaHome) */}
            <div
              style={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: 262,
                  height: 262,
                  borderRadius: '50%',
                  backgroundColor: '#EFF5F9',
                }}
              />
              <img
                src={opt.imagem}
                alt=""
                draggable={false}
                style={{
                  position: 'relative',
                  width: 320,
                  height: 320,
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              />
            </div>

            {/* Texto */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 32 }}>
              <span className="font-semibold" style={{ fontSize: 32, color: '#0066B3', lineHeight: '120%' }}>
                {opt.title}
              </span>
              <span className="font-normal" style={{ fontSize: 24, color: '#6B7280', lineHeight: '150%' }}>
                {opt.desc}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
