import { Modalidade } from '../data/modalidades';
import LotteryClover from '../../../../components/ui/LotteryClover';

interface Props {
  modalidade: Modalidade;
  size?: number;
  className?: string;
}

/**
 * Marca da modalidade — usa o trevo das Loterias CAIXA na cor da loteria.
 */
export default function LotteryLogo({ modalidade, size = 40, className }: Props) {
  return (
    <LotteryClover color={modalidade.cor} size={size} className={className} />
  );
}
