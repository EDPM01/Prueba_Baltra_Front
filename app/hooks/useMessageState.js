'use client';

import { useState, useCallback } from 'react';
import { useNotifications } from '@/app/hooks/useNotifications';
import { 
  MESSAGE_STATES, 
  canTransitionTo, 
  getAvailableActions,
  isActiveState 
} from '@/app/utils/messageStates';

export const useMessageState = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const notifications = useNotifications();

  // Transición de estado con validación
  const transitionState = useCallback(async (messageId, newState, reason = '') => {
    setLoading(true);
    
    try {
      const message = messages.find(m => m.id === messageId);
      if (!message) {
        throw new Error('Mensaje no encontrado');
      }

      // Validar transición
      if (!canTransitionTo(message.status, newState)) {
        throw new Error(`No se puede cambiar de ${message.status} a ${newState}`);
      }

      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Actualizar estado local
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              status: newState,
              lastStatusChange: new Date(),
              statusReason: reason 
            }
          : msg
      ));

      // Notificaciones según el nuevo estado
      switch (newState) {
        case MESSAGE_STATES.SCHEDULED:
          notifications.showMessageScheduled(
            message.scheduledFor, 
            message.groups?.length || 0
          );
          break;
        case MESSAGE_STATES.SENT:
          notifications.showMessageSent(
            message.groups?.length || 0, 
            message.groups?.length || 0
          );
          break;
        case MESSAGE_STATES.FAILED:
          notifications.showMessageFailed(reason);
          break;
        case MESSAGE_STATES.PAUSED:
          notifications.showMessagePaused(reason);
          break;
        case MESSAGE_STATES.CANCELLED:
          notifications.showMessageCancelled();
          break;
      }

    } catch (error) {
      notifications.showError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [messages, notifications]);

  // Acciones específicas
  const scheduleMessage = useCallback(async (messageData) => {
    setLoading(true);
    
    try {
      // Simular creación de mensaje
      const newMessage = {
        id: Date.now(),
        ...messageData,
        status: MESSAGE_STATES.SCHEDULED,
        createdAt: new Date(),
        lastStatusChange: new Date()
      };

      setMessages(prev => [...prev, newMessage]);
      
      notifications.showMessageScheduled(
        messageData.scheduledFor,
        messageData.groups?.length || 0
      );

      return newMessage;
    } catch (error) {
      notifications.showError('Error al programar mensaje');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [notifications]);

  const pauseMessage = useCallback(async (messageId, reason = 'Pausado por el usuario') => {
    return transitionState(messageId, MESSAGE_STATES.PAUSED, reason);
  }, [transitionState]);

  const resumeMessage = useCallback(async (messageId) => {
    return transitionState(messageId, MESSAGE_STATES.SCHEDULED, 'Reanudado por el usuario');
  }, [transitionState]);

  const cancelMessage = useCallback(async (messageId, reason = 'Cancelado por el usuario') => {
    return transitionState(messageId, MESSAGE_STATES.CANCELLED, reason);
  }, [transitionState]);

  const retryMessage = useCallback(async (messageId) => {
    return transitionState(messageId, MESSAGE_STATES.RETRY, 'Reintentando envío');
  }, [transitionState]);

  const deleteMessage = useCallback(async (messageId) => {
    setLoading(true);
    
    try {
      // Simular eliminación
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMessages(prev => prev.filter(m => m.id !== messageId));
      notifications.showSuccess('Mensaje eliminado exitosamente');
    } catch (error) {
      notifications.showError('Error al eliminar mensaje');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [notifications]);

  const duplicateMessage = useCallback(async (messageId) => {
    setLoading(true);
    
    try {
      const originalMessage = messages.find(m => m.id === messageId);
      if (!originalMessage) {
        throw new Error('Mensaje no encontrado');
      }

      const duplicatedMessage = {
        ...originalMessage,
        id: Date.now(),
        status: MESSAGE_STATES.DRAFT,
        createdAt: new Date(),
        lastStatusChange: new Date(),
        content: `[COPIA] ${originalMessage.content}`
      };

      setMessages(prev => [...prev, duplicatedMessage]);
      notifications.showSuccess('Mensaje duplicado exitosamente');
      
      return duplicatedMessage;
    } catch (error) {
      notifications.showError('Error al duplicar mensaje');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [messages, notifications]);

  // Simular procesamiento automático de mensajes
  const processScheduledMessages = useCallback(() => {
    const now = new Date();
    
    messages.forEach(async (message) => {
      if (message.status === MESSAGE_STATES.SCHEDULED) {
        const scheduledTime = new Date(message.scheduledFor);
        
        // Si es hora de enviar (simulación)
        if (scheduledTime <= now) {
          try {
            await transitionState(message.id, MESSAGE_STATES.SENDING);
            
            // Simular envío
            setTimeout(async () => {
              try {
                // 90% de éxito, 10% de fallo
                const success = Math.random() > 0.1;
                
                if (success) {
                  await transitionState(message.id, MESSAGE_STATES.SENT);
                } else {
                  await transitionState(message.id, MESSAGE_STATES.FAILED, 'Error de conexión');
                }
              } catch (error) {
                console.error('Error en procesamiento automático:', error);
              }
            }, 2000);
            
          } catch (error) {
            console.error('Error al iniciar envío:', error);
          }
        }
      }
    });
  }, [messages, transitionState]);

  // Obtener acciones disponibles para un mensaje
  const getMessageActions = useCallback((messageId) => {
    const message = messages.find(m => m.id === messageId);
    if (!message) return [];
    
    return getAvailableActions(message.status);
  }, [messages]);

  // Estadísticas de estado
  const getStateStats = useCallback(() => {
    const stats = {};
    
    Object.values(MESSAGE_STATES).forEach(state => {
      stats[state] = messages.filter(m => m.status === state).length;
    });
    
    return stats;
  }, [messages]);

  // Obtener mensajes activos
  const getActiveMessages = useCallback(() => {
    return messages.filter(m => isActiveState(m.status));
  }, [messages]);

  return {
    // Estado
    messages,
    loading,
    
    // Acciones principales
    scheduleMessage,
    transitionState,
    deleteMessage,
    duplicateMessage,
    
    // Acciones específicas
    pauseMessage,
    resumeMessage,
    cancelMessage,
    retryMessage,
    
    // Utilidades
    getMessageActions,
    getStateStats,
    getActiveMessages,
    processScheduledMessages,
    
    // Setters para testing
    setMessages
  };
};
