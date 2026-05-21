# Caixa Autoatendimento — Lotéricas (Kiosk)

MVP do totem de autoatendimento para lojas de conveniência, focado no submódulo **Lotéricas** da Caixa Econômica Federal.

## Stack

- **Vite + React 18 + TypeScript**
- **Tailwind CSS** (design tokens em `tailwind.config.js`)
- **React Router v6** (rotas + AnimatePresence)
- **Zustand** (estado de sessão de compra)
- **Framer Motion** (microinterações)

## Como rodar

```bash
npm install
npm run dev
```

Abrir em `http://localhost:5173`. Para testar como totem, use o Chrome em **modo kiosk fullscreen**:

```
chrome --kiosk --app=http://localhost:5173
```

Resolução-alvo: **1080×1920 retrato** (totem 22"–32"). O CSS é responsivo, mas a calibração foi feita para tela vertical.

## Fluxos implementados

| Rota | Tela |
|---|---|
| `/` | Home / attract mode |
| `/escolha` | Loja vs. Caixa |
| `/caixa` | **Hub Caixa — 2 cards: Lotéricas (ativo) + Outros Serviços (Em breve)** |
| `/caixa/outros` | Tela "Em breve" com roadmap |
| `/caixa/loterias` | Hub de loterias + serviços |
| `/caixa/loterias/:id/metodo` | Surpresinha / Escolher / Bolão |
| `/caixa/loterias/:id/numeros` | Grid de bolas para seleção |
| `/caixa/loterias/revisao` | Resumo do bilhete |
| `/caixa/pagamento-conta` | Escanear/QR/Digitar |
| `/caixa/recarga` | Operadora → Número → Valor |
| `/caixa/resultados` | Consulta de resultados |
| `/checkout/pagamento` | Pix / Débito / Crédito / Dinheiro |
| `/checkout/pix` | QR + countdown + auto-aprovação simulada |
| `/checkout/processando` | Loading com chance de erro (10%) |
| `/checkout/sucesso` | Confirmação + impressão simulada → home |
| `/checkout/erro` | Recuperação por motivo (declined / expired / cancelled) |

## Arquitetura

```
src/
├── app/             KioskShell (timeout, FAB)
├── components/
│   ├── primitives/  KioskButton, ServiceCard, NumberBall, NumPad, Header, PageWrapper
│   ├── feedback/    IdleModal
│   └── layout/      AccessibilityFAB
├── hooks/           useIdleTimeout
├── modules/
│   ├── home/
│   ├── module-choice/
│   ├── loja/        (placeholder fora de escopo)
│   ├── caixa/
│   │   ├── hub/
│   │   ├── outros-servicos/
│   │   ├── loterias/
│   │   │   ├── data/modalidades.ts
│   │   │   ├── flows/aposta/
│   │   │   └── LoteriasHub.tsx
│   │   ├── pagamento-conta/
│   │   ├── recarga/
│   │   └── resultados/
│   └── checkout/
├── store/           sessionStore (Zustand)
└── utils/           currency
```

## Design system

| Token | Valor |
|---|---|
| primary | `#005CA9` (Caixa azul) |
| accent | `#F39200` (Caixa laranja) |
| success / danger / warning | `#2E8B57` / `#D62828` / `#FFB020` |
| Botão primário (alt mín) | 120 px |
| Bola de número | 96×96 px |
| Tipografia base | 32 px |
| Border radius padrão | 24 px |

## Comportamento de sessão (timeout)

- 60s sem toque → modal "Você ainda está aí?"
- +30s sem resposta → reset do estado e volta à home
- Qualquer toque dentro do app reseta o timer

## Próximas etapas (não implementadas neste MVP)

- Integração com APIs reais da Caixa (apostas, pagamentos, recarga)
- Hardware: impressora térmica, leitor de barras, pinpad, scanner QR (HAL)
- Bolão e Teimosinha
- Modo acessibilidade plenamente funcional (TTS, alto-contraste, zoom)
- Telemetria (cada toque, tempos por tela, abandono)
- Máquina de estados de pagamento com XState
- Comprovante térmico (layout de impressão dedicado)
- Empacotamento Electron / PWA fullscreen
