interface Props {
  color?: string;
  size?: number;
  className?: string;
}

/**
 * Trevo de 4 folhas — símbolo das Loterias CAIXA.
 * Parametrizado por cor: cada modalidade aplica seu hex.
 * Folhas opostas em opacidade total; as outras duas em 0.5 (cria efeito de profundidade).
 */
export default function LotteryClover({
  color = '#1AA659',
  size = 40,
  className = '',
}: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Trevo das Loterias CAIXA"
    >
      <path
        d="M19.0514 20.9463H6.13707C2.80181 20.9463 0.00463867 23.7438 0.00463867 27.0702C0.00463867 30.3965 2.80181 33.1987 6.13707 33.1987H6.80041V33.8667C6.80041 37.1977 9.59758 39.9999 12.9282 39.9999C16.2588 39.9999 19.0328 37.2163 19.056 33.9038V20.9463H19.0514Z"
        fill={color}
        fillOpacity="0.5"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.0514 6.13315C19.0514 2.80214 16.2542 0 12.9236 0C9.59295 0 6.79578 2.80214 6.79578 6.13315V6.80121H6.13243C2.80181 6.80121 0 9.59871 0 12.9297C0 16.2607 2.79717 19.0536 6.13243 19.0536H19.0514V6.13315Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.9486 33.8667C20.9486 37.1977 23.7458 39.9999 27.0764 39.9999C30.407 39.9999 33.2042 37.1977 33.2042 33.8667V33.1987H33.8675C37.1982 33.1987 39.9953 30.4012 39.9953 27.0702C39.9953 23.7391 37.1982 20.9463 33.8675 20.9463H20.9486V33.8621V33.8667Z"
        fill={color}
      />
      <path
        d="M27.0764 0C23.7597 0 20.9718 2.78358 20.9486 6.09604V19.0536H33.8675C37.1982 19.0536 40 16.2561 40 12.9344C40 9.61262 37.2028 6.80585 33.8675 6.80585H33.2042V6.14243C33.2042 2.81141 30.407 0.00927859 27.0764 0.00927859"
        fill={color}
        fillOpacity="0.5"
      />
    </svg>
  );
}
