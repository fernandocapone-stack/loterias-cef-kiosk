import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useIdleTimeout } from '../hooks/useIdleTimeout';
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

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-surface">
      {children}
      {warning && <IdleModal seconds={secondsLeft} onStay={dismiss} />}
      <CartToast />
      {!isHome && <AccessibilityFAB />}
    </div>
  );
}
