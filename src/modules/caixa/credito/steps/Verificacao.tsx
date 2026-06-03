import StepStub from './StepStub';

export default function Verificacao() {
  return (
    <StepStub
      title="Verificação por WhatsApp"
      description="Enviaremos um código de 6 dígitos para confirmar sua identidade."
      nextLabel="Verificar"
      nextTo="/caixa/credito/dados"
    />
  );
}
