import { useNavigate, useParams } from 'react-router-dom';
import { Dices, Hash, Users, Info } from 'lucide-react';
import FlowLayout from '../../../../../components/primitives/FlowLayout';
import ListCard from '../../../../../components/ui/ListCard';
import { getModalidade, calcularPreco } from '../../data/modalidades';
import { useSession } from '../../../../../store/sessionStore';
import { brl } from '../../../../../utils/currency';
import LotteryLogo from '../../components/LotteryLogo';

export default function PickMethod() {
  const { modalidade } = useParams<{ modalidade: string }>();
  const navigate       = useNavigate();
  const m              = getModalidade(modalidade ?? '');
  const addAposta      = useSession((s) => s.addAposta);

  if (!m) return null;

  const surpresinha = () => {
    const set = new Set<number>();
    while (set.size < m.minNumeros) set.add(1 + Math.floor(Math.random() * m.totalNumeros));
    addAposta({
      id: crypto.randomUUID(),
      modalidadeId: m.id,
      modalidadeNome: m.nome,
      numeros: [...set].sort((a, b) => a - b),
      concursos: 1,
      teimosinha: false,
      valor: calcularPreco(m, m.minNumeros),
      addedAt: Date.now(),
    });
    navigate('/caixa/loterias/apostar');
  };

  return (
    <FlowLayout
      onBack={() => navigate('/caixa/loterias/apostar')}
      leftContent={
        <div className="flex flex-col gap-6">
          <LotteryLogo modalidade={m} size={72} />
          <div>
            <div className="text-white/60 text-kiosk-xs mb-1">Modalidade</div>
            <div className="font-bold text-white text-kiosk-lg leading-tight">{m.nome}</div>
            <div className="text-white/60 text-kiosk-xs mt-1">Concurso {m.concursoAtual}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-white/60 text-kiosk-xs">Prêmio estimado</div>
            <div className="font-bold text-white text-kiosk-xl leading-tight mt-0.5">{brl(m.premioEstimado)}</div>
            <div className="text-white/60 text-kiosk-xs mt-0.5">{m.proximoSorteio}</div>
          </div>
        </div>
      }
    >
      <div className="p-8 flex flex-col gap-6 h-full">
        <div>
          <h1 className="font-bold text-ink text-kiosk-lg">Como você quer apostar?</h1>
          <p className="text-muted text-kiosk-xs mt-1">As opções geram a mesma aposta — escolha a que preferir</p>
        </div>

        <div className="space-y-3">
          <ListCard
            icon={<Dices className="w-6 h-6" />}
            iconBg={`${m.cor}15`} iconColor={m.cor}
            title="Surpresinha"
            description={`A máquina escolhe ${m.minNumeros} números pra você`}
            badge="Mais rápido" badgeColor={m.cor}
            highlighted accentColor={m.cor}
            onClick={surpresinha}
          />
          <ListCard
            icon={<Hash className="w-6 h-6" />}
            iconBg={`${m.cor}15`} iconColor={m.cor}
            title="Escolher meus números"
            description={`Selecione de ${m.minNumeros} a ${m.maxNumeros} números`}
            onClick={() => navigate(`/caixa/aposta/${m.id}/numeros`)}
          />
          <ListCard
            icon={<Users className="w-6 h-6" />}
            title="Bolão"
            description="Dividir uma aposta com mais gente"
            comingSoon
          />
        </div>

        <div className="bg-primary/5 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-kiosk-xs text-slate leading-relaxed">
            <span className="font-semibold text-ink">Valor mínimo: {brl(m.precoBase)}</span>{' '}
            (com {m.minNumeros} números). Mais números = mais chances e maior valor.
          </p>
        </div>
      </div>
    </FlowLayout>
  );
}
