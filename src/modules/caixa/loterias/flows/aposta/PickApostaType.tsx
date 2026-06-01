import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { getModalidade } from '../../data/modalidades';
import { useSession } from '../../../../../store/sessionStore';
import LotteryLogo from '../../components/LotteryLogo';

/**
 * Escolha do tipo de aposta — etapa intermediária entre seleção de
 * modalidade (ApostarTab) e seleção de números (PickNumbers).
 *
 * Duas opções: Aposta Individual e Bolão.
 * Layout: header azul #0066B3 (mesmo padrão do ApostarTab/PickNumbers) +
 * dois cards grandes lado a lado no corpo. Reservar espaço para a futura
 * 3ª opção "Ler caderneta" (Fase 2).
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

  const options = [
    {
      id: 'individual',
      title: 'Aposta Individual',
      desc: 'Você joga sozinho e o comprovante fica em seu nome.',
      onClick: goIndividual,
    },
    {
      id: 'bolao',
      title: 'Bolão',
      desc: 'Divida a aposta em cotas com mais pessoas.',
      onClick: goBolao,
    },
  ];

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

        <div className="flex-1 flex items-center justify-center" style={{ gap: 24 }}>
          <LotteryLogo modalidade={{ ...m, cor: '#FFFFFF' }} size={48} />
          <span className="font-semibold" style={{ fontSize: 44, color: '#FFFFFF', lineHeight: '120%' }}>
            {m.nome}
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
      <div
        className="flex-1 flex flex-col overflow-y-auto"
        style={{ padding: 24, gap: 24 }}
      >
        <div className="flex flex-col" style={{ gap: 8 }}>
          <span style={{ fontSize: 32, fontWeight: 600, color: '#005DA4', lineHeight: '120%' }}>
            Como você quer apostar?
          </span>
          <span style={{ fontSize: 20, fontWeight: 400, color: '#6B7280', lineHeight: '150%' }}>
            Escolha entre uma aposta individual ou um bolão dividido em cotas.
          </span>
        </div>

        <div className="flex flex-1" style={{ gap: 24 }}>
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
                padding: '40px 32px',
                borderRadius: 8,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'stretch',
                gap: 32,
                boxShadow: '0px 2px 2px 0px rgba(0,0,0,0.09)',
              }}
            >
              {/* Zona do círculo (placeholder até receber a ilustração final) */}
              <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 260 }}>
                <div style={{ width: 262, height: 262, borderRadius: '50%', backgroundColor: '#EFF5F9' }} />
              </div>

              {/* Texto */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span className="font-semibold" style={{ fontSize: 32, color: '#0066B3', lineHeight: '120%' }}>
                  {opt.title}
                </span>
                <span className="font-normal" style={{ fontSize: 20, color: '#6B7280', lineHeight: '150%' }}>
                  {opt.desc}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
