import StepStub from './StepStub';

export default function Simulacao() {
  return (
    <StepStub
      title="Simulação de empréstimo"
      description="Escolha o valor e o prazo do seu empréstimo."
      nextLabel="Concordar e continuar"
      nextTo="/caixa/credito/contrato"
    />
  );
}
