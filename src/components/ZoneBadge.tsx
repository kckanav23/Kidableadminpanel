import { Zone } from '../types';
import { ZONE_COLORS, ZONE_LABELS } from '../lib/constants';
import { Badge } from './ui/badge';

interface ZoneBadgeProps {
  zone: Zone;
  showLabel?: boolean;
}

const ZONE_EMOJI: Record<Zone, string> = {
  green: '🟢',
  yellow: '🟡',
  orange: '🟠',
  red: '🔴',
  blue: '🔵',
};

export function ZoneBadge({ zone, showLabel = true }: ZoneBadgeProps) {
  return (
    <Badge
      variant="outline"
      style={{ borderColor: ZONE_COLORS[zone], color: ZONE_COLORS[zone] }}
      className="gap-1"
    >
      <span>{ZONE_EMOJI[zone]}</span>
      {showLabel && <span>{ZONE_LABELS[zone]}</span>}
    </Badge>
  );
}
