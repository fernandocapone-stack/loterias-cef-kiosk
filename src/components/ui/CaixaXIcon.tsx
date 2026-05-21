interface Props {
  size?: number;
  className?: string;
}

/**
 * Glifo "X" da identidade CAIXA — duas barras diagonais (branca + laranja).
 * Placeholder estilizado; substituir pelo SVG oficial quando fornecido.
 */
export default function CaixaXIcon({ size = 64, className = '' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="CAIXA"
    >
      {/* Barra branca: do alto-esquerdo ao baixo-direito */}
      <polygon points="12,8 38,8 88,92 62,92" fill="white" />
      {/* Barra laranja por cima, do alto-direito ao baixo-esquerdo */}
      <polygon points="62,8 88,8 38,92 12,92" fill="#F39200" />
    </svg>
  );
}
