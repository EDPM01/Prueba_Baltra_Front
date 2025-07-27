'use client';

import { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Clock, 
  MoreVertical, 
  Edit, 
  Copy, 
  Trash2, 
  Play,
  Pause,
  Eye
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { FadeIn, ScaleIn } from '@/app/components/ui/animations';
import StatusBadge from './StatusBadge';
import { formatDate, formatRelativeDate } from '@/app/utils/dateUtils';
import { useBreakpoint } from '@/app/hooks/useResponsive';
import { cn } from '@/lib/utils';

export default function MessageCard({ message, onEdit, onDuplicate, onDelete, onTogglePause, onPreview }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isMobile, isTablet } = useBreakpoint();

  const {
    id,
    content,
    scheduledFor,
    groups = [],
    status,
    sentAt,
    recipientCount,
    deliveredCount,
    failedCount,
    createdAt
  } = message;

  const scheduledDate = new Date(scheduledFor);
  const isOverdue = scheduledDate < new Date() && status === 'scheduled';
  const totalContacts = groups.reduce((sum, group) => sum + (group.contactCount || 0), 0);

  // Ajustar truncado según el dispositivo
  const truncateLength = isMobile ? 80 : isTablet ? 100 : 120;
  const truncatedContent = content.length > truncateLength 
    ? content.substring(0, truncateLength) + '...' 
    : content;

  const handleAction = (action, event) => {
    event.stopPropagation();
    switch (action) {
      case 'edit':
        onEdit?.(message);
        break;
      case 'duplicate':
        onDuplicate?.(message);
        break;
      case 'delete':
        onDelete?.(message);
        break;
      case 'toggle-pause':
        onTogglePause?.(message);
        break;
      case 'preview':
        onPreview?.(message);
        break;
    }
  };

  return (
    <FadeIn>
      <Card className={cn(
        "transition-all duration-200 hover:shadow-md cursor-pointer",
        "hover:scale-[1.02] active:scale-[0.98]",
        isOverdue && "border-orange-200 bg-orange-50/50"
      )}>
        <CardContent className={cn(
          "p-4",
          isMobile && "p-3"
        )}>
          <div className={cn(
            "space-y-4",
            isMobile && "space-y-3"
          )}>
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2 flex-wrap">
                <StatusBadge status={status} size="sm" />
                {isOverdue && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                    Vencido
                  </Badge>
                )}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className={cn(
                    "h-8 w-8 p-0",
                    isMobile && "h-10 w-10" // Área táctil más grande en móvil
                  )}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className={cn(
                  isMobile && "w-56" // Menú más ancho en móvil
                )}>
                  <DropdownMenuItem onClick={(e) => handleAction('preview', e)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Vista previa
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => handleAction('edit', e)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => handleAction('duplicate', e)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicar
                  </DropdownMenuItem>
                  {status === 'scheduled' && (
                    <DropdownMenuItem onClick={(e) => handleAction('toggle-pause', e)}>
                      <Pause className="mr-2 h-4 w-4" />
                      Pausar
                    </DropdownMenuItem>
                  )}
                  {status === 'paused' && (
                    <DropdownMenuItem onClick={(e) => handleAction('toggle-pause', e)}>
                      <Play className="mr-2 h-4 w-4" />
                      Reanudar
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={(e) => handleAction('delete', e)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Contenido del mensaje */}
            <div 
              className="space-y-2"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <p className={cn(
                "text-gray-900 leading-relaxed",
                isMobile && "text-sm"
              )}>
                {isExpanded ? content : truncatedContent}
              </p>
              {content.length > truncateLength && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal"
                >
                  {isExpanded ? 'Ver menos' : 'Ver más'}
                </Button>
              )}
            </div>

            {/* Información de programación */}
            <div className={cn(
              "flex items-center space-x-4 text-sm text-gray-600",
              isMobile && "flex-col items-start space-x-0 space-y-1"
            )}>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(scheduledDate)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{formatRelativeDate(scheduledDate)}</span>
              </div>
            </div>

            {/* Grupos y estadísticas */}
            <div className="space-y-3">
              {/* Grupos */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {groups.length} grupo{groups.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {totalContacts} contactos
                </span>
              </div>

              {/* Grupos tags */}
              <div className="flex flex-wrap gap-1">
                {groups.slice(0, isMobile ? 2 : 3).map((group, index) => (
                  <Badge 
                    key={group.id || index} 
                    variant="secondary" 
                    className="text-xs bg-gray-100 text-gray-700"
                  >
                    {group.name}
                  </Badge>
                ))}
                {groups.length > (isMobile ? 2 : 3) && (
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                    +{groups.length - (isMobile ? 2 : 3)} más
                  </Badge>
                )}
              </div>
            </div>

            {/* Estadísticas de envío (solo para mensajes enviados) */}
            {status === 'sent' && (deliveredCount !== undefined || failedCount !== undefined) && (
              <div className="pt-3 border-t border-gray-200">
                <div className={cn(
                  "grid grid-cols-3 gap-4 text-center",
                  isMobile && "gap-2"
                )}>
                  <div>
                    <p className={cn(
                      "text-lg font-semibold text-gray-900",
                      isMobile && "text-base"
                    )}>{recipientCount || totalContacts}</p>
                    <p className="text-xs text-gray-500">Enviados</p>
                  </div>
                  <div>
                    <p className={cn(
                      "text-lg font-semibold text-green-600",
                      isMobile && "text-base"
                    )}>{deliveredCount || 0}</p>
                    <p className="text-xs text-gray-500">Entregados</p>
                  </div>
                  <div>
                    <p className={cn(
                      "text-lg font-semibold text-red-600",
                      isMobile && "text-base"
                    )}>{failedCount || 0}</p>
                    <p className="text-xs text-gray-500">Fallidos</p>
                  </div>
                </div>
              </div>
            )}

            {/* Información adicional */}
            {!isMobile && (
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <span>ID: {id}</span>
                <span>Creado: {formatRelativeDate(new Date(createdAt))}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );
}
