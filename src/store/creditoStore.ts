import { create } from 'zustand';

/**
 * Estado de sessão do fluxo de Crédito Pessoal.
 *
 * Persiste entre as 4 etapas (Identificação → Seus dados → Simulação → Contrato).
 * Limpo ao concluir ou cancelar via `reset()`.
 */

export interface CreditoSimulacao {
  valor: number;        // valor solicitado
  prazo: number;        // prazo em meses
  parcela: number;      // valor da parcela calculada
  jurosTotais: number;  // juros totais
  total: number;        // total a pagar
  taxaMensal: number;   // ex: 0.0199 (1.99% a.m.)
  cetAnual: number;     // ex: 0.2677 (26.77% a.a.)
}

interface CreditoState {
  cpf: string;
  otpVerificado: boolean;          // OTP do WhatsApp confirmado em Verificação
  dadosConfirmados: boolean;       // confirmou os dados mockados
  simulacao: CreditoSimulacao | null;
  contratoLido: boolean;           // rolou o contrato até o fim
  assinaturaConfirmada: boolean;   // OTP de assinatura confirmado

  setCpf: (cpf: string) => void;
  setOtpVerificado: (v: boolean) => void;
  setDadosConfirmados: (v: boolean) => void;
  setSimulacao: (s: CreditoSimulacao) => void;
  setContratoLido: (v: boolean) => void;
  setAssinaturaConfirmada: (v: boolean) => void;
  reset: () => void;
}

const initial = {
  cpf: '',
  otpVerificado: false,
  dadosConfirmados: false,
  simulacao: null,
  contratoLido: false,
  assinaturaConfirmada: false,
};

export const useCredito = create<CreditoState>((set) => ({
  ...initial,
  setCpf: (cpf) => set({ cpf }),
  setOtpVerificado: (otpVerificado) => set({ otpVerificado }),
  setDadosConfirmados: (dadosConfirmados) => set({ dadosConfirmados }),
  setSimulacao: (simulacao) => set({ simulacao }),
  setContratoLido: (contratoLido) => set({ contratoLido }),
  setAssinaturaConfirmada: (assinaturaConfirmada) => set({ assinaturaConfirmada }),
  reset: () => set(initial),
}));
