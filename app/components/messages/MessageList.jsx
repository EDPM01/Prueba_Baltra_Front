'use client';

import { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  SortDesc, 
  Calendar,
  MessageSquare,
  RefreshCw,
  Plus
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import MessageCard from './MessageCard';
import { toast } from 'sonner';

// Datos mock de mensajes
const mockMessages = [
  {
    id: 'msg-001',
    content: 'Recordatorio: Reunión de equipo mañana a las 10:00 AM. Por favor confirmen su asistencia.',
    scheduledFor: '2025-07-27T09:00:00.000Z',
    status: 'scheduled',
    groups: [
      { id: '1', name: 'Equipo Desarrollo', contactCount: 8 },
      { id: '4', name: 'Managers', contactCount: 6 }
    ],
    createdAt: '2025-07-26T10:00:00.000Z'
  },
  {
    id: 'msg-002',
    content: '🎉 ¡Promoción especial! 50% de descuento en todos nuestros productos hasta el viernes. No te lo pierdas, oferta limitada.',
    scheduledFor: '2025-07-27T14:00:00.000Z',
    status: 'scheduled',
    groups: [
      { id: '3', name: 'Clientes VIP', contactCount: 25 }
    ],
    createdAt: '2025-07-26T11:30:00.000Z'
  },
  {
    id: 'msg-003',
    content: 'Feliz cumpleaños! 🎂🎈 Esperamos que tengas un día maravilloso.',
    scheduledFor: '2025-07-26T12:00:00.000Z',
    status: 'sent',
    groups: [
      { id: '5', name: 'Personal', contactCount: 15 }
    ],
    sentAt: '2025-07-26T12:00:00.000Z',
    recipientCount: 15,
    deliveredCount: 14,
    failedCount: 1,
    createdAt: '2025-07-26T08:00:00.000Z'
  },
  {
    id: 'msg-004',
    content: 'Actualización del sistema programada para esta noche de 2:00 AM a 4:00 AM. Puede haber interrupciones temporales.',
    scheduledFor: '2025-07-25T20:00:00.000Z',
    status: 'error',
    groups: [
      { id: '1', name: 'Equipo Desarrollo', contactCount: 8 },
      { id: '2', name: 'Marketing', contactCount: 12 }
    ],
    createdAt: '2025-07-25T15:00:00.000Z'
  },
  {
    id: 'msg-005',
    content: 'Recordatorio semanal: Reunión de ventas todos los lunes a las 9:00 AM en la sala de conferencias.',
    scheduledFor: '2025-07-28T09:00:00.000Z',
    status: 'paused',
    groups: [
      { id: '2', name: 'Marketing', contactCount: 12 },
      { id: '4', name: 'Managers', contactCount: 6 }
    ],
    createdAt: '2025-07-26T16:00:00.000Z'
  },
  {
    id: 'msg-006',
    content: 'Bienvenido a nuestro equipo! Estamos emocionados de trabajar contigo.',
    scheduledFor: '2025-07-26T10:30:00.000Z',
    status: 'sent',
    groups: [
      { id: '1', name: 'Equipo Desarrollo', contactCount: 8 }
    ],
    sentAt: '2025-07-26T10:30:00.000Z',
    recipientCount: 8,
    deliveredCount: 8,
    failedCount: 0,
    createdAt: '2025-07-26T09:00:00.000Z'
  }
];

export default function MessageList({ onCreateNew }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('scheduledFor');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(false);

  // Filtrar y ordenar mensajes
  const filteredAndSortedMessages = useMemo(() => {
    let filtered = mockMessages.filter(message => {
      const matchesSearch = message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          message.groups.some(group => group.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Ordenar
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'scheduledFor' || sortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [searchTerm, statusFilter, sortBy, sortOrder]);

  // Contar mensajes por estado
  const statusCounts = useMemo(() => {
    return mockMessages.reduce((counts, message) => {
      counts[message.status] = (counts[message.status] || 0) + 1;
      return counts;
    }, {});
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simular carga
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success('Lista actualizada');
  };

  const handleMessageAction = (action, message) => {
    switch (action) {
      case 'edit':
        toast.info(`Editando mensaje: ${message.id}`);
        break;
      case 'duplicate':
        toast.success(`Mensaje duplicado: ${message.id}`);
        break;
      case 'delete':
        toast.success(`Mensaje eliminado: ${message.id}`);
        break;
      case 'toggle-pause':
        const newStatus = message.status === 'paused' ? 'scheduled' : 'paused';
        toast.success(`Mensaje ${newStatus === 'paused' ? 'pausado' : 'reanudado'}`);
        break;
      case 'preview':
        toast.info(`Vista previa del mensaje: ${message.id}`);
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <div className="space-y-4">
        {/* Título y acción principal */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mensajes</h2>
            <p className="text-gray-600">
              {filteredAndSortedMessages.length} de {mockMessages.length} mensajes
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            <Button onClick={onCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Mensaje
            </Button>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">Programados</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {statusCounts.scheduled || 0}
              </Badge>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-700">Enviados</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {statusCounts.sent || 0}
              </Badge>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-yellow-700">Pausados</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {statusCounts.paused || 0}
              </Badge>
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-red-700">Con Error</span>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                {statusCounts.error || 0}
              </Badge>
            </div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Búsqueda */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar mensajes o grupos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtro por estado */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="scheduled">Programados</SelectItem>
              <SelectItem value="sent">Enviados</SelectItem>
              <SelectItem value="paused">Pausados</SelectItem>
              <SelectItem value="error">Con error</SelectItem>
            </SelectContent>
          </Select>

          {/* Ordenar */}
          <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
            const [field, order] = value.split('-');
            setSortBy(field);
            setSortOrder(order);
          }}>
            <SelectTrigger className="w-full sm:w-48">
              <SortDesc className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduledFor-desc">Más reciente</SelectItem>
              <SelectItem value="scheduledFor-asc">Más antiguo</SelectItem>
              <SelectItem value="createdAt-desc">Creado reciente</SelectItem>
              <SelectItem value="createdAt-asc">Creado antiguo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de mensajes */}
      <div className="space-y-4">
        {filteredAndSortedMessages.length > 0 ? (
          filteredAndSortedMessages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              onEdit={(msg) => handleMessageAction('edit', msg)}
              onDuplicate={(msg) => handleMessageAction('duplicate', msg)}
              onDelete={(msg) => handleMessageAction('delete', msg)}
              onTogglePause={(msg) => handleMessageAction('toggle-pause', msg)}
              onPreview={(msg) => handleMessageAction('preview', msg)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron mensajes
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Prueba ajustando los filtros de búsqueda'
                : 'Crea tu primer mensaje programado'
              }
            </p>
            <Button onClick={onCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Mensaje
            </Button>
          </div>
        )}
      </div>

      {/* Paginación (para implementar más tarde) */}
      {filteredAndSortedMessages.length > 0 && (
        <div className="flex items-center justify-center pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Mostrando {filteredAndSortedMessages.length} de {mockMessages.length} mensajes
          </p>
        </div>
      )}
    </div>
  );
}
