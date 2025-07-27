'use client';

import { toast } from 'sonner';
import { CheckCircle, AlertCircle, XCircle, Clock, Send, Pause } from 'lucide-react';

export const useNotifications = () => {
  const showSuccess = (message, options = {}) => {
    toast.success(message, {
      icon: <CheckCircle className="h-4 w-4" />,
      duration: 4000,
      ...options
    });
  };

  const showError = (message, options = {}) => {
    toast.error(message, {
      icon: <XCircle className="h-4 w-4" />,
      duration: 6000,
      ...options
    });
  };

  const showWarning = (message, options = {}) => {
    toast.warning(message, {
      icon: <AlertCircle className="h-4 w-4" />,
      duration: 5000,
      ...options
    });
  };

  const showInfo = (message, options = {}) => {
    toast.info(message, {
      icon: <Clock className="h-4 w-4" />,
      duration: 4000,
      ...options
    });
  };

  // Notificaciones específicas para mensajes de WhatsApp
  const showMessageScheduled = (scheduledTime, groupCount) => {
    showSuccess(
      `Mensaje programado para ${scheduledTime} a ${groupCount} grupo(s)`,
      {
        description: 'El mensaje será enviado automáticamente',
        action: {
          label: 'Ver detalles',
          onClick: () => console.log('Ver detalles del mensaje')
        }
      }
    );
  };

  const showMessageSent = (groupCount, successCount) => {
    showSuccess(
      `Mensaje enviado exitosamente`,
      {
        description: `${successCount} de ${groupCount} grupos recibieron el mensaje`,
        icon: <Send className="h-4 w-4" />
      }
    );
  };

  const showMessageFailed = (error, retryCount = 0) => {
    showError(
      `Error al enviar mensaje`,
      {
        description: retryCount > 0 ? `Intento ${retryCount + 1} falló: ${error}` : error,
        action: {
          label: 'Reintentar',
          onClick: () => console.log('Reintentar envío')
        }
      }
    );
  };

  const showMessagePaused = (reason) => {
    showWarning(
      `Mensaje pausado`,
      {
        description: reason || 'El envío ha sido pausado temporalmente',
        icon: <Pause className="h-4 w-4" />
      }
    );
  };

  const showMessageCancelled = () => {
    showInfo(
      `Mensaje cancelado`,
      {
        description: 'El mensaje programado ha sido cancelado exitosamente'
      }
    );
  };

  // Notificaciones de progreso
  const showProgress = (message, progress = 0) => {
    return toast.loading(message, {
      description: `Progreso: ${Math.round(progress)}%`,
      duration: Infinity
    });
  };

  const updateProgress = (toastId, message, progress) => {
    toast.loading(message, {
      id: toastId,
      description: `Progreso: ${Math.round(progress)}%`
    });
  };

  const dismissProgress = (toastId, successMessage) => {
    toast.dismiss(toastId);
    if (successMessage) {
      showSuccess(successMessage);
    }
  };

  // Notificaciones del sistema
  const showConnectionError = () => {
    showError(
      'Error de conexión',
      {
        description: 'No se pudo conectar con el servidor. Verificando...',
        duration: 8000
      }
    );
  };

  const showConnectionRestored = () => {
    showSuccess(
      'Conexión restaurada',
      {
        description: 'La conexión con el servidor ha sido restablecida'
      }
    );
  };

  const showMaintenanceMode = () => {
    showWarning(
      'Modo mantenimiento',
      {
        description: 'El servicio estará temporalmente no disponible',
        duration: 10000
      }
    );
  };

  return {
    // Notificaciones básicas
    showSuccess,
    showError,
    showWarning,
    showInfo,
    
    // Notificaciones específicas de mensajes
    showMessageScheduled,
    showMessageSent,
    showMessageFailed,
    showMessagePaused,
    showMessageCancelled,
    
    // Notificaciones de progreso
    showProgress,
    updateProgress,
    dismissProgress,
    
    // Notificaciones del sistema
    showConnectionError,
    showConnectionRestored,
    showMaintenanceMode
  };
};
