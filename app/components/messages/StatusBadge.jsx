'use client';

import { Badge } from '@/app/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Send, 
  Pause,
  Edit,
  X,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { getStateConfig, MESSAGE_STATES } from '@/app/utils/messageStates';

const iconMap = {
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Send,
  Pause,
  Edit,
  X,
  RotateCcw,
  AlertTriangle
};

export default function StatusBadge({ status, size = 'default', showIcon = true, showLabel = true }) {
  const config = getStateConfig(status);
  const IconComponent = iconMap[config.icon] || iconMap.Clock;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    default: 'text-sm px-2.5 py-1.5',
    lg: 'text-base px-3 py-2'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    default: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Badge
      variant="secondary"
      className={cn(
        'flex items-center space-x-1 border font-medium',
        config.bgColor,
        config.textColor,
        config.borderColor,
        sizeClasses[size],
        config.animated && 'animate-pulse'
      )}
    >
      {showIcon && (
        <IconComponent className={iconSizes[size]} />
      )}
      {showLabel && <span>{config.label}</span>}
    </Badge>
  );
}
