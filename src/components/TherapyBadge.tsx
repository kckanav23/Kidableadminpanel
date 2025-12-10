import { TherapyType } from '../types';
import { THERAPY_ICONS, THERAPY_LABELS, THERAPY_COLORS } from '../lib/constants';
import { Badge } from './ui/badge';

interface TherapyBadgeProps {
  type: TherapyType;
  showLabel?: boolean;
}

export function TherapyBadge({ type, showLabel = true }: TherapyBadgeProps) {
  return (
    <Badge
      variant="outline"
      style={{ borderColor: THERAPY_COLORS[type], color: THERAPY_COLORS[type] }}
      className="gap-1"
    >
      <span>{THERAPY_ICONS[type]}</span>
      {showLabel && <span>{THERAPY_LABELS[type]}</span>}
    </Badge>
  );
}
