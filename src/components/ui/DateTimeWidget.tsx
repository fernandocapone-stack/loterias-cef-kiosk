import { useEffect, useState } from 'react';
import { cn } from '../../lib/cn';

interface Props {
  variant?: 'light' | 'dark';
  className?: string;
}

const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

function format(now: Date) {
  const weekday = WEEKDAYS[now.getDay()];
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return { weekday, line: `${dd}/${mm} - ${hh}:${min}` };
}

export default function DateTimeWidget({ variant = 'light', className }: Props) {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const { weekday, line } = format(now);
  const colorWeekday = variant === 'light' ? 'text-white' : 'text-ink';
  const colorLine = variant === 'light' ? 'text-white/80' : 'text-muted';

  return (
    <div className={cn('text-right leading-tight', className)}>
      <div className={cn('font-bold text-kiosk-sm', colorWeekday)}>{weekday}</div>
      <div className={cn('text-kiosk-xs', colorLine)}>{line}</div>
    </div>
  );
}
