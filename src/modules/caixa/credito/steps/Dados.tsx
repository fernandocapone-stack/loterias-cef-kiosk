import StepStub from './StepStub';

export default function Dados() {
  return (
    <StepStub
      title="Confirme seus dados"
      description="Estas são as informações que a Caixa tem em seus registros."
      nextLabel="Confirmar"
      nextTo="/caixa/credito/simulacao"
    />
  );
}
