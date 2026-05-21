import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../store/sessionStore';

interface Opts {
  idleMs: number;
  warningMs: number;
  enabled: boolean;
}

export function useIdleTimeout({ idleMs, warningMs, enabled }: Opts) {
  const [warning, setWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(Math.floor(warningMs / 1000));
  const idleTimer = useRef<number | null>(null);
  const warnTimer = useRef<number | null>(null);
  const tickTimer = useRef<number | null>(null);
  const navigate = useNavigate();
  const reset = useSession((s) => s.reset);

  const clearAll = () => {
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    if (warnTimer.current) window.clearTimeout(warnTimer.current);
    if (tickTimer.current) window.clearInterval(tickTimer.current);
  };

  const goHome = () => {
    clearAll();
    setWarning(false);
    reset();
    navigate('/', { replace: true });
  };

  const startTimers = () => {
    clearAll();
    setWarning(false);
    idleTimer.current = window.setTimeout(() => {
      setWarning(true);
      setSecondsLeft(Math.floor(warningMs / 1000));
      tickTimer.current = window.setInterval(() => {
        setSecondsLeft((s) => Math.max(0, s - 1));
      }, 1000);
      warnTimer.current = window.setTimeout(goHome, warningMs);
    }, idleMs);
  };

  const dismiss = () => {
    startTimers();
  };

  useEffect(() => {
    if (!enabled) {
      clearAll();
      setWarning(false);
      return;
    }

    const onActivity = () => {
      if (warning) return;
      startTimers();
    };

    startTimers();
    window.addEventListener('pointerdown', onActivity);
    window.addEventListener('keydown', onActivity);

    return () => {
      window.removeEventListener('pointerdown', onActivity);
      window.removeEventListener('keydown', onActivity);
      clearAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return { warning, secondsLeft, dismiss };
}
