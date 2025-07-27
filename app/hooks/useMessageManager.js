'use client';

import { useApi } from './useApi';
import { useAdvancedForm } from './useAdvancedForm';
import { useLocalStorage, useCache } from './useStorage';
import { useListManager } from './useListManager';
import { useRealTimeUpdates } from './useWebSocket';
import { useMessageState } from './useMessageState';
import { useNotifications } from './useNotifications';

// Hook compuesto para gestión completa de mensajes
export const useMessageManager = () => {
  const api = useApi();
  const notifications = useNotifications();
  const messageState = useMessageState();
  const cache = useCache(10 * 60 * 1000); // 10 minutos
  const realTime = useRealTimeUpdates('message');
  
  // Almacenamiento local para borradores
  const [drafts, setDrafts] = useLocalStorage('message_drafts', [], {
    expiry: 7 * 24 * 60 * 60 * 1000 // 7 días
  });

  // Gestión de lista de mensajes
  const listManager = useListManager(messageState.messages, {
    searchFields: ['content', 'groups.name'],
    defaultSort: { field: 'scheduledFor', direction: 'asc' },
    pageSize: 10
  });

  // Obtener mensajes con caché
  const fetchMessages = async (useCache = true) => {
    const cacheKey = 'messages_list';
    
    if (useCache && cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey);
      messageState.setMessages(cachedData);
      return cachedData;
    }

    try {
      const response = await api.apiCall({
        endpoint: '/api/messages',
        method: 'GET',
        successMessage: null // No mostrar notificación para carga normal
      });

      cache.set(cacheKey, response.data);
      messageState.setMessages(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  };

  // Crear mensaje con validación completa
  const createMessage = async (messageData) => {
    try {
      // Validar datos
      if (!messageData.content || !messageData.scheduledFor || !messageData.groups?.length) {
        throw new Error('Datos de mensaje incompletos');
      }

      const response = await api.apiCall({
        endpoint: '/api/messages',
        method: 'POST',
        data: messageData,
        successMessage: 'Mensaje programado exitosamente',
        showLoadingNotification: true,
        loadingMessage: 'Programando mensaje...'
      });

      // Actualizar cache
      cache.remove('messages_list');
      
      // Actualizar estado local
      await messageState.scheduleMessage(response.data);
      
      // Remover borrador si existe
      const updatedDrafts = drafts.filter(draft => draft.tempId !== messageData.tempId);
      setDrafts(updatedDrafts);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Guardar borrador
  const saveDraft = (draftData) => {
    const draft = {
      ...draftData,
      tempId: draftData.tempId || Date.now(),
      savedAt: new Date().toISOString()
    };

    const existingIndex = drafts.findIndex(d => d.tempId === draft.tempId);
    
    if (existingIndex >= 0) {
      const updatedDrafts = [...drafts];
      updatedDrafts[existingIndex] = draft;
      setDrafts(updatedDrafts);
    } else {
      setDrafts([...drafts, draft]);
    }

    notifications.showInfo('Borrador guardado automáticamente');
    return draft;
  };

  // Eliminar borrador
  const deleteDraft = (tempId) => {
    const updatedDrafts = drafts.filter(draft => draft.tempId !== tempId);
    setDrafts(updatedDrafts);
    notifications.showSuccess('Borrador eliminado');
  };

  // Estadísticas avanzadas
  const getAdvancedStats = () => {
    const messages = messageState.messages;
    const now = new Date();
    
    // Estadísticas por tiempo
    const today = messages.filter(m => {
      const date = new Date(m.scheduledFor);
      return date.toDateString() === now.toDateString();
    });

    const thisWeek = messages.filter(m => {
      const date = new Date(m.scheduledFor);
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      return date >= weekStart;
    });

    // Estadísticas por grupo
    const groupStats = {};
    messages.forEach(message => {
      message.groups?.forEach(groupId => {
        if (!groupStats[groupId]) {
          groupStats[groupId] = { scheduled: 0, sent: 0, failed: 0 };
        }
        groupStats[groupId][message.status] = (groupStats[groupId][message.status] || 0) + 1;
      });
    });

    return {
      total: messages.length,
      drafts: drafts.length,
      today: today.length,
      thisWeek: thisWeek.length,
      byStatus: messageState.getStateStats(),
      byGroup: groupStats,
      realTimeUpdates: realTime.updates.length
    };
  };

  // Buscar mensajes con múltiples criterios
  const searchMessages = (criteria) => {
    const { query, status, dateRange, groups } = criteria;

    // Aplicar filtros
    if (status?.length) {
      listManager.setFilter('status', status);
    }
    
    if (groups?.length) {
      listManager.setFilter('groups', groups);
    }
    
    if (dateRange?.from && dateRange?.to) {
      listManager.setFilter('scheduledFor', dateRange);
    }
    
    if (query) {
      listManager.setSearchQuery(query);
    }
  };

  // Operaciones en lote
  const bulkOperations = {
    delete: async (messageIds) => {
      try {
        await api.apiCall({
          endpoint: '/api/messages/bulk-delete',
          method: 'DELETE',
          data: { ids: messageIds },
          successMessage: `${messageIds.length} mensajes eliminados`,
          showLoadingNotification: true
        });

        messageIds.forEach(id => listManager.removeItem(id));
        cache.remove('messages_list');
      } catch (error) {
        notifications.showError('Error en eliminación masiva');
      }
    },

    pause: async (messageIds) => {
      try {
        for (const id of messageIds) {
          await messageState.pauseMessage(id, 'Pausado masivamente');
        }
        notifications.showSuccess(`${messageIds.length} mensajes pausados`);
      } catch (error) {
        notifications.showError('Error al pausar mensajes');
      }
    },

    resume: async (messageIds) => {
      try {
        for (const id of messageIds) {
          await messageState.resumeMessage(id);
        }
        notifications.showSuccess(`${messageIds.length} mensajes reanudados`);
      } catch (error) {
        notifications.showError('Error al reanudar mensajes');
      }
    }
  };

  return {
    // Estado
    messages: listManager.data,
    allMessages: listManager.allData,
    drafts,
    loading: api.loading,
    error: api.error,
    stats: getAdvancedStats(),
    
    // Conexión en tiempo real
    connectionStatus: realTime.connectionStatus,
    realTimeUpdates: realTime.updates,
    
    // Acciones principales
    fetchMessages,
    createMessage,
    saveDraft,
    deleteDraft,
    
    // Gestión de estado
    ...messageState,
    
    // Gestión de lista
    ...listManager,
    searchMessages,
    
    // Operaciones en lote
    bulkOperations,
    
    // Cache y utilidades
    clearCache: () => cache.clear(),
    refreshData: () => fetchMessages(false)
  };
};

// Hook para formularios de mensaje integrado
export const useMessageForm = (initialData = {}) => {
  const messageManager = useMessageManager();
  
  const form = useAdvancedForm({
    initialValues: {
      content: '',
      scheduledDateTime: null,
      groups: [],
      ...initialData
    },
    onSubmit: async (data) => {
      const messageData = {
        ...data,
        scheduledFor: data.scheduledDateTime?.dateTime?.toISOString(),
        tempId: initialData.tempId
      };
      
      return await messageManager.createMessage(messageData);
    },
    autosave: true,
    autosaveDelay: 2000,
    resetOnSubmit: true
  });

  // Auto-guardar como borrador
  const saveDraft = () => {
    if (form.isDirty && form.values.content) {
      messageManager.saveDraft({
        ...form.values,
        tempId: initialData.tempId || Date.now()
      });
    }
  };

  return {
    ...form,
    saveDraft,
    messageManager
  };
};
