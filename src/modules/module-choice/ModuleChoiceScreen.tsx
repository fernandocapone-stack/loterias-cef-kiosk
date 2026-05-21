import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useSession } from '../../store/sessionStore';
import { useLojaStore } from '../../store/lojaStore';
import CartClearWarningModal from '../../components/feedback/CartClearWarningModal';

/**
 * 2. Escolha o Serviço — Figma (194:238), canvas 1440×900.
 *
 * Layout:
 *  - Full screen bg #EFF5F9
 *  - Header: row, gap:24, padding:24
 *      Back 280×80 bg #004B8B  |  "Escolha o serviço" 44px SemiBold white  |  280×80 placeholder
 *  - Content: col, gap:32, padding: 24
 *      Row of 3 white tiles (fill×fill)
 *  - Acessibilidade: row at bottom
 *
 * Aviso de carrinho: ao trocar de módulo com itens no carrinho do outro módulo.
 */

type TargetModule = 'loja' | 'loterica';

interface PendingNav {
  path:   string;
  module: TargetModule;
}

export default function ModuleChoiceScreen() {
  const navigate       = useNavigate();
  const apostasCount   = useSession((s) => s.apostas.length);
  const resetSession   = useSession((s) => s.reset);
  const lojaCount      = useLojaStore((s) => s.totalItens());
  const clearLoja      = useLojaStore((s) => s.clear);

  const [pendingNav, setPendingNav] = useState<PendingNav | null>(null);

  /** Intercepta navegação — mostra aviso se o módulo de destino tem conflito de carrinho */
  const handleNavigate = (path: string, module: TargetModule) => {
    const hasConflict =
      (module === 'loja'     && apostasCount > 0) ||
      (module === 'loterica' && lojaCount    > 0);

    if (hasConflict) {
      setPendingNav({ path, module });
    } else {
      navigate(path);
    }
  };

  const confirmNav = () => {
    if (!pendingNav) return;
    if (pendingNav.module === 'loja')     resetSession();
    if (pendingNav.module === 'loterica') clearLoja();
    navigate(pendingNav.path);
    setPendingNav(null);
  };

  const tiles = [
    {
      title:    'Conveniência',
      desc:     'Produtos da Loja\nde Conveniência.',
      module:   'loja' as TargetModule,
      path:     '/loja',
      disabled: false,
      imagem:   '/images/servicos/conveniencia.png',
    },
    {
      title:    'Lotérica',
      desc:     'Apostas, pagamentos\ne recargas.',
      module:   'loterica' as TargetModule,
      path:     '/caixa/loterias',
      disabled: false,
      imagem:   '/images/servicos/loterica.png',
    },
    {
      title:    'Caixa',
      desc:     'Serviços e produtos\nda Caixa em Geral.',
      module:   null,
      path:     '/caixa',
      disabled: true,
      imagem:   '/images/servicos/caixa.png',
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
          onClick={() => navigate('/')}
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
          <span className="text-white font-semibold text-center" style={{ fontSize: 44, lineHeight: '120%' }}>
            Escolha o serviço
          </span>
        </div>

        <div style={{ width: 280, height: 80, flexShrink: 0 }} />
      </div>

      {/* ── Content ── */}
      <div
        className="flex flex-col flex-1"
        style={{ padding: 24, gap: 32 }}
      >
        {/* Tiles row */}
        <div className="flex flex-1" style={{ gap: 24 }}>
          {tiles.map((tile, idx) => (
            <motion.button
              key={tile.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.2 }}
              whileTap={tile.disabled ? {} : { scale: 0.985 }}
              disabled={tile.disabled}
              onClick={
                tile.disabled || !tile.module
                  ? undefined
                  : () => handleNavigate(tile.path, tile.module!)
              }
              className="flex-1 rounded-lg text-left"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 8,
                opacity: tile.disabled ? 0.5 : 1,
                cursor: tile.disabled ? 'default' : 'pointer',
                boxShadow: '0px 2px 4px rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'stretch',
                padding: '40px 24px',
                overflow: 'hidden',
              }}
            >
              {/* Zona da imagem — círculo + ilustração 3D */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {/* Círculo de fundo */}
                <div
                  style={{
                    position: 'absolute',
                    width: 262,
                    height: 262,
                    borderRadius: '50%',
                    backgroundColor: '#EFF5F9',
                  }}
                />
                {/* Ilustração 3D */}
                {tile.imagem && (
                  <img
                    src={tile.imagem}
                    alt=""
                    draggable={false}
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      pointerEvents: 'none',
                      userSelect: 'none',
                    }}
                  />
                )}
              </div>

              {/* Texto — parte inferior */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <span className="font-semibold" style={{ fontSize: 32, color: '#0066B3', lineHeight: '120%' }}>
                  {tile.title}
                </span>
                <span className="font-normal" style={{ fontSize: 24, color: '#6B7280', lineHeight: '150%' }}>
                  {tile.desc}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

      </div>

      {/* ── Modal de aviso de carrinho ── */}
      <AnimatePresence>
        {pendingNav && (
          <CartClearWarningModal
            targetModule={pendingNav.module}
            onConfirm={confirmNav}
            onCancel={() => setPendingNav(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
