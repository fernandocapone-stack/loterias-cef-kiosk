import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingCart, ScanLine, Plus, Minus, X, ArrowRight, PackageSearch } from 'lucide-react';
import { useLojaStore } from '../../store/lojaStore';
import { produtos } from './data/produtos';
import { brl } from '../../utils/currency';

/**
 * 3.B Loja — Escanear produtos.
 *
 * Layout 2 colunas:
 *   ESQUERDA — lista cumulativa de produtos escaneados (flex: 1, ocupa a maior parte)
 *   DIREITA  — viewfinder compacto + botão "Simular leitura" (largura fixa)
 *
 * Cada "leitura" sorteia um produto aleatório do catálogo e adiciona ao
 * lojaStore (mesmo carrinho usado pela navegação por Categorias).
 *
 * Finalizar → /loja/carrinho (segue o checkout existente).
 * Cancelar  → /loja (volta para Conveniência, mantém o carrinho intacto).
 */

const VIEWFINDER_W = 380;
const VIEWFINDER_H = 260;
const ACCENT = '#F39200';

export default function EscanearProdutoScreen() {
  const navigate    = useNavigate();
  const itens       = useLojaStore((s) => s.itens);
  const addItem     = useLojaStore((s) => s.addItem);
  const setQtd      = useLojaStore((s) => s.setQuantidade);
  const removeItem  = useLojaStore((s) => s.removeItem);
  const totalItens  = useLojaStore((s) => s.totalItens());
  const totalValor  = useLojaStore((s) => s.totalValor());

  const [ultimoLido, setUltimoLido] = useState<string | null>(null);

  const simularLeitura = () => {
    const p = produtos[Math.floor(Math.random() * produtos.length)];
    addItem({ id: p.id, nome: p.nome, codigo: p.codigo, preco: p.preco, categoriaId: p.categoriaId });
    setUltimoLido(p.id);
    window.setTimeout(() => setUltimoLido((cur) => (cur === p.id ? null : cur)), 600);
  };

  const finalizar = () => {
    if (totalItens === 0) return;
    navigate('/loja/carrinho');
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden" style={{ backgroundColor: '#EFF5F9' }}>

      {/* ── Header ── */}
      <div className="flex items-center shrink-0" style={{ gap: 24, padding: 24, backgroundColor: '#0066B3' }}>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/loja')}
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 280, height: 80, backgroundColor: '#004B8B', borderRadius: 8, gap: 8, padding: '12px 24px 12px 16px' }}
        >
          <ArrowLeft style={{ width: 48, height: 48, color: '#F39200', flexShrink: 0 }} strokeWidth={2} />
          <span className="text-white" style={{ fontSize: 20, fontWeight: 500, lineHeight: '120%' }}>Voltar</span>
        </motion.button>

        <div className="flex-1 flex items-center justify-center">
          <span className="font-semibold text-center" style={{ fontSize: 44, color: '#FFFFFF', lineHeight: '120%' }}>
            Escanear produtos
          </span>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/loja/carrinho')}
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 280, height: 80, backgroundColor: '#004B8B', borderRadius: 8, gap: 16, padding: '0 24px' }}
        >
          <ShoppingCart style={{ width: 40, height: 40, color: '#F39200', flexShrink: 0 }} strokeWidth={2} />
          <span className="font-semibold text-white" style={{ fontSize: 20 }}>Carrinho</span>
          {totalItens > 0 && (
            <span
              className="flex items-center justify-center rounded-full font-bold text-white shrink-0"
              style={{ width: 28, height: 28, fontSize: 13, backgroundColor: '#F39200' }}
            >
              {totalItens}
            </span>
          )}
        </motion.button>
      </div>

      {/* ── Body — 2 colunas ── */}
      <div className="flex flex-1 overflow-hidden" style={{ gap: 24, padding: 24 }}>

        {/* Coluna esquerda — lista cumulativa + finalizar (ocupa a maior parte) */}
        <div
          className="flex flex-col"
          style={{
            flex: 1,
            minWidth: 0,
            backgroundColor: '#FFFFFF',
            borderRadius: 8,
            overflow: 'hidden',
            boxShadow: '0px 2px 4px rgba(0,0,0,0.06)',
          }}
        >
          {/* Header da lista */}
          <div className="flex items-baseline justify-between shrink-0" style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: '#0066B3' }}>
              Produtos lidos
            </span>
            <span style={{ fontSize: 17, fontWeight: 600, color: '#6B7280' }}>
              {totalItens} {totalItens === 1 ? 'item' : 'itens'}
            </span>
          </div>

          {/* Lista rolável */}
          <div className="flex-1 overflow-y-auto" style={{ padding: '8px 16px' }}>
            {itens.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center" style={{ gap: 12, padding: 24 }}>
                <ShoppingCart style={{ width: 64, height: 64, color: '#D1D5DB' }} strokeWidth={1.5} />
                <span style={{ fontSize: 18, color: '#9CA3AF', fontWeight: 500, textAlign: 'center' }}>
                  Nenhum produto lido ainda.
                </span>
                <span style={{ fontSize: 15, color: '#D1D5DB', textAlign: 'center' }}>
                  Aponte o produto para o leitor ao lado.
                </span>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {itens.map((it) => {
                  const piscando = ultimoLido === it.id;
                  return (
                    <motion.div
                      key={it.id}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{
                        opacity: 1, y: 0,
                        backgroundColor: piscando ? 'rgba(0,171,103,0.12)' : 'rgba(0,0,0,0)',
                      }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.18 }}
                      style={{
                        padding: '14px 12px',
                        borderRadius: 8,
                        display: 'flex', alignItems: 'center', gap: 16,
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 17, fontWeight: 600, color: '#374151',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {it.nome}
                        </div>
                        <div style={{ fontSize: 14, color: '#6B7280', fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>
                          {brl(it.preco)} · subtotal <strong style={{ color: '#374151', fontWeight: 700 }}>{brl(it.preco * it.quantidade)}</strong>
                        </div>
                      </div>

                      {/* Stepper qty */}
                      <div className="flex items-center" style={{ gap: 6 }}>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setQtd(it.id, it.quantidade - 1)}
                          style={{
                            width: 36, height: 36, borderRadius: 6,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: '#EFF5F9', border: 'none', color: '#0066B3',
                          }}
                        >
                          <Minus style={{ width: 18, height: 18 }} strokeWidth={2.5} />
                        </motion.button>
                        <span style={{
                          minWidth: 32, textAlign: 'center',
                          fontSize: 18, fontWeight: 700, color: '#374151',
                          fontVariantNumeric: 'tabular-nums',
                        }}>
                          {it.quantidade}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setQtd(it.id, it.quantidade + 1)}
                          style={{
                            width: 36, height: 36, borderRadius: 6,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: '#EFF5F9', border: 'none', color: '#0066B3',
                          }}
                        >
                          <Plus style={{ width: 18, height: 18 }} strokeWidth={2.5} />
                        </motion.button>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeItem(it.id)}
                        style={{
                          width: 32, height: 32, borderRadius: 999,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          backgroundColor: 'transparent', border: 'none', color: '#9CA3AF',
                        }}
                      >
                        <X style={{ width: 18, height: 18 }} strokeWidth={2} />
                      </motion.button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>

          {/* Rodapé — subtotal + CTAs fixos */}
          <div style={{ padding: 20, borderTop: '1px solid rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="flex items-baseline justify-between">
              <span style={{ fontSize: 20, fontWeight: 600, color: '#6B7280' }}>Subtotal</span>
              <span style={{
                fontSize: 32, fontWeight: 700, color: '#00AB67',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {brl(totalValor)}
              </span>
            </div>

            <motion.button
              whileTap={totalItens > 0 ? { scale: 0.97 } : {}}
              disabled={totalItens === 0}
              onClick={finalizar}
              className="flex items-center justify-center font-semibold rounded-lg"
              style={{
                height: 80, gap: 12, padding: '0 24px',
                fontSize: 20, color: '#FFFFFF',
                backgroundColor: totalItens > 0 ? '#00AB67' : '#D0E0E3',
                borderRadius: 8,
                transition: 'background-color 0.25s',
              }}
            >
              Finalizar compra
              <ArrowRight style={{ width: 28, height: 28 }} strokeWidth={2} />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/loja')}
              className="flex items-center justify-center font-semibold rounded-lg"
              style={{
                height: 64, padding: '0 24px',
                fontSize: 18, color: '#6B7280',
                backgroundColor: '#FFFFFF',
                border: '2px solid #D0E0E3',
                borderRadius: 8,
              }}
            >
              Voltar à conveniência
            </motion.button>
          </div>
        </div>

        {/* Coluna direita — viewfinder compacto + CTA simular */}
        <div
          className="flex flex-col items-center justify-center"
          style={{
            width: VIEWFINDER_W + 40,
            flexShrink: 0,
            gap: 20,
          }}
        >
          <div className="flex flex-col items-center text-center" style={{ gap: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 600, color: '#005DA4', lineHeight: '120%' }}>
              Aponte o código de barras
            </span>
            <span style={{ fontSize: 15, fontWeight: 400, color: '#6B7280', lineHeight: '150%' }}>
              Mantenha o produto dentro da área marcada.
            </span>
          </div>

          {/* Viewfinder compacto */}
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
            <div
              style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse at center, #2A3848 0%, #111827 100%)',
              }}
            />

            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 12,
            }}>
              <PackageSearch style={{ width: 64, height: 64, color: 'rgba(255,255,255,0.25)' }} strokeWidth={1.25} />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                Produto / código de barras
              </span>
            </div>

            <CornerBrackets cor={ACCENT} />

            {/* Linha de scan em loop contínuo */}
            <motion.div
              animate={{ top: [0, VIEWFINDER_H - 4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                left: 0, right: 0,
                height: 4,
                background: `linear-gradient(90deg, transparent 0%, ${ACCENT} 50%, transparent 100%)`,
                boxShadow: `0 0 24px 4px ${ACCENT}AA`,
                pointerEvents: 'none',
              }}
            />
            <motion.div
              animate={{ opacity: [0, 0.15, 0] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              style={{
                position: 'absolute', inset: 0,
                background: `radial-gradient(ellipse at center, ${ACCENT}33 0%, transparent 70%)`,
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Simular leitura */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={simularLeitura}
            className="flex items-center justify-center font-semibold rounded-lg"
            style={{
              height: 80, gap: 16, padding: '0 40px',
              fontSize: 20, color: '#FFFFFF',
              backgroundColor: '#00AB67',
              borderRadius: 8,
              width: '100%',
            }}
          >
            <ScanLine style={{ width: 28, height: 28 }} strokeWidth={2} />
            Simular leitura
          </motion.button>
        </div>
      </div>
    </div>
  );
}

/* Brackets dos 4 cantos do viewfinder */
function CornerBrackets({ cor }: { cor: string }) {
  const L = 40;
  const T = 4;
  const corner = (vert: 'top' | 'bottom', horiz: 'left' | 'right'): React.CSSProperties => ({
    position: 'absolute',
    width: L, height: L,
    [vert]: 12,
    [horiz]: 12,
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
