import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useIdleTimeout } from '../hooks/useIdleTimeout';
import { useKioskScale } from '../hooks/useKioskScale';
import IdleModal from '../components/feedback/IdleModal';
import CartToast from '../components/feedback/CartToast';
import AccessibilityFAB from '../components/layout/AccessibilityFAB';

interface Props {
  children: ReactNode;
}

export default function KioskShell({ children }: Props) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { warning, secondsLeft, dismiss } = useIdleTimeout({
    idleMs: 60_000,
    warningMs: 30_000,
    enabled: !isHome,
  });

  const { scale, designW, designH } = useKioskScale();

  return (
    /* Camada externa: ocupa o viewport inteiro, centraliza o frame do kiosk */
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#101820',
      }}
    >
      {/* Frame interno fixo 1440×900 — escala proporcionalmente ao viewport */}
      <div
        style={{
          width: designW,
          height: designH,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {children}
        {warning && <IdleModal seconds={secondsLeft} onStay={dismiss} />}
        <CartToast />
        {!isHome && <AccessibilityFAB />}
      </div>
    </div>
  );
}
