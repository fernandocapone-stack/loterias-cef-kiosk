import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import {
  BoletoLookup,
  formatBoleto,
  formatDate,
  lookupBoleto,
} from '../../../../../utils/boleto';
import { brl } from '../../../../../utils/currency';
import { useSession } from '../../../../../store/sessionStore';

/**
 * Confirmação de boleto — Figma (306:2309), canvas 1440×900.
 *
 * Layout (sem sidebar):
 *  Header: bg #0066B3 — Voltar 200×80 | título dinâmico | placeholder 200×80
 *  Body: col, items-center, gap 24, padding 56 24
 *    Card 1 684px: "Código de barras" + display do código formatado
 *    Card 2 684px (border #D0E0E3): logo 80×80 + cedente + CNPJ
 *                                    divider
 *                                    descrição + vencimento
 *                                    divider
 *                                    valores (original / multa / juros) + Total verde
 *    Botão "Escolher forma de Pagamento" 684×80 #00AB67
 *    Acessibilidade no rodapé
 */
export default function BoletoConfirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const setPendingOperation = useSession((s) => s.setPendingOperation);

  const state  = location.state as { code?: string; source?: string } | null;
  const code   = state?.code   ?? '';
  const source = state?.source ?? 'digitar'; // 'digitar' | 'scan'

  const [loading, setLoading] = useState(true);
  const [data, setData]       = useState<BoletoLookup | null>(null);

  const backRoute   = source === 'scan' ? '/caixa/conta/escanear' : '/caixa/conta/digitar';
  const headerTitle = source === 'scan' ? 'Escanear o código de barras' : 'Digite o código';

  const goToPayment = () => {
    if (!data) return;
    setPendingOperation({
      type: 'boleto',
      total: data.total,
      boleto: {
        cedente:       data.cedente,
        cnpj:          data.cnpj,
        descricao:     data.descricao,
        vencimentoIso: data.vencimento.toISOString(),
        valorOriginal: data.valorOriginal,
        multa:         data.multa,
        juros:         data.juros,
        total:         data.total,
        vencido:       data.vencido,
        diasVencido:   data.diasVencido,
        tipo:          data.tipo,
        linhaDigitavel: data.linhaDigitavel,
      },
    });
    navigate('/checkout/pagamento', { state: { valor: data.total, source: 'boleto' } });
  };

  useEffect(() => {
    if (!code) {
      navigate('/caixa/conta/digitar', { replace: true });
      return;
    }
    const t = window.setTimeout(() => {
      setData(lookupBoleto(code));
      setLoading(false);
    }, 1100);
    return () => clearTimeout(t);
  }, [code, navigate]);

  /* ── Loading state ── */
  if (loading || !data) {
    return (
      <div className="flex flex-col h-full w-full" style={{ backgroundColor: '#EFF5F9' }}>
        <div className="flex items-center shrink-0" style={{ gap: 24, padding: 24, backgroundColor: '#0066B3' }}>
          <div style={{ width: 280, height: 80, flexShrink: 0 }} />
          <div className="flex-1 flex items-center justify-center">
            <span className="font-semibold text-center" style={{ fontSize: 44, color: '#FFFFFF', lineHeight: '120%' }}>
              {headerTitle}
            </span>
          </div>
          <div style={{ width: 280, height: 80, flexShrink: 0 }} />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center" style={{ gap: 24 }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
            <Loader2 style={{ width: 64, height: 64, color: '#0066B3' }} strokeWidth={1.5} />
          </motion.div>
          <span style={{ fontSize: 24, fontWeight: 500, color: '#364153' }}>Buscando informações...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full" style={{ backgroundColor: '#EFF5F9' }}>

      {/* ── Header ── */}
      <div
        className="flex items-center shrink-0"
        style={{ gap: 24, padding: 24, backgroundColor: '#0066B3' }}
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate(backRoute)}
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 280, height: 80, backgroundColor: '#004B8B', borderRadius: 8, gap: 8, padding: '12px 24px 12px 16px' }}
        >
          <ArrowLeft style={{ width: 48, height: 48, color: '#F39200', flexShrink: 0 }} strokeWidth={2} />
          <span className="text-white" style={{ fontSize: 20, fontWeight: 500, lineHeight: '120%' }}>Voltar</span>
        </motion.button>

        <div className="flex-1 flex items-center justify-center">
          <span className="font-semibold text-center" style={{ fontSize: 44, color: '#FFFFFF', lineHeight: '120%' }}>
            {headerTitle}
          </span>
        </div>

        <div style={{ width: 280, height: 80, flexShrink: 0 }} />
      </div>

      {/* ── Body ── */}
      <div
        className="flex-1 overflow-y-auto flex flex-col items-center"
        style={{ gap: 24, padding: '56px 24px' }}
      >

        {/* Card 1 — Código de barras */}
        <div
          style={{
            width: 684,
            backgroundColor: '#FFFFFF',
            borderRadius: 8,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <span style={{ fontSize: 24, fontWeight: 600, color: '#0066B3' }}>Código de barras</span>
          <div
            style={{
              padding: '20px 24px',
              backgroundColor: '#EFF5F9',
              border: '1px solid #D0E0E3',
              borderRadius: 8,
            }}
          >
            <span style={{
              fontSize: 20,
              fontWeight: 400,
              lineHeight: '28px',
              color: '#364153',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.02em',
              wordBreak: 'break-all',
              display: 'block',
            }}>
              {formatBoleto(data.linhaDigitavel)}
            </span>
          </div>
        </div>

        {/* Card 2 — Dados do boleto */}
        <div
          style={{
            width: 684,
            backgroundColor: '#FFFFFF',
            border: '1px solid #D0E0E3',
            borderRadius: 8,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* Cedente */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 80, height: 80, borderRadius: 8, flexShrink: 0,
              backgroundColor: '#EFF5F9',
              border: '1px solid #D0E0E3',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: '#0066B3' }}>
                {data.cedente.charAt(0)}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
              <span style={{ fontSize: 22, fontWeight: 600, color: '#364153', lineHeight: '120%' }}>
                {data.cedente}
              </span>
              <span style={{ fontSize: 18, fontWeight: 400, color: '#6B7280' }}>
                CNPJ {data.cnpj}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, backgroundColor: '#D0E0E3', alignSelf: 'stretch' }} />

          {/* Descrição + Vencimento */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16 }}>
              <span style={{ fontSize: 18, color: '#6B7280', flexShrink: 0 }}>Descrição</span>
              <span style={{ fontSize: 18, fontWeight: 500, color: '#364153', textAlign: 'right' }}>
                {data.descricao}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16 }}>
              <span style={{ fontSize: 18, color: '#6B7280', flexShrink: 0 }}>Vencimento</span>
              <span style={{
                fontSize: 18, fontWeight: 500, textAlign: 'right',
                color: data.vencido ? '#ED1C24' : '#364153',
              }}>
                {formatDate(data.vencimento)}
                {data.vencido && (
                  <span style={{ fontSize: 16, color: '#ED1C24', display: 'block' }}>
                    Vencido há {data.diasVencido} {data.diasVencido === 1 ? 'dia' : 'dias'}
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, backgroundColor: '#D0E0E3', alignSelf: 'stretch' }} />

          {/* Valores */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 18, color: '#6B7280' }}>Valor original</span>
              <span style={{ fontSize: 18, fontWeight: 500, color: '#364153', fontVariantNumeric: 'tabular-nums' }}>
                {brl(data.valorOriginal)}
              </span>
            </div>
            {data.multa > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 18, color: '#6B7280' }}>Multa (2%)</span>
                <span style={{ fontSize: 18, fontWeight: 500, color: '#ED1C24', fontVariantNumeric: 'tabular-nums' }}>
                  + {brl(data.multa)}
                </span>
              </div>
            )}
            {data.juros > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 18, color: '#6B7280' }}>
                  Juros ({data.diasVencido} {data.diasVencido === 1 ? 'dia' : 'dias'})
                </span>
                <span style={{ fontSize: 18, fontWeight: 500, color: '#ED1C24', fontVariantNumeric: 'tabular-nums' }}>
                  + {brl(data.juros)}
                </span>
              </div>
            )}

            {/* Total */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginTop: 4, paddingTop: 12, borderTop: '1px solid #D0E0E3',
            }}>
              <span style={{ fontSize: 24, fontWeight: 600, color: '#364153' }}>Total</span>
              <span style={{ fontSize: 28, fontWeight: 700, color: '#00AB67', fontVariantNumeric: 'tabular-nums' }}>
                {brl(data.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Botão "Escolher forma de Pagamento" */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={goToPayment}
          style={{
            width: 684, height: 80,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 600, color: '#FFFFFF',
            backgroundColor: '#00AB67',
            borderRadius: 8, border: 'none',
            cursor: 'pointer',
          }}
        >
          Escolher forma de Pagamento
        </motion.button>

      </div>
    </div>
  );
}
