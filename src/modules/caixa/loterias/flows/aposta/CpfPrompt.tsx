import { useNavigate } from 'react-router-dom';
import { UserCheck, UserX, ShieldCheck, Info } from 'lucide-react';
import FlowLayout from '../../../../../components/primitives/FlowLayout';
import ListCard from '../../../../../components/ui/ListCard';
import { useSession } from '../../../../../store/sessionStore';
import { brl } from '../../../../../utils/currency';

export default function CpfPrompt() {
  const navigate            = useNavigate();
  const total               = useSession((s) => s.totalApostas());
  const apostas             = useSession((s) => s.apostas);
  const setCpf              = useSession((s) => s.setCpf);
  const setPendingOperation = useSession((s) => s.setPendingOperation);

  const seguirSemCpf = () => {
    setCpf(null);
    setPendingOperation({ type: 'aposta', total, apostas, cpf: null });
    navigate('/checkout/pagamento');
  };

  return (
    <FlowLayout
      onBack={() => navigate(-1)}
      leftContent={
        <div className="flex flex-col gap-5">
          <div>
            <div className="text-white/60 text-kiosk-xs mb-1">Suas apostas</div>
            <div className="font-bold text-white text-kiosk-xl tabular-nums">{brl(total)}</div>
            <div className="text-white/60 text-kiosk-xs mt-1">
              {apostas.length} {apostas.length === 1 ? 'aposta' : 'apostas'}
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-4 h-4 text-white/70 shrink-0 mt-0.5" />
            <p className="text-white/80 text-kiosk-xs leading-relaxed">
              Para sacar prêmios acima de{' '}
              <span className="font-semibold text-white">R$ 1.903,98</span>, o CPF é
              obrigatório. Cadastrá-lo facilita o processo.
            </p>
          </div>

          <div className="flex items-start gap-2 text-white/50 text-kiosk-xs">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <p>CPF aparece só no bilhete. O totem não salva seus dados.</p>
          </div>
        </div>
      }
    >
      <div className="p-8 flex flex-col gap-6">
        <div>
          <h1 className="font-bold text-ink text-kiosk-lg">Cadastrar CPF?</h1>
          <p className="text-muted text-kiosk-xs mt-1">Você pode apostar com ou sem CPF — a escolha é sua</p>
        </div>

        <div className="space-y-3">
          <ListCard
            icon={<UserCheck className="w-6 h-6" />}
            iconBg="#FFF1DD" iconColor="#C57600"
            title="Cadastrar meu CPF"
            description="Digite o CPF que vai constar no bilhete"
            highlighted
            onClick={() => navigate('/caixa/aposta/cpf/digitar')}
          />
          <ListCard
            icon={<UserX className="w-6 h-6" />}
            title="Apostar sem CPF"
            description="Bilhete anônimo, ao portador"
            badge="mais rápido" badgeColor="#0E8345"
            onClick={seguirSemCpf}
          />
        </div>
      </div>
    </FlowLayout>
  );
}
