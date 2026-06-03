import StepStub from './StepStub';

export default function Assinatura() {
  return (
    <StepStub
      title="Assinatura eletrônica"
      description="Digite o código alfanumérico enviado por WhatsApp."
      nextLabel="Confirmar assinatura"
      nextTo="/caixa/credito/conclusao"
    />
  );
}
