import { useState, useEffect } from 'react';

const DESIGN_W = 1440;
const DESIGN_H = 900;

/**
 * Calcula o factor de escala para encaixar o canvas 1440×900
 * no viewport actual, mantendo proporção e sem scroll.
 */
export function useKioskScale() {
  const getScale = () =>
    Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H);

  const [scale, setScale] = useState(getScale);

  useEffect(() => {
    const onResize = () => setScale(getScale());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return { scale, designW: DESIGN_W, designH: DESIGN_H };
}
