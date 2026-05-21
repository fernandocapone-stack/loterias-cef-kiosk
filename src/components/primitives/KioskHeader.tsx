import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

/**
 * Universal kiosk header — shared by all screens.
 * Canvas 1440px wide, height hug.
 *
 * Layout (Figma layout_DCP80Z / layout_Y8HVHQ):
 *   row, alignItems: center, gap: 24px, padding: 24px, w: 1440
 *
 * Left:  back button 200×80px, bg #004B8B, radius 8px
 *          row center, gap 8px, padding: 12px 24px 12px 16px
 *          ArrowLeft 48×48 + "Voltar" 20px Medium white
 * Center: fill — title, 44px SemiBold
 * Right:  rightSlot (ReactNode) or transparent placeholder 200×80px
 */
interface KioskHeaderProps {
  onBack?: () => void;
  title: string;
  titleColor?: string;
  rightSlot?: ReactNode;
}

export default function KioskHeader({
  onBack,
  title,
  titleColor = '#FFFFFF',
  rightSlot,
}: KioskHeaderProps) {
  return (
    <div
      className="flex items-center shrink-0 w-full"
      style={{ gap: 24, padding: 24 }}
    >
      {/* ── Back button — 200×80, bg #004B8B ── */}
      {onBack ? (
        <button
          onClick={onBack}
          className="flex items-center justify-center rounded-lg shrink-0 transition-opacity active:opacity-80"
          style={{
            width: 280,
            height: 80,
            backgroundColor: '#004B8B',
            borderRadius: 8,
            gap: 8,
            padding: '12px 24px 12px 16px',
          }}
        >
          <ArrowLeft
            style={{ width: 48, height: 48, color: '#F39200', flexShrink: 0 }}
            strokeWidth={2}
          />
          <span
            className="text-white"
            style={{ fontSize: 20, fontWeight: 500, lineHeight: '120%' }}
          >
            Voltar
          </span>
        </button>
      ) : (
        /* Transparent placeholder keeps layout consistent */
        <div style={{ width: 280, height: 80, flexShrink: 0 }} />
      )}

      {/* ── Title — fill ── */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <span
          className="font-semibold text-center leading-tight"
          style={{ fontSize: 44, fontWeight: 600, color: titleColor, lineHeight: '120%' }}
        >
          {title}
        </span>
      </div>

      {/* ── Right slot — 200×80 ── */}
      {rightSlot ? (
        <div style={{ flexShrink: 0 }}>{rightSlot}</div>
      ) : (
        <div style={{ width: 280, height: 80, flexShrink: 0 }} />
      )}
    </div>
  );
}
