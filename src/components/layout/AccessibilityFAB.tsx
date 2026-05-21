import { motion } from 'framer-motion';

/**
 * FAB global de acessibilidade — flutuante em todas as telas exceto a splash.
 * Renderizado no KioskShell.
 *
 * Posição: bottom-right, margem 24px.
 * Visual: círculo #004B8B 64×64 com o ícone SVG 48×48.
 */
export default function AccessibilityFAB() {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      aria-label="Acessibilidade"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 40,
        width: 64,
        height: 64,
        borderRadius: 128,
        backgroundColor: '#004B8B',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0px 4px 16px rgba(0,0,0,0.20)',
      }}
    >
      <img
        src="/images/icon-acessibilidade.svg"
        alt=""
        style={{ width: 48, height: 48 }}
        draggable={false}
      />
    </motion.button>
  );
}
