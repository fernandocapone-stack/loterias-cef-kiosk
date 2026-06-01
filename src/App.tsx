import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import KioskShell from './app/KioskShell';
import HomeScreen from './modules/home/HomeScreen';
import ModuleChoiceScreen from './modules/module-choice/ModuleChoiceScreen';
import CaixaHub from './modules/caixa/hub/CaixaHub';
import ComingSoon from './modules/caixa/outros-servicos/ComingSoon';
import LoteriasShell from './modules/caixa/loterias/LoteriasShell';
import LotericaHome from './modules/caixa/loterias/LotericaHome';
import ApostarTab from './modules/caixa/loterias/tabs/ApostarTab';
import PagarTab from './modules/caixa/loterias/tabs/PagarTab';
import RecarregarTab from './modules/caixa/loterias/tabs/RecarregarTab';
import ResultadosTab from './modules/caixa/loterias/tabs/ResultadosTab';
import CartPage from './modules/caixa/loterias/CartPage';
import PickApostaType from './modules/caixa/loterias/flows/aposta/PickApostaType';
import PickNumbers from './modules/caixa/loterias/flows/aposta/PickNumbers';
import BolaoCotas from './modules/caixa/loterias/flows/aposta/BolaoCotas';
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
import ConvenienciaScreen from './modules/loja/ConvenienciaScreen';
import CategoriasScreen from './modules/loja/CategoriasScreen';
import CategoriaExpandidaScreen from './modules/loja/CategoriaExpandidaScreen';
import LojaCarrinhoScreen from './modules/loja/LojaCarrinhoScreen';

export default function App() {
  return (
    <KioskShell>
      <AnimatePresence mode="wait">
        <Routes>
          {/* ── Home / Module choice ── */}
          <Route path="/" element={<HomeScreen />} />
          <Route path="/escolha" element={<ModuleChoiceScreen />} />
          {/* ── Loja de Conveniência ── */}
          <Route path="/loja" element={<ConvenienciaScreen />} />
          <Route path="/loja/categorias" element={<CategoriasScreen />} />
          <Route path="/loja/categorias/:id" element={<CategoriaExpandidaScreen />} />
          <Route path="/loja/carrinho" element={<LojaCarrinhoScreen />} />

          {/* ── Caixa hub ── */}
          <Route path="/caixa" element={<CaixaHub />} />
          <Route path="/caixa/outros" element={<ComingSoon />} />

          {/* ── Lotéricas shell (thin wrapper) ── */}
          <Route path="/caixa/loterias" element={<LoteriasShell />}>
            {/* Entry: 4-tile hub */}
            <Route index element={<LotericaHome />} />

            {/* Tabs */}
            <Route path="apostar" element={<ApostarTab />} />
            <Route path="pagar" element={<PagarTab />} />
            <Route path="recarregar" element={<RecarregarTab />} />
            <Route path="resultados" element={<ResultadosTab />} />

            {/* Cart (full-page, replaces CartDrawer) */}
            <Route path="carrinho" element={<CartPage />} />
          </Route>

          {/* ── Bet flow (fullscreen, outside shell) ── */}
          <Route path="/caixa/aposta/:modalidade/tipo" element={<PickApostaType />} />
          <Route path="/caixa/aposta/:modalidade/numeros" element={<PickNumbers />} />
          <Route path="/caixa/aposta/:modalidade/bolao" element={<BolaoCotas />} />
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
