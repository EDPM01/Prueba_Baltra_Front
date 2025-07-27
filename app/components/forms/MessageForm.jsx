'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNotifications } from '@/app/hooks/useNotifications';
import { useMessageState } from '@/app/hooks/useMessageState';
import { 
  MessageSquare, 
  Send, 
  Eye, 
  Calendar,
  Users,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import DateTimePicker from './DateTimePicker';
import GroupSelector from './GroupSelector';

// Esquema de validación
const messageSchema = z.object({
  content: z
    .string()
    .min(1, 'El mensaje es obligatorio')
    .max(4096, 'El mensaje no puede exceder 4096 caracteres'),
  
  scheduledDateTime: z
    .object({
      date: z.date(),
      time: z.string(),
      dateTime: z.date()
    })
    .refine(data => data.dateTime > new Date(), {
      message: 'La fecha debe ser futura'
    }),
  
  groups: z
    .array(z.string())
    .min(1, 'Debe seleccionar al menos un grupo')
});

export default function MessageForm() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const notifications = useNotifications();
  const { scheduleMessage } = useMessageState();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
      groups: [],
      scheduledDateTime: null
    }
  });

  const watchedValues = watch();
  const characterCount = watchedValues.content?.length || 0;
  const maxCharacters = 4096;

  // Simular datos de grupos
  const mockGroups = [
    { id: '1', name: 'Equipo Desarrollo', contactCount: 12, description: 'Desarrolladores y QA' },
    { id: '2', name: 'Clientes VIP', contactCount: 45, description: 'Clientes premium' },
    { id: '3', name: 'Marketing', contactCount: 8, description: 'Equipo de marketing' },
    { id: '4', name: 'Ventas', contactCount: 23, description: 'Equipo comercial' },
    { id: '5', name: 'Soporte', contactCount: 15, description: 'Atención al cliente' }
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Usar el hook de estado de mensajes
      const messageData = {
        content: data.content,
        scheduledFor: data.scheduledDateTime.dateTime.toISOString(),
        groups: data.groups,
        createdBy: 'Usuario' // En una app real, vendría del contexto de auth
      };

      await scheduleMessage(messageData);
      
      // Mostrar notificación de éxito (ya manejada por el hook)
      
      // Resetear formulario
      setValue('content', '');
      setValue('groups', []);
      setValue('scheduledDateTime', null);
      
    } catch (error) {
      console.error('Error al programar mensaje:', error);
      // El error ya se maneja en el hook useMessageState
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedGroupsInfo = () => {
    const selectedGroups = mockGroups.filter(group => 
      watchedValues.groups?.includes(group.id)
    );
    
    const totalContacts = selectedGroups.reduce((sum, group) => sum + group.contactCount, 0);
    
    return {
      groups: selectedGroups,
      totalContacts
    };
  };

  const { groups: selectedGroups, totalContacts } = getSelectedGroupsInfo();

  const formatPreviewDateTime = () => {
    if (!watchedValues.scheduledDateTime?.dateTime) return '';
    
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(watchedValues.scheduledDateTime.dateTime);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Formulario Principal */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Crear Nuevo Mensaje
              </CardTitle>
              <CardDescription>
                Programa tu mensaje de WhatsApp para envío automático
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Campo de mensaje */}
              <div className="space-y-2">
                <Label htmlFor="content">Mensaje</Label>
                <Textarea
                  id="content"
                  placeholder="Escribe tu mensaje aquí..."
                  className="min-h-[120px] resize-none"
                  {...register('content')}
                />
                <div className="flex justify-between text-sm">
                  <span className={errors.content ? 'text-red-600' : 'text-gray-500'}>
                    {errors.content?.message || ' '}
                  </span>
                  <span className={`${characterCount > maxCharacters * 0.9 ? 'text-orange-600' : 'text-gray-500'}`}>
                    {characterCount}/{maxCharacters}
                  </span>
                </div>
              </div>

              {/* Selector de fecha y hora */}
              <DateTimePicker
                value={watchedValues.scheduledDateTime}
                onChange={(dateTime) => setValue('scheduledDateTime', dateTime)}
                error={errors.scheduledDateTime?.message}
              />

              {/* Selector de grupos */}
              <GroupSelector
                groups={mockGroups}
                selectedGroups={watchedValues.groups || []}
                onSelectionChange={(groups) => setValue('groups', groups)}
                error={errors.groups?.message}
              />
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPreviewOpen(!isPreviewOpen)}
              disabled={!watchedValues.content}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              {isPreviewOpen ? 'Ocultar Vista Previa' : 'Vista Previa'}
            </Button>
            
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Programando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Programar Mensaje
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Panel Lateral - Resumen y Vista Previa */}
      <div className="space-y-6">
        {/* Resumen */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Estado del mensaje */}
            <div className="flex items-center space-x-2">
              {isValid ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-orange-600" />
              )}
              <span className="text-sm font-medium">
                {isValid ? 'Listo para enviar' : 'Faltan datos'}
              </span>
            </div>

            {/* Información de destinatarios */}
            {selectedGroups.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">
                    {totalContacts} destinatarios en {selectedGroups.length} grupo(s)
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedGroups.map(group => (
                    <Badge key={group.id} variant="secondary" className="text-xs">
                      {group.name} ({group.contactCount})
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Información de programación */}
            {watchedValues.scheduledDateTime?.dateTime && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Programación</span>
                </div>
                <p className="text-sm text-gray-600 capitalize">
                  {formatPreviewDateTime()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vista Previa del Mensaje */}
        {isPreviewOpen && watchedValues.content && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vista Previa</CardTitle>
              <CardDescription>Cómo se verá tu mensaje en WhatsApp</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="bg-white rounded-lg p-3 shadow-sm border">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {watchedValues.content}
                  </p>
                  <div className="flex justify-end mt-2">
                    <span className="text-xs text-gray-500">
                      {new Date().toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
