import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn';

interface Props {
  icon: ReactNode;
  iconBg?: string;
  iconColor?: string;
  title: string;
  description?: string;
  badge?: string;
  badgeColor?: string;
  trailing?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  comingSoon?: boolean;
  highlighted?: boolean;
  accentColor?: string;
}

export default function ListCard({
  icon, iconBg, iconColor, title, description,
  badge, badgeColor, trailing, onClick, disabled,
  comingSoon, highlighted, accentColor,
}: Props) {
  return (
    <motion.button
      whileTap={disabled || comingSoon ? undefined : { scale: 0.99 }}
      onClick={comingSoon || disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        'group relative w-full text-left bg-white rounded-lg border transition-all',
        'flex items-center gap-4 p-4 sm:p-5',
        'hover:border-primary/30 hover:shadow-card',
        highlighted ? 'border-accent/50 ring-1 ring-accent/20 bg-accent/5' : 'border-line',
        (disabled || comingSoon) && 'opacity-60 cursor-not-allowed',
      )}
      style={
        highlighted && accentColor
          ? { borderColor: `${accentColor}66`, boxShadow: `0 0 0 1px ${accentColor}22` }
          : undefined
      }
    >
      {/* Icon box — rounded-lg */}
      <div
        className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: iconBg ?? '#E0EBF6', color: iconColor ?? '#005CA9' }}
      >
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-kiosk-base text-ink leading-tight truncate">{title}</div>
        {description && (
          <div className="text-kiosk-xs text-muted mt-0.5 truncate">{description}</div>
        )}
      </div>

      {badge && (
        <span
          className="flex-shrink-0 text-kiosk-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: `${badgeColor ?? '#575264'}15`, color: badgeColor ?? '#575264' }}
        >
          {badge}
        </span>
      )}

      {comingSoon && (
        <span className="flex-shrink-0 text-kiosk-xs font-semibold px-2.5 py-1 rounded-full bg-accent/15 text-accent-dark">
          Em breve
        </span>
      )}

      {trailing ?? (
        <ChevronRight className="flex-shrink-0 w-5 h-5 text-muted transition-transform group-hover:translate-x-0.5" />
      )}
    </motion.button>
  );
}
