import { LastOperation } from '../../store/sessionStore';
import { brl } from '../../utils/currency';
import { formatBoleto } from '../../utils/boleto';
import { formatCpf, maskCpfForDisplay } from '../../utils/cpf';
import { MODALIDADES } from '../../modules/caixa/loterias/data/modalidades';

interface Props {
  operation: LastOperation;
  showSensitiveCpf?: boolean;
}

const PAYMENT_LABELS: Record<string, string> = {
  pix: 'PIX',
  debito: 'CARTÃO DÉBITO',
  credito: 'CARTÃO CRÉDITO',
  dinheiro: 'DINHEIRO',
};

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const time = d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return `${date}  ${time}`;
}

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, '');
  if (d.length !== 11) return raw;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export default function Receipt({ operation, showSensitiveCpf }: Props) {
  return (
    <div className="bg-[#FAFAF7] rounded-md shadow-card-strong border border-line max-w-md mx-auto w-full">
      {/* Top notch (like real thermal paper) */}
      <div
        className="h-3 bg-white rounded-t-md"
        style={{
          backgroundImage:
            'linear-gradient(135deg, transparent 33.333%, white 33.333%, white 66.667%, transparent 66.667%), linear-gradient(45deg, transparent 33.333%, white 33.333%, white 66.667%, transparent 66.667%)',
          backgroundSize: '12px 12px',
          backgroundPosition: '0 0',
        }}
      />

      <div className="px-6 py-5 font-mono text-[13px] leading-[1.55] text-ink">
        {operation.type === 'aposta' && <ApostaReceipt op={operation} showSensitiveCpf={showSensitiveCpf} />}
        {operation.type === 'boleto' && <BoletoReceipt op={operation} />}
        {operation.type === 'recarga' && <RecargaReceipt op={operation} />}

        {/* Footer comum */}
        <Divider />
        <div className="text-center font-bold uppercase tracking-wider mb-1">
          Pagamento
        </div>
        <Row label="Forma" value={PAYMENT_LABELS[operation.paymentMethod] ?? operation.paymentMethod.toUpperCase()} />
        <Row label="Autenticação" value={operation.authCode} />
        <Row label="NSU" value={operation.nsu} />
        <Divider />
        <div className="text-center text-[11px] text-slate leading-relaxed">
          CAIXA ECONÔMICA FEDERAL
          <br />
          CNPJ 00.360.305/0001-04
          <br />
          Operação realizada em totem de autoatendimento
        </div>
      </div>

      {/* Bottom notch */}
      <div
        className="h-3 bg-white rounded-b-md"
        style={{
          backgroundImage:
            'linear-gradient(225deg, transparent 33.333%, white 33.333%, white 66.667%, transparent 66.667%), linear-gradient(315deg, transparent 33.333%, white 33.333%, white 66.667%, transparent 66.667%)',
          backgroundSize: '12px 12px',
        }}
      />
    </div>
  );
}

function ApostaReceipt({ op, showSensitiveCpf }: { op: LastOperation; showSensitiveCpf?: boolean }) {
  const apostas = op.apostas ?? [];
  return (
    <>
      <div className="text-center font-extrabold tracking-wider">
        CAIXA ECONÔMICA FEDERAL
      </div>
      <div className="text-center font-bold uppercase tracking-widest text-[12px] text-slate mb-1">
        Loterias · Comprovante
      </div>
      <Divider />
      <div className="text-center mb-1">{formatDateTime(op.timestampIso)}</div>
      <Divider />

      {apostas.map((a, idx) => {
        const m = MODALIDADES.find((mm) => mm.id === a.modalidadeId);
        const bilhete = op.bilheteNumeros?.[idx];
        return (
          <div key={a.id} className="mb-3">
            <div className="font-bold uppercase">
              {a.modalidadeNome} · Concurso {m?.concursoAtual ?? '—'}
            </div>
            <div className="text-[11px] text-slate">
              Sorteio: {m?.proximoSorteio ?? '—'}
            </div>
            <div className="my-1 text-slate">
              Aposta {idx + 1} — {a.numeros.length} números
            </div>
            <div className="font-extrabold tracking-widest text-[15px]">
              {a.numeros.map((n) => String(n).padStart(2, '0')).join('  ')}
            </div>
            {bilhete && (
              <div className="text-[11px] text-slate mt-1">
                Bilhete nº {bilhete}
              </div>
            )}
            <Row label="Valor" value={brl(a.valor)} />
            {idx < apostas.length - 1 && <Divider />}
          </div>
        );
      })}

      <Divider />
      <Row label="TOTAL" value={brl(op.total)} bold />
      {op.cpf && (
        <Row
          label="CPF"
          value={showSensitiveCpf ? formatCpf(op.cpf) : maskCpfForDisplay(op.cpf)}
        />
      )}

      <Divider double />
      <div className="text-center text-[11px] text-slate leading-relaxed">
        Confira o resultado em
        <br />
        <span className="font-bold text-ink">loterias.caixa.gov.br</span>
        <br />
        Guarde este comprovante.
        <br />
        Necessário para resgatar prêmio.
      </div>
    </>
  );
}

function BoletoReceipt({ op }: { op: LastOperation }) {
  const b = op.boleto!;
  const venc = new Date(b.vencimentoIso).toLocaleDateString('pt-BR');
  return (
    <>
      <div className="text-center font-extrabold tracking-wider">
        CAIXA ECONÔMICA FEDERAL
      </div>
      <div className="text-center font-bold uppercase tracking-widest text-[12px] text-slate mb-1">
        Pagamento de título
      </div>
      <Divider />
      <div className="text-center mb-1">{formatDateTime(op.timestampIso)}</div>
      <Divider />

      <div className="font-bold uppercase">Cedente</div>
      <div>{b.cedente}</div>
      <div className="text-[11px] text-slate">CNPJ {b.cnpj}</div>
      <div className="text-[11px] text-slate mt-1">{b.descricao}</div>

      <Divider />
      <Row label="Vencimento" value={venc} />
      {b.vencido && (
        <Row
          label="Status"
          value={`Vencido há ${b.diasVencido}d`}
        />
      )}

      <Divider />
      <Row label="Valor original" value={brl(b.valorOriginal)} />
      {b.multa > 0 && <Row label="Multa" value={`+ ${brl(b.multa)}`} />}
      {b.juros > 0 && <Row label="Juros" value={`+ ${brl(b.juros)}`} />}
      <Divider />
      <Row label="TOTAL PAGO" value={brl(op.total)} bold />

      <Divider double />
      <div className="text-[10px] text-slate break-all leading-relaxed">
        Linha digitável:
        <br />
        {formatBoleto(b.linhaDigitavel)}
      </div>
    </>
  );
}

function RecargaReceipt({ op }: { op: LastOperation }) {
  const r = op.recarga!;
  return (
    <>
      <div className="text-center font-extrabold tracking-wider">
        CAIXA ECONÔMICA FEDERAL
      </div>
      <div className="text-center font-bold uppercase tracking-widest text-[12px] text-slate mb-1">
        Recarga de celular
      </div>
      <Divider />
      <div className="text-center mb-1">{formatDateTime(op.timestampIso)}</div>
      <Divider />

      <Row label="Operadora" value={r.operadoraNome.toUpperCase()} />
      <Row label="Número" value={formatPhone(r.numero)} />
      <Divider />
      <Row label="VALOR" value={brl(op.total)} bold />
      <Divider double />
      <div className="text-center text-[11px] text-slate leading-relaxed">
        A operadora confirmará a recarga
        <br />
        por SMS no número informado.
      </div>
    </>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between gap-3 ${bold ? 'font-extrabold text-[14px]' : ''}`}>
      <span className={bold ? '' : 'text-slate'}>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

function Divider({ double }: { double?: boolean } = {}) {
  return (
    <div
      className={`my-2 border-t ${double ? 'border-double border-t-[3px]' : 'border-dashed'} border-slate/40`}
    />
  );
}
