'use client';

import { useState, useCallback, useRef } from 'react';
import { useNotifications } from './useNotifications';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const notifications = useNotifications();
  const abortControllerRef = useRef(null);

  // Simular API calls con delays realistas
  const apiCall = useCallback(async (config) => {
    const {
      endpoint,
      method = 'GET',
      data = null,
      successMessage = null,
      errorMessage = 'Error en la operación',
      timeout = 10000,
      showLoadingNotification = false,
      loadingMessage = 'Procesando...'
    } = config;

    // Cancelar request anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    let loadingToastId = null;
    if (showLoadingNotification) {
      loadingToastId = notifications.showProgress(loadingMessage, 0);
    }

    try {
      // Simular progreso
      if (showLoadingNotification) {
        setTimeout(() => notifications.updateProgress(loadingToastId, loadingMessage, 30), 200);
        setTimeout(() => notifications.updateProgress(loadingToastId, loadingMessage, 60), 500);
        setTimeout(() => notifications.updateProgress(loadingToastId, loadingMessage, 90), 800);
      }

      // Simular API call con delay realista
      const delay = Math.random() * 1000 + 500; // 500ms - 1.5s
      await new Promise(resolve => setTimeout(resolve, delay));

      // Simular timeout
      if (delay > timeout) {
        throw new Error('Timeout: La operación tardó demasiado');
      }

      // Simular errores ocasionales (5% de chance)
      if (Math.random() < 0.05) {
        const errors = [
          'Error de conexión con el servidor',
          'Token de autenticación expirado',
          'Límite de API excedido',
          'Servicio temporalmente no disponible'
        ];
        throw new Error(errors[Math.floor(Math.random() * errors.length)]);
      }

      // Simular respuesta exitosa
      const mockResponse = {
        success: true,
        data: generateMockData(endpoint, method, data),
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9)
      };

      if (showLoadingNotification) {
        notifications.dismissProgress(loadingToastId, successMessage);
      } else if (successMessage) {
        notifications.showSuccess(successMessage);
      }

      return mockResponse;

    } catch (err) {
      setError(err.message);
      
      if (showLoadingNotification) {
        notifications.dismissProgress(loadingToastId);
      }
      
      notifications.showError(`${errorMessage}: ${err.message}`);
      throw err;
      
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [notifications]);

  // Generar datos mock según el endpoint
  const generateMockData = (endpoint, method, data) => {
    switch (endpoint) {
      case '/api/messages':
        if (method === 'POST') {
          return {
            id: Date.now(),
            ...data,
            status: 'scheduled',
            createdAt: new Date().toISOString()
          };
        }
        return mockMessages;
      
      case '/api/groups':
        return mockGroups;
      
      case '/api/contacts':
        return mockContacts;
      
      case '/api/stats':
        return mockStats;
      
      default:
        return { message: 'Success' };
    }
  };

  // Cancelar request en curso
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
    }
  }, []);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    apiCall,
    cancel,
    clearError
  };
};

// Datos mock para diferentes endpoints
const mockMessages = [
  {
    id: 1,
    content: 'Recordatorio: Reunión de equipo mañana a las 10:00 AM',
    scheduledFor: '2025-07-28T09:00:00Z',
    groups: ['1', '2'],
    status: 'scheduled',
    createdAt: '2025-07-27T08:00:00Z'
  },
  {
    id: 2,
    content: 'Promoción especial: 50% de descuento en todos los productos',
    scheduledFor: '2025-07-28T14:00:00Z',
    groups: ['2'],
    status: 'scheduled',
    createdAt: '2025-07-27T09:00:00Z'
  }
];

const mockGroups = [
  { id: '1', name: 'Equipo Desarrollo', contactCount: 12, description: 'Desarrolladores y QA' },
  { id: '2', name: 'Clientes VIP', contactCount: 45, description: 'Clientes premium' },
  { id: '3', name: 'Marketing', contactCount: 8, description: 'Equipo de marketing' }
];

const mockContacts = [
  { id: '1', name: 'Juan Pérez', phone: '+51987654321', groupId: '1' },
  { id: '2', name: 'María García', phone: '+51987654322', groupId: '1' },
  { id: '3', name: 'Carlos López', phone: '+51987654323', groupId: '2' }
];

const mockStats = {
  totalMessages: 145,
  scheduledMessages: 12,
  sentMessages: 120,
  failedMessages: 13,
  deliveryRate: 92.3,
  activeGroups: 8,
  totalContacts: 234
};
