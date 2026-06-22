import { Routes, Route, Navigate } from 'react-router-dom';
import CreditoShell from './modules/caixa/credito/CreditoShell';
import CreditoAcesso from './modules/caixa/credito/steps/Acesso';
import CreditoVerificacao from './modules/caixa/credito/steps/Verificacao';
import CreditoDados from './modules/caixa/credito/steps/Dados';
import CreditoSimulacao from './modules/caixa/credito/steps/Simulacao';
import CreditoContrato from './modules/caixa/credito/steps/Contrato';
import CreditoAssinatura from './modules/caixa/credito/steps/Assinatura';
import CreditoConclusao from './modules/caixa/credito/steps/Conclusao';
import { AnimatePresence } from 'framer-motion';
import KioskShell from './app/KioskShell';
import HomeScreen from './modules/home/HomeScreen';
import ModuleChoiceScreen from './modules/module-choice/ModuleChoiceScreen';
import CaixaHub from './modules/caixa/hub/CaixaHub';
import ComingSoon from './modules/caixa/outros-servicos/ComingSoon';
import ParaVoceHub from './modules/caixa/para-voce/ParaVoceHub';
import LoteriasShell from './modules/caixa/loterias/LoteriasShell';
import LotericaHome from './modules/caixa/loterias/LotericaHome';
import ApostarTab from './modules/caixa/loterias/tabs/ApostarTab';
import PagarTab from './modules/caixa/loterias/tabs/PagarTab';
import ResultadosTab from './modules/caixa/loterias/tabs/ResultadosTab';
import CartPage from './modules/caixa/loterias/CartPage';
import PickApostaType from './modules/caixa/loterias/flows/aposta/PickApostaType';
import PickNumbers from './modules/caixa/loterias/flows/aposta/PickNumbers';
import BolaoCotas from './modules/caixa/loterias/flows/aposta/BolaoCotas';
import LerCaderneta from './modules/caixa/loterias/flows/aposta/LerCaderneta';
import ReviewBilhete from './modules/caixa/loterias/flows/aposta/ReviewBilhete';
import CpfPrompt from './modules/caixa/loterias/flows/aposta/CpfPrompt';
import CpfInput from './modules/caixa/loterias/flows/aposta/CpfInput';
import BoletoInput from './modules/caixa/loterias/flows/conta/BoletoInput';
import BoletoConfirm from './modules/caixa/loterias/flows/conta/BoletoConfirm';
import EscanearConta from './modules/caixa/loterias/flows/conta/EscanearConta';
import PaymentMethod from './modules/checkout/PaymentMethod';
import PixScreen from './modules/checkout/PixScreen';
import ProcessingScreen from './modules/checkout/ProcessingScreen';
import SuccessScreen from './modules/checkout/SuccessScreen';
import ErrorScreen from './modules/checkout/ErrorScreen';

export default function App() {
  return (
    <KioskShell>
      <AnimatePresence mode="wait">
        <Routes>
          {/* ── Home / Module choice ── */}
          <Route path="/" element={<HomeScreen />} />
          <Route path="/escolha" element={<ModuleChoiceScreen />} />

          {/* ── Caixa hub ── */}
          <Route path="/caixa" element={<CaixaHub />} />
          <Route path="/caixa/outros" element={<ComingSoon />} />
          <Route path="/caixa/para-voce" element={<ParaVoceHub />} />

          {/* ── Pagar Conta — entrada via Para Você ── */}
          <Route path="/caixa/para-voce/pagar-conta" element={<PagarTab />} />

          {/* ── Crédito Pessoal — shell + 7 sub-telas ── */}
          <Route path="/caixa/credito" element={<CreditoShell />}>
            <Route index element={<Navigate to="acesso" replace />} />
            <Route path="acesso"      element={<CreditoAcesso />} />
            <Route path="verificacao" element={<CreditoVerificacao />} />
            <Route path="dados"       element={<CreditoDados />} />
            <Route path="simulacao"   element={<CreditoSimulacao />} />
            <Route path="contrato"    element={<CreditoContrato />} />
            <Route path="assinatura"  element={<CreditoAssinatura />} />
            <Route path="conclusao"   element={<CreditoConclusao />} />
          </Route>

          {/* ── Lotéricas shell (thin wrapper) ── */}
          <Route path="/caixa/loterias" element={<LoteriasShell />}>
            <Route index element={<LotericaHome />} />
            <Route path="apostar" element={<ApostarTab />} />
            <Route path="resultados" element={<ResultadosTab />} />
            <Route path="carrinho" element={<CartPage />} />
          </Route>

          {/* ── Bet flow (fullscreen, outside shell) ── */}
          <Route path="/caixa/aposta/:modalidade/tipo" element={<PickApostaType />} />
          <Route path="/caixa/aposta/:modalidade/numeros" element={<PickNumbers />} />
          <Route path="/caixa/aposta/:modalidade/bolao" element={<BolaoCotas />} />
          <Route path="/caixa/aposta/:modalidade/caderneta" element={<LerCaderneta />} />
          <Route path="/caixa/aposta/revisao" element={<ReviewBilhete />} />
          <Route path="/caixa/aposta/cpf" element={<CpfPrompt />} />
          <Route path="/caixa/aposta/cpf/digitar" element={<CpfInput />} />

          {/* ── Pagar Conta flow ── */}
          <Route path="/caixa/conta/escanear" element={<EscanearConta />} />
          <Route path="/caixa/conta/digitar" element={<BoletoInput />} />
          <Route path="/caixa/conta/confirmar" element={<BoletoConfirm />} />

          {/* ── Checkout ── */}
          <Route path="/checkout/pagamento" element={<PaymentMethod />} />
          <Route path="/checkout/pix" element={<PixScreen />} />
          <Route path="/checkout/processando" element={<ProcessingScreen />} />
          <Route path="/checkout/sucesso" element={<SuccessScreen />} />
          <Route path="/checkout/erro" element={<ErrorScreen />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </KioskShell>
  );
}
