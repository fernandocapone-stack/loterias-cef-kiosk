import StepStub from './StepStub';

export default function Acesso() {
  return (
    <StepStub
      title="Identificação"
      description="Informe seu CPF para iniciar a solicitação."
      nextLabel="Continuar"
      nextTo="/caixa/credito/verificacao"
    />
  );
}
