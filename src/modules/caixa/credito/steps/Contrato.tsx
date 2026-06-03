import StepStub from './StepStub';

export default function Contrato() {
  return (
    <StepStub
      title="Contrato de empréstimo pessoal"
      description="Leia as cláusulas e habilite a assinatura eletrônica."
      nextLabel="Assinar contrato"
      nextTo="/caixa/credito/assinatura"
    />
  );
}
